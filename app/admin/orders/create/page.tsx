"use client";

import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function CreateOrderPage() {
  const router = useRouter();

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await addDoc(collection(db, "orders"), {
        customerName,
        customerEmail,
        productName,
        quantity: Number(quantity),
        source,
        destination,
        status: "Pending",
        createdAt: serverTimestamp(),
      });

      alert("Order created successfully!");

      router.push("/admin");
    } catch (error) {
      console.error("Create order error:", error);

      setError("Failed to create order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-3xl">

        <div className="mb-6">
          <button
            onClick={() => router.push("/admin")}
            className="text-sm text-gray-600 hover:underline"
          >
            ← Back to Dashboard
          </button>

          <h1 className="mt-3 text-3xl font-bold">
            Create New Order
          </h1>

          <p className="mt-1 text-gray-500">
            Add a new logistics order
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
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
                  setCustomerName(e.target.value)
                }
                placeholder="Enter customer name"
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
                  setCustomerEmail(e.target.value)
                }
                placeholder="Enter customer email"
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
                  setProductName(e.target.value)
                }
                placeholder="Enter product name"
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
                  setQuantity(e.target.value)
                }
                placeholder="Enter quantity"
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
                  setSource(e.target.value)
                }
                placeholder="e.g. Ahmedabad Warehouse"
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
                  setDestination(e.target.value)
                }
                placeholder="e.g. Mumbai"
                required
                className="w-full rounded-lg border p-3"
              />
            </div>

            {error && (
              <p className="text-sm text-red-500">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-black p-3 text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? "Creating Order..." : "Create Order"}
            </button>

          </form>
        </div>
      </div>
    </main>
  );
}