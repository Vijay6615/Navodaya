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
  Hr,
  Link,
} from "@react-email/components";

export default function StoreOrderEmail({
  orderId = "PD-STORE-SAMPLE",
  customerName = "Devotee",
  phone = "",
  shippingAddress = {},
  items = [],
  pricing = {},
  paymentMethod = "cod",
  orderDate = "",
}) {
  const formattedDate =
    orderDate ||
    new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <Html>
      <Head />
      <Preview>
        Your sacred Puja Dham order {orderId} has been confirmed!
      </Preview>
      <Body
        style={{
          backgroundColor: "#faf7f4",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          margin: 0,
          padding: "24px 0",
        }}
      >
        <Container
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            border: "1px solid #eadfd7",
            overflow: "hidden",
          }}
        >
          {/* HEADER */}
          <Section
            style={{
              backgroundColor: "#fffaf6",
              padding: "28px 24px 20px",
              textAlign: "center",
              borderBottom: "1px solid #f0e3db",
            }}
          >
            <Text
              style={{
                color: "#a8441b",
                fontSize: "12px",
                fontWeight: "700",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                margin: "0 0 6px",
              }}
            >
              🙏 Puja Dham Sacred Store 🙏
            </Text>
            <Heading
              style={{
                color: "#28221f",
                fontSize: "24px",
                fontWeight: "800",
                margin: "0 0 8px",
              }}
            >
              Order Confirmed
            </Heading>
            <Text
              style={{
                color: "#6e6057",
                fontSize: "14px",
                margin: 0,
              }}
            >
              Thank you, {customerName}. Your order for authentic Vedic puja
              samagri has been received.
            </Text>
          </Section>

          {/* ORDER INFO BAR */}
          <Section style={{ padding: "20px 24px", backgroundColor: "#fdfbf9" }}>
            <Row>
              <Column>
                <Text style={{ fontSize: "11px", color: "#8d7f76", margin: 0 }}>
                  ORDER ID
                </Text>
                <Text
                  style={{
                    fontSize: "14px",
                    fontWeight: "700",
                    color: "#28221f",
                    margin: "4px 0 0",
                  }}
                >
                  {orderId}
                </Text>
              </Column>
              <Column style={{ textAlign: "right" }}>
                <Text style={{ fontSize: "11px", color: "#8d7f76", margin: 0 }}>
                  DATE
                </Text>
                <Text
                  style={{
                    fontSize: "14px",
                    fontWeight: "700",
                    color: "#28221f",
                    margin: "4px 0 0",
                  }}
                >
                  {formattedDate}
                </Text>
              </Column>
            </Row>
          </Section>

          <Hr style={{ borderColor: "#f0e3db", margin: 0 }} />

          {/* ITEMS LIST */}
          <Section style={{ padding: "24px" }}>
            <Text
              style={{
                fontSize: "13px",
                fontWeight: "700",
                color: "#a8441b",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                margin: "0 0 16px",
              }}
            >
              Items in Your Order
            </Text>

            {items.map((item, idx) => (
              <Row
                key={idx}
                style={{
                  paddingBottom: "12px",
                  marginBottom: "12px",
                  borderBottom:
                    idx < items.length - 1 ? "1px solid #f6f0ea" : "none",
                }}
              >
                <Column style={{ width: "70%" }}>
                  <Text
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#28221f",
                      margin: 0,
                    }}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={{
                      fontSize: "12px",
                      color: "#8d7f76",
                      margin: "2px 0 0",
                    }}
                  >
                    Qty: {item.quantity} {item.weight ? `• ${item.weight}` : ""}
                  </Text>
                </Column>
                <Column style={{ width: "30%", textAlign: "right" }}>
                  <Text
                    style={{
                      fontSize: "14px",
                      fontWeight: "700",
                      color: "#28221f",
                      margin: 0,
                    }}
                  >
                    ₹{item.price * item.quantity}
                  </Text>
                </Column>
              </Row>
            ))}
          </Section>

          <Hr style={{ borderColor: "#f0e3db", margin: 0 }} />

          {/* PRICING & PAYMENT */}
          <Section style={{ padding: "20px 24px", backgroundColor: "#fffaf6" }}>
            <Row style={{ marginBottom: "6px" }}>
              <Column>
                <Text style={{ fontSize: "13px", color: "#6e6057", margin: 0 }}>
                  Subtotal
                </Text>
              </Column>
              <Column style={{ textAlign: "right" }}>
                <Text
                  style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#28221f",
                    margin: 0,
                  }}
                >
                  ₹{pricing.subtotal || 0}
                </Text>
              </Column>
            </Row>

            <Row style={{ marginBottom: "8px" }}>
              <Column>
                <Text style={{ fontSize: "13px", color: "#6e6057", margin: 0 }}>
                  Delivery Fee
                </Text>
              </Column>
              <Column style={{ textAlign: "right" }}>
                <Text
                  style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    color: pricing.deliveryFee === 0 ? "#16a34a" : "#28221f",
                    margin: 0,
                  }}
                >
                  {pricing.deliveryFee === 0 ? "FREE" : `₹${pricing.deliveryFee}`}
                </Text>
              </Column>
            </Row>

            <Hr style={{ borderColor: "#eadfd7", margin: "10px 0" }} />

            <Row>
              <Column>
                <Text
                  style={{
                    fontSize: "16px",
                    fontWeight: "800",
                    color: "#28221f",
                    margin: 0,
                  }}
                >
                  Total Amount
                </Text>
                <Text
                  style={{
                    fontSize: "11px",
                    color: "#8d7f76",
                    margin: "2px 0 0",
                  }}
                >
                  Payment: Cash / UPI on Delivery
                </Text>
              </Column>
              <Column style={{ textAlign: "right" }}>
                <Text
                  style={{
                    fontSize: "20px",
                    fontWeight: "800",
                    color: "#a8441b",
                    margin: 0,
                  }}
                >
                  ₹{pricing.total || 0}
                </Text>
              </Column>
            </Row>
          </Section>

          {/* SHIPPING ADDRESS */}
          <Section style={{ padding: "24px" }}>
            <Text
              style={{
                fontSize: "12px",
                fontWeight: "700",
                color: "#8d7f76",
                textTransform: "uppercase",
                margin: "0 0 6px",
              }}
            >
              Delivery Address
            </Text>
            <Text
              style={{
                fontSize: "14px",
                color: "#28221f",
                lineHeight: "1.5",
                margin: 0,
              }}
            >
              <strong>{customerName}</strong> ({phone})
              <br />
              {shippingAddress.address}
              {shippingAddress.landmark ? `, ${shippingAddress.landmark}` : ""}
              <br />
              {shippingAddress.city} - {shippingAddress.pincode}
            </Text>
          </Section>

          {/* FOOTER */}
          <Section
            style={{
              backgroundColor: "#28221f",
              padding: "24px",
              textAlign: "center",
              color: "#d5c9c1",
            }}
          >
            <Text style={{ fontSize: "12px", margin: "0 0 8px" }}>
              Questions about your order? Need urgent samagri delivery?
            </Text>
            <Text style={{ fontSize: "12px", margin: 0 }}>
              🌐{" "}
              <Link
                href="https://www.pujadham.co.in"
                style={{ color: "#f7b28d", textDecoration: "underline" }}
              >
                www.pujadham.co.in
              </Link>{" "}
              • Puja Dham Vedic Services
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
