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

document.getElementById('signupForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('newName').value; // Capturar el nombre del usuario
    const email = document.getElementById('newEmail').value;
    const password = document.getElementById('newPassword').value;

    // Validar la longitud de la contraseña
    if (password.length < 6) {
        alert('La contraseña debe tener al menos 6 caracteres.');
        return; // Detener la ejecución si la contraseña es demasiado corta
    }

    // Crear usuario con Firebase Authentication
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Usuario registrado exitosamente
            const user = userCredential.user;

            // Guardar el nombre en la base de datos
            database.ref('users/' + user.uid).set({
                name: name,
            }).then(() => {
                console.log('Usuario registrado exitosamente con ID:', user.uid);

                // Redireccionar o mostrar mensaje de éxito
                window.location.href = 'login.html';

            }).catch((error) => {
                console.error('Error al guardar datos en la base de datos:', error);
            });
        })
        .catch((error) => {
            // Si ocurre un error al crear el usuario
            const errorMessage = error.message;
            console.error('Error al crear el usuario:', errorMessage);
            alert('Error al crear el usuario: ' + errorMessage);
        });

        function saveUserName(userId, name) {
            firebase.database().ref('users/' + userId).set({
                name: name,
            });
        }
});

