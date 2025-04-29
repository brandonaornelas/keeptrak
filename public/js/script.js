document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const tabs = document.querySelectorAll('.tab');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');

            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            if (tabName === 'login') {
                loginForm.classList.add('active-form');
                signupForm.classList.remove('active-form');
            } else if (tabName === 'signup') {
                signupForm.classList.add('active-form');
                loginForm.classList.remove('active-form');
            }
        });
    });

    // Login form submission
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const formMessage = document.getElementById('form-message');
    
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
    
            const data = await response.json();
    
            if (data.success) {
                formMessage.textContent = '✅ Login successful! Redirecting...';
                formMessage.style.color = 'green';
                loginForm.reset();
    
                // Redirect to dashboard after short delay
                setTimeout(() => {
                    window.location.href = '/dashboard.html';
                }, 1000); // 1 second delay to show success message
            } else {
                formMessage.textContent = `❌ ${data.message}`;
                formMessage.style.color = 'red';
            }
        } catch (error) {
            console.error('Login error:', error);
            formMessage.textContent = '❌ Error logging in. Please try again.';
            formMessage.style.color = 'red';
        }
    });

    // Signup form submission
    signupForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm').value;
        const formMessage = document.getElementById('form-message');
    
        if (password !== confirmPassword) {
            formMessage.textContent = '❌ Passwords do not match!';
            formMessage.style.color = 'red';
            return;
        }
    
        try {
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });
    
            const data = await response.json();
    
            if (data.success) {
                formMessage.textContent = '✅ Account created successfully! Please log in.';
                formMessage.style.color = 'green';
                signupForm.reset();
                document.querySelector('.tab[data-tab="login"]').click();
            } else {
                formMessage.textContent = `❌ ${data.message}`;
                formMessage.style.color = 'red';
            }
        } catch (error) {
            console.error('Signup error:', error);
            formMessage.textContent = '❌ Error signing up. Please try again.';
            formMessage.style.color = 'red';
        }
    });
});
