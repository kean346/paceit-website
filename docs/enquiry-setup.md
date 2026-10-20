# Direct website enquiries with Brevo SMTP

The form POSTs to `/api/enquiry` and stays on the website. The server sends a plain-text email with Nodemailer through Brevo SMTP. The sender and recipient are both **info@paceit.co.za**. The visitor's validated email address is used as **Reply-To**, so replying in the inbox reaches the visitor.

## Vercel configuration

Use Vercel's **Next.js** framework preset and default build/output settings. The homepage is still prerendered; only the enquiry endpoint needs a server runtime. Remove any old custom `out` output-directory override, because a static-only deployment cannot run the SMTP endpoint.

In **Project → Settings → Environment Variables**, add:

| Variable | Value |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://paceit.co.za` |
| `SMTP_HOST` | `smtp-relay.brevo.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | The SMTP login shown in Brevo's SMTP settings |
| `SMTP_PASS` | The SMTP key generated in Brevo's SMTP settings |

The SMTP login may differ from `info@paceit.co.za`; use the value Brevo provides. The password is an **SMTP key**, not the Brevo account password or REST API key. Do not prefix SMTP variables with `NEXT_PUBLIC_`, commit credentials, or put them in client code. Local development can use an ignored `.env.local` copied from `.env.example`.

Enable these secrets only for environments that should send real enquiries; keep previews unconfigured or use a separate test account. Redeploy after changing settings. Confirm Brevo authorises `info@paceit.co.za` as a sender, and complete its sender-domain authentication steps (DKIM and any required DNS records). Review DMARC alignment and the mailbox's spam folder. Website changes do not require replacing the domain's mailbox MX records.

No SMTP credentials were present in the execution environment. The code and mock SMTP tests are complete; live account authentication, delivery, spam placement and inbox receipt remain to be verified after the variables are configured. An SMTP acceptance response means the mail server accepted the message, not that inbox delivery is guaranteed.

## Implemented protections

- Same-origin JSON submissions, no cross-origin relay and a fixed recipient.
- Server-side type, length and format checks, CRLF/control-character rejection, a hidden spam trap and a 24 KiB streamed-body limit.
- Plain-text messages; visitor text is never used as HTML, a database query, a mail attachment or a destination URL. There is no database or SQL query in this application.
- STARTTLS required on port 587 (implicit TLS on 465), TLS 1.2 or later, certificate validation, bounded connection/delivery timeouts and no URL/file attachment access.
- Application responses do not cache enquiry data. Logs contain generic delivery failure markers, not message contents, passwords or visitor addresses.
- A bounded, ten-minute, keyed-IP burst limit: five attempts per application instance. **This is not a distributed/global limit.** Configure Vercel Firewall rate limiting for POST `/api/enquiry` before exposing a high-volume public endpoint, or use a shared rate-limit service if the hosting plan does not offer the required rule.
- The submit button prevents duplicate in-flight submissions. A stable SMTP Message-ID helps identify identical retries, but SMTP does not provide guaranteed idempotent delivery.
- Success appears only after SMTP accepts the intended recipient. Errors preserve the visitor's input; the page never redirects to an email app.

Review the privacy draft before publishing it: direct enquiries now pass through the hosting provider, Brevo and the mailbox, even though the website has no enquiry database, analytics or persistent browser storage.

## Verification

```sh
npm ci
npm run test:enquiry  # Uses mocked SMTP: no email is sent.
npm run typecheck
npm run build
npm run start -- --hostname 127.0.0.1 --port 3004
# In a second terminal:
npm run test:site     # Browser tests stub the form POST: no email is sent.
```

When credentials are installed, perform one clearly identified test enquiry from the deployed website and verify receipt plus Reply-To in the inbox. Then check that Brevo records successful delivery, and inspect an intentional failure in a non-production environment to confirm it does not show a sent confirmation.
