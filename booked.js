// Check authentication
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (!currentUser) {
    window.location.href = 'index.html';
}

// Set welcome message
document.getElementById('welcomeUser').textContent = `Welcome, ${currentUser.name}`;

// Initialize bookings page
document.addEventListener('DOMContentLoaded', function() {
    loadCurrentBooking();
    loadBookingHistory();
});

// Load current booking for today
function loadCurrentBooking() {
    const today = new Date().toISOString().split('T')[0];
    const todayBookings = JSON.parse(localStorage.getItem(`bookedSeats_${today}`)) || {};
    
    // Find current user's booking for today
    const userSeat = Object.keys(todayBookings).find(seat => 
        todayBookings[seat] === currentUser.name
    );
    
    const currentBookingDiv = document.getElementById('currentBooking');
    
    if (userSeat) {
        const seatNumber = userSeat.replace('Seat-', '');
        const department = getDepartmentForSeat(parseInt(seatNumber));
        
        currentBookingDiv.innerHTML = `
            <h3>🪑 Current Booking</h3>
            <div style="font-size: 1.2rem; margin: 1rem 0;">
                <strong>${userSeat}</strong> - ${department} Department
            </div>
            <div style="font-size: 0.9rem; opacity: 0.9;">
                Booked for: ${new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })}
            </div>
        `;
        currentBookingDiv.style.display = 'block';
    } else {
        currentBookingDiv.innerHTML = `
            <div style="text-align: center; padding: 2rem; background: rgba(255, 255, 255, 0.1); border-radius: 12px;">
                <div style="font-size: 2rem; margin-bottom: 1rem;">📅</div>
                <h3>No Booking for Today</h3>
                <p>You haven't booked a seat for today yet.</p>
                <button onclick="goToSeating()" class="action-btn primary" style="margin-top: 1rem;">
                    Book a Seat Now
                </button>
            </div>
        `;
        currentBookingDiv.style.background = 'linear-gradient(135deg, #64748b 0%, #475569 100%)';
        currentBookingDiv.style.color = 'white';
    }
}

// Load booking history
function loadBookingHistory() {
    const userBookings = JSON.parse(localStorage.getItem(`userBookings_${currentUser.id}`)) || [];
    const bookingHistoryTable = document.getElementById('bookingHistory');
    const noBookingsDiv = document.getElementById('noBookings');
    
    if (userBookings.length === 0) {
        document.querySelector('.booking-history').style.display = 'none';
        noBookingsDiv.style.display = 'block';
        return;
    }
    
    // Sort bookings by date (newest first)
    userBookings.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    bookingHistoryTable.innerHTML = '';
    
    userBookings.forEach(booking => {
        const row = document.createElement('tr');
        const isToday = booking.date === new Date().toISOString().split('T')[0];
        const status = isToday ? 'Active' : 'Completed';
        const statusClass = isToday ? 'status-active' : 'status-completed';
        
        row.innerHTML = `
            <td>${formatDate(booking.date)}</td>
            <td><strong>${booking.seat}</strong></td>
            <td>${booking.department}</td>
            <td><span class="status-badge ${statusClass}">${status}</span></td>
        `;
        
        if (isToday) {
            row.style.background = 'rgba(16, 185, 129, 0.1)';
        }
        
        bookingHistoryTable.appendChild(row);
    });
    
    // Show booking history section
    document.querySelector('.booking-history').style.display = 'block';
    noBookingsDiv.style.display = 'none';
}

// Get department for seat number
function getDepartmentForSeat(seatNumber) {
    if (seatNumber >= 23 && seatNumber <= 26) return 'DCC';
    if ((seatNumber >= 27 && seatNumber <= 29) || (seatNumber >= 38 && seatNumber <= 43)) return 'BREAD';
    if (seatNumber >= 30 && seatNumber <= 37) return 'Solutions';
    if (seatNumber >= 44 && seatNumber <= 47) return 'Cap360';
    return 'Unknown';
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

// Navigation functions
function goToDashboard() {
    window.location.href = 'dashboard.html';
}

function goToSeating() {
    window.location.href = 'seating.html';
}

// Add CSS for status badges
const style = document.createElement('style');
style.textContent = `
    .status-badge {
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    
    .status-active {
        background: #10b981;
        color: white;
    }
    
    .status-completed {
        background: #64748b;
        color: white;
    }
    
    .booking-history {
        animation: fadeIn 0.6s ease;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .bookings-table tr:hover {
        background: rgba(0, 112, 173, 0.05) !important;
        transition: background 0.3s ease;
    }
    
    .current-booking {
        animation: slideIn 0.6s ease;
    }
    
    @keyframes slideIn {
        from { opacity: 0; transform: translateX(-30px); }
        to { opacity: 1; transform: translateX(0); }
    }
`;
document.head.appendChild(style);

// Add booking statistics
function addBookingStats() {
    const userBookings = JSON.parse(localStorage.getItem(`userBookings_${currentUser.id}`)) || [];
    
    if (userBookings.length > 0) {
        const statsDiv = document.createElement('div');
        statsDiv.className = 'booking-stats';
        statsDiv.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
                <div class="mini-stat-card">
                    <div style="font-size: 1.5rem; font-weight: 700; color: #0070ad;">${userBookings.length}</div>
                    <div style="font-size: 0.9rem; color: #64748b;">Total Bookings</div>
                </div>
                <div class="mini-stat-card">
                    <div style="font-size: 1.5rem; font-weight: 700; color: #26a69a;">${getMostUsedDepartment(userBookings)}</div>
                    <div style="font-size: 0.9rem; color: #64748b;">Favorite Dept.</div>
                </div>
                <div class="mini-stat-card">
                    <div style="font-size: 1.5rem; font-weight: 700; color: #ff7043;">${getThisMonthBookings(userBookings)}</div>
                    <div style="font-size: 0.9rem; color: #64748b;">This Month</div>
                </div>
            </div>
        `;
        
        // Add CSS for mini stat cards
        const statsStyle = document.createElement('style');
        statsStyle.textContent = `
            .mini-stat-card {
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(20px);
                padding: 1rem;
                border-radius: 12px;
                text-align: center;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
            }
        `;
        document.head.appendChild(statsStyle);
        
        // Insert stats before booking history
        const bookingsMain = document.querySelector('.bookings-main');
        const bookingsContent = document.querySelector('.bookings-content');
        bookingsMain.insertBefore(statsDiv, bookingsContent);
    }
}

// Helper functions for stats
function getMostUsedDepartment(bookings) {
    const deptCount = {};
    bookings.forEach(booking => {
        deptCount[booking.department] = (deptCount[booking.department] || 0) + 1;
    });
    
    return Object.keys(deptCount).reduce((a, b) => 
        deptCount[a] > deptCount[b] ? a : b
    ) || 'None';
}

function getThisMonthBookings(bookings) {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return bookings.filter(booking => {
        const bookingDate = new Date(booking.date);
        return bookingDate.getMonth() === currentMonth && 
               bookingDate.getFullYear() === currentYear;
    }).length;
}

// Call addBookingStats after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(addBookingStats, 500); // Add slight delay for smooth animation
});