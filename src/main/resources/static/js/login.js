document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const alertBox = document.getElementById('alertBox');
    const params = new URLSearchParams();
    params.append('username', document.getElementById('username').value);
    params.append('password', document.getElementById('password').value);

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers:{'Content-Type': 'application/x-www-form-urlencoded'},
            body: params.toString(),
            credentials:'include'
        });
        if (response.redirected) {
            window.location.href = response.url;
            return;
        }

        if (response.ok) {
            console.log("Login Success");
            window.location.href = '/index.html';
        } else {
            alertBox.classList.remove('hidden');
            alertBox.className = 'alert error';
            alertBox.classList.add('error');

            if (response.status === 401) {
                // Spring Security
                alertBox.textContent = 'Invalid username, password, or account is disabled.';
            } else if (response.status === 403) {
                alertBox.textContent = 'Access Denied.';
            } else {
                alertBox.textContent = 'Login failed. Please try again later.';
            }
        }
    } catch (err) {
        console.error('Login error', err);
        alertBox.classList.add('error');
        alertBox.textContent = 'Connection error. Please check your server.';
        alertBox.classList.remove('hidden');
    }
});