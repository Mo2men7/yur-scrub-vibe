import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server-client";
import StatsCard from "@/components/admin/StatsCard";
import { ShoppingBag, Clock, Package, TrendingUp } from "lucide-react";
import { Order } from "@/lib/types";
import { STATUS_COLORS } from "@/lib/utils";

export default async function AdminDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("admin");
  const supabase = await createClient();

  const [
    { count: totalOrders },
    { count: pendingOrders },
    { count: totalProducts },
    { data: recentOrders },
  ] = await Promise.all([
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true),
    supabase
      .from("orders")
      .select("*, products(name_ar, name_en)")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const statusLabel = (s: string) =>
    locale === "ar"
      ? {
          pending: "معلق",
          awaiting_confirmation: "بانتظار التأكيد",
          confirmed: "مؤكد",
          shipped: "تم الشحن",
          delivered: "تم التسليم",
          cancelled: "ملغي",
        }[s] || s
      : s.replace("_", " ");

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold">{t("dashboard")}</h1>
        <p className="text-muted-foreground mt-1">
          {locale === "ar"
            ? "مرحباً بك في لوحة التحكم"
            : "Welcome to your admin panel"}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <StatsCard
          title={t("totalOrders")}
          value={totalOrders ?? 0}
          icon={ShoppingBag}
          color="blue"
        />
        <StatsCard
          title={t("pendingOrders")}
          value={pendingOrders ?? 0}
          icon={Clock}
          color="amber"
        />
        <StatsCard
          title={t("totalProducts")}
          value={totalProducts ?? 0}
          icon={Package}
          color="green"
        />
      </div>

      {/* Recent orders */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          <h2 className="font-semibold">
            {locale === "ar" ? "أحدث الطلبات" : "Recent Orders"}
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-start px-6 py-3 font-medium text-muted-foreground">
                  {locale === "ar" ? "العميل" : "Customer"}
                </th>
                <th className="text-start px-6 py-3 font-medium text-muted-foreground">
                  {locale === "ar" ? "المنتج" : "Product"}
                </th>
                <th className="text-start px-6 py-3 font-medium text-muted-foreground">
                  {locale === "ar" ? "الحالة" : "Status"}
                </th>
                <th className="text-start px-6 py-3 font-medium text-muted-foreground">
                  {locale === "ar" ? "التاريخ" : "Date"}
                </th>
              </tr>
            </thead>
            <tbody>
              {recentOrders?.map((order: any) => (
                <tr
                  key={order.id}
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-6 py-4 font-medium">
                    {order.customer_name}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {locale === "ar"
                      ? order.products?.name_ar
                      : order.products?.name_en}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[order.status]}`}
                    >
                      {statusLabel(order.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString(
                      locale === "ar" ? "ar-EG" : "en-EG",
                    )}
                  </td>
                </tr>
              ))}
              {(!recentOrders || recentOrders.length === 0) && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-muted-foreground"
                  >
                    {locale === "ar" ? "لا توجد طلبات بعد" : "No orders yet"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
