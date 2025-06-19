import {app} from "./../render";
import createForm from "./form";
import createProjectTask from "./task";

function createAddTaskBtn() {
  const addTaskBtn = document.createElement("button");
  const plus = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>plus-circle-outline</title><path d="M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,7H11V11H7V13H11V17H13V13H17V11H13V7Z" /></svg>';
  addTaskBtn.innerHTML = plus;
  addTaskBtn.id = "addTask";
  return addTaskBtn;
}

export function openForm(e, task={}) {
    const body = document.querySelector(".container");
    const overlay = document.createElement("div");
    overlay.classList.add("overlay");
    const form = createForm(task);
    overlay.appendChild(form);
    body.appendChild(overlay);
}

export default function createProjectTasksDiv() {
  const container = document.createElement("div");
  container.classList.add("projectTasks");
  const project = app.activeProject;
  const projectTasks = project.tasks.map((task) => createProjectTask(task));
  container.append(...projectTasks);
  const addTaskBtn = createAddTaskBtn();
  addTaskBtn.addEventListener("click", openForm);
  container.appendChild(addTaskBtn);
  return container;
}