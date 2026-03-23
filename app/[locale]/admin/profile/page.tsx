"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function AdminProfilePage() {
  const t = useTranslations("admin");
  const locale = useLocale();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition";
  const labelClass = "block text-sm font-medium mb-1.5";

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingEmail(true);
    const { error } = await supabase.auth.updateUser({ email });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(
        locale === "ar"
          ? "تم إرسال تأكيد البريد الإلكتروني"
          : "Email confirmation sent"
      );
      setEmail("");
    }
    setLoadingEmail(false);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error(
        locale === "ar" ? "كلمتا المرور غير متطابقتين" : "Passwords do not match"
      );
      return;
    }
    if (password.length < 6) {
      toast.error(
        locale === "ar"
          ? "كلمة المرور يجب أن تكون 6 أحرف على الأقل"
          : "Password must be at least 6 characters"
      );
      return;
    }
    setLoadingPassword(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(
        locale === "ar" ? "تم تحديث كلمة المرور" : "Password updated"
      );
      setPassword("");
      setConfirmPassword("");
    }
    setLoadingPassword(false);
  };

  return (
    <div className="p-8 max-w-xl">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold">{t("profile")}</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {locale === "ar"
            ? "إدارة بيانات الحساب"
            : "Manage your account credentials"}
        </p>
      </div>

      <div className="space-y-6">
        {/* Update email */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-semibold mb-5">{t("updateEmail")}</h2>
          <form onSubmit={handleUpdateEmail} className="space-y-4">
            <div>
              <label className={labelClass}>{t("newEmail")}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder="new@email.com"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loadingEmail}
              className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loadingEmail && <Loader2 className="w-4 h-4 animate-spin" />}
              {t("updateEmail")}
            </button>
          </form>
        </div>

        {/* Update password */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-semibold mb-5">{t("updatePassword")}</h2>
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label className={labelClass}>{t("newPassword")}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
            <div>
              <label className={labelClass}>{t("confirmPassword")}</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={inputClass}
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
            <button
              type="submit"
              disabled={loadingPassword}
              className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loadingPassword && <Loader2 className="w-4 h-4 animate-spin" />}
              {t("updatePassword")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
