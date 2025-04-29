document.addEventListener('DOMContentLoaded', function() {
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('cardio-date').value = today;
    
    // Initialize user info
    checkAuthStatus();
    
    // Set up event listeners
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
    document.getElementById('cardio-form').addEventListener('submit', saveCardio);
});

// Function to check auth status and update UI
async function checkAuthStatus() {
    try {
        const response = await fetch('/api/user');
        const data = await response.json();
        
        if (data.success) {
            updateUserInfo(data.user);
        } else {
            // For development purposes, show mock data
            updateUserInfo({
                name: 'John Doe',
                email: 'john@example.com'
            });
        }
    } catch (error) {
        console.error('Error checking authentication status:', error);
        
        // For development purposes, show mock data
        updateUserInfo({
            name: 'John Doe',
            email: 'john@example.com'
        });
    }
}

// Function to update user information in the UI
function updateUserInfo(user) {
    const userNameElement = document.getElementById('user-name');
    
    if (user.name) {
        userNameElement.textContent = user.name;
    } else if (user.email) {
        userNameElement.textContent = user.email;
    }
}

// Function to handle logout
function handleLogout() {
    // For now, just redirect to login page
    window.location.href = '/';
}

// Function to save the cardio activity
async function saveCardio(e) {
    e.preventDefault();
    
    // Get form data
    const date = document.getElementById('cardio-date').value;
    const type = document.getElementById('cardio-type').value;
    const duration = parseInt(document.getElementById('cardio-duration').value);
    const distance = parseFloat(document.getElementById('cardio-distance').value) || 0;
    const calories = parseInt(document.getElementById('cardio-calories').value) || 0;
    const heartRate = parseInt(document.getElementById('cardio-heart-rate').value) || 0;
    const notes = document.getElementById('cardio-notes').value;
    
    // Create cardio object
    const cardio = {
        date,
        type,
        duration,
        distance,
        calories,
        heartRate,
        notes
    };
    
    console.log('Saving cardio activity:', cardio);
    
    try {
        // In a real app, you would send this to your server
        // const response = await fetch('/api/cardio', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(cardio)
        // });
        // const data = await response.json();
        
        // For now, just show success message
        alert('Cardio activity saved successfully!');
        
        // Reset form
        document.getElementById('cardio-type').value = '';
        document.getElementById('cardio-duration').value = '';
        document.getElementById('cardio-distance').value = '';
        document.getElementById('cardio-calories').value = '';
        document.getElementById('cardio-heart-rate').value = '';
        document.getElementById('cardio-notes').value = '';
        
    } catch (error) {
        console.error('Error saving cardio activity:', error);
        alert('Error saving cardio activity. Please try again.');
    }
}