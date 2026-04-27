document.addEventListener('DOMContentLoaded', () => {
    loadUserInfo();
    loadTodos();
});

async function loadUserInfo() {
    try {
        const response = await fetch('/api/users/me', { credentials: 'include' });
        if (response.ok) {
            const user = await response.json();
            document.getElementById('currentUserName').textContent = user.username;


            if (user.role === 'ROLE_ADMIN' || user.role === 'admin') {
                document.getElementById('adminBtn').style.display = 'block';
            }
        } else {
            window.location.href = '/login.html';
        }
    } catch (err) {
        console.error("Failed to load user info", err);
    }
}

async function loadTodos() {
    try {
        // 💡 獲取當前用戶身分
        const userRes = await fetch('/api/users/me');
        const currentUser = await userRes.json();
        const currentUsername = currentUser.username;
        const isAdmin = currentUser.role === 'ROLE_ADMIN';

        const response = await fetch('/api/todos');
        const todos = await response.json();
        const listContainer = document.getElementById('todoList');

        listContainer.innerHTML = todos.map(todo => {
            // 💡 權限判定：是本人或是管理員
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
                    <small class="text-muted">${todo.content}</small>
                    <div style="font-size: 11px; color: #999;" class="mt-1">
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
        console.log("當前用戶資訊:", user);

        const navName = document.getElementById('currentUserName');
        if (navName) {
            navName.textContent = user.username;
        }

        const sidebarName = document.getElementById('sidebarUserName');
        if (sidebarName) {
            sidebarName.textContent = user.username;
        }

        // 💡 修正 3：處理 Admin 權限顯示
        // 確保判斷字串與後端回傳的 "ROLE_ADMIN" 完全一致
        if (user.role === 'ROLE_ADMIN') {
            const adminBtn = document.getElementById('adminBtn');
            const adminSidebarBtn = document.getElementById('adminSidebarBtn');

            if (adminBtn) adminBtn.style.display = 'inline-block';
            if (adminSidebarBtn) adminSidebarBtn.style.display = 'block';
        }

    } catch (error) {
        console.error('載入用戶資訊失敗', error);
    }
}

async function deleteTodo(id, element) {
    if (!confirm("Confirm Delete?")) return;

    // 💡 步驟 A：前端先讓該筆資料消失（不需要等待後端）
    const item = document.querySelector(`button[onclick="deleteTodo(${id})"]`).closest('.list-group-item');
    item.style.transition = '0.3s';
    item.style.opacity = '0';
    setTimeout(() => item.remove(), 300);

    // 💡 步驟 B：背景發送請求
    const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
        credentials: 'include'
    });

    if (!response.ok) {
        // 如果後端刪除失敗（例如權限不足），再抓回來或報錯
        alert("Delete Fail. Restore the data...");
        await loadTodos();
    }
}
async function logout() {
    await fetch('/api/logout', { method: 'POST', credentials: 'include' });
    window.location.href = '/login.html';
}
