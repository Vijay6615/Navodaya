import BookingStatusEmail from "./BookingStatusEmail";

export default function BookingPending({
  booking,
  dashboardUrl,
  whatsappUrl,
}) {
  return (
    <BookingStatusEmail
      booking={booking}
      status="pending"
      dashboardUrl={dashboardUrl}
      whatsappUrl={whatsappUrl}
    />
  );
}