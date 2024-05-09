
const newButton = document.querySelector("#new");
const closeButton = document.querySelector("#closeButton");
const projectPanel = document.querySelector("#projects");
const createButton = document.querySelector("#submitButton");
const projectForm = document.querySelector("#myForm");

//render all the projects
fetch('/get_projects')
    .then(response => response.json())
    .then(data => {
        projectId = data.last_id;
        if(projectId !== 0){
            data.projects.forEach(project => {
                title = project.title;
                desc = project.description;
                date = project.date;
                id = project.id;
                currProject = createProject(title,desc,date,id);
                projectPanel.appendChild(currProject.project);
            })
        }
    })

newButton.addEventListener("click", ()=>{ 
    projectForm.style.display = "block";
});

createButton.addEventListener("click", ()=>{
    projectId += 1;
    desc = document.querySelector("#project_description");
    title = document.querySelector("#project_title");
    
    if (title.value === ""){
        alert("Please fill in title")
    } else if (desc.value === ""){
        alert("Please fill in description")
    } else {
        newProject = createProject(title.value, desc.value);
        desc.value= "";
        title.value = "";
        projectPanel.appendChild(newProject.project);
        projectForm.style.display = "none";

        fetch('/add_project', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: newProject.id,
                title: newProject.title,
                description: newProject.description,
                date: newProject.date
            })
        })
    }
});


closeButton.addEventListener("click", ()=>{
    projectForm.style.display = "none";
    document.querySelector("#project_description").value= "";
    document.querySelector("#project_title").value = "";
})



function getDate(){
    return new Date().toDateString();
}

function addChildren(list, node){
    list.forEach(element => {
        node.appendChild(element)
    });
}    

//function for projects
function createProject(title, description, dateInput=-1, idInput=-1){ 
    //object variables

    const date = dateInput == -1 ? getDate() : dateInput;
    const id = idInput == -1 ? projectId : idInput;
    const project = document.createElement("form");

    //private variables
    const descHTML = document.createElement("p");
    const titleHTML = document.createElement("h1");
    const dateHTML = document.createElement("h2");

    project.action = "/upload";

    descHTML.textContent = description;
    titleHTML.textContent = title;
    dateHTML.textContent = "Create Date: " + date;

    project.method = "GET";
    project.classList.add("project_card"); //add styling
    addChildren([titleHTML,descHTML, dateHTML], project);

    const queryParams = new URLSearchParams({ id: id });
    
    const enterProject = () => {
        fetch(`/upload?${queryParams}`, {
            method:"GET"})
        .then(response => response.json());
        project.submit();
    };

    project.addEventListener("dblclick", enterProject);


    return {id, title, description, date, project};
}


project1 = createProject("lol", "LOL");
console.log(project1.descHTML);