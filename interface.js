
// Variable to store parsed CSV data
let users = [];
// Flag to track login status
let isLoggedIn = false;
// Variable to store the logged-in user's data
let loggedInUser = null;
// Variable to store fetched journey data
let journeyData = [];
let distances = [];
let fees = [];

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
// Wait for the document to load
document.addEventListener('DOMContentLoaded', function() {
    // Find the Pay button element
    var payButton = document.getElementById('payButton');
    
    // Add click event listener to the Pay button
    payButton.addEventListener('click', function() {
        // Here you can implement the payment logic
        // For example, you can redirect to a payment gateway or perform an AJAX request
        
        // Replace this with your payment handling logic
        alert('Redirecting to payment gateway...');
        
        // For demonstration purposes, let's simulate a payment success after 2 seconds
        setTimeout(function() {
            alert('Payment successful!');
            // You can add further actions here, such as updating UI or navigating to another page
        }, 2000); // 2000 milliseconds = 2 seconds
    });
});

// Function to fetch and parse CSV data
async function fetchUserAdminData() {
    const response = await fetch('login.csv');
    const data = await response.text();

    // Parse CSV data
    const userData = parseCSV(data);

    // Populate user table with parsed data
    populateUserAdminTable(userData);
}

// Function to parse CSV data
function parseAdminCSV(csv) {
    // Split CSV into rows
    const rows = csv.split('\n');

    // Extract headers (first row)
    const headers = rows[0].split(',');

    // Initialize array to store parsed data
    const userData = [];

    // Loop through rows (starting from second row)
    for (let i = 1; i < rows.length; i++) {
        // Split row into columns
        const columns = rows[i].split(',');

        // Create object with userId and vehicleId
        const user = {
            userId: columns[0].trim(),     // Assuming userId is the first column
            vehicleId: columns[1].trim()   // Assuming vehicleId is the second column
        };

        // Push object into userData array
        userData.push(user);
    }

    return userData;
}

