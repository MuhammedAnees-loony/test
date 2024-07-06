let users = []; // Array to store user data
let isLoggedIn = false;

// Function to fetch user data from the GitHub repository
function fetchUserData() {
    const userCsvPath = 'https://raw.githubusercontent.com/MuhammedAnees-loony/test/main/login.csv';  // GitHub URL for user data

    fetch(userCsvPath)
        .then(response => response.text())
        .then(data => {
            users = parseCSV(data);
            console.log('User data fetched:', users);  // Log the fetched user data for debugging
        })
        .catch(error => console.error('Error fetching user data:', error));
}

// Function to parse CSV text into JSON
function parseCSV(data) {
    const lines = data.split('\n').filter(line => line.trim() !== '');
    const headers = lines[0].split(',');
    const result = [];

    for (let i = 1; i < lines.length; i++) {
        const obj = {};
        const currentLine = lines[i].split(',');

        for (let j = 0; j < headers.length; j++) {
            obj[headers[j].trim()] = currentLine[j].trim();
        }
        result.push(obj);
    }

    return result;
}

// Function to handle login
function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Check if the provided username and password match any user in the array
    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        isLoggedIn = true;
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('registerForm').style.display = 'none';
        enableTabs();
        showUserProfile(user);
        fetchJourneyData(user.vehicleId);  // Fetch journeys after successful login
    } else {
        alert('Invalid username or password');
    }
}

// Event listener for login form submission
document.getElementById('loginFormElem').addEventListener('submit', handleLogin);

// Event listener for registration form submission
document.getElementById('registerFormElem').addEventListener('submit', async function(event) {
    event.preventDefault();
    const username = document.getElementById('newUsername').value;
    const password = document.getElementById('newPassword').value;

    const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    const result = await response.json();
    if (result.success) {
        alert('Registration successful');
        // Handle successful registration
    } else {
        alert(result.error);
    }
});

// Function to show user profile
function showUserProfile(user) {
    document.getElementById('profileUserId').textContent = user.user_id;
    document.getElementById('profileUserName').textContent = user.username;
    document.getElementById('profileVehicleId').textContent = user.vehicle_id;
    document.getElementById('profileVehicleType').textContent = user.vehicle_type;
    document.getElementById('profileGpsId').textContent = user.gps_id;
    document.getElementById('userProfile').style.display = 'block';
}

// Function to enable tabs
function enableTabs() {
    const tabs = document.querySelectorAll('nav ul li a');
    tabs.forEach(tab => {
        tab.classList.remove('disabled');
    });
}

// Function to fetch journey data (assuming this is needed, placeholder function)
function fetchJourneyData(vehicleId) {
    // Implement journey data fetching logic here
    console.log('Fetching journey data for vehicle ID:', vehicleId);
}

// Fetch user data when the page loads
fetchUserData();

// Event listener for fetch data button
document.getElementById('fetchDataBtn').addEventListener('click', async function() {
    const response = await fetch('http://localhost:5000/profile');
    const result = await response.json();
    if (result.user_id) {
        document.getElementById('profileUserId').textContent = result.user_id;
        document.getElementById('profileUserName').textContent = result.username;
        document.getElementById('profileVehicleId').textContent = result.vehicle_id;
        document.getElementById('profileVehicleType').textContent = result.vehicle_type;
        document.getElementById('profileGpsId').textContent = result.gps_id;
        document.getElementById('userProfile').style.display = 'block';
    } else {
        alert(result.error);
    }
});
