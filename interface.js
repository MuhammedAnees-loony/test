let isLoggedIn = false;
let users = [];
let journeys = [];

// Function to fetch user and journey data from backend
function fetchDataFromBackend() {
    const userCsvPath = 'http://127.0.0.1:5000/users';  // Backend endpoint to fetch user data
    const journeyCsvPath = 'http://127.0.0.1:5000/journeys';  // Backend endpoint to fetch journey data

    // Fetch user data
    fetch(userCsvPath)
        .then(response => response.json())
        .then(data => {
            users = JSON.parse(data);
        })
        .catch(error => console.error('Error fetching user data:', error));

    // Fetch journey data
    fetch(journeyCsvPath)
        .then(response => response.json())
        .then(data => {
            journeys = JSON.parse(data);
        })
        .catch(error => console.error('Error fetching journey data:', error));
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
        populateJourneys(user.vehicleId);
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

// Function to populate journey details
function populateJourneys(vehicleId) {
    const userJourneys = journeys.filter(journey => journey.vehicle_id === vehicleId);
    let totalDistance = 0;
    let totalFees = 0;

    for (let i = 0; i < userJourneys.length; i++) {
        document.getElementById('j' + (i+1) + '-distance').innerText = userJourneys[i].distance + ' km';
        document.getElementById('j' + (i+1) + '-fees').innerText = '$' + userJourneys[i].fees;
        totalDistance += userJourneys[i].distance;
        totalFees += userJourneys[i].fees;
    }

    document.getElementById('totalDistance').innerText = totalDistance + ' km';
    document.getElementById('totalToll').innerText = '$' + totalFees;
}

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
document.getElementById('fetchDataBtn').addEventListener('click', function() {
    fetchDataFromBackend();
});

// Handle login form submission
document.getElementById('loginFormElem').addEventListener('submit', handleLogin);
