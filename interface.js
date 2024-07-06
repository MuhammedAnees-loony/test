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
        showUserProfile(user); // Display user profile details
        fetchJourneyData(user.vehicleId);  // Fetch journeys after successful login
    } else {
        alert('Invalid username or password');
    }
}

// Function to fetch journey data after successful login
function fetchJourneyData(vehicleId) {
    const apiUrl = 'http://localhost:5000/predict'; // Replace with your Flask API URL

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
        // Handle click on status tab (optionally call fetchJourneyData() here if needed)
        fetchJourneyData(user.vehicleId); // Replace with actual user object or data structure
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
