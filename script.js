const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const taskTemplate = document.getElementById('taskTemplate');
const taskCount = document.getElementById('taskCount');
const themeToggle = document.getElementById('themeToggle');
const filterButtons = document.querySelectorAll('.filter');

let tasks = [
  { id: 1, text: 'Projektstruktur vorbereiten', completed: false },
  { id: 2, text: 'Erste App-Funktion testen', completed: true },
];

let currentFilter = 'all';

function saveTasks() {
  localStorage.setItem('gpt-tasks', JSON.stringify(tasks));
}

function loadTasks() {
  const stored = localStorage.getItem('gpt-tasks');
  if (!stored) {
    return;
  }

  try {
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed) && parsed.length) {
      tasks = parsed;
    }
  } catch (error) {
    console.error('Fehler beim Laden der Aufgaben:', error);
  }
}

function updateTaskCount() {
  const remaining = tasks.filter((task) => !task.completed).length;
  taskCount.textContent = `${tasks.length} Aufgabe${tasks.length === 1 ? '' : 'n'} · ${remaining} offen`;
}

function filterTasks() {
  const filteredTasks = tasks.filter((task) => {
    if (currentFilter === 'active') return !task.completed;
    if (currentFilter === 'completed') return task.completed;
    return true;
  });

  return filteredTasks;
}

function renderTasks() {
  taskList.innerHTML = '';
  const filteredTasks = filterTasks();

  if (!filteredTasks.length) {
    const empty = document.createElement('li');
    empty.className = 'empty-state';
    empty.textContent = 'Keine Aufgaben in dieser Ansicht.';
    taskList.appendChild(empty);
    updateTaskCount();
    return;
  }

  filteredTasks.forEach((task) => {
    const node = taskTemplate.content.firstElementChild.cloneNode(true);
    const checkbox = node.querySelector('input[type="checkbox"]');
    const text = node.querySelector('.task-text');
    const deleteBtn = node.querySelector('.delete-btn');

    checkbox.checked = task.completed;
    text.textContent = task.text;
    if (task.completed) {
      node.classList.add('completed');
    }

    checkbox.addEventListener('change', () => {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    deleteBtn.addEventListener('click', () => {
      tasks = tasks.filter((item) => item.id !== task.id);
      saveTasks();
      renderTasks();
    });

    taskList.appendChild(node);
  });

  updateTaskCount();
}

function addTask(event) {
  event.preventDefault();
  const text = taskInput.value.trim();

  if (!text) {
    taskInput.focus();
    return;
  }

  tasks.unshift({
    id: Date.now(),
    text,
    completed: false,
  });

  taskInput.value = '';
  saveTasks();
  renderTasks();
}

function setupFilters() {
  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      currentFilter = button.dataset.filter;
      filterButtons.forEach((btn) => btn.classList.toggle('active', btn === button));
      renderTasks();
    });
  });
}

function initTheme() {
  const savedTheme = localStorage.getItem('gpt-theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
    themeToggle.textContent = '☀️';
  }

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    themeToggle.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('gpt-theme', isDark ? 'dark' : 'light');
  });
}

taskForm.addEventListener('submit', addTask);
setupFilters();
loadTasks();
initTheme();
renderTasks();
