document.getElementById('documentInput').addEventListener('change', function(event) {
    handleFileUpload(event.target.files);
});

document.getElementById('criteriaInput').addEventListener('change', function(event) {
    displayFile(event.target.files[0], 'criteriaDisplay');
});

document.getElementById('toggleSidebar').addEventListener('click', function(event) {
    document.querySelector('.sidebar').classList.toggle('active');
    updateDocumentList(); 
    event.stopPropagation(); // Prevent click from being registered on the document
});

document.addEventListener('click', function(event) {
    var sidebar = document.querySelector('.sidebar');
    var clickInsideSidebar = sidebar.contains(event.target);
    if (!clickInsideSidebar && sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
    }
});

// To prevent clicks within the sidebar from closing it
document.querySelector('.sidebar').addEventListener('click', function(event) {
    event.stopPropagation();
});

let uploadedFiles = [];
let currentIndex = 0;

function handleFileUpload(files) {
    uploadedFiles = Array.from(files);
    currentIndex = 0; // Reset index to show the first file
    displayCurrentFile();
    updateDocumentList(); // Update the document list in the sidebar
}

function updateDocumentList() {
    const list = document.getElementById('documentList');
    list.innerHTML = ''; // Clear existing list items

    if (uploadedFiles.length === 0) {
        // Display a message when there are no documents
        const noDocsItem = document.createElement('li');
        noDocsItem.textContent = 'No documents to view. Upload some files!';
        list.appendChild(noDocsItem);
    } else {
        uploadedFiles.forEach((file, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = file.name; // Use file names as list items
            listItem.onclick = () => {
                currentIndex = index; // Update currentIndex to clicked item
                displayCurrentFile(); // Display the clicked document
            };
            list.appendChild(listItem);
        });
    }
}


function displayCurrentFile() {
    if (uploadedFiles.length === 0) return;
    displayFile(uploadedFiles[currentIndex], 'documentDisplay');
}

function displayFile(file, displayId) {
    const displayElement = document.getElementById(displayId);

    displayElement.innerHTML = ''; // Clear the display area

    if (file.type.match('image.*')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            displayElement.appendChild(img);
        };
        reader.readAsDataURL(file);
    } else if (file.type.match('audio.*')) {
        const audio = document.createElement('audio');
        audio.src = URL.createObjectURL(file);
        audio.controls = true;
        displayElement.appendChild(audio);
    } else if (file.type.match('video.*')) {
        const video = document.createElement('video');
        video.src = URL.createObjectURL(file);
        video.controls = true;
        displayElement.appendChild(video);
    } else if (file.type === 'application/pdf') {
        const object = document.createElement('object');
        object.data = URL.createObjectURL(file);
        object.type = "application/pdf";
        object.style.height = "100%";
        object.style.width = "100%";
        displayElement.appendChild(object);
    }
}

// Keyboard navigation for files
document.addEventListener('keydown', function(event) {
    if (uploadedFiles.length === 0) return;

    if (event.key === 'ArrowRight') {
        currentIndex = (currentIndex + 1) % uploadedFiles.length; // Move to the next file
        displayCurrentFile();
    } else if (event.key === 'ArrowLeft') {
        if (currentIndex === 0) {
            currentIndex = uploadedFiles.length - 1; // Move to the last file if at the first file
        } else {
            currentIndex--; // Move to the previous file
        }
        displayCurrentFile();
    }
});

document.getElementById('nextFile').addEventListener('click', function() {
    if (uploadedFiles.length === 0) return;
    currentIndex = (currentIndex + 1) % uploadedFiles.length; // Move to the next file
    displayCurrentFile();
});

document.getElementById('prevFile').addEventListener('click', function() {
    if (uploadedFiles.length === 0) return;
    if (currentIndex === 0) {
        currentIndex = uploadedFiles.length - 1; // Move to the last file if at the first file
    } else {
        currentIndex--; // Move to the previous file
    }
    displayCurrentFile();
});

//Upload Process for popup markign criteria 

document.getElementById('singleFileUpload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        displayFileInPopup(file);
    }
});

document.getElementById('uploadIcon').addEventListener('click', function() {
    const popup = document.getElementById('filePopup');
    popup.style.display = popup.style.display === 'none' ? 'block' : 'none';
});

document.getElementById('closePopup').addEventListener('click', function() {
    document.getElementById('filePopup').style.display = 'none';
});

function displayFileInPopup(file) {
    const fileContent = document.getElementById('fileContent');
    fileContent.innerHTML = ''; // Clear previous content

    // Create an object element for PDF display
    const pdfObject = document.createElement('object');
    pdfObject.type = 'application/pdf';
    pdfObject.data = URL.createObjectURL(file);
    pdfObject.style.width = '100%';
    pdfObject.style.height = '500px';


    fileContent.appendChild(pdfObject);

    // Show the popup if not already visible
    document.getElementById('filePopup').style.display = 'block';
}


// Implement draggable functionality for filePopup
let isDragging = false;

const dragPopup = document.getElementById('filePopup');
dragPopup.onmousedown = function(e) {
    isDragging = true;
    let deltaX = e.clientX - dragPopup.getBoundingClientRect().left;
    let deltaY = e.clientY - dragPopup.getBoundingClientRect().top;

    document.onmousemove = function(e) {
        if (isDragging) {
            dragPopup.style.left = e.clientX - deltaX + 'px';
            dragPopup.style.top = e.clientY - deltaY + 'px';
        }
    };

    document.onmouseup = function() {
        isDragging = false;
        document.onmousemove = null;
        document.onmouseup = null;
    };
};

//Code to resize the pop up window (To fix: highlighting backgorund stuff while moving, moving outside constraints, asks for file everytime pop up is clicked)

let isResizing = false;

const popup = document.getElementById('filePopup');
const resizeHandle = document.getElementById('resizeHandle');

resizeHandle.addEventListener('mousedown', function(e) {
    e.preventDefault(); // Prevent default action (text selection, etc.)
    isResizing = true;

    let prevX = e.clientX;
    let prevY = e.clientY;

    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResize);

    function resize(e) {
        if (!isResizing) return;

        const rect = popup.getBoundingClientRect();
        popup.style.width = rect.width - (prevX - e.clientX) + "px";
        popup.style.height = rect.height - (prevY - e.clientY) + "px";

        prevX = e.clientX;
        prevY = e.clientY;
    }

    function stopResize() {
        window.removeEventListener('mousemove', resize);
        window.removeEventListener('mouseup', stopResize);
        isResizing = false;
    }
});

