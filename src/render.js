import "./styles.css"
import TodoApp from "./logic";
import createNav from "./renderModules/nav";
import createProjectTasksDiv from "./renderModules/projectTasksDiv";
import createHeader from "./renderModules/header";

export const app = new TodoApp();

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
