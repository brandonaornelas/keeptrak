document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    checkAuthStatus();

    // Set up event listeners
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
    
    const workoutCard = document.getElementById('workout-card');
    const cardioCard = document.getElementById('cardio-card');
    
    workoutCard.querySelector('.btn-track').addEventListener('click', function() {
        window.location.href = '/workout-tracker.html';
    });
    
    cardioCard.querySelector('.btn-track').addEventListener('click', function() {
        window.location.href = '/cardio-tracker.html';
    });
});

// Function to check if user is logged in and fetch user data
async function checkAuthStatus() {
    try {
        const response = await fetch('/api/user');
        const data = await response.json();
        
        if (data.success) {
            // User is logged in, update UI
            updateUserInfo(data.user);
        } else {
            // User is not logged in, redirect to login page
            // window.location.href = '/';
            
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
    const welcomeNameElement = document.getElementById('welcome-name');
    
    if (user.name) {
        userNameElement.textContent = user.name;
        welcomeNameElement.textContent = user.name.split(' ')[0]; // Just use first name in welcome message
    } else if (user.email) {
        // If name is not available, use email
        userNameElement.textContent = user.email;
        welcomeNameElement.textContent = user.email.split('@')[0]; // Use part before @ as name
    }
}

// Function to handle logout
async function handleLogout() {
    try {
        const response = await fetch('/api/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Redirect to login page
            window.location.href = '/';
        } else {
            alert('Logout failed. Please try again.');
        }
    } catch (error) {
        console.error('Error during logout:', error);
        
        // For development, just redirect anyway
        window.location.href = '/';
    }
}

// Function to fetch recent activities (to be implemented)
async function fetchRecentActivities() {
    try {
        const response = await fetch('/api/activities/recent');
        const data = await response.json();
        
        if (data.success && data.activities.length > 0) {
            renderActivities(data.activities);
        }
    } catch (error) {
        console.error('Error fetching recent activities:', error);
    }
}

// Function to render activities in the UI (to be implemented)
function renderActivities(activities) {
    const activityContainer = document.querySelector('.recent-activity');
    const emptyState = document.querySelector('.activity-empty');
    
    if (activities.length > 0) {
        // Remove empty state
        if (emptyState) {
            emptyState.remove();
        }
        
        // Create activity items
        const activityList = document.createElement('div');
        activityList.className = 'activity-list';
        
        activities.forEach(activity => {
            // Create and append activity items
            // This will be implemented when you have activity data
        });
        
        activityContainer.appendChild(activityList);
    }
}