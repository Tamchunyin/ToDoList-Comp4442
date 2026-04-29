document.getElementById('updateForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const alertBox = document.getElementById('alertBox');
    const newUsername = document.getElementById('newUsername').value;
    const newPassword = document.getElementById('newPassword').value;

    if (newUsername && newUsername.length < 4) {
        alert("Username must be at least 4 characters long.");
        return;
    }
    if (newPassword) {
        const PasswordLim = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!PasswordLim.test(newPassword)) {
            alert("Password must be 8+ chars and include uppercase, lowercase, and a number.");
            return;
        }
    }
    if (!newUsername && !newPassword){
        alert("Please enter at least one field to update.")
        return
    }
    try {
        const response = await fetch('/api/user/update', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: newUsername || null,
                password: newPassword || null
            })
        });

        alertBox.classList.remove('hidden');
        if (response.ok) {
            alertBox.className = 'alert success';
            alertBox.textContent = 'Profile updated successfully! Please re-login if username changed.';
            if (newUsername || newPassword) setTimeout(() => window.location.href = '/login.html', 2000);
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