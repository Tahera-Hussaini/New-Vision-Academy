import { auth, db, storage } from "./firebase.js";

import {
  doc, setDoc, getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
  ref, uploadBytes, getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

let currentUser;

/* ========================
   LOAD USER DATA
======================== */
auth.onAuthStateChanged(async (user) => {

  if (!user) {
    window.location.href = "index.html";
    return;
  }

  currentUser = user;

  // show email
  document.getElementById("email").value = user.email;
  document.getElementById("viewEmail").innerText = user.email;

  const refDoc = doc(db, "students", user.uid);
  const snap = await getDoc(refDoc);

  if (snap.exists()) {

    const data = snap.data();

    // form inputs
    document.getElementById("name").value = data.name || "";
    document.getElementById("level").value = data.level || "";
    document.getElementById("studentId").value = data.studentId || "";

    // right side view
    document.getElementById("viewName").innerText = data.name || "-";
    document.getElementById("viewLevel").innerText = data.level || "-";
    document.getElementById("viewId").innerText = data.studentId || "-";

    // profile image
    if (data.photo) {
      document.getElementById("profileImg").src = data.photo;
    }

    // progress
    const progress = calculateProgress(data.level);
    updateProgress(progress);
  }

});


/* ========================
   IMAGE PREVIEW
======================== */
document.getElementById("imageInput").addEventListener("change", function () {

  const file = this.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      document.getElementById("profileImg").src = e.target.result;
    };

    reader.readAsDataURL(file);
  }

});


/* ========================
   SAVE PROFILE
======================== */
window.saveProfile = async function () {

  const name = document.getElementById("name").value;
  const level = document.getElementById("level").value;
  const studentId = document.getElementById("studentId").value;
  const file = document.getElementById("imageInput").files[0];

  let photoURL = "";

  try {

    // upload image if exists
    if (file) {
      const fileRef = ref(storage, "profiles/" + currentUser.uid);
      await uploadBytes(fileRef, file);
      photoURL = await getDownloadURL(fileRef);
    }

    // save data
    await setDoc(doc(db, "students", currentUser.uid), {
      name,
      level,
      studentId,
      photo: photoURL || null
    }, { merge: true });

    // update UI
    document.getElementById("viewName").innerText = name;
    document.getElementById("viewLevel").innerText = level;
    document.getElementById("viewId").innerText = studentId;

    // update progress
    const progress = calculateProgress(level);
    updateProgress(progress);

    alert("Profile saved successfully ✔");

  } catch (err) {
    console.error(err);
    alert("Error saving profile ❌");
  }

};


/* ========================
   PROGRESS LOGIC
======================== */
function calculateProgress(level) {

  switch (level) {
    case "A0": return 20;
    case "A1": return 40;
    case "B1": return 60;
    case "B2": return 80;
    case "C1": return 100;
    default: return 10;
  }

}


/* ========================
   UPDATE PROGRESS BAR
======================== */
function updateProgress(value) {

  const bar = document.getElementById("progressBar");

  bar.style.width = value + "%";
  bar.innerText = value + "%";

}



document.addEventListener("DOMContentLoaded", function () {

  const uploadInput = document.getElementById("uploadImg");
  const profileImg = document.getElementById("profileImg");

  // 1. Load saved image (if exists)
  const savedImage = localStorage.getItem("profileImage");

  if (savedImage) {
    profileImg.src = savedImage;
  } else {
    profileImg.src = "img/default-user.png";
  }

  // 2. Upload new image
  uploadInput.addEventListener("change", function (e) {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = function (event) {
        const base64 = event.target.result;

        // show image
        profileImg.src = base64;

        // save permanently (browser)
        localStorage.setItem("profileImage", base64);
      };

      reader.readAsDataURL(file);
    }
  });

});

function changeEmail() {
    document.getElementById("email").value = "new@email.com";
}