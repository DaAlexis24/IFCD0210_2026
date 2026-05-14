# Del patrón Controlador/Presentadores al State Management

El patrón Controlador/Presentador es una arquitectura de diseño que se puede aplicar a los custom elements para separar la lógica de presentación (renderización y manejo de eventos) de la lógica de negocio (gestión del estado...). En este patrón, el custom element actúa como un presentador que se encarga de renderizar la interfaz de usuario y manejar las interacciones del usuario, mientras que un controlador externo se encarga de gestionar el estado y la lógica de negocio del componente.

Veamos un ejemplo con una lista de tareas (todo list) donde el custom element se encarga de renderizar la lista y manejar los eventos de clic, mientras que un controlador externo gestiona el estado de las tareas.  

El componente task-item es el presentador que se encarga de renderizar cada tarea y manejar sus interacciones, mientras que el controlador gestiona el estado general de la lista.

```js
class TaskItem extends HTMLElement {
  constructor() {
    super();
    this.controller = null; // El controlador se asignará externamente
  }

  setController(controller) {
    this.controller = controller;
    this.render();
  }

  render() {
    if (!this.controller) return;

    const task = this.controller.getTask();
    this.innerHTML = `
      <div class="task-item">
        <span>${task.text}</span>
        <button id="deleteTask">Delete</button>
      </div>
    `;

    this.querySelector('#deleteTask').addEventListener('click', () => {
      this.controller.deleteTask(task.id);
      this.render(); // Re-renderizar el item después de eliminar la tarea
    });
  }
}
customElements.define('task-item', TaskItem);
```


```js
class TodoList extends HTMLElement {
  constructor() {
    super();
    this.controller = null; // El controlador se asignará externamente
  }

  setController(controller) {
    this.controller = controller;
    this.render();
  }

  render() {
    if (!this.controller) return;

    const tasks = this.controller.getTasks();
    this.innerHTML = `
      <ul>
        ${tasks.map(task => `<li>${task}</li>`).join('')}
      </ul>
      <button id="addTask">Add Task</button>
    `;

    this.querySelector('#addTask').addEventListener('click', () => {
      const newTask = prompt('Enter a new task:');
      if (newTask) {
        this.controller.addTask(newTask);
        this.render(); // Re-renderizar la lista después de agregar una tarea
      }
    });
  }
} 
customElements.define('todo-list', TodoList);
```

```js
class TodoController {
  constructor() {
    this.tasks = [];
  } 
  getTasks() {
    return this.tasks;
  }
  addTask(task) {
    this.tasks.push(task);
  }
  deleteTask(taskId) {
    this.tasks = this.tasks.filter((task, index) => index !== taskId);
  }
}   
```

```js
const todoController = new TodoController();
const todoList = document.querySelector('todo-list');
todoList.setController(todoController);
```
