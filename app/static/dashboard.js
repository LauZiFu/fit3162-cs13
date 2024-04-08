
const newButton = document.querySelector("#new");
const projectPanel = document.querySelector("#projects");

newButton.addEventListener("click", ()=>{
    let project = document.createElement("div");
    let title = document.createElement("h2");
    let content = document.createElement("p");

    project.classList.add("project_card");
    project.appendChild(title);
    project.appendChild(content);
    projectPanel.appendChild(project);
});

