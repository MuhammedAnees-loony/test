let isLoggedIn = false;
let users = [];
let journeys = [];

// Function to fetch journey data from backend
function fetchJourneyData() {
    const journeyCsvPath = 'http://127.0.0.1:5000/journeys';  // Backend endpoint to fetch journey data

    // Fetch journey data
    fetch(journeyCsvPath)
        .then(response => response.json())
        .then(data => {
            journeys = JSON.parse(data);
        })
        .catch(error => console.error('Error fetching journey data:', error));
}

// Function to fetch login data from CSV file in GitHub repository
function fetchLoginData() {
    const loginCsvPath = 'https://raw.githubusercontent.com/yourusername/yourrepository/main/login.csv';  // Replace with your GitHub raw CSV file URL

    // Fetch login data using Fetch API
    fetch(loginCsvPath)
        .then(response => response.text())
        .then(data => {
            users = parseCsvData(data);
        })
        .catch(error => console.error('Error fetching login data:', error));
}

// Function to parse CSV data
function parseCsvData(csvData) {
    const lines = csvData.split('\n');
    const headers = lines[0].split(',');
    const result = [];

    for (let i = 1; i < lines.length; i++) {
        const obj = {};
        const currentline = lines[i].split(',');

        for (let j = 0; j < headers.length; j++) {
            obj[headers[j].trim()] = currentline[j].trim();
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
        sendVehicleIdForPrediction(user.vehicleId); // Send vehicle ID for prediction
        fetchJourneyDetails(user.vehicleId); // Fetch journey details
    } else {
        alert('Invalid username or password');
    }
}

// Function to show user profile
function showUserProfile(user) {
    document.getElementById('profileUserName').innerText = user.username;
    document.getElementById('profileUserId').innerText = user.userId;
    document.getElementById('profileVehicleId').innerText = user.vehicleId;
    document.getElementById('profileVehicleType').innerText = user.vehicleType;
    document.getElementById('profileGpsId').innerText = user.gpsId;
    document.getElementById('userProfile').style.display = 'block';
}

// Function to enable the Status tab
function enableTabs() {
    document.getElementById('statusTab').classList.remove('disabled');
}

// Function to fetch journey details from the backend
function fetchJourneyDetails(vehicleId) {
    fetch(`http://127.0.0.1:5000/journeys/${vehicleId}`)
        .then(response => response.json())
        .then(data => {
            journeys = data;
            populateJourneys(vehicleId);
        })
        .catch(error => console.error('Error fetching journey details:', error));
}

// Function to populate journey details
function populateJourneys(vehicleId) {
    const userJourneys = journeys.filter(journey => journey.vehicle_id === vehicleId);
    let totalDistance = 0;
    let totalFees = 0;

    for (let i = 0; i < userJourneys.length; i++) {
        document.getElementById('j' + (i + 1) + '-distance').innerText = userJourneys[i].distance + ' km';
        document.getElementById('j' + (i + 1) + '-fees').innerText = '$' + userJourneys[i].fees;
        totalDistance += parseFloat(userJourneys[i].distance);
        totalFees += parseFloat(userJourneys[i].fees);
    }

    document.getElementById('totalDistance').innerText = totalDistance + ' km';
    document.getElementById('totalToll').innerText = '$' + totalFees;
}

// Toggle between login and registration forms
document.getElementById('loginTab').addEventListener('click', function () {
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
document.getElementById('registerLink').addEventListener('click', function (event) {
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
document.getElementById('statusTab').addEventListener('click', function (event) {
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

// Function to send vehicle ID for prediction
function sendVehicleIdForPrediction(vehicleId) {
    axios.post('http://127.0.0.1:5000/predict', { vehicle_id: vehicleId })
        .then(response => {
            console.log('Prediction Response:', response.data);
            // Handle the prediction response if needed
        })
        .catch(error => {
            console.error('Error sending vehicle ID for prediction:', error);
        });
}

// Fetch data from backend on button click
document.getElementById('fetchDataBtn').addEventListener('click', function () {
    fetchLoginData(); // Fetch login data
    fetchJourneyData(); // Fetch journey data
});

// Handle login form submission
document.getElementById('loginFormElem').addEventListener('submit', handleLogin);
