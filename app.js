import { getLocalData, setLocalData } from "./scripts/db.js";
import { handleDeleteTask, loadTasks } from "./scripts/interaction.js";

const userInfo = getLocalData("user-info-todo");

document.addEventListener("DOMContentLoaded", function () {
  if (userInfo?.name) {
    document.getElementById("hide-interface").style.display = "none";
    window.location.href = "/pages/home.html";
  }

  const registerForm = document.getElementById("handle-register");
  if (registerForm) {
    registerForm.addEventListener("submit", function (event) {
      event.preventDefault();

      // Retrieve form data
      const formData = new FormData(this);

      // Create an object to store form values
      const data = {};

      formData.forEach((value, key) => {
        data[key] = value;
      });

      if (!data?.name) {
        const errorMessage = "<p>Name is required!</p>";
        const errorContainer = document.getElementById("error-container");
        errorContainer.innerHTML = errorMessage;
      } else {
        setLocalData("user-info-todo", data);
        // Redirect to another page
        window.location.href = "/pages/home.html";
      }
    });
  }
});

// modal functionality
const modal = document.getElementById("modal");
const openModalBtn = document.getElementById("openModalBtn");
const closeModalBtn = document.getElementsByClassName("close")[0];

// Open the modal
openModalBtn.onclick = function () {
  modal.style.display = "block";
};

export function openModal(content) {
  const modalContent = document.getElementById("modal-content");
  modalContent.innerHTML = content;
  modal.style.display = "block";
}

// Close the modal
closeModalBtn.onclick = function () {
  modal.style.display = "none";
};

export function closeModal() {
  const modal = document.getElementById("modal");
  modal.style.display = "none";
}

// Close the modal when clicking outside
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

document.addEventListener("DOMContentLoaded", function () {
  // Append userInfo to HTML
  const userInfoContainer = document.getElementById("user-info-container");
  userInfoContainer.innerHTML = `
  <div class="img-box" id="imageBox">
    <img
      src=${
        userInfo?.avatar
          ? userInfo?.avatar
          : "../assets/sajib-hossain-official1-1-passport.jpg"
      }
      alt=""
    />
  </div>
  <div class="profile-title">
     <p>Hello!</p>
     <h2>${userInfo?.name}</h2>
  </div>`;

  loadTasks();
});

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("handleAddTaskGroup")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const titleValue = document.getElementById("title").value.toLowerCase();

      if (!titleValue) {
        const errorMessage = `<p class="error">Task title is required!</p>`;
        const errorContainer = document.getElementById("taskGroupError");
        errorContainer.innerHTML = errorMessage;
      } else {
        let previousData = getLocalData("task-groups");

        let newId;
        if (previousData) {
          const duplicate = previousData?.find(
            (name) => titleValue == name?.title
          );

          if (!duplicate) {
            newId = previousData?.length + 1;
          } else {
            const errorMessage = `<p class="error">Task title already exists</p>`;
            const errorContainer = document.getElementById("taskGroupError");
            errorContainer.innerHTML = errorMessage;
            return;
          }
        } else {
          previousData = [];
          newId = 1;
        }

        const newData = [
          ...previousData,
          {
            id: newId,
            title: titleValue,
          },
        ];

        // Save updated data
        setLocalData("task-groups", newData);
        // Close the modal after task is added
        modal.style.display = "none";
        loadTasks();
      }
    });

  document.addEventListener("dblclick", function (event) {
    if (event.target.id) {
      handleDeleteTask(event.target.closest(".task-box").dataset.id);
      loadTasks();
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const tasks = getLocalData("tasks");

  const completed = tasks?.filter((task) => task?.status == true);

  let percent = ((completed?.length / tasks?.length) * 100)?.toFixed(0);

  const countHtml = document.getElementById("count");
  countHtml.innerHTML = `<p class="text-white">${
    percent == "NaN" ? 0 : percent
  }%</p>`;
});
