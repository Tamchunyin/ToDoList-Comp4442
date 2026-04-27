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
        const response = await fetch('/api/todos', {credentials: 'include'});
        const todos = await response.json();
        const listContainer = document.getElementById('todoList');
        listContainer.innerHTML = todos.map(todo => `
            <div class="list-group-item list-group-item-action d-flex justify-content-between align-items-start p-3">
                <div class="ms-2 me-auto">
                    <div class="fw-bold d-flex align-items-center">
                        <span class="priority-dot ${todo.priority}"></span>
                        ${todo.title} 
                        ${todo.isPublic ? '<span class="badge bg-info text-dark ms-2" style="font-size: 10px;">Public</span>' : ''}
                    </div>
                    <small class="text-muted">${todo.content}</small>
                    <div class="mt-1" style="font-size: 12px; color: #888;">
                        <i class="bi bi-calendar-event"></i> Due: ${todo.dueDate || 'No Deadline'}
                    </div>
                </div>
                <div class="d-flex flex-column align-items-end">
                    <button class="btn btn-sm btn-outline-success mb-1" onclick="toggleTodo(${todo.id})">
                        ${todo.isCompleted ? 'Undo' : 'Done'}
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteTodo(${todo.id})">Delete</button>
                </div>
            </div>
        `).join('');
    } catch (err) {
        console.error("ERROR:", err);
        document.getElementById('todoList').innerHTML = '<div class="alert alert-danger">Loading fail</div>';
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

        // 💡 修正 1：安全地設定導覽列名字
        const navName = document.getElementById('currentUserName');
        if (navName) {
            navName.textContent = user.username;
        }

        // 💡 修正 2：安全地設定側邊欄名字 (這行最可能是第 109 行的元兇)
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

async function deleteTodo(id) {
    if (!confirm("確定要刪除嗎？")) return;
    const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
        credentials: 'include'
    });
    if (response.ok) await loadTodos(); // 即時重新整理
}

async function toggleTodo(id) {
    // 這裡建議後端有一個 PATCH 或 PUT 接口來切換完成狀態
    const response = await fetch(`/api/todos/${id}/toggle`, {
        method: 'POST',
        credentials: 'include'
    });
    if (response.ok) await loadTodos(); // 即時重新整理
}
async function logout() {
    await fetch('/api/logout', { method: 'POST', credentials: 'include' });
    window.location.href = '/login.html';
}
