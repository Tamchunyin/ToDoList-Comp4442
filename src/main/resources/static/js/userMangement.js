async function fetchUsers() {
    const response = await fetch('/api/admin/users');
    const users = await response.json();
    console.log(users);
    const tbody = document.querySelector('#userTable tbody');
    tbody.innerHTML = '';

    users.forEach(user => {
        // button text and colour
        const statusText = user.enabled ? 'Enabled' : 'Disabled';
        const statusBtnClass = user.enabled ? 'btn-disable' : 'btn-enable';

        tbody.innerHTML += `
            <tr>
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>
                    <select onchange="updateRole(${user.id}, this.value)">
                        <option value="ROLE_USER" ${user.role === 'ROLE_USER' || user.role === 'USER' ? 'selected' : ''}>USER</option>
                        <option value="ROLE_ADMIN" ${user.role === 'ROLE_ADMIN' || user.role === 'ADMIN' ? 'selected' : ''}>ADMIN</option>
                    </select>
                </td>
                <td>
                    <button class="${statusBtnClass}" onclick="toggleStatus(${user.id}, ${user.enabled})">
                        ${statusText}
                    </button>
                </td>
                <td>
                    <button class="btn-delete" onclick="deleteUser(${user.id},'${user.username}')">Delete</button>
                </td>
            </tr>
        `;
    });
}

async function toggleStatus(id, currentStatus) {
    const nextStatus = !currentStatus;
    const response = await fetch(`/api/admin/users/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: nextStatus })
    });

    if (response.ok) {
        fetchUsers(); // Refresh Table
    } else {
        const errorMsg = await response.text();
        alert("Operation failed: " + errorMsg);
    }
}
async function updateRole(id, newRole) {
    const response = await fetch(`/api/admin/users/${id}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: newRole
    });

    if (response.ok) {
        console.log("Role updated to " + newRole);
    } else {
        alert("Failed to update role");
    }
}
async function deleteUser(id, username) {
    if (!confirm(`Are you sure you want to delete user ID: ${username}?`)) {
        return;
    }

    try {
        const response = await fetch(`/api/admin/users/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            alert("User deleted successfully.");
            fetchUsers();
        } else {
            const errorMsg = await response.text();
            alert("Delete failed: " + errorMsg);
        }
    } catch (error) {
        console.error("Error deleting user:", error);
        alert("An error occurred while deleting the user.");
    }
}
document.addEventListener('DOMContentLoaded', fetchUsers);
