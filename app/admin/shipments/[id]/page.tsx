"use client";

import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useParams, useRouter } from "next/navigation";

type Shipment = {
  id: string;
  shipmentNumber: string;
  orderId: string;
  customerName: string;
  source: string;
  destination: string;
  status: string;
  vehicleId?: string;
  vehicleNumber?: string;
  driverId?: string;
  driverName?: string;
  createdAt?: any;
};

export default function ShipmentDetailsPage() {
  const router = useRouter();
  const params = useParams();

  const shipmentId = params.id as string;

  const [shipment, setShipment] =
    useState<Shipment | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ==========================================
  // FETCH SHIPMENT
  // ==========================================

  useEffect(() => {
    const fetchShipment = async () => {
      try {
        if (!shipmentId) {
          setError("Shipment ID is missing.");
          setLoading(false);
          return;
        }

        console.log(
          "Fetching shipment:",
          shipmentId
        );

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

        console.log(
          "Shipment data:",
          data
        );

        setShipment({
          id: shipmentSnapshot.id,

          shipmentNumber:
            data.shipmentNumber || "",

          orderId:
            data.orderId || "",

          customerName:
            data.customerName || "",

          source:
            data.source || "",

          destination:
            data.destination || "",

          status:
            data.status || "Pending",

          vehicleId:
            data.vehicleId || "",

          vehicleNumber:
            data.vehicleNumber || "",

          driverId:
            data.driverId || "",

          driverName:
            data.driverName || "",

          createdAt:
            data.createdAt || null,
        });
      } catch (error) {
        console.error(
          "Error fetching shipment:",
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

  if (error || !shipment) {
    return (
      <main className="min-h-screen bg-gray-100 p-6">
        <div className="mx-auto max-w-4xl">

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

          <div className="mt-6 rounded-xl bg-white p-8 shadow">

            <p className="text-red-500">
              {error ||
                "Shipment not found."}
            </p>

          </div>
        </div>
      </main>
    );
  }

  // ==========================================
  // DETAILS PAGE
  // ==========================================

  return (
    <main className="min-h-screen bg-gray-100 p-6">

      <div className="mx-auto max-w-4xl">

        {/* HEADER */}

        <div className="mb-6">

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

          <h1 className="mt-4 text-3xl font-bold">
            Shipment Details
          </h1>

          <p className="mt-1 text-gray-500">
            View complete shipment information
          </p>

        </div>

        {/* SHIPMENT CARD */}

        <div className="rounded-xl bg-white p-6 shadow">

          {/* Shipment Header */}

          <div className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <p className="text-sm text-gray-500">
                Shipment Number
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                {shipment.shipmentNumber}
              </h2>

            </div>

            <span className="w-fit rounded-full bg-gray-100 px-4 py-2 text-sm font-medium">
              {shipment.status}
            </span>

          </div>

          {/* BASIC INFORMATION */}

          <section className="mt-6">

            <h3 className="text-lg font-semibold">
              Shipment Information
            </h3>

            <div className="mt-4 grid gap-5 sm:grid-cols-2">

              <InfoItem
                label="Shipment Number"
                value={
                  shipment.shipmentNumber ||
                  "Not Available"
                }
              />

              <InfoItem
                label="Order ID"
                value={
                  shipment.orderId ||
                  "Not Available"
                }
              />

              <InfoItem
                label="Customer"
                value={
                  shipment.customerName ||
                  "Not Available"
                }
              />

              <InfoItem
                label="Status"
                value={
                  shipment.status ||
                  "Pending"
                }
              />

            </div>

          </section>

          {/* ROUTE */}

          <section className="mt-8 border-t pt-6">

            <h3 className="text-lg font-semibold">
              Delivery Route
            </h3>

            <div className="mt-4 grid gap-5 sm:grid-cols-2">

              <InfoItem
                label="Source"
                value={
                  shipment.source ||
                  "Not Available"
                }
              />

              <InfoItem
                label="Destination"
                value={
                  shipment.destination ||
                  "Not Available"
                }
              />

            </div>

          </section>

          {/* VEHICLE */}

          <section className="mt-8 border-t pt-6">

            <h3 className="text-lg font-semibold">
              Vehicle
            </h3>

            <div className="mt-4 grid gap-5 sm:grid-cols-2">

              <InfoItem
                label="Vehicle Number"
                value={
                  shipment.vehicleNumber ||
                  "Not Assigned"
                }
              />

              <InfoItem
                label="Vehicle ID"
                value={
                  shipment.vehicleId ||
                  "Not Assigned"
                }
              />

            </div>

          </section>

          {/* DRIVER */}

          <section className="mt-8 border-t pt-6">

            <h3 className="text-lg font-semibold">
              Driver
            </h3>

            <div className="mt-4 grid gap-5 sm:grid-cols-2">

              <InfoItem
                label="Driver Name"
                value={
                  shipment.driverName ||
                  "Not Assigned"
                }
              />

              <InfoItem
                label="Driver ID"
                value={
                  shipment.driverId ||
                  "Not Assigned"
                }
              />

            </div>

          </section>

          {/* BACK BUTTON */}

          <div className="mt-8 border-t pt-6">

            <button
              onClick={() =>
                router.push(
                  "/admin/shipments"
                )
              }
              className="rounded-lg bg-black px-5 py-2 text-white hover:bg-gray-800"
            >
              Back to Shipments
            </button>

          </div>

        </div>

      </div>

    </main>
  );
}

// ==========================================
// INFO ITEM
// ==========================================

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg bg-gray-50 p-4">

      <p className="text-sm text-gray-500">
        {label}
      </p>

      <p className="mt-1 break-all font-medium">
        {value}
      </p>

    </div>
  );
}