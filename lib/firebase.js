// /lib/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL // Realtime Database URL 추가
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// Firestore, Storage, Realtime Database, Auth 인스턴스 가져오기
export const db = getFirestore(app);
export const storage = getStorage(app);
export const database = getDatabase(app);
export const auth = getAuth(app);

// 갤러리 조명 관련 함수들
export const updateLightingLevel = async (level) => {
  const lightingRef = ref(database, 'gallery/lighting');
  await set(lightingRef, level);
};

export const subscribeToLightingLevel = (callback) => {
  const lightingRef = ref(database, 'gallery/lighting');
  return onValue(lightingRef, (snapshot) => {
    const level = snapshot.val() || 5; // 기본값 5
    callback(level);
  });
};

export default app;