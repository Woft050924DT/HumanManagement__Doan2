// Demo credentials
const validCredentials = {
    username: 'admin',
    password: 'admin123'
};

// Login form handler
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');
    
    if (username === validCredentials.username && password === validCredentials.password) {
        // Hide login page
        document.getElementById('loginPage').classList.add('hidden');
        // Show dashboard
        document.getElementById('dashboardPage').classList.add('active');
        // Update welcome message
        document.getElementById('userWelcome').textContent = `Xin chào, ${username}`;
    } else {
        errorMessage.style.display = 'block';
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 3000);
    }
});

// Logout function
function logout() {
    document.getElementById('loginPage').classList.remove('hidden');
    document.getElementById('dashboardPage').classList.remove('active');
    document.getElementById('loginForm').reset();
}
