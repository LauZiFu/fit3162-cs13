// document.getElementById('documentInput').addEventListener('change', function(event) {
//     handleFileUpload(event.target.files);
// });

// document.getElementById('criteriaInput').addEventListener('change', function(event) {
//     displayFile(event.target.files[0], 'criteriaDisplay');
// });

// document.getElementById('toggleSidebar').addEventListener('click', function(event) {
//     document.querySelector('.sidebar').classList.toggle('active');
//     updateDocumentList(); 
//     event.stopPropagation(); // Prevent click from being registered on the document
// });

// document.addEventListener('click', function(event) {
//     var sidebar = document.querySelector('.sidebar');
//     var clickInsideSidebar = sidebar.contains(event.target);
//     if (!clickInsideSidebar && sidebar.classList.contains('active')) {
//         sidebar.classList.remove('active');
//     }
// });

// // To prevent clicks within the sidebar from closing it
// document.querySelector('.sidebar').addEventListener('click', function(event) {
//     event.stopPropagation();
// });

// let uploadedFiles = [];
// let currentIndex = 0;

// let feedbackStorage = {};

// document.getElementById('saveFeedback').addEventListener('click', saveFeedback);

// function refreshFeedbackBox() {
//     const currentFileName = uploadedFiles[currentIndex] ? uploadedFiles[currentIndex].name : "";
//     document.getElementById('documentFeedback').value = feedbackStorage[currentFileName] || "";
// }

// function saveFeedback() {
//     if (uploadedFiles.length === 0 || currentIndex < 0) {
//         alert("Please select a document to save feedback.");
//         return;
//     }
//     const currentFileName = uploadedFiles[currentIndex].name;
//     const feedbackText = document.getElementById('documentFeedback').value;
//     feedbackStorage[currentFileName] = feedbackText;
//     alert("Feedback saved for " + currentFileName);
// }


// function handleFileUpload(files) {
//     uploadedFiles = Array.from(files);
//     currentIndex = 0; // Reset index to show the first file
//     displayCurrentFile();
//     updateDocumentList(); // Update the document list in the sidebar
// }

// function updateDocumentList() {
//     const list = document.getElementById('documentList');
//     list.innerHTML = ''; // Clear existing list items

//     if (uploadedFiles.length === 0) {
//         // Display a message when there are no documents
//         const noDocsItem = document.createElement('li');
//         noDocsItem.textContent = 'No documents to view. Upload some files!';
//         list.appendChild(noDocsItem);
//     } else {
//         uploadedFiles.forEach((file, index) => {
//             const listItem = document.createElement('li');
//             listItem.textContent = file.name; // Use file names as list items
//             listItem.onclick = () => {
//                 currentIndex = index; // Update currentIndex to clicked item
//                 displayCurrentFile(); // Display the clicked document
//             };
//             list.appendChild(listItem);
//         });
//     }
// }


// function displayCurrentFile() {
//     if (uploadedFiles.length === 0) return;
//     displayFile(uploadedFiles[currentIndex], 'documentDisplay');
// }

// function displayFile(file, displayId) {
//     const displayElement = document.getElementById(displayId);

//     displayElement.innerHTML = ''; // Clear the display area

//     if (file.type.match('image.*')) {
//         const reader = new FileReader();
//         reader.onload = function(e) {
//             const img = document.createElement('img');
//             img.src = e.target.result;
//             displayElement.appendChild(img);
//         };
//         reader.readAsDataURL(file);
//     } else if (file.type.match('audio.*')) {
//         const audio = document.createElement('audio');
//         audio.src = URL.createObjectURL(file);
//         audio.controls = true;
//         displayElement.appendChild(audio);
//     } else if (file.type.match('video.*')) {
//         const video = document.createElement('video');
//         video.src = URL.createObjectURL(file);
//         video.controls = true;
//         displayElement.appendChild(video);
//     } else if (file.type === 'application/pdf') {
//         const object = document.createElement('object');
//         object.data = URL.createObjectURL(file);
//         object.type = "application/pdf";
//         object.style.height = "100%";
//         object.style.width = "100%";
//         displayElement.appendChild(object);
//     }
// }

// // Keyboard navigation for files
// document.addEventListener('keydown', function(event) {
//     if (uploadedFiles.length === 0) return;

//     if (event.key === 'ArrowRight') {
//         currentIndex = (currentIndex + 1) % uploadedFiles.length; // Move to the next file
//         displayCurrentFile();
//         refreshFeedbackBox();
//     } else if (event.key === 'ArrowLeft') {
//         if (currentIndex === 0) {
//             currentIndex = uploadedFiles.length - 1; // Move to the last file if at the first file
//         } else {
//             currentIndex--; // Move to the previous file
//         }
//         displayCurrentFile();
//         refreshFeedbackBox();
//     }
// });

// document.getElementById('nextFile').addEventListener('click', function() {
//     if (uploadedFiles.length === 0) return;
//     currentIndex = (currentIndex + 1) % uploadedFiles.length; // Move to the next file
//     displayCurrentFile();
//     refreshFeedbackBox();
// });

// document.getElementById('prevFile').addEventListener('click', function() {
//     if (uploadedFiles.length === 0) return;
//     if (currentIndex === 0) {
//         currentIndex = uploadedFiles.length - 1; // Move to the last file if at the first file
//     } else {
//         currentIndex--; // Move to the previous file
//     }
//     displayCurrentFile();
//     refreshFeedbackBox();
// });


// document.getElementById('submitFeedback').addEventListener('click', function() {
//     // Check if no files have been uploaded
//     if (uploadedFiles.length === 0) {
//         alert("Please upload files before submitting feedback.");
//         return; // Exit the function early
//     }
    
//     const feedbackText = document.getElementById('documentFeedback').value;
//     const currentFileName = uploadedFiles[currentIndex].name; // Assuming this holds the current file name
    
//     // Initialize jsPDF
//     const { jsPDF } = window.jspdf;
//     const doc = new jsPDF();

//     // Add feedback text to PDF
//     doc.text(feedbackText, 10, 10);
    
//     // Generate download filename based on the current document
//     const downloadName = currentFileName.replace(/\.[^/.]+$/, "") + "_feedback.pdf";
    
//     // Save the PDF
//     doc.save(downloadName);
// });





// //save everything to database instead of local sotrage and then be able to load
// //keep header fixed in position

