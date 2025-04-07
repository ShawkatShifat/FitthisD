const ctx = document.getElementById('skillsChart').getContext('2d');
const skillsChart = new Chart(ctx, {
  type: 'radar',
  data: {
    labels: ['HTML', 'CSS', 'JavaScript', 'Firebase', 'Angular', 'SCSS'],
    datasets: [{
      label: 'Skill Levels',
      data: [80, 70, 65, 50, 40, 60],
      backgroundColor: 'rgba(52, 152, 219, 0.2)',
      borderColor: 'rgba(52, 152, 219, 1)',
      pointBackgroundColor: 'rgba(52, 152, 219, 1)'
    }]
  },
  options: {
    responsive: true,
    scales: {
      r: {
        angleLines: { display: true },
        suggestedMin: 0,
        suggestedMax: 100
      }
    }
  }
});
