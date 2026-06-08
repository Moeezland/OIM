import { auth, db } from "./firebase.js";

import {
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

const loginForm = document.querySelector("#loginForm");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.querySelector("#loginEmail").value.trim();
  const password = document.querySelector("#loginPassword").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);

    alert("Login successful");
    window.location.href = "dashboard.html";

  } catch (error) {
    alert("Login failed: " + error.message);
  }
});