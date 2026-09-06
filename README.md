# Courtly ⚽

Courtly is a mobile application built with **Expo, React Native, and TypeScript** for managing and discovering futsal court activities.

The project uses modern React Native and Expo technologies to provide a smooth mobile experience, including secure authentication storage, optimized image rendering, haptic feedback, gradient-based UI, and controlled application initialization.

## 🚀 Tech Stack

- **React Native** `0.86.3`
- **Expo SDK** `57`
- **Expo Router** - File-based navigation
- **TypeScript**
- **React Hook Form** - Form management
- **Zod** - Form validation
- **TanStack React Query** - Server state management
- **Axios** - HTTP client
- **Zustand** - Client state management
- **React Native Reanimated** - Animations
- **Reactotron** - Development and debugging

---

## 📦 Requirements

### Node.js

Check your Node.js version:

```bash
node --version
```

The project requires a Node.js version compatible with **Expo SDK 57**.

### Package Manager

This project uses **Yarn**.

Check your Yarn version:

```bash
yarn --version
```

Install dependencies:

```bash
yarn install
```

---

## 🛠️ Installation

Clone the repository and install the dependencies:

```bash
git clone <repository-url>
cd courtly
yarn install
```

Create a `.env` file in the project root:

```env
EXPO_PUBLIC_API_BASE_URL=<your-api-url>
```

> Do not store private API keys, passwords, database credentials, or other secrets in `EXPO_PUBLIC_*` variables because these values can be exposed to the client application.

---

## ▶️ Running the Application

### Start Expo Development Server

```bash
yarn start
```

### Android

```bash
yarn android
```

### iOS

```bash
yarn ios
```

### Web

```bash
yarn web
```

> **Note:** Running the native Android/iOS application requires the corresponding development environment, such as Android Studio/SDK or Xcode.

---

# 📱 Expo SDK Modules

Courtly integrates **5 Expo SDK modules** beyond core React Native to improve security, performance, user experience, and application initialization.

| Expo Module            | Purpose               | Why We Use It                                             |
| ---------------------- | --------------------- | --------------------------------------------------------- |
| `expo-secure-store`    | Secure storage        | Stores authentication `token` and `user` data securely    |
| `expo-image`           | Image rendering       | Provides optimized image loading and caching              |
| `expo-haptics`         | Haptic feedback       | Provides tactile feedback for user interactions           |
| `expo-linear-gradient` | Gradient UI           | Creates visually rich backgrounds and UI elements         |
| `expo-splash-screen`   | Splash screen control | Keeps the splash screen visible while the app initializes |

### 1. `expo-secure-store`

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

| Key / State  | Purpose                                                                       |
| ------------ | ----------------------------------------------------------------------------- |
| `token`      | Authentication token used for API authorization                               |
| `user`       | Information about the authenticated user                                      |
| `isHydrated` | Zustand state indicating that persisted authentication data has been restored |

**Why:** `expo-secure-store` provides platform-specific secure storage on Android and iOS, while Zustand manages the authentication state and hydration process.

### 2. `expo-image`

**Purpose:** Efficient image rendering and caching.

```tsx
import { Image } from 'expo-image';

<Image source={{ uri: imageUrl }} style={{ width: 100, height: 100 }} contentFit="cover" />;
```

**Why:** Courtly uses images such as user avatars and other visual content. `expo-image` provides optimized image loading and caching.

### 3. `expo-haptics`

**Purpose:** Provide tactile feedback during user interactions.

```tsx
import * as Haptics from 'expo-haptics';

await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
```

**Why:** Haptic feedback makes interactions feel more responsive, especially for buttons, selections, and important actions.

### `expo-linear-gradient`

**Purpose:** Support shimmer skeleton loading effects.

Courtly uses `expo-linear-gradient` as part of the **shimmer skeleton UI** displayed while data is loading.

**Why:**

The gradient is used to create the moving highlight effect in skeleton placeholders, providing visual feedback that content is still loading and improving the overall user experience.

