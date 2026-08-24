"use client";

import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useParams, useRouter } from "next/navigation";

const shipmentStatuses = [
  "Pending",
  "Picked Up",
  "In Transit",
  "Out for Delivery",
  "Delivered",
];

export default function EditShipmentPage() {
  const router = useRouter();
  const params = useParams();

  const shipmentId = params.id as string;

  const [shipmentNumber, setShipmentNumber] =
    useState("");

  const [customerName, setCustomerName] =
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
  // FETCH SHIPMENT
  // ==========================================

  useEffect(() => {
    const fetchShipment = async () => {
      try {
        if (!shipmentId) {
          setError(
            "Shipment ID is missing."
          );
          return;
        }

        const shipmentRef = doc(
          db,
          "shipments",
          shipmentId
        );

        const shipmentSnapshot =
          await getDoc(shipmentRef);

        if (!shipmentSnapshot.exists()) {
          setError(
            "Shipment not found."
          );
          return;
        }

        const data =
          shipmentSnapshot.data();

        setShipmentNumber(
          data.shipmentNumber || ""
        );

        setCustomerName(
          data.customerName || ""
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
          "Error loading shipment:",
          error
        );

        setError(
          "Failed to load shipment."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchShipment();
  }, [shipmentId]);

  // ==========================================
  // UPDATE SHIPMENT
  // ==========================================

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");
    setSaving(true);

    try {
      await updateDoc(
        doc(
          db,
          "shipments",
          shipmentId
        ),
        {
          shipmentNumber,
          customerName,
          source,
          destination,
          status,
        }
      );

      // Update related order status
      const shipmentRef = doc(
        db,
        "shipments",
        shipmentId
      );

      const shipmentSnapshot =
        await getDoc(shipmentRef);

      if (shipmentSnapshot.exists()) {
        const shipmentData =
          shipmentSnapshot.data();

        if (shipmentData.orderId) {
          await updateDoc(
            doc(
              db,
              "orders",
              shipmentData.orderId
            ),
            {
              status,
            }
          );
        }
      }

      alert(
        "Shipment updated successfully!"
      );

      router.push(
        `/admin/shipments/${shipmentId}`
      );
    } catch (error) {
      console.error(
        "Update shipment error:",
        error
      );

      setError(
        "Failed to update shipment."
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
          Loading shipment...
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
              router.push(
                "/admin/shipments"
              )
            }
            className="text-sm text-gray-600 hover:underline"
          >
            ← Back to Shipments
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
              `/admin/shipments/${shipmentId}`
            )
          }
          className="text-sm text-gray-600 hover:underline"
        >
          ← Back to Shipment Details
        </button>

        <h1 className="mt-4 text-3xl font-bold">
          Edit Shipment
        </h1>

        <p className="mt-1 text-gray-500">
          Update shipment information
        </p>

        {/* FORM */}

        <div className="mt-6 rounded-xl bg-white p-6 shadow">

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
                onChange={(e) =>
                  setCustomerName(
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

                {shipmentStatuses.map(
                  (shipmentStatus) => (
                    <option
                      key={shipmentStatus}
                      value={shipmentStatus}
                    >
                      {shipmentStatus}
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
                    `/admin/shipments/${shipmentId}`
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