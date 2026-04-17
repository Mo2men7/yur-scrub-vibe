"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  User,
  LogOut,
  GalleryVerticalEnd,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "../ui";

export default function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const t = useTranslations("admin");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const links = [
    {
      href: `/${locale}/admin`,
      label: t("dashboard"),
      icon: LayoutDashboard,
    },
    {
      href: `/${locale}/admin/products`,
      label: t("manageProducts"),
      icon: Package,
    },
    {
      href: `/${locale}/admin/orders`,
      label: t("manageOrders"),
      icon: ShoppingBag,
    },
    {
      href: `/${locale}/admin/profile`,
      label: t("profile"),
      icon: User,
    },
  ];

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push(`/${locale}/admin/login`);
  };

  return (
    <Sidebar
      variant="sidebar"
      side={locale === "ar" ? "right" : "left"}
      {...props}
      className="w-64 shrink-0 bg-card border-e border-border min-h-screen flex flex-col"
    >
      <SidebarHeader>
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div>
            <p className="font-display text-xl font-bold capitalize">
              yur<span className="text-primary">.</span>scrub
            </p>
            <p className="text-xs text-muted-foreground mt-1">Admin Panel</p>
          </div>
          <SidebarTrigger />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {links.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.label}
                  className={`${pathname === item.href ? "bg-primary/5 text-primary" : ""}`}
                >
                  <Link href={item.href}>
                    {item.icon && <item.icon />}
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Button onClick={handleLogout} className="w-full">
                <LogOut className="w-4 h-4 shrink-0" />
                {t("logout")}
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
