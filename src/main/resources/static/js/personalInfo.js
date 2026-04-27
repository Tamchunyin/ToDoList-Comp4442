document.getElementById('updateForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const alertBox = document.getElementById('alertBox');
    const newUsername = document.getElementById('newUsername').value;
    const newPassword = document.getElementById('newPassword').value;

    try {
        const response = await fetch('/api/user/update', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: newUsername,
                password: newPassword
            })
        });

        alertBox.classList.remove('hidden');
        if (response.ok) {
            alertBox.className = 'alert success';
            alertBox.textContent = 'Profile updated successfully! Please re-login if username changed.';
            // 如果改了用戶名，建議導向登入頁
            if (newUsername) setTimeout(() => window.location.href = '/login.html', 2000);
        } else {
            alertBox.className = 'alert error';
            const msg = await response.text();
            alertBox.textContent = 'Update failed: ' + msg;
        }
    } catch (err) {
        console.error(err);
        alertBox.classList.remove('hidden');
        alertBox.textContent = 'Connection error.';
    }
});