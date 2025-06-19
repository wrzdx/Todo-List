import {app} from "./../render";
import createHeader from "./header";
import createProjectTasksDiv from "./projectTasksDiv";


function createProfileDiv() {
  const profile = document.createElement("div");
  const accountSVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>account-circle</title><path d="M12,19.2C9.5,19.2 7.29,17.92 6,16C6.03,14 10,12.9 12,12.9C14,12.9 17.97,14 18,16C16.71,17.92 14.5,19.2 12,19.2M12,5A3,3 0 0,1 15,8A3,3 0 0,1 12,11A3,3 0 0,1 9,8A3,3 0 0,1 12,5M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12C22,6.47 17.5,2 12,2Z" /></svg>';
  profile.innerHTML = accountSVG;
  
  const name = document.createElement("p");
  name.innerText = "User";
  
  profile.appendChild(name);
  profile.classList.add("profile");
  
  return profile;
}

function createDeleteBtn(project) {
  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("deleteProjectBtn");
  const deleteSVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>trash-can-outline</title><path d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z" /></svg>'; 
  deleteBtn.innerHTML = deleteSVG;
  deleteBtn.addEventListener("click", (e) => {
    app.removeProject(project);
    app.activeProject = app.defaultProject;
    const projectsTasksDiv = document.querySelector(".projectTasks");
    const projects = document.querySelector(".projects");
    projects.replaceWith(createProjects());
    projectsTasksDiv.replaceWith(createProjectTasksDiv());
    const header = document.querySelector("header");
    header.replaceWith(createHeader());
  });

  return deleteBtn;
}

function createTab(project) {
  const folderSVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>folder</title><path d="M10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6H12L10,4Z" /></svg>'
  const tab = document.createElement("button");
  tab.classList.add("tab");
  tab.innerHTML = folderSVG;
  const titleSpan = document.createElement("span");
  titleSpan.classList.add("projectTitle");
  titleSpan.textContent = project.title;
  titleSpan.addEventListener("dblclick", (e) => {
    e.stopPropagation();
    
    const currentText = titleSpan.textContent;
    const input = document.createElement("input");
    input.type = "text";
    input.value = currentText;
    input.classList.add("title-edit-input");
    
    titleSpan.textContent = "";
    titleSpan.appendChild(input);
    input.focus();
    
    const saveTitle = () => {
      const newTitle = input.value.trim();
      if (newTitle && newTitle !== currentText) {
        titleSpan.textContent = newTitle;
        app.editProject(project, newTitle, "");
        const header = document.querySelector("header");
        header.replaceWith(createHeader());
      } else {
        titleSpan.textContent = currentText;
      }
    };
    
    input.addEventListener("blur", saveTitle);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") saveTitle();
      if (e.key === "Escape") titleSpan.textContent = currentText;
    });
  });
  tab.dataset.id = project.id;
  if (project.id === app.activeProject.id) {
    tab.classList.add("active");
  }
  tab.appendChild(titleSpan);
  tab.addEventListener("mouseenter", (e) => {
    tab.appendChild(createDeleteBtn(project));
  });
  tab.addEventListener("mouseleave", (e) => {
    for (let child of tab.children) {
      if (child.classList.contains("deleteProjectBtn")) {
        child.remove();
      }
    }
  });
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
      newTab.children.item(1).dispatchEvent(new MouseEvent("dblclick"))
    } else if (e.target.classList.contains("tab") || 
                e.target.classList.contains("projectTitle")) {
      const oldActiveProjectTab = document.querySelector(".active");
      oldActiveProjectTab.classList.remove("active");
      const tabNode = e.target.classList.contains("tab") ? e.target : e.target.parentNode;
      tabNode.classList.add("active");
      const projectId = tabNode.dataset.id;
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

export default function createNav() {
  const nav = document.createElement("nav");
  nav.classList.add("nav");

  const profile = createProfileDiv();
  const projects = createProjects();
  const footer = createFooter();
  nav.append(profile, projects, footer);
  return nav;
}

