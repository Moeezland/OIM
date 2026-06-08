import { auth, db } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  deleteUser
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import {
  doc,
  getDoc,
  runTransaction,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const registerForm = document.querySelector("#registerForm");
const submitBtn = registerForm.querySelector("button[type='submit']");

let registrationInProgress = false;

function lockForm() {
  registrationInProgress = true;
  submitBtn.disabled = true;
  submitBtn.textContent = "CREATING ACCOUNT...";
}

function unlockForm() {
  registrationInProgress = false;
  submitBtn.disabled = false;
  submitBtn.textContent = "CREATE ACCOUNT";
}

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (registrationInProgress) return;

  const email = document.querySelector("#registerEmail").value.trim().toLowerCase();
  const password = document.querySelector("#registerPassword").value;
  const registryNumber = document.querySelector("#registryNumber").value.trim();

  if (!/^\d{10}$/.test(registryNumber)) {
    alert("OIM registry number must be exactly 10 digits.");
    return;
  }

  lockForm();

  const registryRef = doc(db, "oimRegistry", registryNumber);

  try {
    const registrySnap = await getDoc(registryRef);

    if (!registrySnap.exists()) {
      alert("This OIM registry number does not exist.");
      unlockForm();
      return;
    }

    if (registrySnap.data().used === true) {
      alert("This OIM registry number is already used.");
      unlockForm();
      return;
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    try {
      await runTransaction(db, async (transaction) => {
        const freshRegistrySnap = await transaction.get(registryRef);

        if (!freshRegistrySnap.exists()) {
          throw new Error("This OIM registry number does not exist.");
        }

        if (freshRegistrySnap.data().used === true) {
          throw new Error("This OIM registry number is already used.");
        }

        transaction.update(registryRef, {
          used: true,
          assignedTo: user.uid,
          assignedEmail: email,
          usedAt: serverTimestamp()
        });

        transaction.set(doc(db, "users", user.uid), {
          email: email,
          registryNumber: registryNumber,
          role: "member",
          createdAt: serverTimestamp()
        });
      });

      alert("Account created successfully.");
      window.location.href = "dashboard.html";

    } catch (claimError) {
      try {
        await deleteUser(user);
      } catch (deleteError) {
        console.error(deleteError);
      }

      alert("Account was not created because the registry number could not be claimed. Please try again.");
      unlockForm();
    }

  } catch (error) {
    alert("Account creation failed: " + error.message);
    unlockForm();
  }
});
