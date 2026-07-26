// Firebase Auth and Firestore Client Container for Project vyapaarsathi-43073

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

export const firebaseConfig: FirebaseConfig = {
  apiKey: "AIzaSyBIgxBdmWH2H0v05CApoGNuvoW9vwHaM1c",
  authDomain: "vyapaarsathi-43073.firebaseapp.com",
  projectId: "vyapaarsathi-43073",
  storageBucket: "vyapaarsathi-43073.firebasestorage.app",
  messagingSenderId: "590535619738",
  appId: "1:590535619738:web:b82a4d2d4c3ef59b861b23",
  measurementId: "G-5ZQC2J08E7"
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
