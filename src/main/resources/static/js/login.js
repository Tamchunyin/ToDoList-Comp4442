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
            console.log("Login Success")
            window.location.href = '/index.html';
        } else {
            alertBox.textContent = 'Wrong Username or Password';
            alertBox.className = 'alert error';
            alertBox.classList.remove('hidden');
        }
    } catch (err) {
        console.error('Login error', err);
    }
});