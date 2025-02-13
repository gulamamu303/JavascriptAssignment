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
    //reset the input fields after task added for next entry

    document.getElementById("taskTitle").value = "";
    document.getElementById("taskDescription").value = "";
    document.getElementById("taskDueDate").value = "";
    //Calls the loadTasks() function to refresh the UI. This ensures that the new task appears immediately in the task list.
    loadTasks();
}

function loadTasks(filter = "all") {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
        // Show only complete tasks
        if (filter === "completed" && !task.completed) return;
        // Show only incompleted tasks
        if (filter === "incomplete" && task.completed) return;

        let taskItem = document.createElement("li");
        taskItem.className = "task-item " + (task.completed ? "completed" : "");
        // Set the inner HTML of the task item with task details and buttons
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

// function editTask(index) {
//     let tasks = JSON.parse(localStorage.getItem("tasks"));
//     let task = tasks[index];

//     let newTitle = prompt("Edit Title:", task.title);
//     let newDescription = prompt("Edit Description:", task.description);
//     let newDueDate = prompt("Edit Due Date:", task.dueDate);

//     if (newTitle !== null) task.title = newTitle.trim();
//     if (newDescription !== null) task.description = newDescription.trim();
//     if (newDueDate !== null) task.dueDate = newDueDate.trim();

//     localStorage.setItem("tasks", JSON.stringify(tasks));
//     loadTasks();
// }

let editingTaskIndex = -1; // To keep track of which task is being edited

function editTask(index) {
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    let task = tasks[index];

    // Set the values in the modal
    document.getElementById("editTitle").value = task.title;
    document.getElementById("editDescription").value = task.description;
    document.getElementById("editDueDate").value = task.dueDate;

    // Set the task index
    editingTaskIndex = index;

    // This line makes the modal visible
    document.getElementById("editModal").style.display = "block";
}

function closeModal() {
    // Close the modal
    document.getElementById("editModal").style.display = "none";
}

function saveEdit() {
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    let task = tasks[editingTaskIndex];

    // Get the values from the modal
    let newTitle = document.getElementById("editTitle").value.trim();
    let newDescription = document.getElementById("editDescription").value.trim();
    let newDueDate = document.getElementById("editDueDate").value.trim();

    // Update the task with new values
    if (newTitle) task.title = newTitle;
    if (newDescription) task.description = newDescription;
    if (newDueDate) task.dueDate = newDueDate;

    // Save updated tasks
    localStorage.setItem("tasks", JSON.stringify(tasks));

    // Close the modal
    closeModal();

    // Reload the tasks
    loadTasks();
}
// Function to delete a task from the task list
function deleteTask(index) {
    // Show a confirmation dialog before deleting the task
    if (confirm("Are you sure you want to delete this task?")) {
        // Retrieve the existing tasks from localStorage and parse them into a JavaScript array
        let tasks = JSON.parse(localStorage.getItem("tasks"));
        tasks.splice(index, 1);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        // Reload the task list to reflect the changes
        loadTasks();
    }
}
// Function to toggle the completion status of a task
function toggleComplete(index) {
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    tasks[index].completed = !tasks[index].completed;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    // Reload the task list to reflect the changes
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
