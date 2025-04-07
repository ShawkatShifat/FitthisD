js

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
  
  // Firebase initialization
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  
  // Replace this with the current user ID logic if needed
  const userId = "123";
  
  // Get XP data and show total squats
  db.collection("users").doc(userId).get().then((doc) => {
    if (!doc.exists) {
      console.error("No user data found.");
      return;
    }
  
    const data = doc.data();
  
    // ✅ Show total squats under "Legs done"
    const squatCountElement = document.getElementById("squat-count");
    if (squatCountElement) {
      squatCountElement.textContent = `Legs done: ${data.totalSquats || 0}`;
    }
  
    // ✅ Prepare XP data for radar chart
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
  
  // === Render radar chart ===
  function renderRadarChart(xpData) {
    const ctx = document.getElementById("skillsChart").getContext("2d");
  
    const labels = Object.keys(xpData);
    const values = Object.values(xpData);
  
    const pointColors = [
      "rgba(231, 76, 60, 1)",   // Arms - red
      "rgba(52, 152, 219, 1)",  // Back - blue
      "rgba(46, 204, 113, 1)",  // Chest - green
      "rgba(155, 89, 182, 1)",  // Shoulders - purple
      "rgba(241, 196, 15, 1)"   // Squats - yellow
    ];
  
    const hoverColors = [
      "rgba(231, 76, 60, 0.7)",
      "rgba(52, 152, 219, 0.7)",
      "rgba(46, 204, 113, 0.7)",
      "rgba(155, 89, 182, 0.7)",
      "rgba(241, 196, 15, 0.7)"
    ];
  
    const data = {
      labels: labels,
      datasets: [{
        label: "XP Progress",
        data: values,
        fill: true,
        backgroundColor: "rgba(54, 119, 179, 0.2)",
        borderColor: "rgba(54, 119, 179, 0.8)",
        pointBackgroundColor: pointColors,
        pointBorderColor: "#ffffff",
        pointHoverBackgroundColor: hoverColors,
        pointHoverBorderColor: "#ffffff"
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
            angleLines: { display: true },
            suggestedMax: 500,
            ticks: {
              stepSize: 100
            }
          }
        },
        plugins: {
          legend: {
            display: true,
            position: "top"
          }
        }
      }
    };
  
    new Chart(ctx, config);
  }