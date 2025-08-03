document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const todosContainer = document.querySelector(".todos-container");
    const progressBar = document.getElementById("progress");
    const progressNumbers = document.getElementById("numbers");


    const toggleEmptyState = () => {
        todosContainer.style.width = taskList.children.length > 0 ? '100%' : '50%';
    }

    const updateProgress = (checkCompletion = true) => {
        const totalTasks = taskList.querySelectorAll('li:not(.placeholder)').length;
        const completedTasks = taskList.querySelectorAll('.checkbox:checked').length

        progressBar.style.width = totalTasks ? `${(completedTasks / totalTasks) * 100}%` : '0%';
        progressNumbers.textContent = `${completedTasks} / ${totalTasks}`;

        if (checkCompletion && totalTasks > 0 && completedTasks === totalTasks) {
            Confetti();
        }
    };

    // 儲存
    const saveTaskToLocalStorage = () => {
        const tasks = Array.from(taskList.querySelectorAll('li')).map(li => {
            return {
                text: li.querySelector('span')?.textContent || '',
                completed: li.querySelector('input[type="checkbox"]')?.checked || false
            };
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    // 載入
    const loadTasksFromLocalStorage = () => {
        const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        savedTasks.forEach(({ text, completed }) => addTask(text, completed, false));
        toggleEmptyState();
        updateProgress();
    };

    const addTask = (eventOrText, completed = false, checkCompletion = true) => {
        let taskText = '';

        if (typeof eventOrText === 'string') {
            taskText = eventOrText.trim();
        } else {
            eventOrText.preventDefault();
            taskText = taskInput.value.trim();
        }
        if (!taskText) {
            return;
        }

        const li = document.createElement('li');
        li.innerHTML = `
        <input type="checkbox" class="checkbox">
        <span>${taskText}</span>
        <div class="task-buttons">
          <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
          <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
        </div>
        `;

        const checkbox = li.querySelector('.checkbox');
        checkbox.checked = completed;

        const editBtn = li.querySelector('.edit-btn');
        editBtn.disabled = completed;

        if (completed) {
            li.classList.add('completed');
        }

        checkbox.addEventListener('change', () => {
            li.classList.toggle('completed', checkbox.checked);
            editBtn.disabled = checkbox.checked;
            updateProgress();
            saveTaskToLocalStorage();
        });

        editBtn.addEventListener('click', () => {
            if (checkbox.checked) return; // 勾選完成的就不給編輯// 
            const span = li.querySelector('span');
            const originalText = span.textContent;

            const input = document.createElement('input');
            input.type = 'text';
            input.value = originalText;
            input.classList.add('edit-input');

            li.replaceChild(input, span);
            input.focus();



            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    const newSpan = document.createElement('span');
                    newSpan.textContent = input.value.trim() || originalText;
                    li.replaceChild(newSpan, input);
                }
            });

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    const newSpan = document.createElement('span');
                    newSpan.textContent = originalText;
                    li.replaceChild(newSpan, input);
                }
            });

            input.addEventListener('blur', () => {
                const newSpan = document.createElement('span');
                newSpan.textContent = input.value.trim() || originalText;
                li.replaceChild(newSpan, input);
            });
            toggleEmptyState();
            updateProgress(false);
            saveTaskToLocalStorage();
        });

        li.querySelector('.delete-btn').addEventListener('click', () => {
            li.remove();
            toggleEmptyState();
            updateProgress();
            saveTaskToLocalStorage();
        });

        taskList.appendChild(li);
        taskInput.value = '';
        updateProgress(checkCompletion);
        saveTaskToLocalStorage();

        requestAnimationFrame(() => {
            taskList.style.display = 'none';
            taskList.offsetHeight; // force reflow
            taskList.style.display = '';
        });


    };

    addTaskBtn.addEventListener('click', (e) => addTask(e));
    taskInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            addTask(e);
        }
    });

    loadTasksFromLocalStorage();

});

const Confetti = () => {
    const count = 200;
    const defaults = {
        origin: { y: 0.7 },
    };

    function fire(particleRatio, opts) {
        confetti(Object.assign({}, defaults, opts, {
            particleCount: Math.floor(count * particleRatio),
        }));
    }

    fire(0.25, {
        spread: 26,
        startVelocity: 55,
    });

    fire(0.2, {
        spread: 60,
    });

    fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
    });

    fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
    });

    fire(0.1, {
        spread: 120,
        startVelocity: 45,
    });
};