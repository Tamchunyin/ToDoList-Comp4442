document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const alertBox = document.getElementById('alertBox');
    const password = document.getElementById('password').value;
    const confirm = document.getElementById('confirmPassword').value;

    if (password !== confirm) {
        alertBox.textContent = 'Password Not match';
        alertBox.className = 'alert error';
        alertBox.classList.remove('hidden');
        return;
    }

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: document.getElementById('username').value,
                password: password
            })
        });

        if (response.ok) {
            alertBox.textContent = 'Success';
            alertBox.className = 'alert success';
            alertBox.classList.remove('hidden');
            setTimeout(() => window.location.href = 'login.html', 1500);
        } else {
            alertBox.textContent = 'User exist';
            alertBox.className = 'alert error';
            alertBox.classList.remove('hidden');
        }
    } catch (err) {
        alertBox.textContent = '伺服器連線失敗';
        alertBox.className = 'alert error';
        alertBox.classList.remove('hidden');
    }
});