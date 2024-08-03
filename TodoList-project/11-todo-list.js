document.addEventListener('DOMContentLoaded', function() {
    const todoInput = document.getElementById('todoInput');
    const todoDate = document.getElementById('todoDate');
    const todoTime = document.getElementById('todoTime');
    const addTodoButton = document.getElementById('addTodo');
    const todoList = document.getElementById('todoList');
    const celebrationOverlay = document.getElementById('celebrationOverlay');

    // Load sounds
    const completionSound = new Audio('https://actions.google.com/sounds/v1/alarms/bugle_tune.ogg');
    const celebrationSound = new Audio('https://actions.google.com/sounds/v1/crowds/crowd_celebration.ogg');

    addTodoButton.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTodo();
        }
    });

    // Set default date and time
    const now = new Date();
    todoDate.valueAsDate = now;
    todoTime.value = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

    // Load todos from localStorage
    loadTodos();

    function addTodo() {
        const todoText = todoInput.value.trim();
        const todoDateValue = todoDate.value;
        const todoTimeValue = todoTime.value;
        if (todoText) {
            const todo = { 
                text: todoText, 
                date: todoDateValue, 
                time: todoTimeValue, 
                completed: false 
            };
            const li = createTodoElement(todo);
            todoList.appendChild(li);
            todoInput.value = '';
            saveTodos();
        }
    }

    function createTodoElement(todo) {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerHTML = `
            <span class="${todo.completed ? 'text-decoration-line-through' : ''}">
                ${todo.text} - ${todo.date} ${todo.time}
            </span>
            <div>
                <button class="btn btn-sm btn-success me-2">Complete</button>
                <button class="btn btn-sm btn-danger">Delete</button>
            </div>
        `;

        li.querySelector('.btn-success').addEventListener('click', function() {
            todo.completed = !todo.completed;
            li.querySelector('span').classList.toggle('text-decoration-line-through');
            celebrate();
            saveTodos();
        });

        li.querySelector('.btn-danger').addEventListener('click', function() {
            li.remove();
            saveTodos();
        });

        return li;
    }

    function celebrate() {
        completionSound.play();
        
        // Trigger confetti
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);

        // Show celebration overlay
        celebrationOverlay.classList.remove('d-none');
        celebrationSound.play();

        // Hide celebration overlay after 3 seconds
        setTimeout(() => {
            celebrationOverlay.classList.add('d-none');
            celebrationSound.pause();
            celebrationSound.currentTime = 0;
        }, 3000);
    }

    function saveTodos() {
        const todos = Array.from(todoList.children).map(li => ({
            text: li.querySelector('span').textContent.split(' - ')[0],
            date: li.querySelector('span').textContent.split(' - ')[1].split(' ')[0],
            time: li.querySelector('span').textContent.split(' - ')[1].split(' ')[1],
            completed: li.querySelector('span').classList.contains('text-decoration-line-through')
        }));
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    function loadTodos() {
        const todos = JSON.parse(localStorage.getItem('todos')) || [];
        todos.forEach(todo => {
            const li = createTodoElement(todo);
            todoList.appendChild(li);
        });
    }
});