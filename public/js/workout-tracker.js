document.addEventListener('DOMContentLoaded', function() {
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('workout-date').value = today;
    
    // Initialize user info
    checkAuthStatus();
    
    // Set up event listeners
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
    document.getElementById('add-exercise').addEventListener('click', addExercise);
    document.getElementById('workout-form').addEventListener('submit', saveWorkout);
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

// Counter for exercise IDs
let exerciseCounter = 2;

// Function to add a new exercise
function addExercise() {
    const exercisesList = document.getElementById('exercises-list');
    
    const exerciseItem = document.createElement('div');
    exerciseItem.className = 'exercise-item';
    exerciseItem.innerHTML = `
        <div class="exercise-row">
            <div class="exercise-field">
                <label for="exercise-${exerciseCounter}-name">Exercise</label>
                <input type="text" id="exercise-${exerciseCounter}-name" placeholder="e.g. Bench Press" required>
            </div>
            <button type="button" class="btn-remove" onclick="removeExercise(this)">Remove</button>
        </div>
        <div class="exercise-row">
            <div class="exercise-field">
                <label for="exercise-${exerciseCounter}-sets">Sets</label>
                <input type="number" id="exercise-${exerciseCounter}-sets" min="1" value="3" required>
            </div>
            <div class="exercise-field">
                <label for="exercise-${exerciseCounter}-reps">Reps</label>
                <input type="number" id="exercise-${exerciseCounter}-reps" min="1" value="10" required>
            </div>
            <div class="exercise-field">
                <label for="exercise-${exerciseCounter}-weight">Weight (lbs)</label>
                <input type="number" id="exercise-${exerciseCounter}-weight" min="0" step="2.5" placeholder="Optional">
            </div>
        </div>
    `;
    
    exercisesList.appendChild(exerciseItem);
    exerciseCounter++;
}

// Function to remove an exercise
function removeExercise(button) {
    const exerciseItem = button.closest('.exercise-item');
    exerciseItem.remove();
}

// Function to save the workout
async function saveWorkout(e) {
    e.preventDefault();
    
    // Get form data
    const date = document.getElementById('workout-date').value;
    const type = document.getElementById('workout-type').value;
    const notes = document.getElementById('workout-notes').value;
    
    // Get exercises
    const exercises = [];
    const exerciseItems = document.querySelectorAll('.exercise-item');
    
    exerciseItems.forEach((item, index) => {
        const nameId = `exercise-${index + 1}-name`;
        const setsId = `exercise-${index + 1}-sets`;
        const repsId = `exercise-${index + 1}-reps`;
        const weightId = `exercise-${index + 1}-weight`;
        
        // Use querySelector to find elements within this specific exercise item
        const nameInput = item.querySelector(`input[id="${nameId}"], input[id*="-name"]`);
        const setsInput = item.querySelector(`input[id="${setsId}"], input[id*="-sets"]`);
        const repsInput = item.querySelector(`input[id="${repsId}"], input[id*="-reps"]`);
        const weightInput = item.querySelector(`input[id="${weightId}"], input[id*="-weight"]`);
        
        if (nameInput && setsInput && repsInput) {  input[id*="-weight"]`);
        
        if (nameInput && setsInput && repsInput) {
            exercises.push({
                name: nameInput.value,
                sets: parseInt(setsInput.value),
                reps: parseInt(repsInput.value),
                weight: weightInput ? parseFloat(weightInput.value) || 0 : 0
            });
        }
    });
    
    // Create workout object
    const workout = {
        date,
        type,
        notes,
        exercises
    };
    
    console.log('Saving workout:', workout);
    
    try {
        // In a real app, you would send this to your server
        // const response = await fetch('/api/workouts', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(workout)
        // });
        // const data = await response.json();
        
        // For now, just show success message
        alert('Workout saved successfully!');
        
        // Reset form
        document.getElementById('workout-notes').value = '';
        document.getElementById('workout-type').value = '';
        
        // Reset exercises (keep only the first one)
        const exercisesList = document.getElementById('exercises-list');
        const firstExercise = exercisesList.querySelector('.exercise-item');
        
        exercisesList.innerHTML = '';
        exercisesList.appendChild(firstExercise);
        
        // Reset first exercise fields
        firstExercise.querySelector('input[id*="-name"]').value = '';
        firstExercise.querySelector('input[id*="-sets"]').value = '3';
        firstExercise.querySelector('input[id*="-reps"]').value = '10';
        const weightInput = firstExercise.querySelector('input[id*="-weight"]');
        if (weightInput) weightInput.value = '';
        
        // Reset counter
        exerciseCounter = 2;
        
    } catch (error) {
        console.error('Error saving workout:', error);
        alert('Error saving workout. Please try again.');
    }
}