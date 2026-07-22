import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Row,
  Column,
  Heading,
  Text,
  Button,
  Hr,
  Link,
} from "@react-email/components";

const STATUS_CONFIG = {
  pending: {
    accent: "#d97706",
    lightBackground: "#fffbeb",
    badgeBackground: "#fef3c7",
    badgeText: "#92400e",
    icon: "⌛",
    title: "Booking Pending",
    preview:
      "Your Puja Dham booking request has been received.",
    message:
      "Your booking request has been received successfully and is currently under review.",
    note:
      "Our Pandit Ji will review your booking shortly. You will receive another email once your booking is confirmed or updated.",
  },

  confirmed: {
    accent: "#16a34a",
    lightBackground: "#f0fdf4",
    badgeBackground: "#dcfce7",
    badgeText: "#166534",
    icon: "✓",
    title: "Booking Confirmed",
    preview:
      "Your Puja Dham booking has been confirmed.",
    message:
      "Your booking has been successfully confirmed by our Pandit Ji.",
    note:
      "Please be available at the selected date and time. Our team will contact you if any additional information is required.",
  },

  rejected: {
    accent: "#dc2626",
    lightBackground: "#fef2f2",
    badgeBackground: "#fee2e2",
    badgeText: "#991b1b",
    icon: "✕",
    title: "Booking Rejected",
    preview:
      "An update regarding your Puja Dham booking.",
    message:
      "Unfortunately, we are unable to accept your booking request at this time.",
    note:
      "You may create a new booking with another date or time slot. Our support team is available to help you.",
  },

  completed: {
    accent: "#7c3aed",
    lightBackground: "#f5f3ff",
    badgeBackground: "#ede9fe",
    badgeText: "#5b21b6",
    icon: "★",
    title: "Puja Completed",
    preview:
      "Your Puja Dham booking has been completed.",
    message:
      "Your Puja has been successfully completed. Thank you for choosing Puja Dham.",
    note:
      "May this Puja bring peace, happiness, prosperity and positive energy to you and your family.",
  },
};

