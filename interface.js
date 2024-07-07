
// Variable to store parsed CSV data
let users = [];
// Flag to track login status
let isLoggedIn = false;
// Variable to store the logged-in user's data
let loggedInUser = null;
// Variable to store fetched journey data
let journeyData = [];

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
        return response.json(); // Expecting JSON response
    })
    .then(data => {
        console.log('Journey data fetched successfully:', data);

        // Ensure data is an array before storing or displaying
        if (Array.isArray(data)) {
            
        // Parse the JSON string to convert it to a JavaScript object
            let jsonObject = JSON.parse(data);

// Initialize arrays to store distances and fees
            let distances = [];
            let fees = [];

// Loop through the JSON object and extract values
            jsonObject.forEach(item => {
                distances.push(item.distance);
                fees.push(item.fee);
            });

// Now you have two arrays: distances and fees
            console.log("Distances:", distances);
            console.log("Fees:", fees);
            journeyData = data; // Store journey data for later use
            showStatusContent(); // Display journey data when status tab is clicked
        } else {
            console.error('Journey data format is not as expected:', data);
        }
    })
    .catch(error => {
        console.error('Error making POST request to Flask API:', error);
    });
}

// Function to enable status and about us tabs
function enableTabs() {
    document.getElementById('statusTab').classList.remove('disabled');
    document.getElementById('aboutusTab').classList.remove('disabled');

    // Event listeners for tabs
    document.getElementById('statusTab').addEventListener('click', showStatusContent);
    document.getElementById('aboutusTab').addEventListener('click', showAboutusContent);
    // Login/Register tab
    const loginTab = document.getElementById('loginTab');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    loginTab.addEventListener('click', function() {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        document.getElementById('userProfile').style.display = 'none';
        document.getElementById('statusContent').style.display = 'none';
    });
    
    // Registration form link
    const registerLink = document.getElementById('registerLink');
    registerLink.addEventListener('click', function(event) {
        event.preventDefault();
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        document.getElementById('userProfile').style.display = 'none';
        document.getElementById('statusContent').style.display = 'none';
    });
    
    // Default state on load
    if (isLoggedIn) {
        loginForm.style.display = 'none';
        registerForm.style.display = 'none';
    } else {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    }
}

// Event listener for login form submission
document.getElementById('loginFormElem').addEventListener('submit', handleLogin);

// Event listener for register form submission
document.getElementById('registerFormElem').addEventListener('submit', function(event) {
    event.preventDefault();
    const password = document.getElementById('newPassword').value;
    if (!validatePassword(password)) {
        alert('Password must be at least 8 characters long and contain at least one number, one symbol, and one uppercase letter.');
        return;
    }
    // Handle registration logic if required
});

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
    document.getElementById('statusContent').style.display = 'block';
    displayJourneyData(); // Display journey data in the table
}

// Function to show about us content
function showAboutusContent() {
    document.getElementById('statusContent').style.display = 'none';
}

// Function to display journey data
// Function to display journey data
function displayJourneyData() {
    // Check if journeyData is an array and not empty
    if (Array.isArray(journeyData) && journeyData.length > 0) {
        // Separate arrays for distances and fees
        const distances = journeyData.map(journey => journey.distance.toFixed(2)); // Array of distances with two decimal places
        const fees = journeyData.map(journey => journey.fee.toFixed(2)); // Array of fees with two decimal places
        
        // Example to print out each distance and fee
        distances.forEach((distance, index) => {
            console.log(`Journey ${index + 1}: Distance - ${distance} km, Fee - $${fees[index]}`);
        });

        // Now you can proceed to display distances and fees on the frontend as needed
    } else {
        console.error('Journey data is not an array or is empty:', journeyData);
    }
}


// Event listener for login form submission
document.getElementById('loginFormElem').addEventListener('submit', handleLogin);

// Event listener for register form submission
document.getElementById('registerFormElem').addEventListener('submit', function(event) {
    event.preventDefault();
    const password = document.getElementById('newPassword').value;
    if (!validatePassword(password)) {
        alert('Password must be at least 8 characters long and contain at least one number, one symbol, and one uppercase letter.');
        return;
    }
    // Handle registration logic if required
});

// Function to validate password based on the given criteria
function validatePassword(password) {
    const minLength = 8;
    const hasNumber = /\d/;
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/;
    const hasUpperCase = /[A-Z]/;

    return password.length >= minLength && hasNumber.test(password) && hasSymbol.test(password) && hasUpperCase.test(password);
}

// Event listener for registration link click
document.getElementById('registerLink').addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
});

// Fetch user data on page load
fetchUserData();
enableTabs();
