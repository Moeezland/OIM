import { db } from "./firebase.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

console.log("URL:", window.location.href);

const params = new URLSearchParams(window.location.search);
const stateId = params.get("state");

console.log("STATE ID:", stateId);

async function loadState() {
  const stateName = document.querySelector("#stateName");
  const fullName = document.querySelector("#fullName");
  const country = document.querySelector("#country");
  const status = document.querySelector("#status");
  const joinDate = document.querySelector("#joinDate");
  const wikiBtn = document.querySelector("#wikiBtn");
  const image = document.querySelector("#stateImage");

  if (!stateId) {
    document.title = "OIM | Member State";
    stateName.textContent = "Member State Not Found";
    console.warn("Use: /member?state=Moeezland");
    return;
  }

  try {
    const docRef = doc(db, "micronations", stateId);
    const snap = await getDoc(docRef);

    console.log("Firestore document exists:", snap.exists());

    if (!snap.exists()) {
      document.title = "OIM | Not Found";
      stateName.textContent = "Member State Not Found";
      return;
    }

    const data = snap.data();

    console.log("Firestore data:", data);

    document.title = `OIM | ${snap.id}`;

    stateName.textContent = snap.id;
    fullName.textContent = data.fullName || "N/A";
    country.textContent = data.country || "N/A";
    status.textContent = data.status || "N/A";

    if (data.joinDate && typeof data.joinDate.toDate === "function") {
      joinDate.textContent = data.joinDate.toDate().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric"
      });
    } else {
      joinDate.textContent = "N/A";
    }

    wikiBtn.href = data.microWikiUrl || "#";

    if (data.image) {
      image.src = `images/${data.image}`;
      image.alt = `${snap.id} Flag`;
    } else {
      image.style.display = "none";
    }

  } catch (error) {
    console.error("Error loading member state:", error);
    document.title = "OIM | Error";
    stateName.textContent = "An error occurred while loading this page.";
  }
}

loadState();