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
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            // Obtener el nombre del usuario de la base de datos
            firebase.database().ref('users/' + user.uid).once('value').then((snapshot) => {
                const userName = snapshot.val().name;
                document.getElementById('userName').textContent = `Hola, ${userName}`;
            });
            // Cargar tareas del usuario
            loadTasks(user.uid);
        } else {
            // Redirigir al inicio de sesión si no está autenticado
            window.location.href = 'inicio.html';
        }
    });

    document.getElementById('Signoff').addEventListener('click', function() {
        firebase.auth().signOut().then(() => {
            window.location.href = 'index.html'; 
        }).catch((error) => {
            console.error('Error al cerrar sesión:', error);
        });
    });
});

document.getElementById('taskForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const taskInput = document.getElementById('taskInput').value;
    if (taskInput.trim() !== '') {
        addTask(taskInput);
        document.getElementById('taskInput').value = '';
    }
});

function addTask(taskText) {
    const user = firebase.auth().currentUser;
    if (user) {
        const userUid = user.uid;
        const taskRef = firebase.database().ref('users/' + userUid + '/tasks').push();

        taskRef.set({
            task: taskText
        }).then(() => {
            // No agregar la tarea directamente aquí, la función loadTasks se encargará de esto
        }).catch((error) => {
            console.error('Error al guardar la tarea:', error);
        });
    } else {
        console.error('No se pudo obtener el usuario actual');
    }
}

function createTaskElement(taskId, taskText) {
    const listItem = document.createElement('li');

    const taskTextElement = document.createElement('span');
    taskTextElement.className = 'task-text';
    taskTextElement.textContent = taskText;

    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'task-buttons';

    const deleteButton = document.createElement('img');
    deleteButton.src = './Imagenes/delete.png'; 
    deleteButton.alt = 'Eliminar';
    deleteButton.addEventListener('click', function() {
        deleteTask(taskId, listItem);
    });

    const viewButton = document.createElement('button');
    viewButton.textContent = 'Tareas';
    viewButton.addEventListener('click', function() {
        window.location.href = `subtasks.html?taskId=${taskId}&taskName=${taskText}`;
    });

    buttonsContainer.appendChild(deleteButton);
    buttonsContainer.appendChild(viewButton);

    listItem.appendChild(taskTextElement);
    listItem.appendChild(buttonsContainer);

    return listItem;
}

function deleteTask(taskId, listItem) {
    const user = firebase.auth().currentUser;
    if (user) {
        const userUid = user.uid;
        const taskRef = firebase.database().ref('users/' + userUid + '/tasks/' + taskId);
        taskRef.remove().then(() => {
            // Eliminar la tarea de la lista de tareas en la interfaz de usuario
            const taskList = document.getElementById('taskList');
            taskList.removeChild(listItem);
        }).catch((error) => {
            console.error('Error al eliminar la tarea:', error);
        });
    } else {
        console.error('No se pudo obtener el usuario actual');
    }
}

function loadTasks(userUid) {
    const taskRef = firebase.database().ref('users/' + userUid + '/tasks');
    taskRef.on('value', (snapshot) => {
        const tasks = snapshot.val();
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = ''; // Limpiar la lista antes de cargar

        for (const taskId in tasks) {
            const taskText = tasks[taskId].task;
            const listItem = createTaskElement(taskId, taskText);
            taskList.appendChild(listItem);
        }
    });
}
