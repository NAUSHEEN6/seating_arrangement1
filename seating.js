// import { employees } from "./utils/employees";

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

// Check authentication
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (!currentUser) {
    window.location.href = 'index.html';
}

// Set welcome message and current date
document.getElementById('welcomeUser').textContent = `Welcome, ${currentUser.name}`;
document.getElementById('currentDate').textContent = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
});

// Seat layout matching the uploaded image exactly
const seatLayout = [
    // Row 1: Top row
    [47, 33, 34, 23],
    [46, 32, 35, null],
    
    // Row 2: Second row  
    [45, 31, 36, null],
    [44, 30, 37, null],
    
    // Row 3: Third row
    [43, 29, 38, 24],
    [42, 28, 39, 25],
    
    // Row 4: Bottom row
    [41, 27, 40, 26]
];

// Department configuration based on image
const seatConfig = {
    // DCC (Green) - seats 23-26
    23: { department: 'dcc' },
    24: { department: 'dcc' },
    25: { department: 'dcc' },
    26: { department: 'dcc' },
    
    // BREAD (Brown) - seats 27-29, 38-43
    27: { department: 'bread' },
    28: { department: 'bread' },
    29: { department: 'bread' },
    38: { department: 'bread' },
    39: { department: 'bread' },
    40: { department: 'bread' },
    41: { department: 'bread' },
    42: { department: 'bread' },
    43: { department: 'bread' },
    
    // Solutions (Blue) - seats 30-37
    30: { department: 'solutions' },
    31: { department: 'solutions' },
    32: { department: 'solutions' },
    33: { department: 'solutions' },
    34: { department: 'solutions' },
    35: { department: 'solutions' },
    36: { department: 'solutions' },
    37: { department: 'solutions' },
    
    // Cap360 (Gray) - seats 44-47
    44: { department: 'cap360' },
    45: { department: 'cap360' },
    46: { department: 'cap360' },
    47: { department: 'cap360' }
};

let selectedSeat = null;
let todayBookings = {};

// Initialize seating page
document.addEventListener('DOMContentLoaded', function() {
    loadTodayBookings();
    renderSeatGrid();
    checkExistingBooking();
    showOrDisableWaitlistButton();
});

// Load today's bookings
function loadTodayBookings() {
    const today = new Date().toISOString().split('T')[0];
    todayBookings = JSON.parse(localStorage.getItem(`bookedSeats_${today}`)) || {};
}

// Render seat grid based on exact layout
function renderSeatGrid() {
    const seatGrid = document.getElementById('seatGrid');
    seatGrid.innerHTML = '';
    
    // Create layout exactly as shown in image
    seatLayout.forEach(row => {
        row.forEach(seatNumber => {
            const seatElement = createSeatElement(seatNumber);
            seatGrid.appendChild(seatElement);
        });
    });
}

// Create seat element
function createSeatElement(seatNumber) {
    const seatDiv = document.createElement('div');
    
    if (!seatNumber || !seatConfig[seatNumber]) {
        // Empty space for layout
        seatDiv.className = 'empty-space';
        return seatDiv;
    }
    
    const config = seatConfig[seatNumber];
    const isBooked = todayBookings[`Seat-${seatNumber}`];
    const isCurrentUserBooking = isBooked === currentUser.name;
    
    seatDiv.className = `seat ${config.department}`;
    seatDiv.dataset.seatNumber = seatNumber;
    
    if (isBooked) {
        seatDiv.classList.add('booked');
        seatDiv.innerHTML = `
            <div class="seat-number">Seat-${seatNumber}</div>
            <div class="seat-employee">${isBooked}</div>
        `;
    } else {
        seatDiv.innerHTML = `
            <div class="seat-number">Seat-${seatNumber}</div>
            <div class="seat-status">Available</div>
        `;
        
        // Add click handler for available seats
        seatDiv.addEventListener('click', () => selectSeat(seatNumber));
    }
    
    // Add hover tooltips
    seatDiv.addEventListener('mouseenter', (e) => showTooltip(e, seatNumber, isBooked));
    seatDiv.addEventListener('mouseleave', hideTooltip);
    
    return seatDiv;
}

// Show tooltip
function showTooltip(e, seatNumber, bookedBy) {
    const tooltip = document.getElementById('tooltip');
    const config = seatConfig[seatNumber];
    const departmentName = getDepartmentName(config.department);
    
    let tooltipText = `Seat-${seatNumber} - ${departmentName}`;
    
    if (bookedBy) {
        tooltipText += `\nBooked by: ${bookedBy}`;
        tooltipText += `\nDate: ${new Date().toLocaleDateString()}`;
    } else {
        tooltipText += '\nClick to book this seat';
    }
    
    tooltip.textContent = tooltipText;
    tooltip.style.whiteSpace = 'pre-line';
    tooltip.classList.add('show');
    
    // Position tooltip
    const rect = e.target.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
}

