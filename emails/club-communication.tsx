import {
  Button,
  Heading,
  Hr,
  Link,
  Text,
} from "react-email";

import { EmailLayout } from "./components/email-layout";

export type ClubCommunicationEmailProps = {
  clubName: string;
  recipientName: string;
  previewText: string;
  messageBody: string;
  ctaLabel?: string | null;
  ctaUrl?: string | null;
  preferencesUrl: string;
  kindLabel: string;
};

/** Individualized club communication — never includes other recipients. */
export function ClubCommunicationEmail({
  clubName,
  recipientName,
  previewText,
  messageBody,
  ctaLabel,
  ctaUrl,
  preferencesUrl,
  kindLabel,
}: ClubCommunicationEmailProps) {
  const paragraphs = messageBody
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);

  return (
    <EmailLayout preview={previewText}>
      <Text style={styles.meta}>{kindLabel}</Text>
      <Heading as="h1" style={styles.heading}>
        {clubName}
      </Heading>
      <Text style={styles.body}>Hi {recipientName},</Text>
      {paragraphs.map((paragraph, index) => (
        <Text key={`${index}-${paragraph.slice(0, 16)}`} style={styles.body}>
          {paragraph}
        </Text>
      ))}
      {ctaLabel && ctaUrl ? (
        <Button href={ctaUrl} style={styles.button}>
          {ctaLabel}
        </Button>
      ) : null}
      <Hr style={styles.hr} />
      <Text style={styles.footer}>
        You received this because you belong to an authorized club audience on
        BayAreaClubs. Manage email preferences:{" "}
        <Link href={preferencesUrl}>{preferencesUrl}</Link>
      </Text>
    </EmailLayout>
  );
}

const styles = {
  meta: {
    color: "#5b6b61",
    fontSize: "12px",
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
  },
  heading: {
    color: "#17211b",
    fontSize: "22px",
    fontWeight: "700",
    margin: "8px 0 16px",
  },
  body: {
    color: "#243028",
    fontSize: "15px",
    lineHeight: "1.55",
    margin: "0 0 12px",
    whiteSpace: "pre-wrap" as const,
  },
  button: {
    backgroundColor: "#155f45",
    borderRadius: "8px",
    color: "#ffffff",
    display: "inline-block",
    fontSize: "14px",
    fontWeight: "600",
    padding: "12px 18px",
    textDecoration: "none",
  },
  hr: {
    borderColor: "#d8ded8",
    margin: "24px 0 12px",
  },
  footer: {
    color: "#5b6b61",
    fontSize: "12px",
    lineHeight: "1.45",
  },
} as const;
