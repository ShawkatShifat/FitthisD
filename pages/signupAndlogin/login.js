import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-analytics.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBIapPGvC5tBizwmdXB7Y5ABg2WL73j3PU",
  authDomain: "gamifiedfitness-6c6cc.firebaseapp.com",
  projectId: "gamifiedfitness-6c6cc",
  storageBucket: "gamifiedfitness-6c6cc.firebasestorage.app",
  messagingSenderId: "507627984423",
  appId: "1:507627984423:web:de3254cdc302a755f7e002",
  measurementId: "G-6SNLFSFF3R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
  // === SIGN UP FORM HANDLER ===
  const signupForm = document.querySelector("#sign-up-form");

  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const username = document.querySelector("#signup-username").value.trim();
      const email = document.querySelector("#signup-email").value.trim();
      const password = document.querySelector("#signup-password").value;

      if (!username || !email || !password) {
        alert("Please fill in all fields.");
        return;
      }

      try {
        const userRef = doc(db, "users", username);
        await setDoc(userRef, {
          username,
          email,
          password
        });

        alert("Sign-up successful!");
      } catch (err) {
        console.error("Sign-up error:", err);
        alert("Failed to sign up.");
      }
    });
  } else {
    console.error("Sign-up form not found!");
  }

  // === SIGN IN FORM HANDLER ===
  const signinForm = document.querySelector("#signin-form");

  if (signinForm) {
    signinForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const username = document.querySelector("#signin-username").value.trim();
      const password = document.querySelector("#signin-password").value;

      if (!username || !password) {
        alert("Please enter both username and password.");
        return;
      }

      try {
        const userRef = doc(db, "users", username);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          alert("Username not found.");
          return;
        }

        const userData = userSnap.data();

        if (userData.password === password) {
          alert("Login successful!");
          window.location.href = "../index.html"; // redirect to homepage
        } else {
          alert("Incorrect password.");
        }
      } catch (error) {
        console.error("Error during login:", error);
        alert("Login failed. Please try again.");
      }
    });
  } else {
    console.error("Signin form not found!");
  }

  const sign_up_btn = document.querySelector("#sign-up-btn");
  const sign_in_btn = document.querySelector("#sign-in-btn");
  const container = document.querySelector(".container");


  sign_up_btn.addEventListener('click', () => {
    container.classList.add("sign-up-mode");
  });

  sign_in_btn.addEventListener('click', () => {
    container.classList.remove("sign-up-mode");
  });
});
