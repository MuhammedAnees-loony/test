// Variable to track login status
let isLoggedIn = false;

// Function to handle login
function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Fetch and parse CSV for login credentials
    fetch('D:/intel/hashed_passwords.csv')  // Adjust the path to your CSV file
        .then(response => response.text())
        .then(data => {
            // Parse CSV data
            const lines = data.split('\n');
            const headers = lines[0].split(',');

            // Find matching user
            let isLoggedIn = false;
            for (let i = 1; i < lines.length; i++) {
                const values = lines[i].split(',');
                const storedUsername = values[0].trim(); // Trim whitespace
                const storedPassword = values[1].trim(); // Trim whitespace

                // Replace this with your actual hashing and comparison logic
                const hashedPassword = hashPassword(password);  // Example function to hash password

                // Validate credentials
                if (username === storedUsername && hashedPassword === storedPassword) {
                    isLoggedIn = true;
                    break;
                }
            }

            if (isLoggedIn) {
                // Login successful
                document.getElementById('loginForm').style.display = 'none';
                document.getElementById('registerForm').style.display = 'none';
                enableTabs();
                showUserProfile();
            } else {
                // Invalid credentials
                alert('Invalid username or password');
            }
        })
        .catch(error => console.error('Error fetching CSV:', error));
}

// Example function to hash password (replace with your actual hashing mechanism)
function hashPassword(password) {
    // Implement your hashing logic here
    // Example: return someHashingFunction(password);
    return password; // Placeholder; replace with actual hashing logic
}

// Function to show user profile
function showUserProfile() {
    document.getElementById('profileUserId').innerText = 'CC-001';
    document.getElementById('profileUserName').innerText = 'Navya Prasad';
    document.getElementById('profileVehicleId').innerText = 'V001';
    document.getElementById('profileVehicleType').innerText = 'Sedan';
    document.getElementById('profileGpsId').innerText = 'G001';
    document.getElementById('userProfile').style.display = 'block';
}

// Function to enable tabs
function enableTabs() {
    document.getElementById('statusTab').classList.remove('disabled');
    document.getElementById('contactTab').classList.remove('disabled');
}

// Event listeners

// Login form submission
document.getElementById('loginFormElem').addEventListener('submit', handleLogin);

// Toggle between login and registration forms
document.getElementById('loginTab').addEventListener('click', function() {
    var loginForm = document.getElementById('loginForm');
    var registerForm = document.getElementById('registerForm');

    if (loginForm.style.display === 'none') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    } else {
        loginForm.style.display = 'none';
    }
});

// Show registration form
document.getElementById('registerLink').addEventListener('click', function(event) {
    event.preventDefault();
    var loginForm = document.getElementById('loginForm');
    var registerForm = document.getElementById('registerForm');

    if (registerForm.style.display === 'none') {
        registerForm.style.display = 'block';
        loginForm.style.display = 'none';
    } else {
        registerForm.style.display = 'none';
    }
});

// Prevent access to status tab if not logged in
document.getElementById('statusTab').addEventListener('click', function(event) {
    event.preventDefault();
    
    if (!isLoggedIn) {
        alert('Please log in to access this page.');
        return;
    }
    
    const statusContent = document.getElementById('statusContent');
    const gpsInterface = document.getElementById('gpsInterface');

    if (statusContent.style.display === 'none') {
        statusContent.style.display = 'block';
        gpsInterface.style.display = 'none'; // Hide GPS interface if shown
    } else {
        statusContent.style.display = 'none';
    }
});
