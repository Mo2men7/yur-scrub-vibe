"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations, useLocale } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { Product } from "@/lib/types";
import { formatPrice, getProductName } from "@/lib/utils";
import { Plus, Pencil, Trash2, Loader2, X, Upload } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

type ProductForm = {
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  price: string;
  sizes: string;
  colors: string;
};

const emptyForm: ProductForm = {
  name_ar: "",
  name_en: "",
  description_ar: "",
  description_en: "",
  price: "",
  sizes: "XS,S,M,L,XL,XXL",
  colors: "#1B4F72,#FFFFFF,#1E8449",
};

export default function AdminProductsPage() {
  const t = useTranslations("admin");
  const locale = useLocale();
  const qc = useQueryClient();
  const supabase = createClient();

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [images, setImages] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const { data: products, isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      return data || [];
    },
  });

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setImages([]);
    setShowModal(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      name_ar: p.name_ar,
      name_en: p.name_en,
      description_ar: p.description_ar,
      description_en: p.description_en,
      price: String(p.price),
      sizes: p.sizes?.join(",") || "",
      colors: p.colors?.join(",") || "",
    });
    setImages([]);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let imageUrls: string[] = editing?.images || [];

      if (images.length > 0) {
        const uploaded: string[] = [];
        for (const file of images) {
          const ext = file.name.split(".").pop();
          const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
          const { error } = await supabase.storage
            .from("product-images")
            .upload(path, file);
          if (error) throw error;
          const { data: urlData } = supabase.storage
            .from("product-images")
            .getPublicUrl(path);
          uploaded.push(urlData.publicUrl);
        }
        imageUrls = [...imageUrls, ...uploaded];
      }

      const payload = {
        name_ar: form.name_ar,
        name_en: form.name_en,
        description_ar: form.description_ar,
        description_en: form.description_en,
        price: parseFloat(form.price),
        sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
        colors: form.colors.split(",").map((c) => c.trim()).filter(Boolean),
        images: imageUrls,
        is_active: true,
      };

      if (editing) {
        const { error } = await supabase
          .from("products")
          .update(payload)
          .eq("id", editing.id);
        if (error) throw error;
        toast.success(locale === "ar" ? "تم تحديث المنتج" : "Product updated");
      } else {
        const { error } = await supabase.from("products").insert(payload);
        if (error) throw error;
        toast.success(locale === "ar" ? "تم إضافة المنتج" : "Product added");
      }

      qc.invalidateQueries({ queryKey: ["admin-products"] });
      setShowModal(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("products")
      .update({ is_active: false })
      .eq("id", id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(locale === "ar" ? "تم حذف المنتج" : "Product deleted");
      qc.invalidateQueries({ queryKey: ["admin-products"] });
    }
    setDeleteConfirm(null);
  };

  const inputClass =
    "w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition";
  const labelClass = "block text-xs font-medium text-muted-foreground mb-1";

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold">{t("manageProducts")}</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {products?.length || 0}{" "}
            {locale === "ar" ? "منتج" : "products"}
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition"
        >
          <Plus className="w-4 h-4" />
          {t("addProduct")}
        </button>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-start px-6 py-3 font-medium text-muted-foreground">
                  {locale === "ar" ? "المنتج" : "Product"}
                </th>
                <th className="text-start px-6 py-3 font-medium text-muted-foreground">
                  {locale === "ar" ? "السعر" : "Price"}
                </th>
                <th className="text-start px-6 py-3 font-medium text-muted-foreground">
                  {locale === "ar" ? "المقاسات" : "Sizes"}
                </th>
                <th className="text-start px-6 py-3 font-medium text-muted-foreground">
                  {locale === "ar" ? "الألوان" : "Colors"}
                </th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto text-muted-foreground" />
                  </td>
                </tr>
              ) : products?.map((p: Product) => (
                <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {p.images?.[0] ? (
                        <div className="w-10 h-10 rounded-lg overflow-hidden relative bg-muted shrink-0">
                          <Image src={p.images[0]} alt={p.name_en} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <span className="font-display text-xs font-bold text-primary/40">ys</span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{getProductName(p, locale)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-primary">
                    {formatPrice(p.price, locale)}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground text-xs">
                    {p.sizes?.join(", ")}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      {p.colors?.slice(0, 4).map((c) => (
                        <span
                          key={c}
                          className="w-4 h-4 rounded-full border border-border"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => openEdit(p)}
                        className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(p.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-muted-foreground hover:text-red-600 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="font-semibold">
                {editing ? t("editProduct") : t("addProduct")}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-muted transition">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>{t("productNameAr")} *</label>
                  <input
                    type="text"
                    value={form.name_ar}
                    onChange={(e) => setForm({ ...form, name_ar: e.target.value })}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>{t("productNameEn")} *</label>
                  <input
                    type="text"
                    value={form.name_en}
                    onChange={(e) => setForm({ ...form, name_en: e.target.value })}
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>{t("descriptionAr")}</label>
                  <textarea
                    value={form.description_ar}
                    onChange={(e) => setForm({ ...form, description_ar: e.target.value })}
                    className={inputClass}
                    rows={3}
                  />
                </div>
                <div>
                  <label className={labelClass}>{t("descriptionEn")}</label>
                  <textarea
                    value={form.description_en}
                    onChange={(e) => setForm({ ...form, description_en: e.target.value })}
                    className={inputClass}
                    rows={3}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>{t("price")} *</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className={labelClass}>{t("sizes")}</label>
                <input
                  type="text"
                  value={form.sizes}
                  onChange={(e) => setForm({ ...form, sizes: e.target.value })}
                  className={inputClass}
                  placeholder="XS,S,M,L,XL,XXL"
                />
              </div>

              <div>
                <label className={labelClass}>{t("colors")}</label>
                <input
                  type="text"
                  value={form.colors}
                  onChange={(e) => setForm({ ...form, colors: e.target.value })}
                  className={inputClass}
                  placeholder="#1B4F72,#FFFFFF"
                />
              </div>

              <div>
                <label className={labelClass}>{t("images")}</label>
                <label className="block cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="sr-only"
                    onChange={(e) => setImages(Array.from(e.target.files || []))}
                  />
                  <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/40 transition-colors">
                    <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      {images.length > 0
                        ? `${images.length} file(s) selected`
                        : locale === "ar"
                        ? "انقر لرفع الصور"
                        : "Click to upload images"}
                    </p>
                  </div>
                </label>
                {editing?.images && editing.images.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {editing.images.map((img, i) => (
                      <div key={i} className="w-12 h-12 rounded-lg overflow-hidden relative bg-muted">
                        <Image src={img} alt="" fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {t("save")}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition"
                >
                  {t("cancel")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirm modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="font-semibold mb-2">
              {locale === "ar" ? "تأكيد الحذف" : "Confirm Delete"}
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              {locale === "ar"
                ? "هل أنت متأكد من حذف هذا المنتج؟"
                : "Are you sure you want to delete this product?"}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition"
              >
                {t("delete")}
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition"
              >
                {t("cancel")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
