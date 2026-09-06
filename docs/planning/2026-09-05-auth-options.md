# Authentication choice: Keycloak and Supabase Auth

Status: Keycloak selected as the working architecture choice, updated 2026-09-06. The comparison and prices below retain their original 2026-09-05 research date.

2026-09-06 scope update: login/recovery is Gmail-based, interpreted as Sign in with Google and Google account recovery. English-default/Gujarati-switch UI and offline purchase/bill entry are confirmed. Earlier settlement and advance workflows are removed. Keycloak on the proposed Netcup VPS is the working choice following the instruction to proceed with that option; no server has been purchased. The pricing below remains a dated comparison.

Confirmed context: maximum 200 application users. Keycloak was suggested to save cost by sharing the planned application server and PostgreSQL infrastructure; it is not a separate enterprise-identity requirement.

## Cost assessment for 200 users

Pricing checked 2026-09-05: Supabase Free is $0/month with 50,000 monthly active users; Pro starts at $25/month with 100,000 MAU and one Micro project's compute covered by credits. Thus 200 users fit either included auth quota. Free projects pause after one inactive week and lack automatic backups; Pro projects do not pause. Other usage/add-ons can change the bill. [Supabase pricing](https://supabase.com/pricing)

For the earlier email/phone-login alternatives, custom SMTP or SMS-provider costs would apply. The selected Google sign-in direction does not require application password-reset emails or SMS OTP. The original SMTP limits are therefore not a reason to add an email service for volunteer login; any separately needed administrative notifications would be evaluated on their own. [SMTP](https://supabase.com/docs/guides/auth/auth-smtp), [phone login](https://supabase.com/docs/guides/auth/phone-login)

Keycloak can share the planned server and PostgreSQL instance. Recommend its own database and database user on that instance. No second VM is intrinsically required. Its software has no subscription fee; incremental hosting cost depends on spare capacity and any server upgrade. Keycloak's container documentation recommends a 2 GB memory limit for smaller production deployments; this is guidance, not a measured requirement for our 200-user workload. Reserve additional capacity for Node, PostgreSQL and the operating system, then verify under representative login/refresh load. [Keycloak](https://www.keycloak.org/), [container memory guidance](https://www.keycloak.org/server/containers)

Revised recommendation: Keycloak cannot save a subscription fee relative to Supabase Free. It can avoid the paid plan's base subscription if the shared server has sufficient capacity, with maintenance and shared-host failure risk as the trade-off. Supabase Free is the simplest low-cost pilot candidate if pausing/recovery limits are acceptable. Keycloak is reasonable for a low-cash-cost production deployment with an operating owner and demonstrated capacity. The subsequent working decision is Keycloak. Google sign-in is the user-facing login requirement; measured server capacity remains open.

## Proposed Netcup deployment

The user is considering VPS 500 G12: 2 x86 vCores, 4 GB RAM and 128 GB NVMe. These specifications match the provider's page checked 2026-09-05. The page lists €5.91/month for VPS 500 and €10.37/month for VPS 1000 (4 vCores, 8 GB, 256 GB), including the displayed 19% VAT. These are advertised starting prices; country/tax and contract choices affect checkout. VPS CPU cores are not dedicated. [Netcup VPS plans](https://www.netcup.com/en/server/vps)

Assessment: VPS 500 is a reasonable starting candidate for 200 registered volunteers with modest simultaneous activity, including a small Node API, PostgreSQL, static web assets, reverse proxy and one Keycloak instance. This is an engineering estimate, not a benchmark or a promise of 200 simultaneous active sessions. RAM headroom and login bursts are more likely constraints than storing 200 accounts.

Using Keycloak's 2 GB container limit leaves approximately 2 GB for PostgreSQL, Node, the OS, proxy and working headroom. Keep database pools small, bound query/export work, rotate logs and measure actual resident memory and available memory. Do not run builds, an Android emulator, a second full staging stack or heavyweight monitoring on this production machine. Build assets/container images in CI and deploy them. Ordinary cached reads and writes should not require a round-trip to Keycloak on every request; honour the separately defined revocation policy.

One PostgreSQL instance with separate application/Keycloak databases and users is appropriate for this proposal. Use a simple container deployment with persistent volumes and private database networking. Keep encrypted database backups and recovery configuration off this host and test restoring them. Provider copy-on-write snapshots are a useful additional recovery tool, not the sole backup or proof of an application-consistent database backup. One host remains a shared outage boundary for app, identity and data.

The user has confirmed there will be no receipt images or other user file uploads. Remove object storage, attachment handling and media transfer from the deployment. This reduces storage growth, bandwidth and implementation scope; it does not substantially reduce Keycloak's base memory needs. The 4 GB starting assessment still depends on measured RAM/CPU headroom.

Before launch, test the expected event-day mix, a concentrated Google-login/session-refresh burst, queued offline bills syncing together, other expense entries, reports, backup activity and service restarts. Measure latency from volunteers' devices in Anand to the selected datacentre, errors, CPU contention, available RAM and sustained swap. Test 200 concurrent users only if that becomes an actual target. Increase capacity if these checks fail rather than reducing authentication security settings to fit.

Cost recommendation: the 4 GB plan is viable for a strict starting budget subject to these checks. The 8 GB / 4 vCore plan is a more comfortable choice for colocated Keycloak and operational headroom; the advertised difference is €4.46/month under the same displayed tax basis. Additional capacity does not remove the single-host availability trade-off. No server purchase or deployment is authorised by this assessment.

## Decision and operating conditions

Proceed with self-hosted Keycloak and Google sign-in. Its operating owner, demonstrated VPS headroom and recovery arrangements must be established before production deployment. The five volunteer roles alone do not require Keycloak; event/record access stays in the application. See the [architecture specification](../superpowers/specs/2026-09-06-kitchen-architecture.md) and [delivery plan](../superpowers/plans/2026-09-06-kitchen-delivery.md).

The comparison below is self-hosted Keycloak versus managed Supabase Auth. Managed Keycloak and self-hosted Supabase change the operational trade-off. Published pricing has been checked above; no purchase or deployment commitment has been made.

## Trade-offs

| Consideration | Keycloak | Managed Supabase Auth |
| --- | --- | --- |
| Identity capabilities | Dedicated identity server supporting OIDC/SAML, identity brokering, sessions and configurable authentication; useful if future applications need shared sign-in | Authentication service with password, social, passwordless and phone sign-in options; fits a managed application backend |
| Independence | Identity service can remain separate from hosting the application database and API | Can be used alongside our Node API; does not require using Supabase's generated data API for kitchen operations |
| Operations | We own production hosting, TLS/proxy configuration, database durability, upgrades, monitoring and recovery | Service operator maintains the authentication infrastructure; we still own correct configuration, access policies, integration and account recovery design |
| Customisation | More control over authentication flows and administration, with more configuration and potential extension maintenance | Less infrastructure/configuration work, with service limits and provider-dependent behaviour |
| App permissions | Supports roles/groups and authorization capabilities, but event/record-specific rules still need careful design | Also requires event/record-specific application authorization; a valid login is not kitchen access |
| Delivery risk | A separate operational service on the kitchen launch path | Lower authentication operational burden; provider dependency remains |

Feature sources: [Keycloak administration](https://www.keycloak.org/docs/latest/server_admin/), [Keycloak OIDC](https://www.keycloak.org/securing-apps/oidc-layers), [Keycloak production configuration](https://www.keycloak.org/server/configuration-production), [Supabase Auth](https://supabase.com/docs/guides/auth). The delivery/maintenance comparison is our assessment based on who operates each service.

## Selected provider: proposed Keycloak integration

1. One BUPA-Satsang realm in production, with isolated nonproduction configuration. Do not make a realm per event or kitchen module. Add separate application clients when there is a distinct client/security boundary.
2. Android uses a public OIDC client and Authorization Code with PKCE through the system browser, using Expo AuthSession. No client secret in the app; no password grant or embedded credential form. Verify redirect URI handling, state/nonce, token refresh, cancellation, logout and deep links in an Expo development build and signed Android build. [Expo authentication](https://docs.expo.dev/guides/authentication/), [Keycloak grant types](https://www.keycloak.org/securing-apps/oidc-layers)
3. Web uses a separate confidential client through the Node backend, which completes the code flow and maintains the session. The browser receives a secure HttpOnly session cookie with CSRF protection; provider tokens remain server-side. This is the proposed web integration even if the UI is built with Expo web.
4. The API verifies mobile access-token issuer, audience, signature and expiry against discovered signing keys; web requests use the validated backend session. Configure the API audience explicitly. Do not use ID tokens as API access tokens.
5. Link the external identity to an internal user using unique `(issuer, subject)` values. Keep a stable internal user ID for expenses, audit entries and offline mutation ownership. Email is a contact attribute, not the primary identity key.
6. Keycloak brokers Google login and manages its own sessions. Google owns volunteers' Google credentials and account recovery; no local volunteer password flow is proposed. BUPA-Satsang owns community/event/module membership and resource/state permissions. Request identity scopes only, not Gmail mailbox access. Do not duplicate event assignments into competing sources of truth.
7. Designated community administrators manage volunteer access and event roles inside BUPA-Satsang. Only identity operators use the Keycloak admin console. Administrative API credentials stay on the server, with narrowly scoped access where integration is necessary.
8. The application database and Keycloak database have separate ownership and credentials. They can share PostgreSQL infrastructure if its availability is acceptable, but the application must not read or modify Keycloak's internal tables.

## Authorization and revocation

For every protected request, including replayed offline writes, check active user/membership and current event/module permissions. A purchaser-only user cannot alter another purchaser's bill; changing identity brokers does not implement that rule. Authentication expiry retains the local queue for the same user's reauthentication; a new account cannot inherit or submit it silently.

Revoking an application assignment must affect the next protected server request. Disabling a Keycloak session/user is a different operation: offline JWT signature verification alone does not guarantee immediate discovery of that change. Use bounded token/session lifetimes and define how identity disable/logout reaches the application, with local user disable for immediate application access removal. Verify the chosen introspection/logout integration before promising immediate provider-wide revocation. [Keycloak token and logout endpoints](https://www.keycloak.org/securing-apps/oidc-layers)

## Operational acceptance

Add a named owner, hosting budget, tested upgrades, database backup/restore, signing-key handling, TLS/reverse-proxy configuration, restricted administrative access, monitored readiness and recovery procedures to the foundation milestone. An identity-service outage can block new sign-ins and token refresh; define acceptable downtime rather than assuming a container alone meets production availability. A single-instance deployment has an availability trade-off. [Keycloak production configuration](https://www.keycloak.org/server/configuration-production), [scaling guidance](https://www.keycloak.org/getting-started/getting-started-scaling-and-tuning)

Google-based login is now confirmed as the working interpretation of Gmail sign-in. Implement a single Google sign-in experience with the selected broker; use established libraries and verify redirects and session restoration on Android and web. Google account recovery restores the same identity; switching accounts requires separately authorised membership linking. [Google identity documentation](https://developers.google.com/identity/openid-connect/openid-connect)

Remaining operational inputs: a named maintainer/operator, deployment domains, Google client configuration, backup destination and measured host capacity. The identity-provider choice is no longer an open question.
