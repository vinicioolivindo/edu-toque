import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";

import { Auth, getAuth } from "firebase/auth";

import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDss8q7A8G_ljMZUI_T1PcDRPJQ9gvfZmw",
  authDomain: "edu-toque.firebaseapp.com",
  projectId: "edu-toque",
  storageBucket: "edu-toque.firebasestorage.app",
  messagingSenderId: "236092594136",
  appId: "1:236092594136:web:55cbedaa21711d6ba0c4ad",
  measurementId: "G-NCSETFGECE"

};

const app = initializeApp(firebaseConfig);

let auth: Auth;

try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
} catch (error) {
  auth = getAuth(app);
}

const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
