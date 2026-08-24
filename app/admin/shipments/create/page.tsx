"use client";

import { Suspense, useEffect, useState } from "react";

import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

function CreateShipmentForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const orderId = searchParams.get("orderId");

  const [shipmentNumber, setShipmentNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");

  const [loadingOrder, setLoadingOrder] = useState(true);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  // Fetch existing order
  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setLoadingOrder(false);
        return;
      }

      try {
        const orderRef = doc(
          db,
          "orders",
          orderId
        );

        const orderSnapshot =
          await getDoc(orderRef);

        if (!orderSnapshot.exists()) {
          setError("Order not found.");
          return;
        }

        const orderData =
          orderSnapshot.data();

        setCustomerName(
          orderData.customerName || ""
        );

        setSource(
          orderData.source || ""
        );

        setDestination(
          orderData.destination || ""
        );
      } catch (error) {
        console.error(
          "Error fetching order:",
          error
        );

        setError(
          "Failed to load order."
        );
      } finally {
        setLoadingOrder(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  // Create shipment
  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await addDoc(
        collection(db, "shipments"),
        {
          shipmentNumber,
          orderId: orderId || "",
          customerName,
          source,
          destination,
          status: "Pending",
          createdAt: serverTimestamp(),
        }
      );

      alert(
        "Shipment created successfully!"
      );

      router.push("/admin");
    } catch (error) {
      console.error(
        "Create shipment error:",
        error
      );

      setError(
        "Failed to create shipment."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-3xl">

        {/* Back Button */}
        <button
          onClick={() =>
            router.push("/admin")
          }
          className="text-sm text-gray-600 hover:underline"
        >
          ← Back to Dashboard
        </button>

        {/* Heading */}
        <h1 className="mt-4 text-3xl font-bold">
          Create Shipment
        </h1>

        <p className="mt-1 text-gray-500">
          Create a shipment for an order
        </p>

        <div className="mt-6 rounded-xl bg-white p-6 shadow">

          {loadingOrder ? (
            <p className="text-gray-500">
              Loading order information...
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* Shipment Number */}
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Shipment Number
                </label>

                <input
                  type="text"
                  value={shipmentNumber}
                  onChange={(e) =>
                    setShipmentNumber(
                      e.target.value
                    )
                  }
                  placeholder="SHP-001"
                  required
                  className="w-full rounded-lg border p-3"
                />
              </div>

              {/* Customer */}
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Customer Name
                </label>

                <input
                  type="text"
                  value={customerName}
                  readOnly
                  className="w-full rounded-lg border bg-gray-100 p-3"
                />
              </div>

              {/* Source */}
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Source
                </label>

                <input
                  type="text"
                  value={source}
                  readOnly
                  className="w-full rounded-lg border bg-gray-100 p-3"
                />
              </div>

              {/* Destination */}
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Destination
                </label>

                <input
                  type="text"
                  value={destination}
                  readOnly
                  className="w-full rounded-lg border bg-gray-100 p-3"
                />
              </div>

              {/* Error */}
              {error && (
                <p className="text-sm text-red-500">
                  {error}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-black p-3 text-white hover:bg-gray-800 disabled:opacity-50"
              >
                {loading
                  ? "Creating Shipment..."
                  : "Create Shipment"}
              </button>

            </form>
          )}

        </div>
      </div>
    </main>
  );
}

export default function CreateShipmentPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-gray-100">
          <p className="text-gray-500">
            Loading shipment page...
          </p>
        </main>
      }
    >
      <CreateShipmentForm />
    </Suspense>
  );
}