// Function to populate the user table
function populateUserAdminTable(userData) {
    const tbody = document.querySelector('#userTable tbody');

    // Clear existing rows
    tbody.innerHTML = '';

    // Populate table with data
    userData.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.userId}</td>
            <td>${user.vehicleId}</td>
        `;
        tbody.appendChild(row);
    });
    fetchUserAdminData();
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
       if (user.isAdmin === 'true') {
            showAdminInterface();
        } else {
            enableTabs();
            showUserProfile(user);
            fetchJourneyData(user.vehicleId);
        }
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
            let jsonObject = JSON.parse(data);
           
// Loop through the JSON object and extract values
            jsonObject.forEach(item => {
                distances.push(item.distance);
                fees.push(item.fee);
            });

// Now you have two arrays: distances and fees
            console.log("Distances:", distances);
            console.log("Fees:", fees);
    })
    .catch(error => {
        console.error('Error making POST request to Flask API:', error);
    });
}
// Function to show admin interface
function showAdminInterface() {
    document.getElementById('adminInterface').style.display = 'block';
    const userTable = document.getElementById('userTable');
    userTable.innerHTML = '';

    // Show the first 15 users
    for (let i = 0; i < Math.min(users.length, 15); i++) {
        const user = users[i];
        const row = userTable.insertRow();
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        cell1.textContent = user.userid;
        cell2.textContent = user.vehicleId;
    }
}
// Function to handle admin search for journey details
function handleAdminSearch(event) {
    event.preventDefault();
    const vehicleId = document.getElementById('searchVehicleId').value;
    const user = users.find(user => user.vehicleId === vehicleId);

    if (user) {
        fetchJourneyData(vehicleId);
        displayJourneyData();
    } else {
        alert('Vehicle ID not found');
    }
}
// Function to enable status and about us tabs
function enableTabs() {
    document.getElementById('statusTab').classList.remove('disabled');
    document.getElementById('aboutusTab').classList.remove('disabled');
   const homeTab = document.getElementById('homeTab');
    const statusTab = document.getElementById('statusTab');
    const aboutusTab = document.getElementById('aboutusTab');
    
    // Login/Register tab
    const loginTab = document.getElementById('loginTab');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

     homeTab.addEventListener('click', function () {
        showIntroduction();
        showGpsTollSystem();
        hideStatusContent();
        hideAboutusContent();
    });

    statusTab.addEventListener('click', function () {
        if (isLoggedIn) {
            hideIntroduction();
            hideGpsTollSystem();
            displayJourneyData();
            showStatusContent();
            hideAboutusContent();
        } else {
            alert('Please log in to view status.');
        }
    });

    aboutusTab.addEventListener('click', function () {
        hideIntroduction();
        hideGpsTollSystem();
        hideStatusContent();
        showAboutusContent();
    });
    
    loginTab.addEventListener('click', function() {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        document.getElementById('userProfile').style.display = 'none';
        document.getElementById('statusContent').style.display = 'none';
        hideStatusContent();
        hideAboutusContent();
        showIntroduction();
        showGpsTollSystem();
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
});
document.addEventListener('DOMContentLoaded', function () {
    const plotButton = document.getElementById('plotButton');
    const mapContainer = document.getElementById('mapContainer');

    plotButton.addEventListener('click', function () {
        fetch('http://127.0.0.1:5000/plot_map', { // Use apiUrl instead of '/plot_map'
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
          return response.json();
        })
        .then(data => {
        var mapHtml = data.map_html;

        // Create an iframe element to load the map HTML
        var iframe = document.createElement('iframe');
        iframe.style.width = '100%';
        iframe.style.height = '400px';
        iframe.style.border = 'none';
        iframe.srcdoc = mapHtml; // Embed the map HTML directly into the iframe

        mapContainer.appendChild(iframe); // Append the iframe to mapContainer
    })
        .catch(error => {
            console.error('Error fetching image:', error);
            // Display user-friendly error message
            alert('There was an error fetching the image. Please try again later.');
        });
    });
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

// Function to display journey data
function displayJourneyData() {
    // Check if fees and distances are arrays and not empty
    if (Array.isArray(fees) && fees.length > 0 && Array.isArray(distances) && distances.length > 0) {
        // Update the table rows with journey details
        distances.forEach((distance, index) => {
            const fee = fees[index];
            const journeyNumber = index + 1;

            // Update table cells with journey data
            const distanceCell = document.getElementById(`j${journeyNumber}-distance`);
            const feeCell = document.getElementById(`j${journeyNumber}-fees`);

            if (distanceCell && feeCell) {
                distanceCell.textContent = `${distance.toFixed(2)} m`;
                feeCell.textContent = `Rs${fee.toFixed(2)}`;
            }
        });

        // Log the distances and fees for debugging
        console.log("Distances:", distances);
        console.log("Fees:", fees);

        // Update the total distance and total toll
        const totalDistance = distances.reduce((acc, curr) => acc + parseFloat(curr), 0).toFixed(2);
        const totalToll = fees.reduce((acc, curr) => acc + parseFloat(curr), 0).toFixed(2);

        document.getElementById('totalDistance').textContent = `${totalDistance} m`;
        document.getElementById('totalToll').textContent = `Rs${totalToll}`;

    } else {
        console.error('Fees or distances array is not valid or is empty.');
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
// Function to show the status content
function showStatusContent() {
    document.getElementById('statusContent').style.display = 'block';
}
// Function to hide the status content
function hideStatusContent() {
    document.getElementById('statusContent').style.display = 'none';
}
function showAboutusContent() {
    document.getElementById('aboutusContent').style.display = 'block';
}
// Function to hide the about us content
function hideAboutusContent() {
    document.getElementById('aboutusContent').style.display = 'none';
}
function showIntroduction() {
    document.getElementById('introduction').style.display = 'block';
}

function hideIntroduction() {
    document.getElementById('introduction').style.display = 'none';
}

function showGpsTollSystem() {
    document.getElementById('gpsTollSystem').style.display = 'block';
}

function hideGpsTollSystem() {
    document.getElementById('gpsTollSystem').style.display = 'none';
}
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
