document.addEventListener('DOMContentLoaded', function() {
   
    document.getElementById('btnInicio').addEventListener('click', function() {
        window.location.href = 'login.html';
    });

    document.getElementById('btnRegistro').addEventListener('click', function() {
        window.location.href = 'register.html';
    });
});
