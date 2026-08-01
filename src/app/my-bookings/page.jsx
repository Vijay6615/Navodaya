import { Suspense } from "react";
import MyBookingsClient from "./MyBookingsClient";
import MyBookingsLoading from "./MyBookingsLoading";

export default function MyBookingsPage() {
  return (
    <Suspense fallback={<MyBookingsLoading />}>
      <MyBookingsClient />
    </Suspense>
  );
}