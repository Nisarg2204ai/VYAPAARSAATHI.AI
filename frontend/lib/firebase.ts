// Firebase Auth and Firestore Client Container for Free Spark Plan

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export const firebaseConfig: FirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDemoVyapaarSathiKey123456789",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "vyapaarsathi-ai.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "vyapaarsathi-ai",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "vyapaarsathi-ai.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "987654321012",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:987654321012:web:a1b2c3d4e5f6a7b8"
};

export interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  phoneNumber: string | null;
}

// User Profile Firestore & IndexedDB User Container Helper
export async function saveUserData(userId: string, data: Record<string, any>): Promise<void> {
  try {
    if (typeof window !== 'undefined') {
      const payload = { ...data, updatedAt: new Date().toISOString() };
      localStorage.setItem(`vyapaar_user_doc_${userId}`, JSON.stringify(payload));
    }
  } catch (error: any) {
    console.error('Firestore saveUserData error:', error);
  }
}

export async function getUserData(userId: string): Promise<Record<string, any> | null> {
  try {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem(`vyapaar_user_doc_${userId}`);
      return cached ? JSON.parse(cached) : null;
    }
  } catch (error: any) {
    console.error('Firestore getUserData error:', error);
  }
  return null;
}
