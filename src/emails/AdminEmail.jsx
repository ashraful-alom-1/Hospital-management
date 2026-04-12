import {
  Html,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
} from "@react-email/components";

export default function AdminEmail({ name, date, doctor, email, phone }) {
  return (
    <Html>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={heading}>Hospital Admin Panel</Heading>
          </Section>

          <Section style={content}>
            <Heading style={title}>New Appointment 📅</Heading>

            <Text style={text}>
              A new appointment has been booked.
            </Text>

            <Section style={detailsBox}>
              <Text style={detail}><b>Name:</b> {name}</Text>
              <Text style={detail}><b>Email:</b> {email}</Text>
              <Text style={detail}><b>Phone:</b> {phone}</Text>
              <Text style={detail}><b>Date:</b> {date}</Text>
              <Text style={detail}><b>Doctor:</b> {doctor || "Not assigned yet"}</Text>
            </Section>

            <Hr />

            <Text style={footer}>
              Check admin dashboard for full details.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

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
  backgroundColor: "#111827",
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
  backgroundColor: "#f9fafb",
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