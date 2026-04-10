import { SMTPClient, Message } from "emailjs";
import type { SMTPClient as SMTPClientType } from "emailjs";

/**
 * Email Service — sends emails via Emailit SMTP using emailjs.
 *
 * Env vars (in .env):
 *   EMAILIT_KEY     — your Emailit API key (used as SMTP password)
 *   EMAIL_FROM      — (optional) override the default from address
 *
 * SMTP config (Emailit):
 *   Host:  smtp.emailit.com
 *   Port:  587
 *   TLS:   yes
 *   User:  emailit
 *   Pass:  {EMAILIT_KEY}
 *
 * Domain fallback:
 *   1. dart.monster (primary)
 *   2. moipippeloi.nl (fallback when primary domain is not verified)
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface EmailAddress {
  /** Display name, e.g. "Patrick" */
  name?: string;
  /** Email address, e.g. "patrick@gmail.com" */
  email: string;
}

export interface SendEmailOptions {
  to: EmailAddress | EmailAddress[];
  subject: string;
  /** Plain-text body */
  text?: string;
  /** HTML body */
  html?: string;
  from?: EmailAddress;
  replyTo?: EmailAddress;
}

export interface VerificationEmailOptions {
  to: EmailAddress;
  /** The player name to personalise the email */
  playerName: string;
  /** Full URL the player clicks, e.g. https://dart.monster/verify/TOKEN */
  verificationUrl: string;
  from?: EmailAddress;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatAddress(addr: EmailAddress): string {
  return addr.name ? `${addr.name} <${addr.email}>` : addr.email;
}

// ---------------------------------------------------------------------------
// From addresses — primary and fallback
// ---------------------------------------------------------------------------

const FROM_PRIMARY = "dart.monster <noreply@dart.monster>";
const FROM_FALLBACK = "dart.monster <no-reply@moipippeloi.nl>";

function getFromAddresses(): string[] {
  if (process.env.EMAIL_FROM) return [process.env.EMAIL_FROM];
  return [FROM_PRIMARY, FROM_FALLBACK];
}

// ---------------------------------------------------------------------------
// Lazy SMTP client
// ---------------------------------------------------------------------------

let _client: SMTPClientType | null = null;

function getClient(): SMTPClientType {
  if (_client) return _client;

  const apiKey = process.env.EMAILIT_KEY;
  if (!apiKey) {
    throw new Error("EMAILIT_KEY environment variable is not set");
  }

  _client = new SMTPClient({
    host: "smtp.emailit.com",
    port: 587,
    ssl: false, // port 587 uses STARTTLS, not implicit SSL
    tls: true,
    user: "emailit",
    password: apiKey,
  });

  return _client;
}

// ---------------------------------------------------------------------------
// Core send with domain fallback
// ---------------------------------------------------------------------------

function sendWithFrom(
  client: SMTPClientType,
  fromAddress: string,
  toArray: string[],
  opts: SendEmailOptions,
): Promise<void> {
  const message = new Message({
    from: fromAddress,
    to: toArray,
    "reply-to": opts.replyTo ? formatAddress(opts.replyTo) : undefined,
    subject: opts.subject,
    text: opts.text || "",
    attachment: opts.html
      ? [{ data: opts.html, alternative: true }]
      : undefined,
  });

  return new Promise<void>((resolve, reject) => {
    client.send(message, (err: Error | null) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

function isDomainError(err: unknown): boolean {
  if (err instanceof Error) {
    const msg = err.message || "";
    return (
      msg.includes("domain is not verified") ||
      msg.includes("not verified for this workspace") ||
      msg.includes("Sender domain") ||
      msg.includes("530")
    );
  }
  return false;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Send a single email.
 *
 * Tries each from address (primary dart.monster, then fallback moipippeloi.nl)
 * until one succeeds or all fail.
 *
 * @example
 * ```ts
 * await EmailService.send({
 *   to: { name: "Patrick", email: "patrick@gmail.com" },
 *   subject: "Hello!",
 *   html: "<p>test</p>",
 * });
 * ```
 */
async function send(opts: SendEmailOptions): Promise<void> {
  const client = getClient();
  const toArray = (Array.isArray(opts.to) ? opts.to : [opts.to]).map(
    formatAddress,
  );

  // If caller specified a custom from, use it directly — no fallback
  if (opts.from) {
    return sendWithFrom(client, formatAddress(opts.from), toArray, opts);
  }

  // Try each from address: primary first, fallback next
  const fromAddresses = getFromAddresses();
  const errors: Error[] = [];

  for (const from of fromAddresses) {
    try {
      await sendWithFrom(client, from, toArray, opts);
      return; // success
    } catch (err) {
      errors.push(err instanceof Error ? err : new Error(String(err)));

      // If it's a domain verification error, try the next from address
      if (isDomainError(err)) continue;

      // Non-domain error — don't retry, throw immediately
      throw new Error(
        `Email send failed: ${errors[errors.length - 1].message}`,
      );
    }
  }

  // All from addresses failed
  throw new Error(
    `Email send failed (tried ${fromAddresses.length} from addresses): ${errors.map((e) => e.message).join("; ")}`,
  );
}

/**
 * Send an email verification link to a player.
 *
 * The email contains a branded HTML template with a button that links to
 * `verificationUrl`.  Also includes a plain-text fallback.
 *
 * @example
 * ```ts
 * await EmailService.sendVerification({
 *   to: { name: "Patrick", email: "patrick@gmail.com" },
 *   playerName: "Patrick",
 *   verificationUrl: "https://dart.monster/verify/abc123",
 * });
 * ```
 */
async function sendVerification(opts: VerificationEmailOptions): Promise<void> {
  const { to, playerName, verificationUrl } = opts;

  const html = VERIFICATION_HTML_TEMPLATE.replace(
    /{{PLAYER_NAME}}/g,
    playerName,
  ).replace(/{{VERIFICATION_URL}}/g, verificationUrl);

  const text = VERIFICATION_TEXT_TEMPLATE.replace(
    /{{PLAYER_NAME}}/g,
    playerName,
  ).replace(/{{VERIFICATION_URL}}/g, verificationUrl);

  return send({
    to,
    from: opts.from,
    subject: "Verify your email — dart.monster",
    html,
    text,
  });
}

// ---------------------------------------------------------------------------
// Templates
// ---------------------------------------------------------------------------

const VERIFICATION_HTML_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#F4F2EE;font-family:system-ui,-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;">
    <!-- Header -->
    <tr>
      <td style="padding:32px 32px 16px 32px;text-align:center;">
        <h1 style="margin:0;font-size:14px;letter-spacing:0.15em;text-transform:uppercase;color:#999;font-weight:600;">
          dart.monster
        </h1>
      </td>
    </tr>
    <!-- Body -->
    <tr>
      <td style="padding:0 32px 32px 32px;">
        <p style="margin:0 0 8px 0;font-size:20px;font-weight:700;color:#1a1a1a;">
          Hey {{PLAYER_NAME}},
        </p>
        <p style="margin:0 0 24px 0;font-size:15px;color:#666;line-height:1.6;">
          Please verify your email address to link this player to your account.
        </p>
        <!-- Button -->
        <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
          <tr>
            <td style="border-radius:9999px;background:#10b981;">
              <a href="{{VERIFICATION_URL}}" target="_blank" style="display:inline-block;padding:12px 32px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:9999px;">
                Verify Email
              </a>
            </td>
          </tr>
        </table>
        <p style="margin:24px 0 0 0;font-size:13px;color:#999;">
          Or copy this link to your browser:<br>
          <a href="{{VERIFICATION_URL}}" style="color:#10b981;word-break:break-all;">{{VERIFICATION_URL}}</a>
        </p>
      </td>
    </tr>
    <!-- Footer -->
    <tr>
      <td style="padding:16px 32px;border-top:1px solid #eee;text-align:center;">
        <p style="margin:0;font-size:12px;color:#bbb;">
          dart.monster — Darts Scoring App
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const VERIFICATION_TEXT_TEMPLATE = `
dart.monster — Email Verification

Hey {{PLAYER_NAME}},

Please verify your email address to link this player to your account.

Open this link in your browser:

{{VERIFICATION_URL}}

— dart.monster
`;

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const EmailService = {
  send,
  sendVerification,
};
