import {
  Html,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
} from "@react-email/components";

export default function PatientEmail({ name, date, doctor }) {
  return (
    <Html>
      <Body style={main}>
        <Container style={container}>
          
          {/* Header */}
          <Section style={header}>
            <Heading style={heading}>Hospital Care</Heading>
          </Section>

          {/* Body */}
          <Section style={content}>
            <Heading style={title}>Appointment Confirmed ✅</Heading>

            <Text style={text}>Hello {name},</Text>

            <Text style={text}>
              Your appointment has been successfully booked.
            </Text>

            <Section style={detailsBox}>
              <Text style={detail}><b>Date:</b> {date}</Text>
              <Text style={detail}><b>Doctor:</b> {doctor || "Will be assigned soon"}</Text>
            </Section>

            <Text style={text}>
              Please arrive 10 minutes early.
            </Text>

            <Hr />

            <Text style={footer}>
              If you have any questions, reply to this email.
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  );
}

/* STYLES */

const main = {
  backgroundColor: "#f4f4f7",
  padding: "20px",
  fontFamily: "Arial, sans-serif",
};

const container = {
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  overflow: "hidden",
  maxWidth: "500px",
  margin: "0 auto",
};

const header = {
  backgroundColor: "#2563eb",
  padding: "20px",
  textAlign: "center",
};

const heading = {
  color: "#ffffff",
  margin: 0,
};

const content = {
  padding: "20px",
};

const title = {
  fontSize: "20px",
  marginBottom: "10px",
};

const text = {
  fontSize: "14px",
  margin: "10px 0",
};

const detailsBox = {
  backgroundColor: "#f1f5f9",
  padding: "15px",
  borderRadius: "6px",
  marginTop: "15px",
};

const detail = {
  margin: "5px 0",
  fontSize: "14px",
};

const footer = {
  fontSize: "12px",
  color: "#6b7280",
  marginTop: "20px",
};