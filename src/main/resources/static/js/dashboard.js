document.addEventListener('DOMContentLoaded', () => {
    loadUserInfo();
    loadTodos();
});


async function loadTodos() {
    try {

        const userRes = await fetch('/api/users/me');
        const currentUser = await userRes.json();
        const currentUsername = currentUser.username;
        const isAdmin = currentUser.role === 'ROLE_ADMIN';

        const response = await fetch('/api/todos');
        const todos = await response.json();
        const listContainer = document.getElementById('todoList');

        listContainer.innerHTML = todos.map(todo => {

            const isOwner = todo.user && todo.user.username === currentUsername;
            const canControl = isOwner || isAdmin;

            return `
            <div class="list-group-item list-group-item-action d-flex justify-content-between align-items-center p-3 mb-2 rounded border-start ${todo.isPublic ? 'border-info' : 'border-secondary'}" style="border-left-width: 5px;">
                <div class="ms-2 me-auto">
                    <div class="fw-bold">
                        <span class="priority-dot ${todo.priority}"></span>
                        <span class="${todo.isCompleted ? 'text-decoration-line-through text-muted' : ''}">${todo.title}</span>
                        ${todo.isPublic ? '<span class="badge bg-info text-dark ms-2">Public</span>' : '<span class="badge bg-light text-muted ms-2">Private</span>'}
                    </div>
                    <p class="text-muted mb-1">${todo.content}</p>
                    
                    <div class="file-section mt-2">
                        ${todo.fileName ? `
                            <div class="mb-2">
                                <a href="/api/todos/${todo.id}/download" class="btn btn-sm btn-link p-0 text-decoration-none">
                                    <i class="bi bi-file-earmark-arrow-down"></i> Download: ${todo.fileName}
                                </a>
                            </div>
                        ` : ''}

                        ${canControl ? `
                            <div class="input-group input-group-sm w-auto">
                                <input type="file" id="fileInput-${todo.id}" class="form-control form-control-sm">
                                <button class="btn btn-outline-primary" onclick="uploadFile(${todo.id})">
                                    <i class="bi bi-upload"></i> Upload
                                </button>
                            </div>
                        ` : ''}
                    </div>

                    <div style="font-size: 11px; color: #999;" class="mt-2">
                        Owner: ${todo.user ? todo.user.username : 'Unknown'} | Due: ${todo.dueDate || 'N/A'}
                    </div>
                </div>
                
                <div class="d-flex flex-column align-items-end">
                    ${canControl ? `
                        <button class="btn btn-sm ${todo.isCompleted ? 'btn-success' : 'btn-outline-success'} mb-1" onclick="toggleTodo(${todo.id})">
                            ${todo.isCompleted ? 'Completed' : 'Mark Done'}
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteTodo(${todo.id})">Delete</button>
                    ` : `
                        <span class="badge rounded-pill bg-light text-muted border">View Only</span>
                    `}
                </div>
            </div>`;
        }).join('');
    } catch (err) {
        console.error("Load failed", err);
    }
}



async function addTodo() {
    const title = document.getElementById('todoTitle').value.trim();
    const content = document.getElementById('todoInput').value.trim();
    const dueDate = document.getElementById('todoDate').value;
    const priority = document.getElementById('prioritySelect').value;
    const isPublic = document.getElementById('isPublicCheck').checked;
    if (!title || !content) {
        alert("Please enter both Title and Description");
        return;
    }


    const data = {
        title: title,
        content: content,
        dueDate: dueDate,
        priority: priority,
        isPublic: isPublic,
        isCompleted: false
    };
    const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include'
    });

    if (response.ok) {
        alert("Add Successful")
        document.getElementById('todoTitle').value = '';
        document.getElementById('todoInput').value = '';
        document.getElementById('todoDate').value = '';
        await loadTodos();
    } else {
        alert("Add failed. Check if your database schema matches!");
    }
}

async function loadUserInfo() {
    try {
        const response = await fetch('/api/users/me');
        if (!response.ok) throw new Error('Not logged in');

        const user = await response.json();
        console.log("Current User:", user);

        const navName = document.getElementById('currentUserName');
        if (navName) {
            navName.textContent = user.username;
        }

        const sidebarName = document.getElementById('sidebarUserName');
        if (sidebarName) {
            sidebarName.textContent = user.username;
        }

        // Ensure the admin response is the same
        if (user.role === 'ROLE_ADMIN') {
            const adminBtn = document.getElementById('adminBtn');
            const adminSidebarBtn = document.getElementById('adminSidebarBtn');

            if (adminBtn) adminBtn.style.display = 'inline-block';
            if (adminSidebarBtn) adminSidebarBtn.style.display = 'block';
        }

    } catch (error) {
        console.error('Loading Fail', error);
    }
}

async function deleteTodo(id, element) {
    if (!confirm("Confirm Delete?")) return;

    // This just delete the task temporary
    const item = document.querySelector(`button[onclick="deleteTodo(${id})"]`).closest('.list-group-item');
    item.style.transition = '0.3s';
    item.style.opacity = '0';
    setTimeout(() => item.remove(), 300);

    //
    const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
        credentials: 'include'
    });

    if (!response.ok) {
        // If not match role, restore the Task
        alert("Delete Fail. Restore the data...");
        await loadTodos();
    }
}
async function logout() {
    await fetch('/api/logout', { method: 'POST', credentials: 'include' });
    window.location.href = '/login.html';
}

async function uploadFile(todoId) {
    const fileInput = document.getElementById(`fileInput-${todoId}`);
    if (fileInput.files.length === 0) return alert("Please select a file");

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    const response = await fetch(`/api/todos/${todoId}/upload`, {
        method: 'POST',
        body: formData

    });

    if (response.ok) {
        alert("Upload Success!");
        loadTodos();
    }
}
