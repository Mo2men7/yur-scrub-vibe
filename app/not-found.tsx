import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center">
        <p className="font-display text-8xl font-bold text-primary/20 mb-4">404</p>
        <h1 className="font-display text-2xl font-bold mb-2">Page Not Found</h1>
        <p className="text-muted-foreground mb-8">
          الصفحة غير موجودة · The page you're looking for doesn't exist.
        </p>
        <Link
          href="/ar"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition"
        >
          العودة للرئيسية · Go Home
        </Link>
      </div>
    </div>
  );
}