// Hide tooltip
function hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    tooltip.classList.remove('show');
}

// Get department full name
function getDepartmentName(dept) {
    const names = {
        'dcc': 'DCC',
        'bread': 'BREAD',
        'solutions': 'Solutions',
        'cap360': 'Cap360'
    };
    return names[dept] || dept;
}

// Select seat for booking
function selectSeat(seatNumber) {
    // Check if user already has a booking today
    const userBooking = Object.keys(todayBookings).find(seat => 
        todayBookings[seat] === currentUser.name
    );
    
    if (userBooking) {
        alert(`You already have a booking today: ${userBooking}`);
        return;
    }
    
    selectedSeat = seatNumber;
    const config = seatConfig[seatNumber];
    const departmentName = getDepartmentName(config.department);
    
    // Update confirmation modal
    document.getElementById('confirmText').innerHTML = `
        Do you want to book <strong>Seat-${seatNumber}</strong> in the <strong>${departmentName}</strong> department?
        <br><br>
        <small>Date: ${new Date().toLocaleDateString()}</small>
    `;
    
    // Show confirmation modal
    document.getElementById('confirmModal').classList.add('show');
}

// Confirm booking
function confirmBooking() {
    if (!selectedSeat) return;
    
    const today = new Date().toISOString().split('T')[0];
    const seatKey = `Seat-${selectedSeat}`;
    
    // Check if 25 seats are already booked
    const currentBookedCount = Object.keys(todayBookings).length;
    
    if (currentBookedCount >= 25) {
        // Add to waiting list
        addToWaitingList(currentUser.name, today);
        closeModal();
        updateBookingInfo(`All 25 seats are booked! You've been added to the waiting list.`);
        showWaitingListNotification();
        return;
    }
    
    // Update today's bookings
    todayBookings[seatKey] = currentUser.name;
    
    // Save to localStorage with booking metadata
    localStorage.setItem(`bookedSeats_${today}`, JSON.stringify(todayBookings));
    
    // Save booking history for the user
    saveUserBookingHistory(selectedSeat);
    
    // Close modal
    closeModal();
    
    // Update UI
    renderSeatGrid();
    updateBookingInfo(`Successfully booked ${seatKey}!`);
    
    // Show success animation
    showSuccessAnimation();
}

// Save user booking history
function saveUserBookingHistory(seatNumber) {
    const userBookings = JSON.parse(localStorage.getItem(`userBookings_${currentUser.id}`)) || [];
    
    const booking = {
        date: new Date().toISOString().split('T')[0],
        seat: `Seat-${seatNumber}`,
        department: getDepartmentName(seatConfig[seatNumber].department),
        timestamp: new Date().toISOString(),
        status: 'active'
    };
    
    userBookings.push(booking);
    localStorage.setItem(`userBookings_${currentUser.id}`, JSON.stringify(userBookings));
}

