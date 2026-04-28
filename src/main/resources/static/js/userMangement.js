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
                    <button class="btn-delete" onclick="deleteUser(${user.id})">Delete</button>
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
document.addEventListener('DOMContentLoaded', fetchUsers);
