
const newButton = document.querySelector("#new");
const closeButton = document.querySelector("#closeButton");
const projectPanel = document.querySelector("#projects");
const createButton = document.querySelector("#submitButton");
const projectForm = document.querySelector("#myForm");

newButton.addEventListener("click", ()=>{
    projectForm.style.display = "block";
});

closeButton.addEventListener("click", ()=>{
    projectForm.style.display = "none";
    document.querySelector("#project_description").value= "";
    document.querySelector("#project_title").value = "";
})

createButton.addEventListener("click", ()=>{
    let description = document.createElement("p");
    let projectTitle = document.createElement("h1");
    let projectCard = document.createElement("form");
    let enter = document.createElement("button");
    
    enter.type = "submit";
    enter.textContent = "Enter Project";
    description.textContent = document.querySelector("#project_description").value;
    projectTitle.textContent = document.querySelector("#project_title").value;
    
    projectCard.method = "post";
    projectCard.classList.add("project_card");
    projectCard.appendChild(projectTitle);
    projectCard.appendChild(description);
    projectCard.appendChild(enter);
    projectPanel.appendChild(projectCard);

    projectForm.style.display = "none";
    document.querySelector("#project_description").value= "";
    document.querySelector("#project_title").value = "";
})

