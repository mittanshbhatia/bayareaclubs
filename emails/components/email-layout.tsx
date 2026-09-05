import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from "react-email";
import type { ReactNode } from "react";

export function EmailLayout({
  children,
  preview,
}: {
  children: ReactNode;
  preview: string;
}) {
  return (
    <Html lang="en">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section>
            <Text style={styles.brand}>BayAreaClubs</Text>
            {children}
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  body: {
    backgroundColor: "#f7f8f6",
    color: "#17211b",
    fontFamily: "Arial, sans-serif",
    margin: 0,
    padding: "32px 16px",
  },
  container: {
    backgroundColor: "#ffffff",
    border: "1px solid #d8ded8",
    borderRadius: "10px",
    margin: "0 auto",
    maxWidth: "560px",
    padding: "28px",
  },
  brand: {
    color: "#155f45",
    fontSize: "14px",
    fontWeight: "700",
  },
} as const;
