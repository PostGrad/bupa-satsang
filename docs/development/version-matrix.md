# Foundation version matrix

Resolved on 2026-09-06. Every application and tool dependency is pinned exactly in its package manifest and `pnpm-lock.yaml`.

## Runtime and workspace

| Component | Pin | Compatibility basis |
| --- | --- | --- |
| Node.js | 24.18.0 | Installed LTS runtime. Node 24 remains supported through April 2028. |
| pnpm | 11.17.0 | Pinned with `packageManager`; used to create the lockfile. |
| Nx | 23.2.0 | Current maintained Nx major; Nx 23 officially supports Node 24. |
| TypeScript | 6.0.3 | Matches the current Expo 57 template line. |
| Node types | 24.13.3 | Latest published Node 24 type line when resolved; kept on the runtime major. |
| NestJS | 12.0.1 | Current maintained release; its package requires Node 20 or newer. |
| Vitest | 5.0.0 | Workspace unit and API integration runner. |
| Playwright | 1.63.0 | Responsive-web acceptance runner. |

## Expo client

| Component | Pin |
| --- | --- |
| Expo SDK | 57.0.20 |
| React / React DOM | 19.2.3 |
| React Native | 0.86.3 |
| React Native Web | 0.21.2 |
| Expo Router | 57.0.19 |
| Expo Constants | 57.0.17 |
| Expo Linking | 57.0.9 |
| Expo Status Bar | 57.0.1 |
| Expo System UI | 57.0.3 |
| React Native Safe Area Context | 5.7.0 |
| React Native Screens | 4.26.0 |
| React Native Reanimated / Worklets | 4.5.1 / 0.10.1 |
| React Native Async Storage | 2.2.0 |
| React types | 19.2.4 |

Expo SDKs target one React Native release rather than arbitrary independent versions. The pins above were checked against Expo 57's installed native-module map and the online compatibility service. `expo install --check` and `expo-doctor` are required checks after dependency changes. See the [Expo SDK policy](https://docs.expo.dev/versions/latest/), [Expo upgrade workflow](https://docs.expo.dev/workflow/upgrading-expo-sdk-walkthrough/), [Nx Node compatibility matrix](https://nx.dev/docs/technologies/node/introduction), [Nx release policy](https://nx.dev/docs/reference/releases), [pnpm installation guidance](https://pnpm.io/installation), and [Node release schedule](https://nodejs.org/en/about/previous-releases).

## Android build environment

Compilation was stopped by user request on2026-09-06. The following commands are reference instructions only, requiring a separate instruction before execution. No successful APK build or physical-device acceptance is claimed.

The configured local toolchain uses Android Studio JBR 21.0.10, Gradle 9.3.1, Android build tools/compile/target SDK 36, minimum SDK 24, Kotlin 2.1.20 and NDK 27.1.12297006. The generated native directory is ignored and recreated through Expo Prebuild.

```sh
export JAVA_HOME='/Applications/Android Studio.app/Contents/jbr/Contents/Home'
export ANDROID_HOME='/Users/postgrad/Library/Android/sdk'
export ANDROID_SDK_ROOT="$ANDROID_HOME"
pnpm exec nx run client:android-build
```

`client:android-build` runs Expo Prebuild followed by Gradle `assembleRelease`; it produces an APK without querying for or starting a device. The generated artifact is `apps/client/android/app/build/outputs/apk/release/app-release.apk`.

Physical-device acceptance remains a user-run check. With Android USB debugging enabled and a device visible in `adb devices`, install and launch the generated APK:

```sh
"$ANDROID_HOME/platform-tools/adb" install -r apps/client/android/app/build/outputs/apk/release/app-release.apk
"$ANDROID_HOME/platform-tools/adb" shell am start -n org.bupasatsang.kitchen/.MainActivity
```

Confirm the English default on a fresh application install, change to Gujarati, force-stop and reopen the app, and confirm the Gujarati choice persists. No emulator image is needed or permitted for this project.

## Reproducible checks

```sh
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test:unit
pnpm test:api
pnpm exec playwright install chromium
pnpm test:web
pnpm --dir apps/client exec expo install --check
pnpm --dir apps/client exec expo-doctor
pnpm exec nx run client:web-build
pnpm exec nx run client:android-build
```

Start the API with `pnpm start:api`, then request `http://127.0.0.1:3000/health/live`; a healthy scaffold returns HTTP 200 with `{"status":"ok"}`.
