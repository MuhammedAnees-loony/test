let users = [];

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
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('registerForm').style.display = 'none';
        enableTabs();
        showUserProfile(user);
        fetchJourneyData(user.vehicleId);  // Fetch journeys after successful login
    } else {
        alert('Invalid username or password');
    }
}

// Function to handle registration
function handleRegistration(event) {
    event.preventDefault();
    const newUsername = document.getElementById('newUsername').value;
    const newPassword = document.getElementById('newPassword').value;

    // Check if the username already exists
    const existingUser = users.find(user => user.username === newUsername);
    if (existingUser) {
        alert('Username already exists');
    } else {
        users.push({ username: newUsername, password: newPassword });
        alert('Registration successful');
        document.getElementById('registerForm').style.display = 'none';
        document.getElementById('loginForm').style.display = 'block';
    }
}

function enableTabs() {
    document.getElementById('statusTab').classList.remove('disabled');
    document.getElementById('aboutusTab').classList.remove('disabled');
}

function showUserProfile(user) {
    document.getElementById('profileUserId').textContent = user.user_id;
    document.getElementById('profileUserName').textContent = user.username;
    document.getElementById('profileVehicleId').textContent = user.vehicle_id;
    document.getElementById('profileVehicleType').textContent = user.vehicle_type;
    document.getElementById('profileGpsId').textContent = user.gps_id;
    document.getElementById('userProfile').style.display = 'block';
}

// Fetch user data when the script loads
fetchUserData();

// Attach event listeners
document.getElementById('loginFormElem').addEventListener('submit', handleLogin);
document.getElementById('registerFormElem').addEventListener('submit', handleRegistration);
document.getElementById('registerLink').addEventListener('click', function() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
});
