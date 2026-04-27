async function fetchUsers() {
    const response = await fetch('/api/admin/users');
    const users = await response.json();
    const tbody = document.querySelector('#userTable tbody');
    tbody.innerHTML = '';

    users.forEach(user => {
        tbody.innerHTML += `
            <tr>
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>
                    <select onchange="updateRole(${user.id}, this.value)">
                        <option value="ROLE_USER" ${user.role === 'ROLE_USER' ? 'selected' : ''}>USER</option>
                        <option value="ROLE_ADMIN" ${user.role === 'ROLE_ADMIN' ? 'selected' : ''}>ADMIN</option>
                    </select>
                </td>
                <td>
                    <button class="btn-delete" onclick="deleteUser(${user.id})">Delete</button>
                </td>
            </tr>
        `;
    });
}

async function deleteUser(id) {
    if (confirm('Are you sure you want to delete this user?')) {
        await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
        fetchUsers();
    }
}

async function updateRole(id, newRole) {
    await fetch(`/api/admin/users/${id}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRole)
    });
    alert('Role updated successfully');
}

fetchUsers();