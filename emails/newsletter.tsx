import {
  Button,
  Heading,
  Hr,
  Img,
  Link,
  Section,
  Text,
} from "react-email";

import { EmailLayout } from "./components/email-layout";

export type NewsletterEmailBlock = {
  blockType: string;
  content: Record<string, unknown>;
};

export function NewsletterEmail({
  clubName,
  title,
  previewText,
  issueLabel,
  blocks,
}: {
  clubName: string;
  title: string;
  previewText: string;
  issueLabel?: string | null;
  blocks: NewsletterEmailBlock[];
}) {
  return (
    <EmailLayout preview={previewText || title}>
      <Text style={styles.meta}>{clubName}</Text>
      <Heading as="h1" style={styles.heading}>
        {title}
      </Heading>
      {issueLabel ? <Text style={styles.issue}>{issueLabel}</Text> : null}
      {blocks.map((block, index) => {
        const content = block.content;
        switch (block.blockType) {
          case "hero":
            return (
              <Section key={index} style={styles.block}>
                <Heading as="h2" style={styles.subheading}>
                  {String(content.title ?? "")}
                </Heading>
                {content.subtitle ? (
                  <Text style={styles.body}>{String(content.subtitle)}</Text>
                ) : null}
              </Section>
            );
          case "text":
            return (
              <Text key={index} style={styles.body}>
                {String(content.body ?? "")}
              </Text>
            );
          case "highlight":
          case "event_recap":
          case "upcoming_event":
            return (
              <Section key={index} style={styles.card}>
                <Text style={styles.cardLabel}>{block.blockType.replaceAll("_", " ")}</Text>
                <Text style={styles.cardTitle}>{String(content.title ?? "")}</Text>
                {content.summary || content.body ? (
                  <Text style={styles.body}>
                    {String(content.summary ?? content.body ?? "")}
                  </Text>
                ) : null}
              </Section>
            );
          case "stats":
            return (
              <Section key={index} style={styles.card}>
                <Text style={styles.cardLabel}>This period</Text>
                <Text style={styles.body}>{String(content.summary ?? "")}</Text>
              </Section>
            );
          case "image":
            return content.imageUrl ? (
              <Img
                key={index}
                src={String(content.imageUrl)}
                alt={String(content.alt ?? "Newsletter image")}
                width="504"
                style={styles.image}
              />
            ) : null;
          case "gallery":
            return (
              <Text key={index} style={styles.body}>
                Gallery: {Array.isArray(content.captions) ? content.captions.join(", ") : "Media"}
              </Text>
            );
          case "course_recommendation":
            return (
              <Section key={index} style={styles.card}>
                <Text style={styles.cardLabel}>Course</Text>
                <Text style={styles.cardTitle}>{String(content.title ?? "")}</Text>
                {content.provider ? (
                  <Text style={styles.body}>{String(content.provider)}</Text>
                ) : null}
              </Section>
            );
          case "cta":
            return content.url ? (
              <Button key={index} href={String(content.url)} style={styles.button}>
                {String(content.label ?? "Learn more")}
              </Button>
            ) : null;
          case "divider":
            return <Hr key={index} style={styles.hr} />;
          default:
            return null;
        }
      })}
      <Hr style={styles.hr} />
      <Text style={styles.footer}>
        Sent via BayAreaClubs. Stats and recaps reflect recorded club data only.
      </Text>
      <Text style={styles.footer}>
        <Link href="https://bayareaclubs.example/dashboard/profile">Email preferences</Link>
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
    fontSize: "24px",
    margin: "8px 0 4px",
  },
  issue: {
    color: "#5b6b61",
    fontSize: "13px",
    margin: "0 0 16px",
  },
  block: { margin: "0 0 16px" },
  subheading: {
    color: "#17211b",
    fontSize: "18px",
    margin: "0 0 8px",
  },
  body: {
    color: "#243028",
    fontSize: "15px",
    lineHeight: "1.55",
    margin: "0 0 12px",
    whiteSpace: "pre-wrap" as const,
  },
  card: {
    backgroundColor: "#f7f8f6",
    borderRadius: "8px",
    margin: "0 0 12px",
    padding: "12px 14px",
  },
  cardLabel: {
    color: "#5b6b61",
    fontSize: "11px",
    letterSpacing: "0.06em",
    textTransform: "uppercase" as const,
    margin: "0 0 4px",
  },
  cardTitle: {
    color: "#17211b",
    fontSize: "15px",
    fontWeight: "700",
    margin: "0 0 6px",
  },
  image: {
    borderRadius: "8px",
    margin: "0 0 12px",
    maxWidth: "100%",
  },
  button: {
    backgroundColor: "#155f45",
    borderRadius: "8px",
    color: "#ffffff",
    display: "inline-block",
    fontSize: "14px",
    fontWeight: "600",
    margin: "8px 0 16px",
    padding: "12px 18px",
    textDecoration: "none",
  },
  hr: { borderColor: "#d8ded8", margin: "20px 0" },
  footer: {
    color: "#5b6b61",
    fontSize: "12px",
    lineHeight: "1.45",
  },
} as const;
