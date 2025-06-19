import "./styles.css"
import loadApp from "./logic";
import createNav from "./renderModules/nav";
import createProjectTasksDiv from "./renderModules/projectTasksDiv";
import createHeader from "./renderModules/header";

export let app = loadApp();

export default function render() {
  const body = document.querySelector("body");
  body.innerHTML = "";
  const container = document.createElement("div");
  container.classList.add("container");
  body.appendChild(container);

  app.activeProject = app.defaultProject;
  const nav = createNav();
  const header = createHeader();
  const projectTasks = createProjectTasksDiv();
  container.append(nav, header, projectTasks);
}
