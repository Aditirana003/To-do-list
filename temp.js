const timeElapsed = Date.now();
const today = new Date(timeElapsed);
document.getElementById("date").innerHTML = today.toDateString();

function time() {
    const data = new Date();
    let h = data.getHours();
    let m = data.getMinutes();
    let s = data.getSeconds();

    if(h < 10)
        h = "0" +h;
    if(m < 10)
        m = "0" + m;
    if(s < 10)
        s = "0" + s;

    document.getElementById("hour").innerHTML = h +":"+ m + ":" + s;
    setTimeout('time()', 500);
}



window.addEventListener('load', () => {
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    const nameInput = document.querySelector('#name');
    const newTodoForm = document.querySelector('#new-todo-form');
    const searchInput = document.querySelector('#search-input');
    const searchButton = document.querySelector('#search-button');

    const username = localStorage.getItem('username') || '';

    nameInput.value = username;

    nameInput.addEventListener('change', (e) => {
        localStorage.setItem('username', e.target.value);
    });

    newTodoForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const todo = {
            content: e.target.elements.content.value,
            category: e.target.elements.category.value,
            done: false,
            createdAt: new Date().getTime(),
            deleted: false, // Add a 'deleted' property to track deleted tasks
        };

        todos.push(todo);

        // Reset the form
        e.target.reset();

        // Save the todos to local storage and filter out deleted tasks
        const activeTodos = todos.filter((todo) => !todo.deleted);
        localStorage.setItem('todos', JSON.stringify(activeTodos));

        DisplayTodos();
    });

    // Add an event listener to the search button
    searchButton.addEventListener('click', (e) => {
        e.preventDefault();
        const searchTerm = searchInput.value.trim().toLowerCase();

        // Filter todos based on the search term and display them
        const filteredTodos = todos.filter((todo) =>
            !todo.deleted && todo.content.toLowerCase().includes(searchTerm)
        );

        DisplayTodos(filteredTodos);
    });

    DisplayTodos(todos);
});

function DisplayTodos(todosToDisplay = []) {
    const todoList = document.querySelector('#todo-list');
    todoList.innerHTML = '';

    const todos = todosToDisplay.length > 0 ? todosToDisplay : JSON.parse(localStorage.getItem('todos')) || [];

    todos.forEach((todo) => {
        if (todo.deleted) {
            return; // Skip deleted tasks
        }

        const todoItem = document.createElement('div');
        todoItem.classList.add('todo-item');

        const label = document.createElement('label');
        const input = document.createElement('input');
        const span = document.createElement('span');
        const content = document.createElement('div');
        const actions = document.createElement('div');
        const edit = document.createElement('button');
        const deleteButton = document.createElement('button');

        input.type = 'checkbox';
        input.checked = todo.done;
        span.classList.add('bubble');
        if (todo.category == 'personal') {
            span.classList.add('personal');
        } else {
            span.classList.add('business');
        }
        content.classList.add('todo-content');
        actions.classList.add('actions');
        edit.classList.add('edit');
        deleteButton.classList.add('delete');

        content.innerHTML = `<input type="text" value="${todo.content}" readonly>`;
        edit.innerHTML = 'Edit';
        deleteButton.innerHTML = 'Delete';

        label.appendChild(input);
        label.appendChild(span);
        actions.appendChild(edit);
        actions.appendChild(deleteButton);
        todoItem.appendChild(label);
        todoItem.appendChild(content);
        todoItem.appendChild(actions);

        todoList.appendChild(todoItem);

        if (todo.done) {
            todoItem.classList.add('done');
        }

        input.addEventListener('change', (e) => {
            todo.done = e.target.checked;

            // Save the todos to local storage and filter out deleted tasks
            const activeTodos = todos.filter((t) => !t.deleted);
            localStorage.setItem('todos', JSON.stringify(activeTodos));

            if (todo.done) {
                todoItem.classList.add('done');
            } else {
                todoItem.classList.remove('done');
            }

            DisplayTodos();
        });

        edit.addEventListener('click', (e) => {
            const input = content.querySelector('input');
            input.removeAttribute('readonly');
            input.focus();
            input.addEventListener('blur', (e) => {
                input.setAttribute('readonly', true);
                todo.content = e.target.value;

                // Save the todos to local storage and filter out deleted tasks
                const activeTodos = todos.filter((t) => !t.deleted);
                localStorage.setItem('todos', JSON.stringify(activeTodos));

                DisplayTodos();
            });
        });

        deleteButton.addEventListener('click', (e) => {
            todo.deleted = true;

            // Save the todos to local storage and filter out deleted tasks
            const activeTodos = todos.filter((t) => !t.deleted);
            localStorage.setItem('todos', JSON.stringify(activeTodos));

            DisplayTodos();
        });
    });
}
