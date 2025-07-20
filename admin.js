// Check authentication and admin role
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (!currentUser) {
    window.location.href = 'index.html';
}

// Admin access control - only specific employees can access admin panel
const adminUsers = ['Kavya', 'Nausheen', 'Subash', 'Raghav', 'Gautham', 'Daison', 'Neavetha'];

if (!adminUsers.includes(currentUser.name)) {
    document.body.innerHTML = `
        <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background: #f8f9fa;">
            <div style="text-align: center; background: white; padding: 3rem; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                <h2 style="color: #ef4444; margin-bottom: 1rem;">🚫 Access Denied</h2>
                <p style="color: #64748b; margin-bottom: 2rem;">You are not authorized to access the admin panel.</p>
                <button onclick="window.location.href='dashboard.html'" 
                        style="background: #0070ad; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer;">
                    ← Back to Dashboard
                </button>
            </div>
        </div>
    `;
    throw new Error('Access denied');
}

// Set welcome message
document.getElementById('welcomeUser').textContent = `Welcome, ${currentUser.name}`;

let allBookings = [];
let filteredBookings = [];
let selectedBookingToDelete = null;
let analyticsChart1, analyticsChart2;

// All 33 registered employees
const employees = [
    { id: "Emp001", name: "Subash" },
    { id: "Emp002", name: "Raghav" },
    { id: "Emp003", name: "Gautham" },
    { id: "Emp004", name: "Daison" },
    { id: "Emp005", name: "Hari" },
    { id: "Emp006", name: "Rahul" },
    { id: "Emp007", name: "Arun Sandeep" },
    { id: "Emp008", name: "Sumithra" },
    { id: "Emp009", name: "Monalisa" },
    { id: "Emp010", name: "Mythili" },
    { id: "Emp011", name: "Debora" },
    { id: "Emp012", name: "Shamshath" },
    { id: "Emp013", name: "Shanthini" },
    { id: "Emp014", name: "Ramya" },
    { id: "Emp015", name: "Tejas" },
    { id: "Emp016", name: "Anand" },
    { id: "Emp017", name: "Harsha" },
    { id: "Emp018", name: "Ankan" },
    { id: "Emp019", name: "Kavya" },
    { id: "Emp020", name: "Nausheen" },
    { id: "Emp021", name: "Sneha" },
    { id: "Emp022", name: "Yukti" },
    { id: "Emp023", name: "Karthik" },
    { id: "Emp024", name: "Gautham s" },
    { id: "Emp025", name: "Gautham d" },
    { id: "Emp026", name: "Neavetha" },
    { id: "Emp027", name: "Aravind Ramesh" },
    { id: "Emp028", name: "Aravind sagar" },
    { id: "Emp029", name: "Hari prasad" },
    { id: "Emp030", name: "Karunya" },
    { id: "Emp031", name: "Kuladeepa" },
    { id: "Emp032", name: "Rishee" },
    { id: "Emp033", name: "Savitha" }
];

// Initialize admin page
document.addEventListener('DOMContentLoaded', function() {
    loadAllBookings();
    updateSummaryStats();
    renderBookingsTable();
    setupDateFilter();
    createAnalyticsCharts();
});

// Load all bookings from localStorage
function loadAllBookings() {
    allBookings = [];
    
    // Get all booking data from localStorage
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        
        // Look for booking keys (format: bookedSeats_YYYY-MM-DD)
        if (key && key.startsWith('bookedSeats_')) {
            const date = key.replace('bookedSeats_', '');
            const dayBookings = JSON.parse(localStorage.getItem(key)) || {};
            
            // Convert day bookings to individual booking records
            Object.keys(dayBookings).forEach(seat => {
                const employeeName = dayBookings[seat];
                const employeeData = getEmployeeData(employeeName);
                
                allBookings.push({
                    date: date,
                    seat: seat,
                    employeeId: employeeData.id,
                    employeeName: employeeName,
                    department: getDepartmentForSeat(seat),
                    timestamp: new Date(`${date}T09:00:00`).toISOString()
                });
            });
        }
    }
    
    // Sort bookings by date (newest first)
    allBookings.sort((a, b) => new Date(b.date) - new Date(a.date));
    filteredBookings = [...allBookings];
}

