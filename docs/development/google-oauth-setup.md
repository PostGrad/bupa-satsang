# Google sign-in setup for BUPA-Satsang

Status: preparation only, 2026-09-06. No Google OAuth client or production domain has been supplied. Local identity tests and real Google sign-in acceptance must be reported separately.

## Google Cloud configuration

1. Select a Google Cloud project owned by the community’s designated maintainer. Configure the OAuth consent application with BUPA-Satsang branding and a monitored support contact.
2. Create an OAuth client of type **Web application** for Keycloak’s Google broker. Copy the exact redirect URI displayed by the Google identity-provider page in the intended Keycloak realm into Google’s authorized redirect URIs. The broker handles Google’s callback for both app platforms.
3. Keep the client secret server-side. Use separate development and production configuration. Google requires exact redirect matching, including scheme, host, port and path. [Google web-server OAuth setup](https://developers.google.com/identity/protocols/oauth2/web-server)

## Keycloak configuration

Add Google under the application realm’s identity providers and enter its client ID and secret. Use the broker’s displayed redirect URI as the source of truth. The realm name, hostname and provider alias affect this address. [Keycloak Google broker](https://www.keycloak.org/docs/latest/server_admin/#_google)

The agreed app requests identity only: `openid`, `email`, `profile`. No Gmail mailbox, Drive or Sheets access is needed. Configure separate Keycloak clients for the Android public PKCE flow and the confidential backend web flow. Never embed either server secret in an Expo public environment variable or a client bundle. The implementation’s identity runbook will supply the exact local client IDs and application callbacks.

## Acceptance to complete after configuration

Use web and an installed Android build on the volunteer’s physical device. Verify successful login, cancellation, restored sessions and logout. A new identity must have no kitchen access before administrator approval; existing event roles must remain scoped correctly. Recover the Google account through Google, then verify that the same identity retains its app access. Any different Google identity requires explicit administration; matching email text must not merge accounts.

No emulator image is needed. Record physical-device and real-provider results when they are actually tested.
