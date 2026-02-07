"use client";

import { ToastProvider } from "@/components/ui/Toast";
import { UserAuthProvider } from "@/lib/user/auth";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <UserAuthProvider>
        {children}
      </UserAuthProvider>
    </ToastProvider>
  );
}