// Get employee data by name
function getEmployeeData(name) {
    const employee = employees.find(emp => emp.name === name);
    return employee || { id: 'Unknown', name: name };
}

// Get department for seat
function getDepartmentForSeat(seat) {
    const seatNumber = parseInt(seat.replace('Seat-', ''));
    
    if (seatNumber >= 23 && seatNumber <= 26) return 'DCC';
    if ((seatNumber >= 27 && seatNumber <= 29) || (seatNumber >= 38 && seatNumber <= 43)) return 'BREAD';
    if (seatNumber >= 30 && seatNumber <= 37) return 'Solutions';
    if (seatNumber >= 44 && seatNumber <= 47) return 'Cap360';
    return 'Unknown';
}

// Update summary statistics
function updateSummaryStats() {
    const today = new Date().toISOString().split('T')[0];
    const todayBookings = filteredBookings.filter(booking => booking.date === today);
    
    document.getElementById('totalBookings').textContent = filteredBookings.length;
    document.getElementById('todayBookings').textContent = todayBookings.length;
}

// Get waiting list for a specific date
function getWaitingList(date) {
    console.log(JSON.parse(localStorage.getItem(`waitingList_${date}`)) || [])
    return JSON.parse(localStorage.getItem(`waitingList_${date}`)) || [];
}

// Create analytics charts
function createAnalyticsCharts() {
    createTodayPieChart();
    createWeeklyBarChart();
}

