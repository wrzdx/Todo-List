import "./styles.css"
import TodoApp from "./logic";

const app = new TodoApp();

function createProfileDiv() {
  const profile = document.createElement("div");
  const accountSVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>account-circle</title><path d="M12,19.2C9.5,19.2 7.29,17.92 6,16C6.03,14 10,12.9 12,12.9C14,12.9 17.97,14 18,16C16.71,17.92 14.5,19.2 12,19.2M12,5A3,3 0 0,1 15,8A3,3 0 0,1 12,11A3,3 0 0,1 9,8A3,3 0 0,1 12,5M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12C22,6.47 17.5,2 12,2Z" /></svg>';
  profile.innerHTML = accountSVG;
  const name = document.createElement("p");
  name.innerText = "Eugene";
  profile.appendChild(name);
  profile.classList.add("profile");
  return profile;
}

function createTab(project) {
  const folderSVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>folder</title><path d="M10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6H12L10,4Z" /></svg>'
  const tab = document.createElement("button");
  tab.classList.add("tab");
  tab.innerHTML = folderSVG;
  const titleNode = document.createTextNode(project.title);
  tab.dataset.id = project.id;
  if (project.id === app.activeProject.id) {
    tab.classList.add("active");
  }
  tab.appendChild(titleNode);
  return tab;
}

function createCreateProjectButton() {
  const btn = document.createElement("button");
  btn.classList.add("createProject");
  const plus = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>plus-circle-outline</title><path d="M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,7H11V11H7V13H11V17H13V13H17V11H13V7Z" /></svg>';
  btn.innerHTML = plus;
  const text = document.createTextNode("Create New Project");
  btn.appendChild(text);
  return btn;
}

function createProjects() {
  const projects = document.createElement("div");
  projects.classList.add("projects");
  const title = document.createElement("p");
  title.innerText = "Projects";
  const tabs = document.createElement("div");
  tabs.classList.add("tabs");
  const allProjects = []
  for (let project of app.projects) {
    allProjects.push(createTab(project));
  }
  const createProject = createCreateProjectButton();
  tabs.append(...allProjects, createProject);
  projects.append(title, tabs);

  const handler = (e) => {
    if (e.target.classList.contains("createProject")) {
      const newProject = app.createProject("default", "...");
      const newTab = createTab(newProject);
      tabs.insertBefore(newTab, e.target);
    } else if (e.target.classList.contains("tab")) {
      const oldActiveProjectTab = document.querySelector(".active");
      oldActiveProjectTab.classList.remove("active");
      e.target.classList.add("active");
      const projectId = e.target.dataset.id;
      const project = app.getProject(projectId);
      app.activeProject = project;
      let header = document.querySelector("header");
      let projectTasks = document.querySelector(".projectTasks");
      header.replaceWith(createHeader());
      projectTasks.replaceWith(createProjectTasksDiv());
    }
  };
  projects.addEventListener("click", handler);
  return projects;
}


function createFooter() {
  const footer = document.createElement("footer");
  const text = document.createTextNode("Created by\xa0");
  const link = document.createElement("a");
  link.textContent = "wrzdx";
  link.href = "https://github.com/wrzdx";
  link.title = "Visit GitHub profile";
  link.target = "_blank"; 
  footer.append(text, link);
  return footer;
}

function createNav() {
  const nav = document.createElement("nav");
  nav.classList.add("nav");

  const profile = createProfileDiv();
  const projects = createProjects();
  const footer = createFooter();
  nav.append(profile, projects, footer);
  return nav;
}

function createHeader() {
  const header = document.createElement("header");
  const project = app.activeProject; 
  header.innerText = project.title;
  return header;
}

function createProjectTask(task) {
  const taskNode = document.createElement("div");
  taskNode.dataset.id = task.id;
  taskNode.classList.add("task");
  const checkboxContainer = document.createElement("div");
  const input = document.createElement("input");
  input.type = "checkbox";
  input.name = "none"
  checkboxContainer.appendChild(input);
  checkboxContainer.classList.add("checkbox");
  const title = document.createElement("p");
  title.classList.add("taskTitle");
  title.innerText = task.title;
  const date = document.createElement("p");
  date.classList.add("taskDate");
  date.innerText = task.dueDate;
  const btns = document.createElement("div");
  btns.classList.add("btns");
  const editBtn = document.createElement("btn");
  editBtn.id = "editBtn";
  const pencilSVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>pencil-outline</title><path d="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z" /></svg>'
  editBtn.innerHTML = pencilSVG;
  const deleteBtn = document.createElement("btn");
  deleteBtn.id = "deleteBtn";
  const deleteSVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>trash-can-outline</title><path d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z" /></svg>'; 
  deleteBtn.innerHTML = deleteSVG;
  btns.append(editBtn, deleteBtn);
  taskNode.append(checkboxContainer, title, date, btns);
  return taskNode;
}

function createAddTaskBtn() {
  const addTaskBtn = document.createElement("btn");
  const plus = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>plus-circle-outline</title><path d="M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,7H11V11H7V13H11V17H13V13H17V11H13V7Z" /></svg>';
  addTaskBtn.innerHTML = plus;
  addTaskBtn.id = "addTask";
  return addTaskBtn;
}

function createProjectTasksDiv() {
  const container = document.createElement("div");
  container.classList.add("projectTasks");
  const project = app.activeProject;
  const projectTasks = project.tasks.map((task) => createProjectTask(task));
  container.append(...projectTasks);
  const addTaskBtn = createAddTaskBtn();
  const handler = (e) => {
    const newTask = app.createTask("default", "Dec 31", 1, 1, project);
    container.insertBefore(createProjectTask(newTask), e.target);
  }
  addTaskBtn.addEventListener("click", handler);
  container.appendChild(addTaskBtn);
  return container;
}


export default function render() {
  const container = document.createElement("div");
  container.classList.add("container");
  document.querySelector("body").appendChild(container);

  app.activeProject = app.defaultProject;
  const nav = createNav();
  const header = createHeader();
  const projectTasks = createProjectTasksDiv();
  container.append(nav, header, projectTasks);
}
