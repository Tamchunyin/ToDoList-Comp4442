document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const alertBox = document.getElementById('alertBox');
    const data = {
        username: document.getElementById('username').value,
        password: document.getElementById('password').value
    };

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            window.location.href = 'index.html';
        } else {
            alertBox.textContent = 'Wrong Username or Password';
            alertBox.className = 'alert error';
            alertBox.classList.remove('hidden');
        }
    } catch (err) {
        console.error('Login error', err);
    }
});