// Show success animation
function showSuccessAnimation() {
    const successDiv = document.createElement('div');
    successDiv.innerHTML = '🎉 Booking Confirmed! 🎉';
    successDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #10b981, #26a69a);
        color: white;
        padding: 2rem;
        border-radius: 16px;
        font-size: 1.5rem;
        font-weight: 700;
        text-align: center;
        z-index: 3000;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        animation: successPop 2s ease;
    `;
    
    // Add success animation CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes successPop {
            0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
            20% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
            30% { transform: translate(-50%, -50%) scale(1); }
            90% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
            100% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        document.body.removeChild(successDiv);
        document.head.removeChild(style);
    }, 2000);
}

// Update booking info
function updateBookingInfo(message) {
    const bookingInfo = document.getElementById('bookingInfo');
    bookingInfo.innerHTML = `<p style="color: #10b981; font-weight: 600;">${message}</p>`;

    const totalBookingsForToday = Object.keys(todayBookings).length;
    if(totalBookingsForToday < 25){
        setTimeout(() => {
            bookingInfo.innerHTML = '<p>Click on an available seat to book it for today</p>';
        }, 3000);
    }
}

// Check existing booking
function checkExistingBooking() {
    const userBooking = Object.keys(todayBookings).find(seat => 
        todayBookings[seat] === currentUser.name
    );
    
    const totalBookingsForToday = Object.keys(todayBookings).length;

    if (userBooking) {
        updateBookingInfo(`You have already booked ${userBooking} for today`);
    }

    console.log(totalBookingsForToday)
    if(totalBookingsForToday == 25){
        const today = new Date().toISOString().split('T')[0];
        const waitingListKey = `waitingList_${today}`;
        const waitingList = JSON.parse(localStorage.getItem(waitingListKey)) || {};
        if(!waitingList.hasOwnProperty(currentUser.id)){
            updateBookingInfo('The seats are full, click below button to join waitlist');
        }
        else{
            updateBookingInfo('The seats are full, and you\'ve already waitlisted');
        }
    }



}

// Modal functions
function closeModal() {
    document.getElementById('confirmModal').classList.remove('show');
    selectedSeat = null;
}

// Navigation functions
function goToDashboard() {
    window.location.href = 'dashboard.html';
}

// Close modal when clicking outside
document.getElementById('confirmModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    switch(e.key) {
        case 'Escape':
            closeModal();
            break;
        case 'Enter':
            if (document.getElementById('confirmModal').classList.contains('show')) {
                confirmBooking();
            }
            break;
    }
});

// Add to waiting list
function addToWaitingList(employee = currentUser, date = new Date().toISOString().split('T')[0]) {
    const waitingListKey = `waitingList_${date}`;
    
    // Retrieve existing waiting list or initialize as an empty object
    const waitingList = JSON.parse(localStorage.getItem(waitingListKey)) || {};

    console.log(waitingListKey, waitingList);

    // Only add if employee ID is not already present
    if (!waitingList.hasOwnProperty(employee.id)) {
        waitingList[employee.id] = employee.name;
        localStorage.setItem(waitingListKey, JSON.stringify(waitingList));
        window.location.reload();
    }
}

// function to disable and hide waitlist button 

function showOrDisableWaitlistButton() {
    const waitlistButton = document.getElementById('waitlist');
    const today = new Date().toISOString().split('T')[0];
    const waitingListKey = `waitingList_${today}`;
    const waitingList = JSON.parse(localStorage.getItem(waitingListKey)) || {};
    const bookingsCount = Object.keys(todayBookings || {}).length;

    // Hide button by default
    waitlistButton.style.display = 'none';
    waitlistButton.disabled = false;
    waitlistButton.textContent = 'Waitlist';

    console.log(bookingsCount, waitingList, waitingList.hasOwnProperty(currentUser.id))

    // Show/disable logic
    if (bookingsCount === 25) {
        if (!waitingList.hasOwnProperty(currentUser.id)) {
            // User not in waitlist, show button
            console.log("Yes")
            waitlistButton.style.display = 'inline-block';
        } else {
            // User already in waitlist
            console.log("Yess")
            waitlistButton.style.display = 'inline-block';
            waitlistButton.disabled = true;
            waitlistButton.textContent = 'Waitlisted';
        }
    }
}



// Show waiting list notification
function showWaitingListNotification() {
    const notificationDiv = document.createElement('div');
    notificationDiv.innerHTML = '⏳ Added to Waiting List';
    notificationDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #f59e0b, #f97316);
        color: white;
        padding: 2rem;
        border-radius: 16px;
        font-size: 1.5rem;
        font-weight: 700;
        text-align: center;
        z-index: 3000;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        animation: waitingPop 3s ease;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes waitingPop {
            0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
            20% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
            30% { transform: translate(-50%, -50%) scale(1); }
            90% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
            100% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notificationDiv);
    
    setTimeout(() => {
        document.body.removeChild(notificationDiv);
        document.head.removeChild(style);
    }, 3000);
}

// Auto-refresh bookings every 10 seconds
setInterval(() => {
    loadTodayBookings();
    renderSeatGrid();
}, 10000);


// function to book all seats (testing)

function bookAllSeats() {
    let tempEmployees = employees.slice(0, 25);
    let remainingEmployees = employees.slice(25, 33);
    const seatNumbers = [
        23, 24, 25, 26,      // dcc
        27, 28, 29,          // bread
        30, 31, 32, 33, 34, 35, 36, 37,  // solutions
        38, 39, 40, 41, 42, 43,          // bread
        44, 45, 46, 47       // cap360
    ];

    let bookedSeats = tempEmployees.reduce((acc, em, index) => {
        let seatKey = 'Seat-' + seatNumbers[index];
        acc[seatKey] = em?.name || 'Unknown'; // Optional fallback
        return acc;
    }, {});

    console.log(bookedSeats);
    console.log(remainingEmployees)
    localStorage.setItem('bookedSeats_2025-07-20', JSON.stringify(bookedSeats));
}


// ⚠️ uncomment this only while testing
// bookAllSeats();