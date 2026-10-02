/**
 * React Email template.
 * Preview with: npx react-email dev
 * Render with: render(<NotificationEmail {...props} />)
 */

import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Img,
  Link,
  Hr,
  Preview,
} from "@react-email/components";
import * as React from "react";

/* THEME: replace colors with domain palette */
const colors = {
  primary: "#0891b2",
  primaryDark: "#0e7490",
  text: "#1e293b",
  muted: "#64748b",
  border: "#e2e8f0",
  bgOuter: "#f1f5f9",   /* off-white, not pure white */
  bgInner: "#ffffff",
  bgFooter: "#f8fafc",
  white: "#ffffff",
};

/* System font stack -- no web fonts for maximum compatibility */
const fontFamily =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

interface NotificationEmailProps {
  previewText?: string;
  logoUrl?: string;
  heading: string;
  bodyText: string;
  ctaLabel?: string;
  ctaUrl?: string;
  footerCompany?: string;
  unsubscribeUrl?: string;
}

export default function NotificationEmail({
  previewText = "You have a new notification",
  logoUrl,
  heading,
  bodyText,
  ctaLabel,
  ctaUrl,
  footerCompany = "Acme Inc.",
  unsubscribeUrl = "#",
}: NotificationEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
        {/* THEME: dark mode color-scheme */}
        <meta name="color-scheme" content="light dark" />
        <meta name="supported-color-schemes" content="light dark" />
      </Head>
      <Preview>{previewText}</Preview>

      <Body style={styles.body}>
        {/* Outer wrapper -- off-white background */}
        <table
          role="presentation"
          width="100%"
          cellPadding={0}
          cellSpacing={0}
          style={styles.outerTable}
        >
          <tr>
            <td align="center" style={{ padding: "40px 16px" }}>
              {/* Responsive container -- 600px max */}
              <Container style={styles.container}>

                {/* ── Header ─────────────────────────── */}
                <Section style={styles.header}>
                  {logoUrl ? (
                    <Img
                      src={logoUrl}
                      alt={footerCompany}
                      width={140}
                      height={40}
                      style={{ display: "block", margin: "0 auto" }}
                    />
                  ) : (
                    /* THEME: replace placeholder with domain logo */
                    <Text style={styles.logoPlaceholder}>{footerCompany}</Text>
                  )}
                </Section>

                <Hr style={styles.hr} />

                {/* ── Body Content ────────────────────── */}
                <Section style={styles.content}>
                  <Text style={styles.heading}>{heading}</Text>
                  <Text style={styles.paragraph}>{bodyText}</Text>

                  {/* CTA button -- table-based for Outlook */}
                  {ctaLabel && ctaUrl && (
                    <table
                      role="presentation"
                      cellPadding={0}
                      cellSpacing={0}
                      style={{ margin: "28px auto 0" }}
                    >
                      <tr>
                        <td
                          align="center"
                          style={styles.ctaCell}
                        >
                          {/*
                            THEME: replace button colors
                            The <a> inside <td> ensures Outlook renders
                            the button with proper background color.
                          */}
                          <Button href={ctaUrl} style={styles.ctaButton}>
                            {ctaLabel}
                          </Button>
                        </td>
                      </tr>
                    </table>
                  )}
                </Section>

                <Hr style={styles.hr} />

                {/* ── Footer ─────────────────────────── */}
                <Section style={styles.footer}>
                  <Text style={styles.footerText}>
                    {footerCompany} &middot; 123 Main St, Suite 100
                  </Text>
                  <Text style={styles.footerText}>
                    <Link href={unsubscribeUrl} style={styles.footerLink}>
                      Unsubscribe
                    </Link>
                    {" "}&#8226;{" "}
                    <Link href="#" style={styles.footerLink}>
                      Privacy Policy
                    </Link>
                  </Text>
                </Section>

              </Container>
            </td>
          </tr>
        </table>
      </Body>
    </Html>
  );
}

/* ── All styles inline ──────────────────────────────── */

/* THEME: replace colors in styles below */
const styles: Record<string, React.CSSProperties> = {
  body: {
    margin: 0,
    padding: 0,
    backgroundColor: colors.bgOuter,
    fontFamily,
    WebkitTextSizeAdjust: "100%",
  },
  outerTable: {
    backgroundColor: colors.bgOuter,
    width: "100%",
  },
  container: {
    maxWidth: 600,
    width: "100%",
    backgroundColor: colors.bgInner,
    borderRadius: 8,
    border: `1px solid ${colors.border}`,
    overflow: "hidden" as const,
  },
  header: {
    padding: "28px 32px 16px",
    textAlign: "center" as const,
  },
  logoPlaceholder: {
    fontSize: 20,
    fontWeight: 700,
    color: colors.primary,
    fontFamily,
    textAlign: "center" as const,
    margin: 0,
  },
  hr: {
    borderTop: `1px solid ${colors.border}`,
    borderBottom: "none",
    margin: "0 32px",
  },
  content: {
    padding: "28px 32px",
  },
  heading: {
    fontSize: 22,
    fontWeight: 700,
    color: colors.text,
    lineHeight: "30px",
    margin: "0 0 16px",
    fontFamily,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: "24px",
    color: colors.text,
    margin: "0 0 8px",
    fontFamily,
  },
  ctaCell: {
    backgroundColor: colors.primary,
    borderRadius: 6,
  },
  ctaButton: {
    display: "inline-block" as const,
    backgroundColor: colors.primary,
    color: colors.white,
    fontSize: 15,
    fontWeight: 600,
    fontFamily,
    textDecoration: "none",
    padding: "12px 28px",
    borderRadius: 6,
    textAlign: "center" as const,
  },
  footer: {
    padding: "20px 32px 28px",
    backgroundColor: colors.bgFooter,
  },
  footerText: {
    fontSize: 12,
    lineHeight: "18px",
    color: colors.muted,
    margin: "0 0 4px",
    textAlign: "center" as const,
    fontFamily,
  },
  footerLink: {
    color: colors.muted,
    textDecoration: "underline",
  },
};
