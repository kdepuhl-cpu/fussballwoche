"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/lib/admin/auth";

interface AdminGuardProps {
  children: ReactNode;
  requireAdmin?: boolean; // true = nur Admins, false = auch Redakteure
}

export default function AdminGuard({ children, requireAdmin = false }: AdminGuardProps) {
  const { user, isAdmin, isRedakteur, loading } = useAdminAuth();
  const router = useRouter();

  const hasAccess = requireAdmin ? isAdmin : isRedakteur;

  useEffect(() => {
    if (!loading && (!user || !hasAccess)) {
      router.replace("/admin/login");
    }
  }, [user, hasAccess, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-forest-green" />
      </div>
    );
  }

  if (!user || !hasAccess) return null;

  return <>{children}</>;
}
