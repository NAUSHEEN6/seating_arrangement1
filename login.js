// Employee data - All 33 registered employees
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

// DOM elements
const loginForm = document.getElementById('loginForm');
const empIdInput = document.getElementById('empId');
const empNameInput = document.getElementById('empName');
const errorMessage = document.getElementById('errorMessage');

// Login form submission
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const empId = empIdInput.value.trim();
    const empName = empNameInput.value.trim();
    
    // Clear previous error
    hideError();
    
    // Validate inputs
    if (!empId || !empName) {
        showError('Please enter both Employee ID and Name');
        return;
    }
    
    // Find matching employee
    const employee = employees.find(emp => 
        emp.id.toLowerCase() === empId.toLowerCase() && 
        emp.name.toLowerCase() === empName.toLowerCase()
    );
    
    if (employee) {
        // Store current user in localStorage
        localStorage.setItem('currentUser', JSON.stringify(employee));
        
        // Add success animation
        loginForm.style.transform = 'scale(0.95)';
        loginForm.style.opacity = '0.8';
        
        // Show success message briefly
        showSuccess('Login successful! Redirecting...');
        
        // Redirect to dashboard after short delay
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    } else {
        showError('Invalid Employee ID or Name. Please check your credentials.');
        
        // Add shake animation for error
        loginForm.style.animation = 'shake 0.5s';
        setTimeout(() => {
            loginForm.style.animation = '';
        }, 500);
    }
});

// Show error message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    errorMessage.style.background = 'rgba(239, 68, 68, 0.1)';
    errorMessage.style.color = '#ef4444';
    errorMessage.style.borderLeft = '4px solid #ef4444';
}

// Show success message
function showSuccess(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    errorMessage.style.background = 'rgba(16, 185, 129, 0.1)';
    errorMessage.style.color = '#10b981';
    errorMessage.style.borderLeft = '4px solid #10b981';
}

// Hide error message
function hideError() {
    errorMessage.style.display = 'none';
}

// Add shake animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// Auto-focus on first input
empIdInput.focus();

// Add input formatting
empIdInput.addEventListener('input', function(e) {
    // Auto-format employee ID (ensure it starts with 'Emp')
    let value = e.target.value.trim();
    if (value && !value.toLowerCase().startsWith('emp')) {
        e.target.value = 'Emp' + value.replace(/\D/g, '').padStart(3, '0');
    }
});

// Add enter key navigation
empIdInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        empNameInput.focus();
    }
});

// Check if user is already logged in
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (currentUser) {
    // Auto-redirect if already logged in
    window.location.href = 'dashboard.html';
}

// Add loading animation to login button
const loginBtn = document.querySelector('.login-btn');
const originalBtnText = loginBtn.innerHTML;

loginForm.addEventListener('submit', function() {
    loginBtn.innerHTML = '<span>Signing In...</span><div class="btn-shimmer"></div>';
    loginBtn.disabled = true;
    
    // Reset button after processing
    setTimeout(() => {
        if (!window.location.href.includes('dashboard.html')) {
            loginBtn.innerHTML = originalBtnText;
            loginBtn.disabled = false;
        }
    }, 2000);
});