**Why:** Gradients are used to improve the visual hierarchy and appearance of the application's UI.

### 5. `expo-splash-screen`

**Purpose:** Control the application splash screen during initialization.

```tsx
import * as SplashScreen from 'expo-splash-screen';

await SplashScreen.preventAutoHideAsync();

// Hide after application initialization
await SplashScreen.hideAsync();
```

**Why:** Prevents users from seeing an incomplete UI while authentication state and other initial resources are being loaded.

---

## 🧭 Navigation

Courtly uses **Expo Router** with file-based routing.

The general structure follows:

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

Routes are automatically generated based on the files inside the `app` directory.

---

## 🗂️ Project Architecture

The project separates application responsibilities into different layers:

```text
courtly/
├── app/                 # Expo Router screens/routes
├── components/          # Reusable UI components
├── api/                 # API clients and React Query configuration
├── store/               # Zustand stores
├── hooks/               # Custom React hooks
├── utils/               # Utility/helper functions
├── constants/           # Application constants
├── assets/              # Images, fonts, and other assets
├── scripts/              # Project scripts
├── app.json
├── package.json
└── tsconfig.json
```

This structure helps keep UI, state management, API communication, and reusable logic separated.

---

## 🔐 Authentication

Authentication-related data is handled using:

- `expo-secure-store` for secure `token` and `user` storage
- `axios` for API communication
- `zustand` for client-side authentication state
- `isHydrated` to track authentication state restoration
- `expo-router` for navigation between authenticated and unauthenticated routes

### Authentication Flow

```text
User Login
    ↓
API Authentication
    ↓
Receive Token & User Data
    ↓
Store Token & User in SecureStore
    ↓
Update Zustand Auth State
    ↓
Set isHydrated = true
    ↓
Navigate to Application
```

When the application starts, the stored authentication data is restored before the application determines the user's authentication state.

---

## 🌐 API Configuration

The API base URL is configured through an environment variable:

```env
EXPO_PUBLIC_API_BASE_URL=<your-api-url>
```

It can be accessed from the Expo application using:

```tsx
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
```

> Do not put private API keys, passwords, database credentials, or other secrets in `EXPO_PUBLIC_*` variables because these values can be exposed to the client application.

---

## 🧪 Code Quality

Run linting with:

```bash
yarn lint
```

The project uses **TypeScript** to provide static type checking and improve code reliability.

---

## 🐞 Development & Debugging

Courtly includes **Reactotron** for development debugging.

Dependency:

```json
"reactotron-react-native": "^5.3.1"
```

Reactotron can be used to inspect application state and debug React Native behavior during development.

---

## 📋 Available Scripts

| Command              | Description                    |
| -------------------- | ------------------------------ |
| `yarn start`         | Start Expo development server  |
| `yarn android`       | Run the application on Android |
| `yarn ios`           | Run the application on iOS     |
| `yarn web`           | Run the application on Web     |
| `yarn lint`          | Run ESLint                     |
| `yarn reset-project` | Reset the Expo starter project |

---

## 📚 Useful Documentation

- [Expo Documentation](https://docs.expo.dev/)
- [Expo SDK 57](https://docs.expo.dev/versions/latest/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [Expo SecureStore](https://docs.expo.dev/versions/latest/sdk/securestore/)
- [Expo Image](https://docs.expo.dev/versions/latest/sdk/image/)
- [Expo Haptics](https://docs.expo.dev/versions/latest/sdk/haptics/)
- [Expo LinearGradient](https://docs.expo.dev/versions/latest/sdk/linear-gradient/)
- [Expo SplashScreen](https://docs.expo.dev/versions/latest/sdk/splash-screen/)

---

## 👋 About Courtly

Courtly is built with a focus on providing a smooth and modern mobile experience for futsal-related activities.

The application combines Expo's native capabilities with modern React Native libraries for:

- Secure authentication
- Efficient data fetching
- Form validation
- Responsive UI
- Native interactions
- Application state management
- Optimized image rendering
