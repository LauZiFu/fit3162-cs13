document.getElementById('documentInput').addEventListener('change', function(event) {
    handleFileUpload(event.target.files);
});

document.getElementById('criteriaInput').addEventListener('change', function(event) {
    displayFile(event.target.files[0], 'criteriaDisplay');
});

let uploadedFiles = [];
let currentIndex = 0;

function handleFileUpload(files) {
    uploadedFiles = Array.from(files);
    currentIndex = 0; // Reset index to show the first file
    displayCurrentFile();
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
