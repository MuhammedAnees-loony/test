let users = []; // Variable to store parsed CSV data
let isLoggedIn = false; // Flag to track login status
let loggedInUser = null; // Variable to store the logged-in user's data

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
        return response.json();
    })
    .then(data => {
        console.log('Predictions made and files updated successfully:', data);
        // Handle successful response as needed
    })
    .catch(error => {
        console.error('Error making POST request to Flask API:', error);
        // Handle error response or network issues
    });
}

// Function to enable tabs after successful login
function enableTabs() {
    document.getElementById('statusTab').classList.remove('disabled');
    document.getElementById('aboutusTab').classList.remove('disabled');
    document.getElementById('statusTab').addEventListener('click', function() {
        if (isLoggedIn && loggedInUser) {
            fetchJourneyData(loggedInUser.vehicleId); // Use the stored user's vehicle ID
        }
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
    document.getElementById('keyFeatures').style.display = 'block';
    document.getElementById('statusContent').style.display = 'block';
    document.getElementById('gpsInterface').style.display = 'none';
}

// Function to show about us content
function showAboutusContent() {
    document.getElementById('keyFeatures').style.display = 'none';
    document.getElementById('statusContent').style.display = 'none';
    document.getElementById('gpsInterface').style.display = 'none';
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
