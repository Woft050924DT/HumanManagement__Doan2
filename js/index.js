// Demo credentials - đã được định nghĩa trong data/mockData.js

// Login form handler
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');
    
    // Kiểm tra đăng nhập admin
    if (username === validCredentials.admin.username && password === validCredentials.admin.password) {
        // Lưu thông tin user vào localStorage
        localStorage.setItem('currentUser', JSON.stringify({
            username: username,
            role: validCredentials.admin.role
        }));
        
        // Hide login page
        document.getElementById('loginPage').classList.add('hidden');
        // Show dashboard
        document.getElementById('dashboardPage').classList.add('active');
        // Update welcome message
        document.getElementById('userWelcome').textContent = `Xin chào, ${username}`;
        // Show chat widget
        const chatWidget = document.getElementById('chatWidget');
        if (chatWidget) {
            chatWidget.style.display = 'flex';
            chatWidget.classList.remove('collapsed');
        }
    } 
    // Kiểm tra đăng nhập giám đốc
    else if (username === validCredentials.giamdoc.username && password === validCredentials.giamdoc.password) {
        // Lưu thông tin user vào localStorage
        localStorage.setItem('currentUser', JSON.stringify({
            username: username,
            role: validCredentials.giamdoc.role
        }));
        
        // Chuyển hướng đến màn hình giám đốc
        window.location.href = 'giamdoc.html';
    } 
    else {
        errorMessage.style.display = 'block';
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 3000);
    }
});

// Logout function
function logout() {
    // Xóa thông tin user khỏi localStorage
    localStorage.removeItem('currentUser');
    
    document.getElementById('loginPage').classList.remove('hidden');
    document.getElementById('dashboardPage').classList.remove('active');
    document.getElementById('loginForm').reset();
    // Hide chat widget
    const chatWidget = document.getElementById('chatWidget');
    if (chatWidget) {
        chatWidget.style.display = 'none';
    }
}

// Hàm tự động điền thông tin đăng nhập từ demo
function fillDemoCredentials(accountType) {
    const credentials = validCredentials[accountType];
    if (!credentials) return;
    
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    
    // Điền thông tin
    usernameInput.value = credentials.username;
    passwordInput.value = credentials.password;
    
    // Focus vào password để user có thể nhấn Enter ngay
    passwordInput.focus();
    
    // Thêm hiệu ứng visual
    usernameInput.style.transition = 'all 0.3s';
    passwordInput.style.transition = 'all 0.3s';
    usernameInput.style.background = '#e8f5e9';
    passwordInput.style.background = '#e8f5e9';
    
    setTimeout(() => {
        usernameInput.style.background = '';
        passwordInput.style.background = '';
    }, 1000);
}

// Kiểm tra nếu đã đăng nhập, tự động chuyển hướng
window.addEventListener('DOMContentLoaded', function() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        const user = JSON.parse(currentUser);
        if (user.role === 'giamdoc') {
            window.location.href = 'giamdoc.html';
        } else if (user.role === 'admin') {
            document.getElementById('loginPage').classList.add('hidden');
            document.getElementById('dashboardPage').classList.add('active');
            document.getElementById('userWelcome').textContent = `Xin chào, ${user.username}`;
            // Show chat widget
            const chatWidget = document.getElementById('chatWidget');
            if (chatWidget) {
                chatWidget.style.display = 'flex';
                chatWidget.classList.remove('collapsed');
            }
        }
    }
});
