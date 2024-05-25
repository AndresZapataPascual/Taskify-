// Inicializar Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAJdvoqrLnnSTDDpswOPLu0S9Ie91zA2fo",
    authDomain: "taskify-final.firebaseapp.com",
    projectId: "taskify-final",
    storageBucket: "taskify-final.appspot.com",
    messagingSenderId: "247110597606",
    appId: "1:247110597606:web:bad32eb4f601143cfb7427",
    measurementId: "G-7G8ZGP85E4"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Manejar el inicio de sesión
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Iniciar sesión con Firebase Authentication
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            const userName = user.displayName; // Obtener el nombre de usuario
            console.log('Inicio de sesión exitoso:', user);
            alert('¡Inicio de sesión exitoso!');
            // Redirigir al usuario a la página de tareas con su nombre como parámetro de consulta
            window.location.href = `tasks.html?name=${userName}`;
        })
        .catch((error) => {
            // Si ocurre un error durante el inicio de sesión
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error('Error al iniciar sesión:', errorMessage);
            alert('Error al iniciar sesión: ' + errorMessage);
        });
});
