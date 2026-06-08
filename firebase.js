import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCfSYT2lSL_omL-BqhqwAWJn5nrWL81_UE",
  authDomain: "org-of-islamic-micronations.firebaseapp.com",
  projectId: "org-of-islamic-micronations",
  storageBucket: "org-of-islamic-micronations.firebasestorage.app",
  messagingSenderId: "829777100801",
  appId: "1:829777100801:web:1ef368e3c5f522811f4000"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);