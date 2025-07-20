// Check authentication
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (!currentUser) {
    window.location.href = 'index.html';
}

// Set welcome message
document.getElementById('welcomeUser').textContent = `Welcome, ${currentUser.name}`;

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    updateStats();
    createCharts();
    addAnimations();
    checkAndHideAdminPanel()
});

// function to hide admin panel
function checkAndHideAdminPanel() {
    const adminPanelButton = document.querySelector("#admin-pannel");
    const adminUsers = ['Kavya', 'Nausheen', 'Subash', 'Raghav', 'Gautham', 'Daison', 'Neavetha'];
    if(!adminUsers.includes(currentUser.name)){
        console.log("Admin panel button is hidden")
        adminPanelButton.classList.add("admin-panel-hide");
    }
}

// Update statistics
function updateStats() {
    const today = new Date().toISOString().split('T')[0];
    const todayBookings = JSON.parse(localStorage.getItem(`bookedSeats_${today}`)) || {};
    const bookedCount = Object.keys(todayBookings).length;
    const totalSeats = 25; // Seats 23-47 = 25 seats
    const availableCount = totalSeats - bookedCount;
    
    document.getElementById('bookedToday').textContent = bookedCount;
    document.getElementById('availableToday').textContent = availableCount;
}

// Create charts using Chart.js
function createCharts() {
    createDoughnutChart();
    createBarChart();
    createPieChart();
}

// Doughnut chart for today's usage
function createDoughnutChart() {
    const ctx = document.getElementById('doughnutChart').getContext('2d');
    const today = new Date().toISOString().split('T')[0];
    const todayBookings = JSON.parse(localStorage.getItem(`bookedSeats_${today}`)) || {};
    const bookedCount = Object.keys(todayBookings).length;
    const availableCount = 25 - bookedCount;
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Booked', 'Available'],
            datasets: [{
                data: [bookedCount, availableCount],
                backgroundColor: ['#ff7043', '#26a69a'],
                borderColor: ['#ff5722', '#4db6ac'],
                borderWidth: 2,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        padding: 20,
                        font: {
                            size: 12,
                            weight: '600'
                        }
                    }
                }
            },
            elements: {
                arc: {
                    borderRadius: 8
                }
            }
        }
    });
}

// Bar chart for last 7 days
function createBarChart() {
    const ctx = document.getElementById('barChart').getContext('2d');
    const last7Days = [];
    const bookingCounts = [];
    
    // Generate last 7 days data
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        last7Days.push(dayName);
        
        const dayBookings = JSON.parse(localStorage.getItem(`bookedSeats_${dateString}`)) || {};
        bookingCounts.push(Object.keys(dayBookings).length);
    }
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: last7Days,
            datasets: [{
                label: 'Bookings',
                data: bookingCounts,
                backgroundColor: 'rgba(64, 169, 224, 0.8)',
                borderColor: '#0070ad',
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 25,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        font: {
                            size: 11
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 11,
                            weight: '600'
                        }
                    }
                }
            }
        }
    });
}

// Pie chart for department distribution
function createPieChart() {
    const ctx = document.getElementById('pieChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['DCC', 'BREAD', 'Solutions', 'Cap360'],
            datasets: [{
                data: [4, 9, 8, 4], // Seat counts by department
                backgroundColor: [
                    '#81c784', // DCC - Cool Sage
                    '#ff7043', // BREAD - Warm Orange
                    '#29b6f6', // Solutions - Cool Sky
                    '#ffa726'  // Cap360 - Warm Gold
                ],
                borderColor: '#ffffff',
                borderWidth: 3,
                hoverOffset: 15
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: {
                            size: 12,
                            weight: '600'
                        },
                        generateLabels: function(chart) {
                            const data = chart.data;
                            if (data.labels.length && data.datasets.length) {
                                return data.labels.map((label, i) => {
                                    const dataset = data.datasets[0];
                                    const value = dataset.data[i];
                                    return {
                                        text: `${label} (${value} seats)`,
                                        fillStyle: dataset.backgroundColor[i],
                                        strokeStyle: dataset.borderColor,
                                        lineWidth: dataset.borderWidth,
                                        hidden: false,
                                        index: i
                                    };
                                });
                            }
                            return [];
                        }
                    }
                }
            },
            elements: {
                arc: {
                    borderRadius: 8
                }
            }
        }
    });
}

// Add animations
function addAnimations() {
    // Animate stat cards
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 150);
    });
    
    // Animate chart cards
    const chartCards = document.querySelectorAll('.chart-card');
    chartCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 500 + (index * 200));
    });
    
    // Animate action buttons
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach((btn, index) => {
        btn.style.opacity = '0';
        btn.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            btn.style.transition = 'all 0.6s ease';
            btn.style.opacity = '1';
            btn.style.transform = 'translateY(0)';
        }, 1000 + (index * 100));
    });
}

// Navigation functions
function goToSeating() {
    window.location.href = 'seating.html';
}

function goToBookings() {
    window.location.href = 'booked.html';
}

function goToSeatPlan() {
    window.location.href = 'tools_seating.html';
}

function goToAdmin() {
    window.location.href = 'admin.html';
}

function logout() {
    // Confirm logout
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }
}

// Auto-refresh stats every 30 seconds
setInterval(updateStats, 30000);

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case '1':
                e.preventDefault();
                goToSeating();
                break;
            case '2':
                e.preventDefault();
                goToBookings();
                break;
            case '3':
                e.preventDefault();
                goToSeatPlan();
                break;
            case '4':
                e.preventDefault();
                goToAdmin();
                break;
        }
    }
});

// Add tooltips to buttons
document.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip show';
        tooltip.textContent = this.querySelector('span').textContent;
        document.body.appendChild(tooltip);
        
        const rect = this.getBoundingClientRect();
        tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
    });
    
    btn.addEventListener('mouseleave', function() {
        const tooltip = document.querySelector('.tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    });
});