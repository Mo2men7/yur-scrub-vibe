import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

import AdminSidebar from "@/components/admin/AdminSidebar";
import Link from "next/link";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 bg-background overflow-auto">{children}</main>
    </div>
    // <TooltipProvider>
    //   <SidebarProvider>
    //     <AdminSidebar />
    //     <SidebarInset>
    //       <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
    //         <SidebarTrigger />
    //         <div className="flex items-center gap-4 h-8">
    //           <div className="">
    //             <Button size={"icon"} className="bg-accent/10 group">
    //               <Sparkles className="text-accent group-hover:text-background" />
    //             </Button>
    //           </div>
    //           <Separator
    //             orientation="vertical"
    //             className="hidden md:block h-4"
    //           />
    //           <Link
    //             href={"/company"}
    //             className="hidden md:flex items-center gap-2"
    //           >
    //             LOL
    //             <div>
    //               <p className="text-sm">شركة ويكي ميكي</p>
    //             </div>
    //           </Link>
    //         </div>
    //       </header>

    //       <main className="flex flex-1 flex-col gap-4 p-4">{children}</main>
    //     </SidebarInset>
    //   </SidebarProvider>
    // </TooltipProvider>
  );
}
