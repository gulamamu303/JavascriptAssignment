document.addEventListener("DOMContentLoaded", loadTasks);

function addTask() {
    let title = document.getElementById("taskTitle").value.trim();
    let description = document.getElementById("taskDescription").value.trim();
    let dueDate = document.getElementById("taskDueDate").value;

    // if (!title) {
    //     alert("Task title is required!");
    //     return;
    // }
    if (!title || !dueDate) {
        alert("Title and Due Date are required!");
        return;
    }

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push({ title, description, dueDate, completed: false });
    localStorage.setItem("tasks", JSON.stringify(tasks));

    document.getElementById("taskTitle").value = "";
    document.getElementById("taskDescription").value = "";
    document.getElementById("taskDueDate").value = "";

    loadTasks();
}

function loadTasks(filter = "all") {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
        if (filter === "completed" && !task.completed) return;
        if (filter === "incomplete" && task.completed) return;

        let taskItem = document.createElement("li");
        taskItem.className = "task-item " + (task.completed ? "completed" : "");

        taskItem.innerHTML = `
            <span>${task.title} - ${task.description} (Due: ${task.dueDate || "No Date"})</span>
            <div class="task-buttons">
                <button class="edit" onclick="editTask(${index})">✏️</button>
                <button onclick="toggleComplete(${index})">✔️</button>
                <button class="delete" onclick="deleteTask(${index})">🗑️</button>
            </div>
        `;

        taskList.appendChild(taskItem);
    });
}

function editTask(index) {
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    let task = tasks[index];

    let newTitle = prompt("Edit Title:", task.title);
    let newDescription = prompt("Edit Description:", task.description);
    let newDueDate = prompt("Edit Due Date:", task.dueDate);

    if (newTitle !== null) task.title = newTitle.trim();
    if (newDescription !== null) task.description = newDescription.trim();
    if (newDueDate !== null) task.dueDate = newDueDate.trim();

    localStorage.setItem("tasks", JSON.stringify(tasks));
    loadTasks();
}

function deleteTask(index) {
    if (confirm("Are you sure you want to delete this task?")) {
        let tasks = JSON.parse(localStorage.getItem("tasks"));
        tasks.splice(index, 1);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        loadTasks();
    }
}

function toggleComplete(index) {
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    tasks[index].completed = !tasks[index].completed;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    loadTasks();
}

function filterTasks(type) {
    loadTasks(type);
}

function searchTasks() {
    let query = document.getElementById("searchInput").value.toLowerCase();
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
        if (task.title.toLowerCase().includes(query) || task.description.toLowerCase().includes(query)) {
            let taskItem = document.createElement("li");
            taskItem.className = "task-item " + (task.completed ? "completed" : "");
            taskItem.innerHTML = `
                <span>${task.title} - ${task.description} (Due: ${task.dueDate || "No Date"})</span>
                <div class="task-buttons">
                    <button class="edit" onclick="editTask(${index})">✏️</button>
                    <button onclick="toggleComplete(${index})">✔️</button>
                    <button class="delete" onclick="deleteTask(${index})">🗑️</button>
                </div>
            `;
            taskList.appendChild(taskItem);
        }
    });
}
