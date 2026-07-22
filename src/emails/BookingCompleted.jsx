import BookingStatusEmail from "./BookingStatusEmail";

export default function BookingCompleted({
  booking,
  dashboardUrl,
  whatsappUrl,
}) {
  return (
    <BookingStatusEmail
      booking={booking}
      status="completed"
      dashboardUrl={dashboardUrl}
      whatsappUrl={whatsappUrl}
    />
  );
}