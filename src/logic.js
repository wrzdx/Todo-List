import { format } from "date-fns";

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

  get formattedDate() { return format(this.dueDate, 'dd MMM yyyy'); }

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

  #getPriorityPosition(priority) {
    let l = 0, r = this.tasks.length - 1;
    let ans = this.tasks.length ;
    while ( l <= r) {
      const middle = Math.floor((l + r) / 2);
      if (this.tasks[middle].priority > priority) {
        l = middle + 1;
      } else {
        ans = middle;
        r = middle - 1;
      }
    }

    return ans;
  }

  addTask(task) {
    const pos = this.#getPriorityPosition(task.priority);
    this.tasks.splice(pos, 0, task);
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

  removeTask(task) {
    if (task.project) {
      task.project.removeTask(task);
    }
    const index = this.#allTasks.findIndex((el) => el.id === task.id);
    this.#allTasks.splice(index, 1);
  }

  editTask(task, title, dueDate, priority, notes, project) {
    this.addTaskToProject(task, project);
    task.update(title, dueDate, priority, notes, project);
  }

  switchStatus(task) {
    task.status = !task.status;
  }

  changePriority(task) {
    task.priority = (task.priority + 1) % TodoApp.maxPriority;
  }

  createProject(title, description) {
    const newProject = new Project(title, description);
    this.#projects.push(newProject);
    return newProject;
  }

  addTaskToProject(task, project) {
    this.removeTaskFromProject(task);
    task.project = project;
    project.addTask(task);
  }

  removeTaskFromProject(task) {
    const project = task.project;    

    task.project = null;
    project.removeTask(task);
  }

  removeProject(project) {
    if (this.#projects.length <= 1) {
      return;
    }
    project.tasks.forEach((task) => {task.project = null;});
    const index = this.#projects.indexOf(project);
    this.#projects.splice(index, 1);
  }

  editProject(project, title, description) {
    project.update(title, description);
  }
}

