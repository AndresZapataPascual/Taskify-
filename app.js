document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btnInicio').addEventListener('click', () => {
        window.location.href = 'login.html';
    });

    document.getElementById('btnRegistro').addEventListener('click', () => {
        window.location.href = 'register.html';
    });
});
