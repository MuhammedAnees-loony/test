document.getElementById('loginFormElem').addEventListener('submit', async function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    const result = await response.json();
    if (result.success) {
        alert('Login successful');
        // Handle successful login, e.g., show user profile
    } else {
        alert(result.error);
    }
});

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
