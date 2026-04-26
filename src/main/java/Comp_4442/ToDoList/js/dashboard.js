// Current user
const currentUser = { name: "Manager_Alpha" };

// Loading execution
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('userNameDisplay').textContent = currentUser.name;
    loadTodos();
});

// submit table
document.getElementById('todoForm').addEventListener('submit', (e) => {
    e.preventDefault();
    addTodo();
});

// Catch Task
async function loadTodos() {
    const mockData = [
        { id: 1, title: "整理周会纪要", priority: "high", completed: false },
        { id: 2, title: "回复客户邮件", priority: "medium", completed: true }
    ];
    renderList(mockData);
}

function renderList(todos) {
    const container = document.getElementById('todoContainer');
    const badge = document.getElementById('taskCountBadge');
    container.innerHTML = '';

    let pendingCount = 0;

    todos.forEach(todo => {
        if(!todo.completed) pendingCount++;

        const col = document.createElement('div');
        col.className = 'col';
        col.innerHTML = `
            <div class="card todo-card priority-${todo.priority} shadow-sm">
                <div class="card-body d-flex justify-content-between align-items-center">
                    <div class="d-flex align-items-center">
                        <input class="form-check-input me-3" type="checkbox" 
                               ${todo.completed ? 'checked' : ''} 
                               onchange="toggleStatus(${todo.id}, this.checked)">
                        <div>
                            <h6 class="mb-0 ${todo.completed ? 'completed-text' : ''}">${todo.title}</h6>
                            <small class="text-muted">ID: #${todo.id}</small>
                        </div>
                    </div>
                    <div class="btn-group">
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteTodo(${todo.id})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(col);
    });

    badge.textContent = `剩余 ${pendingCount} 项未完成`;
}

function addTodo() {
    const input = document.getElementById('todoInput');
    const priority = document.getElementById('prioritySelect').value;

    console.log("Send to management:", { title: input.value, priority });
    alert("add action（javascript）");
    input.value = '';
}

// 模拟操作：删除任务
function deleteTodo(id) {
    if(confirm('Delete Task?')) {
        console.log("ID", id);
    }
}

// 登出处理
function handleLogout() {
    if(confirm('Logout？')) {
        window.location.href = 'login.html';
    }
}