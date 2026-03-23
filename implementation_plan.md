# FitSync Project: Current State & Phase 5 Roadmap

## 🎯 Current State of the Prototype
FitSync is currently functioning as a **highly polished, fully-integrated local prototype**. It features a modern React UI that communicates with a live Python AI backend.

### Project Phases Completed
*   **Phase 1 (Foundations):** Vite + React setup, Tailwind CSS styling, Shadcn UI aesthetics, Sidebar/Mobile navigation, and 3-second animated Splash Screen.
*   **Phase 2 (Core Features):** 5-step Onboarding engine, Calorie/Macro tracking Dashboard, food diary logging, exercise preset logging, and weight tracking with interactive charts.
*   **Phase 3 (Hydration & Polish):** Introduced the modular Hydration Tracker with its own storage context, a dashboard widget, and a dedicated tracking page. Implemented fully responsive grid layouts for mobile.
*   **Phase 4 (Backend API Integration):** Replaced all frontend "mock" math and shuffles with real Python AI logic via an Axios API layer.
    *   `UserContext` fetches real TDEE maths from the Flask `/calculate-tdee` endpoint.
    *   [MealPlanner](file:///c:/Users/user/project%20fit/frontend/src/pages/MealPlanner.jsx#18-192) fetches a 7-day distinct Indian meal plan from `/generate-meal-plan`.
    *   [SnapCook](file:///c:/Users/user/project%20fit/frontend/src/pages/SnapCook.jsx#17-301) posts actual image `FormData` to the backend. (Includes a graceful fallback UI error interceptor since we don't currently have a Gemini API key connected to the backend).

### How It Works Right Now
1.  **Frontend State:** All user data (Profile, targets, daily logs, hydration history, weight history) is currently persisted using **`localStorage`**.
2.  **Backend Processing:** The heavy lifting (TDEE formulas, creating 7-day meal schedules respecting Indian cuisine and diabetic/PCOS health conditions) is handled by the **Python Flask server**.
3.  **The Gap:** If you clear your browser cache, open it on your phone, or open an incognito window, your FitSync data is gone. 

---

## 🚀 The Next Step: Phase 5 (User Authentication & Cloud Sync)

To make FitSync a real web app, we need to replace `localStorage` with a real database and let users create accounts.

### Goal
Integrate Google Firebase for Authentication (Login/Signup) and Cloud Firestore (NoSQL Database) to securely sync user data across devices.

### Proposed Architecture Changes
1.  **Firebase Setup:** 
    *   Initialize a Firebase project and add the `firebase/app`, `firebase/auth`, and `firebase/firestore` SDKs to the frontend.
    *   Create [src/lib/firebase.js](file:///c:/Users/user/project%20fit/frontend/src/lib/firebase.js) to initialize the connection.
2.  **Authentication UI:**
    *   Create a clean, modern `/login` and `/signup` page.
    *   Update [App.jsx](file:///c:/Users/user/project%20fit/frontend/src/App.jsx) to intercept the user. If they aren't logged in, force them to the login screen.
3.  **Refactoring Contexts:**
    *   Update [UserContext.jsx](file:///c:/Users/user/project%20fit/frontend/src/lib/UserContext.jsx) and [HydrationContext.jsx](file:///c:/Users/user/project%20fit/frontend/src/lib/HydrationContext.jsx). Instead of running `localStorage.getItem()` and `setItem()`, they will now `getDoc()` and `setDoc()` to Firestore tied to the user's secure UID.
    *   Data structure in Firestore: `users/{uid}/profile`, `users/{uid}/dailyLogs/{date}`, `users/{uid}/hydration/{date}`.
