import { Suspense } from "react";
import MyBookingsClient from "./MyBookingsClient";

function BookingsLoading() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#fffdfb] px-4">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#eadfd7] border-t-[#a8441b]" />

        <p className="mt-4 text-sm font-medium text-gray-500">
          Loading your sacred bookings...
        </p>
      </div>
    </main>
  );
}

export default function MyBookingsPage() {
  return (
    <Suspense fallback={<BookingsLoading />}>
      <MyBookingsClient />
    </Suspense>
  );
}