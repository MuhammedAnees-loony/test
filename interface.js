// Variable to store parsed CSV data
let users = []; 
// Flag to track login status
let isLoggedIn = false; 
// Variable to store the logged-in user's data
let loggedInUser = null; 

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
        loggedInUser = user; // Store the logged-in user's data
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('registerForm').style.display = 'none';
        enableTabs();
        showUserProfile(user); // Display user profile details
        fetchJourneyData(user.vehicleId); // Fetch journey data after successful login
    } else {
        alert('Invalid username or password');
    }
}

// Function to fetch journey data
function fetchJourneyData(vehicleId) {
    const apiUrl = 'http://127.0.0.1:5000/predict'; // Replace with your Flask API URL

    // Prepare the request body
    const requestBody = {
        vehicle_id: vehicleId
    };

    // Send POST request to Flask API
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        // Assuming the backend returns JSON data
        return response.json();
    })
    .then(data => {
        console.log('Journey data fetched successfully:', data);
        displayJourneyData(data);
    })
    .catch(error => {
        console.error('Error making POST request to Flask API:', error);
    });
}

// Function to enable tabs after successful login
function enableTabs() {
    document.getElementById('statusTab').classList.remove('disabled');
    document.getElementById('aboutusTab').classList.remove('disabled');
    document.getElementById('statusTab').addEventListener('click', function() {
        showStatusContent();
    });
    document.getElementById('aboutusTab').addEventListener('click', showAboutusContent);
}

// Function to show user profile after successful login
function showUserProfile(user) {
    document.getElementById('profileUserId').textContent = user.userid;
    document.getElementById('profileUserName').textContent = user.username;
    document.getElementById('profileVehicleId').textContent = user.vehicleId;
    document.getElementById('profileVehicleType').textContent = user.vehicleType;
    document.getElementById('profileGpsId').textContent = user.gpsId;
    document.getElementById('userProfile').style.display = 'block';
}

// Function to show status content
function showStatusContent() {
    document.getElementById('keyFeatures').style.display = 'none';
    document.getElementById('statusContent').style.display = 'block';
}

// Function to show about us content
function showAboutusContent() {
    document.getElementById('keyFeatures').style.display = 'none';
    document.getElementById('statusContent').style.display = 'none';
}

// Function to display journey data
function displayJourneyData(data) {
    try {
        let journeyData = [];

        // Check if data is an array; if not, attempt to parse it as JSON
        if (Array.isArray(data)) {
            journeyData = data;
        } else {
            journeyData = JSON.parse(data);
        }

        // Clear any existing rows in the table body
        const journeyTableBody = document.getElementById('journeyTableBody');
        journeyTableBody.innerHTML = '';

        // Add new rows to the table
        journeyData.forEach((journey, index) => {
            const row = document.createElement('tr');
            const journeyCell = document.createElement('td');
            journeyCell.textContent = `Journey ${index + 1}`;
            row.appendChild(journeyCell);

            // Add distance and fee cells
            const distanceCell = document.createElement('td');
            distanceCell.textContent = journey.distance.toFixed(2); // Display distance rounded to 2 decimal places
            row.appendChild(distanceCell);

            const feeCell = document.createElement('td');
            feeCell.textContent = journey.fee.toFixed(2); // Display fee rounded to 2 decimal places
            row.appendChild(feeCell);

            journeyTableBody.appendChild(row);
        });

        // Optional: Update total distance and total toll if needed
        updateTotalDistanceAndToll(journeyData);
    } catch (error) {
        console.error('Error parsing journey data:', error);
    }
}

// Event listener for login form submission
document.getElementById('loginFormElem').addEventListener('submit', handleLogin);

// Event listener for register form submission (if needed)
document.getElementById('registerFormElem').addEventListener('submit', function(event) {
    event.preventDefault();
    // Handle registration logic if required
});

// Fetch user data on page load
fetchUserData();
