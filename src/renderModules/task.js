import { app } from "./../render";
import { openForm } from "./projectTasksDiv";
import createProjectTasksDiv from "./projectTasksDiv";

function createCheckbox(task) {
  const checkboxContainer = document.createElement("div");
  const input = document.createElement("input");
  input.type = "checkbox";
  input.name = "none";
  input.checked = task.status;
  checkboxContainer.appendChild(input);
  checkboxContainer.classList.add("checkbox");
  input.addEventListener("click", () => {
    task.status = !task.status;
  });
  return checkboxContainer;
}

function createTitle(task) {
  const title = document.createElement("p");
  title.classList.add("taskTitle");
  title.innerText = task.title;
  return title;
}

function createDate(task) {
  const date = document.createElement("p");
  date.classList.add("taskDate");
  date.innerText = task.formattedDate;
  return date;
}

function createEditBtn(task) {
  const editBtn = document.createElement("button");
  editBtn.id = "editBtn";
  const pencilSVG =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>pencil-outline</title><path d="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z" /></svg>';
  editBtn.innerHTML = pencilSVG;
  editBtn.addEventListener("click", (e) => {
    openForm(e, task);
  });
  return editBtn;
}

function createDeleteBtn(task) {
  const deleteBtn = document.createElement("button");
  deleteBtn.id = "deleteBtn";
  const deleteSVG =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>trash-can-outline</title><path d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z" /></svg>';
  deleteBtn.innerHTML = deleteSVG;
  deleteBtn.addEventListener("click", () => {
    app.removeTask(task);
    const tasksDiv = document.querySelector(".projectTasks");
    tasksDiv.replaceWith(createProjectTasksDiv());
  });
  return deleteBtn;
}

function createBtns(task) {
  const btns = document.createElement("div");
  btns.classList.add("btns");
  const editBtn = createEditBtn(task);
  const deleteBtn = createDeleteBtn(task);
  btns.append(editBtn, deleteBtn);
  return btns;
}

export default function createProjectTask(task) {
  const taskNode = document.createElement("div");
  taskNode.dataset.id = task.id;
  taskNode.classList.add("task");
  const checkboxContainer = createCheckbox(task);
  const title = createTitle(task);
  const date = createDate(task);
  const btns = createBtns(task);
  const colors = {
    0: "#3B67B6",
    1: "#048C04",
    2: "#d64700",
  };
  taskNode.style.borderLeft = `16px solid ${colors[task.priority]}`;
  taskNode.append(checkboxContainer, title, date, btns);
  return taskNode;
}
