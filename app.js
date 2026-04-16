let user = localStorage.getItem("user") || "Student";

/* PROFILE */
function loadProfile(){
  const el = document.getElementById("studentName");
  if(el) el.innerText = user;
}
loadProfile();

/* LOGOUT */
function logout(){
  localStorage.removeItem("user");
  location.href = "Login.html";
}

/* ================= LIBRARY ================= */

function uploadFile(){
  const fileInput = document.getElementById("fileInput");
  const fileName = document.getElementById("fileName").value;

  if(!fileInput.files[0]) return;

  const file = fileInput.files[0];

  const reader = new FileReader();

  reader.onload = function(e){

    let files = JSON.parse(localStorage.getItem("files")) || [];

    files.unshift({
      name: fileName || file.name,
      data: e.target.result,
      type: file.type
    });

    localStorage.setItem("files", JSON.stringify(files));
    showFiles();
  };

  reader.readAsDataURL(file);
}

function showFiles(){
  const box = document.getElementById("fileList");
  if(!box) return;

  let files = JSON.parse(localStorage.getItem("files")) || [];

  box.innerHTML = "";

  files.forEach(f=>{
    box.innerHTML += `
      <div class="file-card">
        <b>${f.name}</b><br>
        <small>${f.type}</small><br>
        <a href="${f.data}" download class="btn btn-success btn-sm mt-2">
          Download
        </a>
      </div>
    `;
  });
}
showFiles();

/* ================= ANNOUNCEMENTS ================= */

function addAnnouncement(){
  let title = document.getElementById("title").value;
  let msg = document.getElementById("message").value;

  if(!title || !msg) return;

  let data = JSON.parse(localStorage.getItem("ann")) || [];

  data.unshift({
    title,
    msg,
    date: new Date().toLocaleString()
  });

  localStorage.setItem("ann", JSON.stringify(data));
  showAnn();
}

function showAnn(){
  const box = document.getElementById("announcementList");
  if(!box) return;

  let data = JSON.parse(localStorage.getItem("ann")) || [];

  box.innerHTML = "";

  data.forEach(a=>{
    box.innerHTML += `
      <div class="ann-card">
        <h5>${a.title}</h5>
        <p>${a.msg}</p>
        <small>${a.date}</small>
      </div>
    `;
  });
}
showAnn();





import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "XXXX",
  appId: "XXXX"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

window.uploadHomework = async function () {

  const file = document.getElementById("fileInput").files[0];
  const status = document.getElementById("status");

  if (!file) {
    status.innerText = "Please select a file";
    return;
  }

  try {

    status.innerText = "Uploading...";

    // unique file name
    const fileRef = ref(storage, "homework/" + Date.now() + "_" + file.name);

    // upload
    await uploadBytes(fileRef, file);

    // get link
    const url = await getDownloadURL(fileRef);

    console.log("File URL:", url);

    status.innerText = "Uploaded successfully ✔";

  } catch (error) {
    status.innerText = "Upload failed ❌";
    console.error(error);
  }
};
