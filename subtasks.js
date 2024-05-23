// Configura la configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAJdvoqrLnnSTDDpswOPLu0S9Ie91zA2fo",
    authDomain: "taskify-final.firebaseapp.com",
    projectId: "taskify-final",
    storageBucket: "taskify-final.appspot.com",
    messagingSenderId: "247110597606",
    appId: "1:247110597606:web:bad32eb4f601143cfb7427",
    measurementId: "G-7G8ZGP85E4"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const taskId = urlParams.get('taskId'); // Obtener taskId de la URL

    const taskName = urlParams.get('taskName');
    document.getElementById('taskName').textContent = `Lista de tareas de : ${taskName}`;

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            document.getElementById('subtaskForm').addEventListener('submit', function(e) {
                e.preventDefault();
                const subtaskInput = document.getElementById('subtaskInput').value;
                if (subtaskInput.trim() !== '') {
                    addSubtask(user.uid, taskId, subtaskInput); // Pasar taskId a addSubtask
                    document.getElementById('subtaskInput').value = '';
                }
            });
            loadSubtasks(user.uid, taskId); // Pasar taskId a loadSubtasks
        } else {
            // Redirigir al inicio de sesión si no está autenticado
            window.location.href = 'login.html';
        }
    });
});



function addSubtask(userUid, taskId, subtaskText) {
    const subtaskRef = firebase.database().ref('users/' + userUid + '/tasks/' + taskId + '/subtasks').push();
    const subtaskId = subtaskRef.key;

    subtaskRef.set({
        subtask: subtaskText
    }).then(() => {
        // Agregar la subtarea a la lista después de guardarla en la base de datos
        const subtaskList = document.getElementById('subtaskList');
        const listItem = createSubtaskElement(subtaskId, subtaskText);
        subtaskList.appendChild(listItem);
    }).catch((error) => {
        console.error('Error al guardar la subtarea:', error);
    });
}

function createSubtaskElement(subtaskId, subtaskText) {
    const listItem = document.createElement('li');
    listItem.textContent = subtaskText;

    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'subtask-buttons';

    const deleteButton = document.createElement('img');
    deleteButton.src = './Imagenes/delete.png'; 
    deleteButton.alt = 'Eliminar';
    deleteButton.addEventListener('click', function() {
        deleteTask(subtaskId, listItem);
    });

    listItem.appendChild(deleteButton);
    return listItem;
}

function deleteSubtask(subtaskId, listItem) {
    const user = firebase.auth().currentUser;
    const urlParams = new URLSearchParams(window.location.search);
    const taskId = urlParams.get('taskId');

    if (user) {
        const userUid = user.uid;
        const subtaskRef = firebase.database().ref('users/' + userUid + '/tasks/' + taskId + '/subtasks/' + subtaskId);
        subtaskRef.remove().then(() => {
            // Eliminar la subtarea de la lista de subtareas en la interfaz de usuario
            const subtaskList = document.getElementById('subtaskList');
            subtaskList.removeChild(listItem);
        }).catch((error) => {
            console.error('Error al eliminar la subtarea:', error);
        });
    } else {
        console.error('No se pudo obtener el usuario actual');
    }
}

function loadSubtasks(userUid, taskId) {
    const subtaskRef = firebase.database().ref('users/' + userUid + '/tasks/' + taskId + '/subtasks');
    subtaskRef.on('value', (snapshot) => {
        const subtasks = snapshot.val();
        const subtaskList = document.getElementById('subtaskList');
        subtaskList.innerHTML = ''; // Limpiar la lista antes de cargar

        for (const subtaskId in subtasks) {
            const subtaskText = subtasks[subtaskId].subtask;
            const listItem = createSubtaskElement(subtaskId, subtaskText);
            subtaskList.appendChild(listItem);
        }
    });
}

