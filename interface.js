let isLoggedIn = false;
        let users = [];

        // Function to load users from CSV
        async function loadUsers() {
            const response = await fetch('user_data_with_15_examples.csv');
            const data = await response.text();
            parseCSV(data);
        }

        // Function to parse CSV data
        function parseCSV(data) {
            const lines = data.split('\n');
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (line) {
                    const [username, password, userId, vehicleId, vehicleType, gpsId] = line.split(',');
                    users.push({
                        username: username.trim(),
                        password: password.trim(),
                        userId: userId.trim(),
                        vehicleId: vehicleId.trim(),
                        vehicleType: vehicleType.trim(),
                        gpsId: gpsId.trim()
                    });
                }
            }
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
                populateJourneys();
            } else {
                alert('Invalid username or password');
            }
        }

        // Function to show user profile
        function showUserProfile(user) {
            document.getElementById('profileUserId').innerText = user.userId;
            document.getElementById('profileUserName').innerText = user.username;
            document.getElementById('profileVehicleId').innerText = user.vehicleId;
            document.getElementById('profileVehicleType').innerText = user.vehicleType;
            document.getElementById('profileGpsId').innerText = user.gpsId;
            document.getElementById('userProfile').style.display = 'block';
        }

        // Function to enable tabs
        function enableTabs() {
            document.getElementById('statusTab').classList.remove('disabled');
            document.getElementById('aboutusTab').classList.remove('disabled');
        }

        // Function to populate journey details
        function populateJourneys() {
            const journeys = [
                { distance: 100, fees: 10 },
                { distance: 200, fees: 20 },
                { distance: 150, fees: 15 },
                { distance: 250, fees: 25 },
                { distance: 300, fees: 30 }
            ];

            for (let i = 0; i < journeys.length; i++) {
                document.getElementById('j' + (i+1) + '-distance').innerText = journeys[i].distance + ' km';
                document.getElementById('j' + (i+1) + '-fees').innerText = '$' + journeys[i].fees;
            }
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

        // Load users on page load
        document.addEventListener('DOMContentLoaded', loadUsers);
