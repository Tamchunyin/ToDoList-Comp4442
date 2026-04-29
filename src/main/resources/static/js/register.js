document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const alertBox = document.getElementById('alertBox');
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirm = document.getElementById('confirmPassword').value;


    if (password !== confirm) {
        alertBox.textContent = 'Password Not match';
        alertBox.className = 'alert error';
        alertBox.classList.remove('hidden');
        return;
    }
    if (!validateForm(username, password)) return;
    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username,
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
        alertBox.textContent = 'Server error';
        alertBox.className = 'alert error';
        alertBox.classList.remove('hidden');
    }
    function validateForm(username, password) {
        if (username.length < 4) {
            alert("Username must be at least 4 characters long.");
            return false;
        }
        const PasswordLim = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if(!PasswordLim.test(password)){
            alert("Password must be 8+ chars and include uppercase, lowercase, and a number.")
            return false;
        }else{
            return true;
        }
    }
});