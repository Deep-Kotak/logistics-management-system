"use client";

import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useParams, useRouter } from "next/navigation";

const orderStatuses = [
  "Pending",
  "Picked Up",
  "In Transit",
  "Out for Delivery",
  "Delivered",
];

export default function EditOrderPage() {
  const router = useRouter();
  const params = useParams();

  const orderId = params.id as string;

  const [customerName, setCustomerName] =
    useState("");

  const [customerEmail, setCustomerEmail] =
    useState("");

  const [productName, setProductName] =
    useState("");

  const [quantity, setQuantity] =
    useState("");

  const [source, setSource] =
    useState("");

  const [destination, setDestination] =
    useState("");

  const [status, setStatus] =
    useState("Pending");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  // ==========================================
  // FETCH ORDER
  // ==========================================

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (!orderId) {
          setError("Order ID is missing.");
          return;
        }

        const orderRef = doc(
          db,
          "orders",
          orderId
        );

        const snapshot =
          await getDoc(orderRef);

        if (!snapshot.exists()) {
          setError("Order not found.");
          return;
        }

        const data =
          snapshot.data();

        setCustomerName(
          data.customerName || ""
        );

        setCustomerEmail(
          data.customerEmail || ""
        );

        setProductName(
          data.productName || ""
        );

        setQuantity(
          String(data.quantity || "")
        );

        setSource(
          data.source || ""
        );

        setDestination(
          data.destination || ""
        );

        setStatus(
          data.status || "Pending"
        );
      } catch (error) {
        console.error(
          "Error loading order:",
          error
        );

        setError(
          "Failed to load order."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  // ==========================================
  // UPDATE ORDER
  // ==========================================

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");
    setSaving(true);

    try {
      await updateDoc(
        doc(db, "orders", orderId),
        {
          customerName,
          customerEmail,
          productName,
          quantity: Number(quantity),
          source,
          destination,
          status,
        }
      );

      alert(
        "Order updated successfully!"
      );

      router.push(
        `/admin/orders/${orderId}`
      );
    } catch (error) {
      console.error(
        "Update order error:",
        error
      );

      setError(
        "Failed to update order."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-gray-500">
          Loading order...
        </p>
      </main>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <main className="min-h-screen bg-gray-100 p-6">
        <div className="mx-auto max-w-3xl">

          <button
            onClick={() =>
              router.push("/admin/orders")
            }
            className="text-sm text-gray-600 hover:underline"
          >
            ← Back to Orders
          </button>

          <div className="mt-6 rounded-xl bg-white p-6 shadow">

            <p className="text-red-500">
              {error}
            </p>

          </div>

        </div>
      </main>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <main className="min-h-screen bg-gray-100 p-6">

      <div className="mx-auto max-w-3xl">

        {/* HEADER */}

        <button
          onClick={() =>
            router.push(
              `/admin/orders/${orderId}`
            )
          }
          className="text-sm text-gray-600 hover:underline"
        >
          ← Back to Order Details
        </button>

        <h1 className="mt-4 text-3xl font-bold">
          Edit Order
        </h1>

        <p className="mt-1 text-gray-500">
          Update order information
        </p>

        {/* FORM */}

        <div className="mt-6 rounded-xl bg-white p-6 shadow">

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Customer Name */}

            <div>
              <label className="mb-1 block text-sm font-medium">
                Customer Name
              </label>

              <input
                type="text"
                value={customerName}
                onChange={(e) =>
                  setCustomerName(
                    e.target.value
                  )
                }
                required
                className="w-full rounded-lg border p-3"
              />
            </div>

            {/* Customer Email */}

            <div>
              <label className="mb-1 block text-sm font-medium">
                Customer Email
              </label>

              <input
                type="email"
                value={customerEmail}
                onChange={(e) =>
                  setCustomerEmail(
                    e.target.value
                  )
                }
                required
                className="w-full rounded-lg border p-3"
              />
            </div>

            {/* Product */}

            <div>
              <label className="mb-1 block text-sm font-medium">
                Product Name
              </label>

              <input
                type="text"
                value={productName}
                onChange={(e) =>
                  setProductName(
                    e.target.value
                  )
                }
                required
                className="w-full rounded-lg border p-3"
              />
            </div>

            {/* Quantity */}

            <div>
              <label className="mb-1 block text-sm font-medium">
                Quantity
              </label>

              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) =>
                  setQuantity(
                    e.target.value
                  )
                }
                required
                className="w-full rounded-lg border p-3"
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
                onChange={(e) =>
                  setSource(
                    e.target.value
                  )
                }
                required
                className="w-full rounded-lg border p-3"
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
                onChange={(e) =>
                  setDestination(
                    e.target.value
                  )
                }
                required
                className="w-full rounded-lg border p-3"
              />
            </div>

            {/* Status */}

            <div>
              <label className="mb-1 block text-sm font-medium">
                Status
              </label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(
                    e.target.value
                  )
                }
                className="w-full rounded-lg border p-3"
              >
                {orderStatuses.map(
                  (orderStatus) => (
                    <option
                      key={orderStatus}
                      value={orderStatus}
                    >
                      {orderStatus}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* ERROR */}

            {error && (
              <p className="text-sm text-red-500">
                {error}
              </p>
            )}

            {/* BUTTONS */}

            <div className="flex gap-3">

              <button
                type="button"
                onClick={() =>
                  router.push(
                    `/admin/orders/${orderId}`
                  )
                }
                className="w-1/2 rounded-lg border p-3 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="w-1/2 rounded-lg bg-black p-3 text-white hover:bg-gray-800 disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>

            </div>

          </form>

        </div>

      </div>

    </main>
  );
}