// Create pie chart for today's booking vs waiting list
function createTodayPieChart() {
    const today = new Date().toISOString().split('T')[0];
    const todayBookings = allBookings.filter(booking => booking.date === today);
    const waitingList = getWaitingList(today);
    
    const ctx = document.getElementById('todayPieChart').getContext('2d');
    
    if (analyticsChart1) {
        analyticsChart1.destroy();
    }
    
    analyticsChart1 = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Booked Seats', 'Waiting List'],
            datasets: [{
                data: [todayBookings.length, Object.keys(waitingList).length],
                backgroundColor: ['#10b981', '#f59e0b'],
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: `Seat Allocation Status - ${formatDate(today)}`,
                    font: { size: 16, weight: 'bold' }
                },
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Create weekly bar chart showing booking load
function createWeeklyBarChart() {
    const ctx = document.getElementById('weeklyBarChart').getContext('2d');
    
    // Get last 7 days
    const weekData = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const dayBookings = allBookings.filter(booking => booking.date === dateStr);
        const waitingList = getWaitingList(dateStr);
        
        const totalEmployees = employees.length;
        const bookedPercentage = (dayBookings.length / 25) * 100;
        const waitingPercentage = (Object.keys(waitingList).length / totalEmployees) * 100;
        
        weekData.push({
            day: date.toLocaleDateString('en-US', { weekday: 'short' }),
            booked: Math.round(bookedPercentage),
            waiting: Math.round(waitingPercentage)
        });
    }
    
    if (analyticsChart2) {
        analyticsChart2.destroy();
    }
    
    analyticsChart2 = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: weekData.map(d => d.day),
            datasets: [
                {
                    label: '% Booked',
                    data: weekData.map(d => d.booked),
                    backgroundColor: '#3b82f6',
                    borderRadius: 4
                },
                {
                    label: '% Waiting',
                    data: weekData.map(d => d.waiting),
                    backgroundColor: '#f97316',
                    borderRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Weekly Booking Load Analysis',
                    font: { size: 16, weight: 'bold' }
                },
                legend: {
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

// Render bookings table with waiting list
function renderBookingsTable() {
    const adminBookingsTable = document.getElementById('adminBookings');
    const noBookingsAdmin = document.getElementById('noBookingsAdmin');
    const waitingListContainer = document.getElementById('waitingListContainer');
    
    if (filteredBookings.length === 0) {
        adminBookingsTable.innerHTML = '';
        noBookingsAdmin.style.display = 'block';
        waitingListContainer.innerHTML = '';
        return;
    }
    
    noBookingsAdmin.style.display = 'none';
    adminBookingsTable.innerHTML = '';
    
    // Render bookings table
    filteredBookings.forEach((booking, index) => {
        const row = document.createElement('tr');
        const isToday = booking.date === new Date().toISOString().split('T')[0];
        
        row.innerHTML = `
            <td>${formatDate(booking.date)}</td>
            <td><strong>${booking.seat}</strong></td>
            <td>${booking.employeeId}</td>
            <td>${booking.employeeName}</td>
            <td>
                <span class="dept-badge dept-${booking.department.toLowerCase()}">
                    ${booking.department}
                </span>
            </td>
            <td>${formatTime(booking.timestamp)}</td>
            <td>
                <button onclick="deleteBooking('${booking.date}', '${booking.seat}')" 
                        class="delete-btn" title="Delete Booking">
                    🗑️ Delete
                </button>
            </td>
        `;
        
        if (isToday) {
            row.style.background = 'rgba(16, 185, 129, 0.1)';
        }
        
        row.style.opacity = '0';
        row.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            row.style.transition = 'all 0.3s ease';
            row.style.opacity = '1';
            row.style.transform = 'translateY(0)';
        }, index * 50);
        
        adminBookingsTable.appendChild(row);
    });
    
    // Render waiting list for selected date
    renderWaitingList();
}

// Render waiting list
function renderWaitingList() {
    const selectedDate = document.getElementById('dateFilter').value || new Date().toISOString().split('T')[0];
    const waitingList = getWaitingList(selectedDate); // should return an object
    const waitingListContainer = document.getElementById('waitingListContainer');

    if (!waitingList || Object.keys(waitingList).length === 0) {
        waitingListContainer.innerHTML = '';
        return;
    }

    waitingListContainer.innerHTML = `
        <div class="waiting-list-section">
            <h3>🔁 Waiting List for ${formatDate(selectedDate)}</h3>
            <div class="waiting-list-grid">
                ${Object.entries(waitingList).map(([empId, name]) => `
                    <div class="waiting-item">
                        <span class="waiting-employee">${name}</span>
                        <span class="waiting-status">Waiting</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}


// Setup date filter
function setupDateFilter() {
    const dateFilter = document.getElementById('dateFilter');
    const today = new Date().toISOString().split('T')[0];
    dateFilter.value = today;
}

// Filter bookings by date
function filterBookings() {
    const selectedDate = document.getElementById('dateFilter').value;
    
    if (selectedDate) {
        filteredBookings = allBookings.filter(booking => booking.date === selectedDate);
    } else {
        filteredBookings = [...allBookings];
    }
    
    updateSummaryStats();
    renderBookingsTable();
    createAnalyticsCharts(); // Refresh charts
}

// Delete booking
function deleteBooking(date, seat) {
    selectedBookingToDelete = { date, seat };
    
    const booking = filteredBookings.find(b => b.date === date && b.seat === seat);
    document.getElementById('deleteText').innerHTML = `
        Are you sure you want to delete this booking?
        <br><br>
        <strong>Date:</strong> ${formatDate(date)}<br>
        <strong>Seat:</strong> ${seat}<br>
        <strong>Employee:</strong> ${booking.employeeName}
    `;
    
    document.getElementById('deleteModal').classList.add('show');
}

// Confirm delete
function confirmDelete() {
    if (!selectedBookingToDelete) return;
    
    const { date, seat } = selectedBookingToDelete;
    
    // Remove from localStorage
    const dayBookings = JSON.parse(localStorage.getItem(`bookedSeats_${date}`)) || {};
    delete dayBookings[seat];
    
    if (Object.keys(dayBookings).length === 0) {
        localStorage.removeItem(`bookedSeats_${date}`);
    } else {
        localStorage.setItem(`bookedSeats_${date}`, JSON.stringify(dayBookings));
    }
    
    // Also remove from user's booking history
    removeFromUserHistory(date, seat);
    
    // Reload data
    loadAllBookings();
    updateSummaryStats();
    renderBookingsTable();
    createAnalyticsCharts();
    
    // Close modal
    closeDeleteModal();
    
    // Show success message
    showSuccessMessage(`Booking deleted: ${seat} on ${formatDate(date)}`);
}

// Remove from user booking history
function removeFromUserHistory(date, seat) {
    const booking = allBookings.find(b => b.date === date && b.seat === seat);
    if (!booking) return;
    
    const employee = employees.find(emp => emp.name === booking.employeeName);
    if (!employee) return;
    
    const userBookings = JSON.parse(localStorage.getItem(`userBookings_${employee.id}`)) || [];
    const updatedBookings = userBookings.filter(b => !(b.date === date && b.seat === seat));
    
    if (updatedBookings.length === 0) {
        localStorage.removeItem(`userBookings_${employee.id}`);
    } else {
        localStorage.setItem(`userBookings_${employee.id}`, JSON.stringify(updatedBookings));
    }
}

// Show success message
function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.innerHTML = `✅ ${message}`;
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #10b981, #26a69a);
        color: white;
        padding: 1rem 2rem;
        border-radius: 12px;
        font-weight: 600;
        z-index: 3000;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        animation: slideInRight 0.5s ease, fadeOut 0.5s ease 2.5s;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        if (document.body.contains(successDiv)) {
            document.body.removeChild(successDiv);
        }
        if (document.head.contains(style)) {
            document.head.removeChild(style);
        }
    }, 3000);
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (dateString === today.toISOString().split('T')[0]) {
        return 'Today';
    } else if (dateString === yesterday.toISOString().split('T')[0]) {
        return 'Yesterday';
    } else {
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }
}

