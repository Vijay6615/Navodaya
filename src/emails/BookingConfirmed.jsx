import BookingStatusEmail from "./BookingStatusEmail";

export default function BookingConfirmed({
  booking,
  dashboardUrl,
  whatsappUrl,
}) {
  return (
    <BookingStatusEmail
      booking={booking}
      status="confirmed"
      dashboardUrl={dashboardUrl}
      whatsappUrl={whatsappUrl}
    />
  );
}