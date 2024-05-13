
const newButton = document.querySelector("#new");
const closeButton = document.querySelector("#closeButton");
const projectPanel = document.querySelector("#projects");
const createButton = document.querySelector("#submitButton");
const projectForm = document.querySelector("#myForm");

//render all the projects
document.addEventListener("DOMContentLoaded", function(){
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
    });
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
    const header = document.createElement("div");

    project.action = "/upload";

    descHTML.textContent = description;
    titleHTML.textContent = title;
    dateHTML.textContent = "Create Date: " + date;

    project.method = "GET";
    project.classList.add("project_card"); //add styling

    addChildren([titleHTML, createDotMenu(id)], header);
    addChildren([header,descHTML, dateHTML], project);

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


function createDotMenu(project_id){
    const dropdown = document.createElement("div"); 
    const menu = document.createElement("div"); //drop menu
    const icon = document.createElement("ul"); //dots

    icon.classList.add("icons", "dropbtn");
    menu.classList.add("dropdown_content");    
    menu.style.display = "none";
    dropdown.appendChild(icon);
    dropdown.appendChild(menu);

    const op = document.createElement("a");
    op.textContent = "open";
    op.href = "/upload";
    const rename = document.createElement("a");
    rename.textContent = "rename";
    const del = document.createElement("a");
    del.textContent = "delete";

    addChildren([op,rename,del], menu);

    for(let i = 0; i<3; i++){
        icon.appendChild(document.createElement("li"));
    };

    icon.addEventListener('click', () =>{
        menu.style.display = "flex";
    })

    del.addEventListener('click', () =>{
        if(confirm("Are you sure you want to delete this project?")){
            fetch(`/remove_project/${project_id}`)
            .then(response => response.json());
            location.reload();
        }
    });

    op.addEventListener('click', ()=>{
        fetch('/upload')
        .then(response => response.json());
    })

    return dropdown
}

document.addEventListener("DOMContentLoaded", function(){
    window.addEventListener('click', (e) => {
        let menus = document.querySelectorAll(".dropdown_content, .dropbtn");
        let target = e.target;
        console.log(menus);
        if (!Array.from(menus).some(element => element.contains(target))){
            menus.forEach((element)=>{
                if(!element.classList.contains("dropbtn")){
                    element.style.display = "none";
                }

            })
        }
    })
})