export default function BookingStatusEmail({
  booking = {},
  status = "confirmed",
  reason = "",
  dashboardUrl = "",
  whatsappUrl = "",
}) {
  const config =
    STATUS_CONFIG[status] ||
    STATUS_CONFIG.confirmed;

  const getBookingValue = (...keys) => {
    for (const key of keys) {
      const value = booking?.[key];

      if (
        value !== undefined &&
        value !== null &&
        value !== ""
      ) {
        return value;
      }
    }

    return "Not provided";
  };

  const customerName = getBookingValue(
    "customerName",
    "name",
    "fullName"
  );

  const bookingId = getBookingValue(
    "bookingId",
    "_id"
  );

  const pujaName = getBookingValue(
    "pujaName",
    "title",
    "serviceName"
  );

  const pujaType = getBookingValue(
    "pujaType",
    "bookingType",
    "type",
    "mode"
  );

  const bookingDate = getBookingValue(
    "date",
    "selectedDate",
    "bookingDate"
  );

  const bookingTime = getBookingValue(
    "timeSlot",
    "selectedTime",
    "time"
  );

  const rawPrice = getBookingValue(
    "price",
    "amount",
    "totalAmount"
  );

  const address = getBookingValue(
    "address",
    "fullAddress"
  );

  const formattedPrice =
    formatPrice(rawPrice);

  return (
    <Html>
      <Head />

      <Preview>{config.preview}</Preview>

      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          {/* Header */}
          <Section
            style={{
              ...headerStyle,
              backgroundColor: config.accent,
            }}
          >
            <Text style={brandIconStyle}>
              🙏
            </Text>

            <Heading style={brandTitleStyle}>
              PUJA DHAM
            </Heading>

            <Text style={brandSubtitleStyle}>
              Divine rituals, trusted Pandit Ji
            </Text>
          </Section>

          {/* Main Content */}
          <Section style={contentStyle}>
            {/* Status Icon */}
            <Section
              style={{
                ...statusIconStyle,
                backgroundColor:
                  config.lightBackground,
                borderColor: config.accent,
                color: config.accent,
              }}
            >
              {config.icon}
            </Section>

            <Heading
              style={{
                ...statusTitleStyle,
                color: config.accent,
              }}
            >
              {config.title}
            </Heading>

            {/* Status Badge */}
            <Section
              style={{
                ...statusBadgeStyle,
                backgroundColor:
                  config.badgeBackground,
              }}
            >
              <Text
                style={{
                  ...statusBadgeTextStyle,
                  color: config.badgeText,
                }}
              >
                {config.title.toUpperCase()}
              </Text>
            </Section>

            {/* Greeting */}
            <Text style={greetingStyle}>
              Namaste{" "}
              <strong>{customerName}</strong>,
            </Text>

            <Text style={messageStyle}>
              {config.message}
            </Text>

            {/* Rejection Reason */}
            {status === "rejected" &&
            reason ? (
              <Section style={reasonBoxStyle}>
                <Text style={reasonHeadingStyle}>
                  Reason
                </Text>

                <Text style={reasonTextStyle}>
                  {reason}
                </Text>
              </Section>
            ) : null}

            {/* Booking Details */}
            <Section style={detailsCardStyle}>
              <Heading
                style={detailsHeadingStyle}
              >
                Booking Details
              </Heading>

              <Hr style={detailsDividerStyle} />

              <DetailRow
                label="Booking ID"
                value={bookingId}
              />

              <DetailRow
                label="Puja"
                value={pujaName}
              />

              <DetailRow
                label="Booking Type"
                value={capitalizeText(pujaType)}
              />

              <DetailRow
                label="Date"
                value={bookingDate}
              />

              <DetailRow
                label="Time"
                value={bookingTime}
              />

              <DetailRow
                label="Amount"
                value={formattedPrice}
              />

              {address !== "Not provided" ? (
                <DetailRow
                  label="Address"
                  value={address}
                />
              ) : null}

              <Row style={statusRowStyle}>
                <Column
                  style={labelColumnStyle}
                >
                  <Text style={labelStyle}>
                    Status
                  </Text>
                </Column>

                <Column
                  style={valueColumnStyle}
                >
                  <Text
                    style={{
                      ...inlineStatusStyle,
                      backgroundColor:
                        config.badgeBackground,
                      color: config.badgeText,
                    }}
                  >
                    {config.title}
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* Information */}
            <Section
              style={{
                ...informationBoxStyle,
                backgroundColor:
                  config.lightBackground,
                borderLeftColor:
                  config.accent,
              }}
            >
              <Text
                style={informationTextStyle}
              >
                {config.note}
              </Text>
            </Section>

            {/* Dashboard Button */}
            {dashboardUrl ? (
              <Section
                style={buttonSectionStyle}
              >
                <Button
                  href={dashboardUrl}
                  style={{
                    ...buttonStyle,
                    backgroundColor:
                      config.accent,
                  }}
                >
                  View My Booking
                </Button>
              </Section>
            ) : null}

            <Hr style={mainDividerStyle} />

            {/* Support */}
            <Heading
              style={supportHeadingStyle}
            >
              Need Help?
            </Heading>

            <Text style={supportTextStyle}>
              Our support team is available to
              assist you regarding your booking.
            </Text>

            {whatsappUrl ? (
              <Text
                style={
                  supportLinkWrapperStyle
                }
              >
                <Link
                  href={whatsappUrl}
                  style={{
                    ...supportLinkStyle,
                    color: config.accent,
                  }}
                >
                  Contact us on WhatsApp
                </Link>
              </Text>
            ) : null}
          </Section>

          {/* Footer */}
          <Section style={footerStyle}>
            <Text style={footerBrandStyle}>
              🙏 Puja Dham
            </Text>

            <Text style={footerTextStyle}>
              Thank you for trusting us with
              your spiritual journey.
            </Text>

            <Text
              style={footerSmallTextStyle}
            >
              This is an automated email.
              Please do not reply directly to
              this email.
            </Text>

            <Text style={copyrightStyle}>
              © {new Date().getFullYear()} Puja
              Dham. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

function DetailRow({ label, value }) {
  return (
    <Row style={detailRowStyle}>
      <Column style={labelColumnStyle}>
        <Text style={labelStyle}>
          {label}
        </Text>
      </Column>

      <Column style={valueColumnStyle}>
        <Text style={valueStyle}>
          {value}
        </Text>
      </Column>
    </Row>
  );
}

function capitalizeText(value) {
  if (
    !value ||
    value === "Not provided"
  ) {
    return value;
  }

  return String(value)
    .replaceAll("-", " ")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

function formatPrice(price) {
  if (
    price === undefined ||
    price === null ||
    price === "" ||
    price === "Not provided"
  ) {
    return "Not provided";
  }

  if (typeof price === "number") {
    return `₹${price.toLocaleString(
      "en-IN"
    )}`;
  }

  const stringPrice =
    String(price).trim();

  if (
    stringPrice.startsWith("₹") ||
    stringPrice
      .toLowerCase()
      .startsWith("rs")
  ) {
    return stringPrice;
  }

  const numericPrice = Number(
    stringPrice.replaceAll(",", "")
  );

  if (!Number.isNaN(numericPrice)) {
    return `₹${numericPrice.toLocaleString(
      "en-IN"
    )}`;
  }

  return stringPrice;
}

// ==========================================
// Styles
// ==========================================

const bodyStyle = {
  backgroundColor: "#f3f4f6",
  fontFamily:
    "Arial, Helvetica, sans-serif",
  margin: "0",
  padding: "30px 10px",
};

const containerStyle = {
  backgroundColor: "#ffffff",
  maxWidth: "620px",
  margin: "0 auto",
  borderRadius: "16px",
  overflow: "hidden",
  border: "1px solid #e5e7eb",
};

const headerStyle = {
  padding: "32px 25px",
  textAlign: "center",
};

const brandIconStyle = {
  fontSize: "32px",
  lineHeight: "38px",
  margin: "0 0 8px",
};

const brandTitleStyle = {
  color: "#ffffff",
  fontSize: "26px",
  lineHeight: "32px",
  letterSpacing: "2px",
  margin: "0",
};

const brandSubtitleStyle = {
  color: "#ffffff",
  fontSize: "13px",
  lineHeight: "20px",
  margin: "8px 0 0",
  opacity: "0.9",
};

const contentStyle = {
  padding: "35px 32px 25px",
};

const statusIconStyle = {
  width: "64px",
  height: "64px",
  lineHeight: "64px",
  margin: "0 auto",
  borderRadius: "50%",
  border: "2px solid",
  textAlign: "center",
  fontSize: "30px",
  fontWeight: "bold",
};

const statusTitleStyle = {
  fontSize: "25px",
  lineHeight: "32px",
  textAlign: "center",
  margin: "18px 0 10px",
};

const statusBadgeStyle = {
  width: "fit-content",
  margin: "0 auto 30px",
  padding: "6px 14px",
  borderRadius: "50px",
};

const statusBadgeTextStyle = {
  margin: "0",
  fontSize: "11px",
  lineHeight: "16px",
  fontWeight: "bold",
  letterSpacing: "0.8px",
};

const greetingStyle = {
  color: "#111827",
  fontSize: "16px",
  lineHeight: "25px",
  margin: "0 0 12px",
};

const messageStyle = {
  color: "#4b5563",
  fontSize: "15px",
  lineHeight: "24px",
  margin: "0 0 25px",
};

const detailsCardStyle = {
  backgroundColor: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: "12px",
  padding: "22px",
};

const detailsHeadingStyle = {
  color: "#111827",
  fontSize: "18px",
  lineHeight: "24px",
  margin: "0",
};

const detailsDividerStyle = {
  borderColor: "#e5e7eb",
  margin: "15px 0 8px",
};

const detailRowStyle = {
  borderBottom: "1px solid #e5e7eb",
};

const statusRowStyle = {
  marginTop: "4px",
};

const labelColumnStyle = {
  width: "40%",
  verticalAlign: "top",
};

const valueColumnStyle = {
  width: "60%",
  verticalAlign: "top",
  textAlign: "right",
};

const labelStyle = {
  color: "#6b7280",
  fontSize: "13px",
  lineHeight: "20px",
  margin: "11px 0",
};

const valueStyle = {
  color: "#111827",
  fontSize: "14px",
  lineHeight: "20px",
  fontWeight: "600",
  margin: "11px 0",
};

const inlineStatusStyle = {
  display: "inline-block",
  fontSize: "12px",
  lineHeight: "18px",
  fontWeight: "bold",
  padding: "5px 10px",
  borderRadius: "50px",
  margin: "8px 0",
};

const informationBoxStyle = {
  borderLeft: "4px solid",
  borderRadius: "6px",
  marginTop: "22px",
  padding: "14px 16px",
};

const informationTextStyle = {
  color: "#374151",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "0",
};

const reasonBoxStyle = {
  backgroundColor: "#fff7ed",
  border: "1px solid #fed7aa",
  borderRadius: "8px",
  marginBottom: "22px",
  padding: "15px",
};

const reasonHeadingStyle = {
  color: "#9a3412",
  fontSize: "13px",
  fontWeight: "bold",
  margin: "0 0 6px",
};

const reasonTextStyle = {
  color: "#7c2d12",
  fontSize: "14px",
  lineHeight: "21px",
  margin: "0",
};

const buttonSectionStyle = {
  textAlign: "center",
  marginTop: "28px",
};

const buttonStyle = {
  color: "#ffffff",
  display: "inline-block",
  fontSize: "14px",
  fontWeight: "bold",
  textDecoration: "none",
  borderRadius: "8px",
  padding: "13px 24px",
};

const mainDividerStyle = {
  borderColor: "#e5e7eb",
  margin: "30px 0 22px",
};

const supportHeadingStyle = {
  color: "#111827",
  fontSize: "17px",
  lineHeight: "23px",
  textAlign: "center",
  margin: "0 0 7px",
};

const supportTextStyle = {
  color: "#6b7280",
  fontSize: "13px",
  lineHeight: "21px",
  textAlign: "center",
  margin: "0",
};

const supportLinkWrapperStyle = {
  textAlign: "center",
  margin: "12px 0 0",
};

const supportLinkStyle = {
  fontSize: "14px",
  fontWeight: "bold",
  textDecoration: "none",
};

const footerStyle = {
  backgroundColor: "#111827",
  padding: "26px 25px",
  textAlign: "center",
};

const footerBrandStyle = {
  color: "#ffffff",
  fontSize: "17px",
  fontWeight: "bold",
  margin: "0 0 8px",
};

const footerTextStyle = {
  color: "#d1d5db",
  fontSize: "12px",
  lineHeight: "19px",
  margin: "0 0 7px",
};

const footerSmallTextStyle = {
  color: "#9ca3af",
  fontSize: "11px",
  lineHeight: "17px",
  margin: "0 0 10px",
};

const copyrightStyle = {
  color: "#6b7280",
  fontSize: "10px",
  lineHeight: "16px",
  margin: "0",
};