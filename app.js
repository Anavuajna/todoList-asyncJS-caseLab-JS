const userToDo = document.querySelector('#user-todo');
const btnAdd = document.querySelector('button');
const toDoList = document.querySelector('#todo-list');
const form = document.querySelector('form');

let toDosArray = [];
let usresArray = [];

form.addEventListener('submit', handleSubmit);

// Функция для обработки ошибок
function alertError(error) {
    alert(error.message);
}

// Запрос на получение списка дел
async function getTodos() {
    try {
        const toDosResponse = await fetch('https://jsonplaceholder.typicode.com/todos');
        let toDosResult = await toDosResponse.json()
        displayToDos(toDosResult);
        return toDosResult;
    } catch (error) {
        alertError(error);
    }
}
getTodos()

// Отрисовка списка дел на странице
function displayToDos(toDosResult) {
    toDosResult.forEach((todo) => {
        const li = document.createElement('li');
        li.className = 'todo-item';
        li.id = todo.id;
        let userId = todo.userId
        li.innerHTML = `<span>${todo.title} - <b>${getUserName(userId)}</b></span>`;

        const statusComplete = document.createElement('input');
        statusComplete.type = 'checkbox';
        statusComplete.checked = todo.completed;
        statusComplete.addEventListener('change', handleChange);

        const btnClose = document.createElement('button');
        btnClose.innerText = 'X';
        btnClose.classList.add('btnClose');
        btnClose.addEventListener('click', handleClose)

        li.prepend(statusComplete)
        toDoList.appendChild(li)
        li.appendChild(btnClose)

        toDosArray.push(todo);
        btnClose.addEventListener('click', () => toDoList.removeChild(li))
    });
}


// Запрос на получение списка пользователей
async function geUsers() {
    try {
        const usersResponse = await fetch('https://jsonplaceholder.typicode.com/users');
        let usersResult = await usersResponse.json()
        displayUsers(usersResult)
        return usersResult;
    } catch (error) {
        alertError(error);
    }
}
geUsers()

// Отрисовка пользователей в Option
function displayUsers(usersResult) {
    usersResult.forEach((user, index) => {
        let userOption = document.createElement('option');
        userOption.value = user.id;
        userOption.innerText = user.name;
        userToDo.appendChild(userOption)
        usresArray.push(user)
    })
}

// Функция для получения имени пользователя
function getUserName(userId) {
    const userName = usresArray.find((u) => u.id === userId);
    return userName.name
}

// Создать новое дело
async function createNewTodo(todo) {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
            method: 'POST',
            body: JSON.stringify(todo),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const newTodo = await response.json();
        toDosArray.unshift(newTodo);
        displayToDos(newTodo)
    } catch (error) {
        alert("Не получилось добавить дело. Надо доработать.");
    }
}

// Обработка событий формы и создание нового дела
function handleSubmit(e) {
    e.preventDefault();
    createNewTodo({
        userId: Number(form.user.value),
        title: form.todo.value,
        completed: false
    });
}

// Обработка события по Checkbox
function handleChange() {
    const todoId = this.parentElement.id;
    const completed = this.checked;
    isCompleted(todoId, completed)
}

// Изменение статуса задачи по Checkbox
async function isCompleted(todoId, completed) {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`, {
            method: 'PATCH',
            body: JSON.stringify({
                completed: completed
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Ошибка соединения с сервером.')
        }
    } catch (error) {
        alertError(error);
    }
}

// Обработка события на удаление дела
function handleClose() {
    const todoId = this.parentElement.id;
    deleteTodo(todoId)
}

// Удаление дела из списка
async function deleteTodo(todoId) {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`, {
            method: 'DELETE'
        });
        const data = await response.json()
        if (response.ok) {
            removeTodo(todoId)
        } else {
            throw new Error('Не удалось удалить')
        }
    } catch (error) {
        alertError(error)
    }
}

// УДАЛИТЬ ЗАДАЧУ СО СТРАНИЦЫ
function removeTodo(todoId) {
    toDosArray = toDosArray.filter(todo => todo.id !== todoId);
}