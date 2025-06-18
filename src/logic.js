class Task {
  #id;

  constructor(title, dueDate, priority, notes, project) {
    this.title = title;
    this.dueDate = dueDate;
    this.priority = priority;
    this.status = false;
    this.notes = notes;
    this.#id = crypto.randomUUID();
    this.project = project;
  }

  get id() { return this.#id; }

  update(title, dueDate, priority, notes, project) {
    this.title = title;
    this.dueDate = dueDate;
    this.priority = priority;
    this.notes = notes;
    this.project = project;
  }
}

class Project {
  #id;

  constructor(title, description) {
    this.tasks = [];
    this.title = title;
    this.description = description;
    this.#id = crypto.randomUUID();
  }

  addTask(task) {
    this.tasks.push(task);
  }

  removeTask(task) {
    const index = this.tasks.indexOf(task);
    this.tasks.splice(index, 1);
  }

  update(title, description) {
    this.title = title;
    this.description = description;
  }

  get id() { return this.#id; }
}

export default class TodoApp {
  static maxPriority = 3;
  #projects;
  #allTasks;
  constructor() {
    this.#projects = [];
    this.#allTasks = [];

    const defaultProject = new Project("Default", "");
    this.#projects.push(defaultProject);
    this.activeProject = defaultProject;
  }


  get projects() {
    return this.#projects;
  }

  get allTasks() {
    return this.#allTasks;
  }

  getProject(id) {
    return this.#projects.find((el) => el.id === id);
  }

  get defaultProject() {
    return this.#projects[0];
  }

  createTask(title, dueDate, priority, notes, project) {
    const newTask = new Task(title, dueDate, priority, notes, project);
    this.#allTasks.push(newTask);
    if (project) {
      project.addTask(newTask);
    }
    return newTask;
  }

  removeTask(taskId) {
    const index = this.#allTasks.findIndex((element) => element.id === taskId);
    const task = this.#allTasks[index];

    if (task.project) {
      task.project.removeTask(task);
    }
    this.#allTasks.splice(index, 1);
  }

  editTask(taskId, title, dueDate, priority, notes, project) {
    const task = this.#allTasks.find((element) => element.id === taskId);
    task.update(title, dueDate, priority, notes, project);
  }

  switchStatus(taskId) {
    const task = this.#allTasks.find((element) => element.id === taskId);
    task.status = !task.status;
  }

  changePriority(taskId) {
    const task = this.#allTasks.find((element) => element.id === taskId);
    task.priority = (task.priority + 1) % TodoApp.maxPriority;
  }

  createProject(title, description) {
    const newProject = new Project(title, description);
    this.#projects.push(newProject);
    return newProject;
  }

  addTaskToProject(taskId, projectId) {
    const project = this.#projects.find((element) => element.id === projectId);
    const task = this.#allTasks.find((element) => element.id === taskId);
    this.removeTaskFromProject(taskId);
    task.project = project;
    project.addTask(task);
  }

  removeTaskFromProject(taskId) {
    const task = this.#allTasks.find((element) => element.id === taskId);
    const project = task.project;
    

    task.project = null;
    project.removeTask(task);
  }

  removeProject(projectId) {
    const index = this.#projects.findIndex((element) => element.id === projectId);
    if (index === 0) return;
    const project = this.#projects[index];
    project.tasks.forEach((task) => {task.project = null;});
    this.#projects.splice(index, 1);
  }

  editProject(projectId, title, description) {
    const project = this.#projects.find((element) => element.id === projectId);
    project.update(title, description);
  }
}

