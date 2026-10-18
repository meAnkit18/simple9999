import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
import { isAdmin } from "@/lib/admin";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdmin())) {
    redirect("/login");
  }
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="min-h-screen bg-background pt-20">{children}</main>
      <SiteFooter />
    </div>
  );
}