```markdown
# Courtly ⚽

Courtly is a mobile application built with **Expo, React Native, and TypeScript** for managing and discovering futsal court activities.

The project leverages modern React Native and Expo technologies to deliver a smooth mobile experience, including secure authentication storage, optimized image rendering, haptic feedback, gradient-based UI, and controlled application initialization.

---

## 🚀 Tech Stack

- **React Native** `0.86.3`
- **Expo SDK** `57`
- **Expo Router** - File-based navigation
- **TypeScript** - Static typing
- **React Hook Form** - Form management
- **Zod** - Form validation
- **TanStack React Query** - Server state management
- **Axios** - HTTP client
- **Zustand** - Client state management
- **React Native Reanimated** - Smooth animations
- **Reactotron** - Development & debugging

---

## 📦 Requirements

### Node.js

Check your Node.js version:

```bash
node --version

```

> **Note:** Ensure your Node.js version is compatible with **Expo SDK 57**.

### Package Manager

This project uses **Yarn**. Check your Yarn version:

```bash
yarn --version

```

---

## 🛠️ Installation

1. **Clone the repository and install dependencies:**
```bash
git clone <repository-url>
cd courtly
yarn install

```


2. **Configure Environment Variables:**
Create a `.env` file in the project root:
```env
EXPO_PUBLIC_API_BASE_URL=<your-api-url>

```


> ⚠️ **Security Warning:** Do not store private API keys, passwords, database credentials, or other secrets in `EXPO_PUBLIC_*` variables as they are exposed to the client bundle.



---

## ▶️ Running the Application

### Start Expo Development Server

```bash
yarn start

```

### Run on Platforms

```bash
# Android
yarn android

# iOS
yarn ios

# Web
yarn web

```

> **Note:** Running native Android or iOS builds requires appropriate setup for Android Studio/SDK or Xcode.

---

## 📱 Expo SDK Modules

Courtly integrates **5 core Expo SDK modules** to enhance security, performance, user experience, and app initialization:

| Expo Module | Purpose | Why We Use It |
| --- | --- | --- |
| `expo-secure-store` | Secure storage | Stores authentication `token` and `user` data securely |
| `expo-image` | Image rendering | Provides optimized image loading, caching, and layout management |
| `expo-haptics` | Haptic feedback | Provides tactile feedback for user interactions |
| `expo-linear-gradient` | Gradient UI | Used for shimmer skeleton loaders and rich background visuals |
| `expo-splash-screen` | Splash screen control | Keeps the splash screen visible while app resources initialize |

---

### Module Details

#### 1. `expo-secure-store`

**Purpose:** Securely persist authentication data on the device.

Courtly uses `expo-secure-store` to store the user's **`token`** and **`user`** information. **Zustand** manages the authentication state, while **`isHydrated`** indicates whether the persisted authentication data has been restored when the application starts.

```tsx
import * as SecureStore from 'expo-secure-store';

// Save authentication data
await SecureStore.setItemAsync('token', token);
await SecureStore.setItemAsync('user', JSON.stringify(user));

// Restore authentication data
const token = await SecureStore.getItemAsync('token');
const userData = await SecureStore.getItemAsync('user');
const user = userData ? JSON.parse(userData) : null;

```

| Key / State | Purpose |
| --- | --- |
| `token` | Authentication token used for API authorization |
| `user` | Profile information of the authenticated user |
| `isHydrated` | Zustand state indicating persisted auth data has been restored |

#### 2. `expo-image`

**Purpose:** Efficient image rendering and caching.

```tsx
import { Image } from 'expo-image';

<Image 100 100, contentFit="cover" height: imageUrl source="{{" style="{{" uri: width: }}/>

```

#### 3. `expo-haptics`

**Purpose:** Provide tactile feedback during user interactions.

```tsx
import * as Haptics from 'expo-haptics';

await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

```

#### 4. `expo-linear-gradient`

**Purpose:** Support shimmer skeleton loading effects and vibrant gradients.

```tsx
import { LinearGradient } from 'expo-linear-gradient';

<LinearGradient '#e5e7eb', '#f3f4f6']} 0 0, 1 1, colors="{['#f3f4f6'," end="{{" flex: start="{{" style="{{" x: y: }}/>

```

#### 5. `expo-splash-screen`

**Purpose:** Control the application splash screen during initialization.

```tsx
import * as SplashScreen from 'expo-splash-screen';

// Prevent splash screen from auto-hiding
await SplashScreen.preventAutoHideAsync();

// Hide splash screen after initialization
await SplashScreen.hideAsync();

```

---

## 🧭 Navigation & Directory Structure

Courtly uses **Expo Router** for file-based routing.

```text
app/
├── _layout.tsx
├── index.tsx
├── (auth)/
│   ├── login.tsx
│   └── register.tsx
└── (tabs)/
    ├── _layout.tsx
    ├── home.tsx
    ├── booking.tsx
    └── profile.tsx

```

---

## 🗂️ Project Architecture

```text
courtly/
├── app/                  # Expo Router screens & routes
├── components/           # Reusable UI components
├── api/                  # API client & React Query hooks
├── store/                # Zustand client state stores
├── hooks/                # Custom React hooks
├── utils/                # Helper functions & utilities
├── constants/            # Application constants & theme
├── assets/               # Local images, fonts, & media
├── scripts/              # Project maintenance scripts
├── app.json
├── package.json
└── tsconfig.json

```

---

## 🔐 Authentication Flow

```text
       User Login
           │
           ▼
    API Authentication
           │
           ▼
Receive Token & User Data
           │
           ▼
 Save to SecureStore
           │
           ▼
Update Zustand Auth State
           │
           ▼
  Set isHydrated = true
           │
           ▼
  Navigate to App Tabs

```

When the application starts, stored credentials are hydrated into Zustand state before deciding whether to show the Auth flow or the main App flow.

---

## 🧪 Code Quality & Debugging

* **Linting:** Run `yarn lint` to check for style and code issues.
* **Debugging:** Integrated with **Reactotron** (`reactotron-react-native`) for network, state, and runtime inspection during development.

---

## 📋 Available Scripts

| Command | Description |
| --- | --- |
| `yarn start` | Start Expo development server |
| `yarn android` | Run application on Android emulator/device |
| `yarn ios` | Run application on iOS simulator/device |
| `yarn web` | Run application in browser |
| `yarn lint` | Run ESLint check |
| `yarn reset-project` | Reset project back to blank Expo starter state |

---

## 📚 Resources & Documentation

* [Expo Documentation](https://docs.expo.dev/)
* [Expo SDK 57 Reference](https://docs.expo.dev/versions/latest/)
* [Expo Router Guide](https://docs.expo.dev/router/introduction/)
* [TanStack React Query Docs](https://tanstack.com/query/latest)
* [Zustand Documentation](https://zustand-demo.pmnd.rs/)

```
