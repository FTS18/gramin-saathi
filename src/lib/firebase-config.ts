import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";
import {
  getVertexAI,
  getGenerativeModel,
  HarmBlockThreshold,
  HarmCategory,
} from "@firebase/vertexai";

// Suppress known harmless Firebase VertexAI registration warnings
const originalWarn = console.warn;
console.warn = (...args: any[]) => {
  const message = args[0]?.toString() || "";
  if (
    message.includes("@firebase/vertexai") &&
    message.includes("illegal characters")
  ) {
    return;
  }
  originalWarn.apply(console, args);
};

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const analytics =
  typeof window !== "undefined" ? getAnalytics(app) : null;
export const auth = getAuth(app);

// Initialize Firestore with modern persistent cache
export const db =
  typeof window !== "undefined"
    ? initializeFirestore(app, {
        localCache: persistentLocalCache({
          tabManager: persistentMultipleTabManager(),
        }),
      })
    : getFirestore(app);

export const vertexAI = getVertexAI(app, { location: "us-central1" });
export const translationModel = getGenerativeModel(vertexAI, {
  model: "gemini-2.5-flash",
  generationConfig: {
    temperature: 0,
    topK: 1,
    candidateCount: 1,
    maxOutputTokens: 1024,
  },
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ],
});

export default app;
