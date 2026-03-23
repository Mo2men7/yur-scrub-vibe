"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations, useLocale } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { Order, OrderStatus } from "@/lib/types";
import { STATUS_COLORS, formatPrice } from "@/lib/utils";
import { Loader2, Eye, X, ExternalLink } from "lucide-react";
import { toast } from "sonner";

const STATUSES: OrderStatus[] = [
  "pending",
  "awaiting_confirmation",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

export default function AdminOrdersPage() {
  const t = useTranslations("admin");
  const locale = useLocale();
  const qc = useQueryClient();
  const supabase = createClient();
  const [filter, setFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const { data: orders, isLoading } = useQuery({
    queryKey: ["admin-orders", filter],
    queryFn: async () => {
      let q = supabase
        .from("orders")
        .select("*, products(name_ar, name_en, price)")
        .order("created_at", { ascending: false });
      if (filter !== "all") q = q.eq("status", filter);
      const { data } = await q;
      return data || [];
    },
  });

  const updateStatus = async (id: string, status: OrderStatus) => {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(locale === "ar" ? "تم تحديث الحالة" : "Status updated");
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
      if (selectedOrder?.id === id) {
        setSelectedOrder({ ...selectedOrder, status });
      }
    }
  };

  const statusLabel = (s: string) => {
    if (locale === "ar") {
      const map: Record<string, string> = {
        pending: "معلق",
        awaiting_confirmation: "بانتظار التأكيد",
        confirmed: "مؤكد",
        shipped: "تم الشحن",
        delivered: "تم التسليم",
        cancelled: "ملغي",
      };
      return map[s] || s;
    }
    return s.replace(/_/g, " ");
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold">{t("manageOrders")}</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {orders?.length || 0} {locale === "ar" ? "طلب" : "orders"}
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
            filter === "all"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          {t("all")}
        </button>
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              filter === s
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {statusLabel(s)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                {[
                  locale === "ar" ? "العميل" : "Customer",
                  locale === "ar" ? "المنتج" : "Product",
                  locale === "ar" ? "الدفع" : "Payment",
                  locale === "ar" ? "الإجمالي" : "Total",
                  locale === "ar" ? "الحالة" : "Status",
                  locale === "ar" ? "التاريخ" : "Date",
                  "",
                ].map((h, i) => (
                  <th key={i} className="text-start px-6 py-3 font-medium text-muted-foreground">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto text-muted-foreground" />
                  </td>
                </tr>
              ) : orders?.map((order: any) => (
                <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium">{order.customer_name}</p>
                    <p className="text-xs text-muted-foreground">{order.customer_phone}</p>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {locale === "ar" ? order.products?.name_ar : order.products?.name_en}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                      order.payment_method === "cod"
                        ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                        : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    }`}>
                      {order.payment_method === "cod"
                        ? locale === "ar" ? "عند الاستلام" : "COD"
                        : locale === "ar" ? "تحويل" : "Transfer"}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {formatPrice(order.total_price, locale)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[order.status]}`}>
                      {statusLabel(order.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground text-xs">
                    {new Date(order.created_at).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-EG")}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {!isLoading && (!orders || orders.length === 0) && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                    {locale === "ar" ? "لا توجد طلبات" : "No orders found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order detail modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="font-semibold">{t("orderDetails")}</h2>
              <button onClick={() => setSelectedOrder(null)} className="p-1.5 rounded-lg hover:bg-muted transition">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                {[
                  [locale === "ar" ? "الاسم" : "Name", selectedOrder.customer_name],
                  [locale === "ar" ? "البريد" : "Email", selectedOrder.customer_email],
                  [locale === "ar" ? "الهاتف" : "Phone", selectedOrder.customer_phone],
                  [locale === "ar" ? "المقاس" : "Size", selectedOrder.size],
                ].map(([label, value]) => (
                  <div key={label} className="bg-muted rounded-xl p-3">
                    <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
                    <p className="font-medium">{value}</p>
                  </div>
                ))}
              </div>

              <div className="bg-muted rounded-xl p-3">
                <p className="text-xs text-muted-foreground mb-0.5">
                  {locale === "ar" ? "اللون" : "Color"}
                </p>
                <div className="flex items-center gap-2">
                  <span
                    className="w-5 h-5 rounded-full border border-border"
                    style={{ backgroundColor: selectedOrder.color }}
                  />
                  <span className="font-medium font-mono text-xs">{selectedOrder.color}</span>
                </div>
              </div>

              <div className="bg-muted rounded-xl p-3">
                <p className="text-xs text-muted-foreground mb-0.5">
                  {locale === "ar" ? "العنوان" : "Address"}
                </p>
                <p className="font-medium">{selectedOrder.delivery_address}</p>
              </div>

              {selectedOrder.transfer_screenshot_url && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {locale === "ar" ? "إيصال التحويل" : "Transfer Receipt"}
                  </p>
                  <a
                    href={selectedOrder.transfer_screenshot_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:underline text-xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    {locale === "ar" ? "عرض الإيصال" : "View Receipt"}
                  </a>
                </div>
              )}

              {/* Update status */}
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  {t("updateStatus")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {STATUSES.map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(selectedOrder.id, s)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                        selectedOrder.status === s
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border text-muted-foreground hover:border-primary/40"
                      }`}
                    >
                      {statusLabel(s)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
