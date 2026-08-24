"use client";

import { useEffect, useState } from "react";

import { onAuthStateChanged } from "firebase/auth";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import { auth, db } from "@/lib/firebase";

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
      onAuthStateChanged(
        auth,
        async (user) => {
          // =====================================
          // NOT LOGGED IN
          // =====================================

          if (!user) {
            router.replace("/login");
            return;
          }

          try {
            // =================================
            // GET USER FROM FIRESTORE
            // =================================

            const userRef = doc(
              db,
              "users",
              user.uid
            );

            const userSnapshot =
              await getDoc(userRef);

            // =================================
            // USER DOCUMENT NOT FOUND
            // =================================

            if (!userSnapshot.exists()) {
              console.log(
                "User document not found"
              );

              router.replace("/dashboard");
              return;
            }

            const userData =
              userSnapshot.data();

            console.log(
              "Logged in user:",
              user.uid
            );

            console.log(
              "User role:",
              userData.role
            );

            // =================================
            // ADMIN CHECK
            // =================================

            if (
              userData.role !== "admin"
            ) {
              router.replace(
                "/dashboard"
              );
              return;
            }

            // =================================
            // ADMIN VERIFIED
            // =================================

            setCheckingAuth(false);

          } catch (error) {
            console.error(
              "Admin authentication error:",
              error
            );

            router.replace(
              "/dashboard"
            );
          }
        }
      );

    return () => unsubscribe();

  }, [router]);

  // ==========================================
  // CHECKING
  // ==========================================

  if (checkingAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100">

        <div className="text-center">

          <p className="text-gray-500">
            Checking admin access...
          </p>

        </div>

      </main>
    );
  }

  // ==========================================
  // ADMIN CONTENT
  // ==========================================

  return <>{children}</>;
}