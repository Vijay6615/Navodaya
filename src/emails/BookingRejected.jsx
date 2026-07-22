import BookingStatusEmail from "./BookingStatusEmail";

export default function BookingRejected({
  booking,
  reason,
  dashboardUrl,
  whatsappUrl,
}) {
  return (
    <BookingStatusEmail
      booking={booking}
      status="rejected"
      reason={
        reason ||
        "The selected date or time slot is currently unavailable."
      }
      dashboardUrl={dashboardUrl}
      whatsappUrl={whatsappUrl}
    />
  );
}