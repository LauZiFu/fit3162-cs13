
const newButton = document.querySelector("#new");
const projectPanel = document.querySelector("#projects");

newButton.addEventListener("click", ()=>{
    let project = document.createElement("div");
    project.classList.add("project_card");
    projectPanel.appendChild(project);
});

