"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [checkingAuth, setCheckingAuth] =
    useState(true);

  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(auth, (user) => {
        if (!user) {
          router.replace("/login");
          return;
        }

        setCheckingAuth(false);
      });

    return () => unsubscribe();
  }, [router]);

  // Authentication check chal raha hai
  if (checkingAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-gray-500">
          Checking authentication...
        </p>
      </main>
    );
  }

  // Logged-in user ko admin pages dikhayenge
  return <>{children}</>;
}