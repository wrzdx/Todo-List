import { app } from "./../render";

export default function createHeader() {
  const header = document.createElement("header");
  const project = app.activeProject;
  header.innerText = project.title;
  return header;
}
