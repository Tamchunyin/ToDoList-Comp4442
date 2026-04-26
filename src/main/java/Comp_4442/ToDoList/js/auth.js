let isLoginMode = true;

const elements = {
    formTitle: document.getElementById('formTitle'),
    formSubtitle: document.getElementById('formSubtitle'),
    confirmGroup: document.getElementById('confirmPasswordGroup'),
    confirmInput: document.getElementById('confirmPassword'),
    submitBtn: document.getElementById('submitBtn'),
    toggleLink: document.getElementById('toggleLink'),
    alertBox: document.getElementById('alertBox'),
    authForm: document.getElementById('authForm')
};

function showAlert(message, type) {
    elements.alertBox.textContent = message;
    elements.alertBox.className = `alert ${type}`;
    setTimeout(() => elements.alertBox.classList.add('hidden'), 3000);
}

function toggleForm() {
    isLoginMode = !isLoginMode;
    elements.authForm.reset();

    if (isLoginMode) {
        elements.formTitle.textContent = 'Welcome';
        elements.submitBtn.textContent = 'Login';
        elements.confirmGroup.classList.add('hidden');
    } else {
        elements.formTitle.textContent = 'New account';
        elements.submitBtn.textContent = 'register';
        elements.confirmGroup.classList.remove('hidden');
    }
}

async function handleSubmit(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (password.length < 6) return showAlert('Too short', 'error');

    if (!isLoginMode) {
        if (password !== elements.confirmInput.value) return showAlert('Not match', 'error');

        console.log("Registing:", username);
    } else {

        console.log("Login:", username);
    }
}