import {app} from "./../render";
import createProjectTasksDiv from "./projectTasksDiv";
import { startOfToday, parseISO, format } from "date-fns";

function createTitleField(initialValue) {
  const title = document.createElement("p");
  const label = document.createElement("label");
  label.setAttribute("for", "titleField");
  label.innerText = "Title: ";
  const input = document.createElement("input");
  input.type = 'text';
  input.id = 'titleField';
  input.name = 'title';
  input.required = true;
  input.placeholder = "Type...";
  if (initialValue) {
    input.value = initialValue;
  }
  title.append(label, input);
  return title;
}

function createProjectField(initialValue=app.activeProject) {
    const project = document.createElement("p");
    const label = document.createElement("label");
    label.setAttribute("for", "projectField");
    label.innerText = "Project: ";
    const select = document.createElement("select");
    select.id = "projectField";
    select.name="project";
    select.required = true;
    select.autocomplete = true;
    for (let project of app.projects) {
        const option = document.createElement("option");
        option.value = project.id;
        option.innerText = project.title;
        if (project === initialValue) {
            option.selected = true;
        }
        select.appendChild(option);
    }
    project.append(label, select);
    return project;
}

function createPriorityField(initialValue=0) {
    const priority = document.createElement("p");
    const label = document.createElement("label");
    label.setAttribute("for", "priorityField");
    label.innerText = "Priority: ";
    const select = document.createElement("select");
    select.id = "priorityField";
    select.name="priority";
    select.required = true;
    select.autocomplete = true;
    const levels = ["Low", "Medium", "High"];
    for (let i = 0; i < levels.length; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.innerText = levels[i];
        if (i === initialValue) {
            option.selected = true;
        }
        select.appendChild(option);
    }
    priority.append(label, select);
    return priority;
}

function createDueDateField(initialValue=startOfToday()) {
    const dueDate = document.createElement("p");
    const label = document.createElement("label");
    label.setAttribute("for", "dueDateField");
    label.innerText = "Due date: ";
    const input = document.createElement("input"); 
    input.type = "date";
    input.id = "dueDateField";
    input.name = "dueDate";
    input.value = format(initialValue, "yyyy-MM-dd");
    dueDate.append(label, input);
    return dueDate;
}

function createSubmitButton(form, task) {
    const submit = document.createElement("button");
    submit.type = "submit";
    submit.innerText = 'Confirm';
    submit.classList.add("formSubmitBtn");
    submit.addEventListener(
        "click", 
        (e) => {
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }
            const args = [
                document.querySelector("#titleField").value, 
                parseISO(document.querySelector("#dueDateField").value), 
                +document.querySelector("#priorityField").value,
                "",
                app.getProject(document.querySelector("#projectField").value),
            ];
            if (task.id) {
                app.editTask(task, ...args);
            } else {
                app.createTask(...args);
            }
            const tasksDiv = document.querySelector(".projectTasks");
            tasksDiv.replaceWith(createProjectTasksDiv());
            form.parentElement.remove();
            form.remove();
    })
    
    return submit;
}

function createCloseButton() {
    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>close-circle-outline</title><path d="M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2C6.47,2 2,6.47 2,12C2,17.53 6.47,22 12,22C17.53,22 22,17.53 22,12C22,6.47 17.53,2 12,2M14.59,8L12,10.59L9.41,8L8,9.41L10.59,12L8,14.59L9.41,16L12,13.41L14.59,16L16,14.59L13.41,12L16,9.41L14.59,8Z" /></svg>'
    closeBtn.classList.add("close");
    return closeBtn;
}

function createHeader(title) {
    const header = document.createElement("h2");
    header.innerText = title;
    return header;
}

export default function createForm(task) {
  const form = document.createElement("form");
  form.classList.add("taskForm");
  const closeBtn = createCloseButton();
  closeBtn.addEventListener("click", (e) => {
    form.parentElement.remove();
    form.remove();
  });
  const header = createHeader(task.id ? "Edit Task" : "Create Task");
  const title = createTitleField(task.title);
  const project = createProjectField(task.project);
  const priority = createPriorityField(task.priority);
  const dueDate = createDueDateField(task.dueDate);
  const submitBtn = createSubmitButton(form, task);
  const container = document.createElement("div");
  container.classList.add("fields");
  container.append(title, project, priority, dueDate,)
  form.append(closeBtn, header, container, submitBtn);
  return form;
}