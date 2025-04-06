// leaderboard.js

const leaderboardData = [
    { username: "Alice", score: 1500 },
    { username: "Bob", score: 1350 },
    { username: "Charlie", score: 1200 },
    { username: "Dave", score: 1100 },
    { username: "Eve", score: 980 },
  ];
  
  function loadLeaderboard() {
    const tbody = document.querySelector("#leaderboard tbody");
    leaderboardData.sort((a, b) => b.score - a.score);
  
    leaderboardData.forEach((player, index) => {
      const row = document.createElement("tr");
  
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${player.username}</td>
        <td>${player.score}</td>
      `;
  
      tbody.appendChild(row);
    });
  }
  
  window.onload = loadLeaderboard;
  