// Format time for display
function formatTime(timestamp) {
    return new Date(timestamp).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Modal functions
function closeDeleteModal() {
    document.getElementById('deleteModal').classList.remove('show');
    selectedBookingToDelete = null;
}

// Navigation functions
function goToDashboard() {
    window.location.href = 'dashboard.html';
}

// Close modal when clicking outside
document.getElementById('deleteModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeDeleteModal();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeDeleteModal();
    }
});

// Add CSS for analytics and waiting list
const style = document.createElement('style');
style.textContent = `
    .analytics-section {
        margin: 2rem 0;
        background: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    .analytics-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        margin-top: 1rem;
    }
    
    .chart-container {
        background: #f8f9fa;
        padding: 1.5rem;
        border-radius: 8px;
        height: 400px;
    }
    
    .waiting-list-section {
        margin-top: 2rem;
        padding: 1.5rem;
        background: #fef3c7;
        border-radius: 12px;
        border-left: 4px solid #f59e0b;
    }
    
    .waiting-list-section h3 {
        color: #92400e;
        margin-bottom: 1rem;
        font-size: 1.1rem;
    }
    
    .waiting-list-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1rem;
    }
    
    .waiting-item {
        background: white;
        padding: 0.75rem;
        border-radius: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .waiting-employee {
        font-weight: 600;
        color: #1f2937;
    }
    
    .waiting-status {
        background: #f59e0b;
        color: white;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.75rem;
        font-weight: 600;
    }
    
    .dept-badge {
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    
    .dept-dcc { background: #81c784; color: white; }
    .dept-bread { background: #ff7043; color: white; }
    .dept-solutions { background: #29b6f6; color: white; }
    .dept-cap360 { background: #ffa726; color: #1e293b; }
    .dept-unknown { background: #64748b; color: white; }
    
    .delete-btn {
        background: #ef4444;
        color: white;
        border: none;
        padding: 6px 12px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.8rem;
        font-weight: 500;
        transition: all 0.3s ease;
    }
    
    .delete-btn:hover {
        background: #dc2626;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
    }
    
    .admin-table tr:hover {
        background: rgba(0, 112, 173, 0.05) !important;
        transition: background 0.3s ease;
    }
    
    @media (max-width: 768px) {
        .analytics-grid {
            grid-template-columns: 1fr;
        }
        
        .waiting-list-grid {
            grid-template-columns: 1fr;
        }
    }
`;
document.head.appendChild(style);

// Auto-refresh every 30 seconds
setInterval(() => {
    loadAllBookings();
    updateSummaryStats();
    renderBookingsTable();
    createAnalyticsCharts();
}, 30000);