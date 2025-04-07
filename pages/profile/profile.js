// === Firebase Setup ===
const firebaseConfig = {
  apiKey: "AIzaSyBIapPGvC5tBizwmdXB7Y5ABg2WL73j3PU",
  authDomain: "gamifiedfitness-6c6cc.firebaseapp.com",
  projectId: "gamifiedfitness-6c6cc",
  storageBucket: "gamifiedfitness-6c6cc.appspot.com",
  messagingSenderId: "507627984423",
  appId: "1:507627984423:web:de3254cdc302a755f7e002",
  measurementId: "G-6SNLFSFF3R"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// === Handle Login State ===
const userId = "nabid"

function handleNavBar() {
  const authLink = document.getElementById("auth-link");
  const navLinks = {
    home: document.getElementById("nav-home"),
    exercises: document.getElementById("nav-exercises"),
    challenges: document.getElementById("nav-challenges"),
    achievements: document.getElementById("nav-achievements"),
    about: document.getElementById("nav-about"),
  };

  if (!authLink) return;

  if (userId) {
    Object.values(navLinks).forEach(link => link.style.display = "list-item");
    authLink.innerHTML = `<a href="#">Sign Out</a>`;
    authLink.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("currentUser");
      alert("You have been logged out.");
      window.location.href = "../../index.html";
    });
  } else {
    Object.entries(navLinks).forEach(([key, link]) => {
      if (key === "home" || key === "about") {
        link.style.display = "list-item";
      } else {
        link.style.display = "none";
      }
    });
    authLink.innerHTML = `<a href="../../pages/signupAndlogin/loginsignup.html">Sign In</a>`;
  }
}

// === Exit if not logged in ===
if (!userId) {
  alert("You must be signed in to view your profile.");
  window.location.href = "../../pages/signupAndlogin/loginsignup.html";
} else {
  // === Fetch and Render User Data ===
  db.collection("users").doc(userId).get().then((doc) => {
    if (!doc.exists) {
      console.error("No user data found.");
      return;
    }

    const data = doc.data();

    document.getElementById("user-username").textContent = data.username || "User";
    document.getElementById("user-email").textContent = `Email: ${data.email || "N/A"}`;
    document.getElementById("user-age").textContent = `Age: ${data.age || "N/A"}`;
    document.getElementById("user-height").textContent = `Height: ${data.height_cm ? data.height_cm + " cm" : "N/A"}`;
    document.getElementById("user-weight").textContent = `Weight: ${data.weight_kg ? data.weight_kg + " kg" : "N/A"}`;
    document.getElementById("user-gender").textContent = `Gender: ${data.gender || "N/A"}`;
    document.getElementById("user-goal").textContent = `Goal: ${data.goal || "N/A"}`;

    document.getElementById("squat-count").textContent = `Legs reps: ${data.totalSquats || 0}`;

    const totalXP =
      (data.armsXP || 0) +
      (data.backXP || 0) +
      (data.chestXP || 0) +
      (data.shoulderXP || 0) +
      (data.squatXP || 0);

    let currentLevel = 1;
    let nextLevelXP = 50;
    let xpThreshold = 0;

    while (totalXP >= nextLevelXP) {
      currentLevel++;
      xpThreshold = nextLevelXP;
      nextLevelXP *= 1.35;
    }

    const progressInLevel = totalXP - xpThreshold;
    const xpNeeded = nextLevelXP - xpThreshold;
    const progressPercent = Math.floor((progressInLevel / xpNeeded) * 100);

    const progressBar = document.querySelector(".progress");
    const levelTitle = document.querySelector(".progress-item h1");
    const progressLabel = document.querySelector(".progress-label");

    if (progressBar) progressBar.value = progressPercent;
    if (levelTitle) levelTitle.textContent = `Level ${currentLevel}`;
    if (progressLabel) progressLabel.textContent = `${progressPercent}%`;

    function showBadgesForLevel(level) {
      if (level >= 5) document.getElementById("badge-1").style.display = "inline-block";
      if (level >= 10) document.getElementById("badge-2").style.display = "inline-block";
      if (level >= 20) document.getElementById("badge-3").style.display = "inline-block";
      if (level >= 30) document.getElementById("badge-4").style.display = "inline-block";
    }

    showBadgesForLevel(currentLevel);

    const xpStats = {
      Arms: data.armsXP || 0,
      Back: data.backXP || 0,
      Chest: data.chestXP || 0,
      Shoulders: data.shoulderXP || 0,
      Squats: data.squatXP || 0
    };

    renderRadarChart(xpStats);
  }).catch((error) => {
    console.error("Error getting user data:", error);
  });
}

// === Radar Chart ===
function renderRadarChart(xpData) {
  const ctx = document.getElementById("skillsChart").getContext("2d");

  const labels = Object.keys(xpData);
  const values = Object.values(xpData);

  const data = {
    labels: labels,
    datasets: [{
      label: "XP Progress",
      data: values,
      fill: true,
      backgroundColor: "rgba(89, 115, 186, 0.23)",
      borderColor: "rgba(46, 95, 219, 0.8)",
      pointBackgroundColor: [
        "rgba(231, 76, 60, 1)",
        "rgba(52, 152, 219, 1)",
        "rgba(46, 204, 113, 1)",
        "rgba(155, 89, 182, 1)",
        "rgba(241, 196, 15, 1)"
      ],
      pointHoverBackgroundColor: [
        "rgba(231, 76, 60, 0.7)",
        "rgba(52, 152, 219, 0.7)",
        "rgba(46, 204, 113, 0.7)",
        "rgba(155, 89, 182, 0.7)",
        "rgba(241, 196, 15, 0.7)"
      ]
    }]
  };
  

  const config = {
    type: 'radar',
    data: data,
    options: {
      responsive: true,
      scales: {
        r: {
          beginAtZero: true,
          suggestedMax: 500,
          ticks: {
            stepSize: 100,
            color: "white" // <-- makes axis tick values white
          },
          angleLines: {
            color: "white" // <-- makes the radial lines white
          },
          grid: {
            color: "white" // <-- makes the circular grid lines white
          },
          pointLabels: {
            color: "white" // <-- makes the category labels white
          }
        }
      },
      plugins: {
        legend: {
          display: true,
          position: "top",
          labels: {
            color: "white" // <-- makes the legend text white
          }
        },
        tooltip: {
          bodyColor: "white",
          titleColor: "white"
        }
      }
    }
  };

  new Chart(ctx, config);
}

// Run nav logic after DOM is ready
document.addEventListener("DOMContentLoaded", handleNavBar);
