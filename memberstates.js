import { db } from "./firebase.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const select = document.querySelector("#memberStateSelect");

async function loadStates() {
  select.innerHTML = `<option value="">Loading member states...</option>`;
  select.disabled = true;

  try {
    const snapshot = await getDocs(collection(db, "micronations"));

    select.innerHTML = `<option value="">Select Member State</option>`;

    snapshot.forEach((docSnap) => {
      const option = document.createElement("option");
      option.value = docSnap.id;
      option.textContent = docSnap.id;
      select.appendChild(option);
    });

    select.disabled = false;

  } catch (error) {
    console.error(error);
    select.innerHTML = `<option value="">Unable to load member states</option>`;
  }
}

select.addEventListener("change", () => {
  const state = select.value;

  if (state) {
    window.location.href = `/member?state=${encodeURIComponent(state)}`;
  }
});

loadStates();