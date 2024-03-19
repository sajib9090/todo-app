import { closeModal } from "../app.js";
import { getLocalData, setLocalData } from "./db.js";
import {
  completeAllFunc,
  handleEditIncomplete,
  loadAllCompletedTasks,
  loadAllIncompleteTasks,
  loadAllTasks,
  removeCompletedFunc,
  removeFunc,
  removeIncompleteFunc,
} from "./interaction.js";
const taskGroup = getLocalData("task-groups");
const tasks = getLocalData("tasks");

document.addEventListener("DOMContentLoaded", function () {
  let tabButtons = document.getElementsByClassName("tablinks");
  for (let i = 0; i < tabButtons.length; i++) {
    tabButtons[i].addEventListener("click", function () {
      let tabName = this.id.replace("Tab", ""); // Remove "Tab" from ID to get tabName
      openTab(tabName);
    });
  }
  loadAllTasks();
  loadAllCompletedTasks();
  loadAllIncompleteTasks();
});

function openTab(tabName) {
  let tabContents = document.getElementsByClassName("tabcontent");
  for (let i = 0; i < tabContents.length; i++) {
    tabContents[i].style.display = "none";
  }

  let tabButtons = document.getElementsByClassName("tablinks");
  for (let i = 0; i < tabButtons.length; i++) {
    tabButtons[i].classList.remove("active");
  }

  let tabContent = document.getElementById(tabName + "Content");
  if (tabContent) {
    tabContent.style.display = "block";
  }

  let tabButton = document.getElementById(tabName + "Tab");
  if (tabButton) {
    tabButton.classList.add("active");
  }
}

// form
document.addEventListener("DOMContentLoaded", function () {
  //get task group

  const selectElement = document.getElementById("taskGroupSelect");

  selectElement.innerHTML = "";

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select an option";
  defaultOption.disabled = true;
  defaultOption.selected = true;
  selectElement.appendChild(defaultOption);

  taskGroup.forEach((group) => {
    const option = document.createElement("option");
    option.value = group.title;
    option.textContent = group.title;
    selectElement.appendChild(option);
  });

  const form = document.getElementById("handleAddTask");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    // Get the values of all form fields
    const descriptionValue = document.getElementById("description").value;
    const dateValue = document.getElementById("date").value;
    const timeValue = document.getElementById("time").value;
    const selectElement = document.getElementById("taskGroupSelect");
    const selectedValue = selectElement.value;

    if (!selectedValue) {
      const errorMessage = `<p class="text-red">Task group is required!</p>`;
      const errorContainer = document.getElementById("taskErrorGroup");
      errorContainer.innerHTML = errorMessage;
    }
    if (!descriptionValue) {
      const errorMessage = `<p class="text-red">Task description is required!</p>`;
      const errorContainer = document.getElementById("taskErrorDescription");
      errorContainer.innerHTML = errorMessage;
    }
    if (descriptionValue?.length > 200) {
      const errorMessage = `<p class="text-red">Task description max 200 characters!</p>`;
      const errorContainer = document.getElementById("taskErrorDescription");
      errorContainer.innerHTML = errorMessage;
    }
    if (!dateValue) {
      const errorMessage = `<p class="text-red">Date is required!</p>`;
      const errorContainer = document.getElementById("taskErrorDate");
      errorContainer.innerHTML = errorMessage;
    }
    if (!timeValue) {
      const errorMessage = `<p class="text-red">Time is required!</p>`;
      const errorContainer = document.getElementById("taskErrorTime");
      errorContainer.innerHTML = errorMessage;
    } else {
      let previousData = getLocalData("tasks");

      let newId;

      if (previousData) {
        newId = previousData?.length + 1;
      } else {
        previousData = [];
        newId = 1;
      }

      const newData = [
        ...previousData,
        {
          id: newId,
          group: selectedValue,
          description: descriptionValue?.toLowerCase(),
          date: dateValue,
          time: timeValue,
          status: false,
        },
      ];

      setLocalData("tasks", newData);
      loadAllTasks();
      loadAllIncompleteTasks();
      closeModal();
    }
  });

  const deleteAll = document.getElementById("deleteAll");
  const completeAll = document.getElementById("completeAll");

  removeFunc(deleteAll);

  completeAllFunc(completeAll);

  const deleteAllCompleted = document.getElementById("deleteAllCompleted");
  removeCompletedFunc(deleteAllCompleted);

  const deleteAllIncomplete = document.getElementById("deleteAllIncomplete");
  removeIncompleteFunc(deleteAllIncomplete);

  document.querySelectorAll(".task-box-1").forEach(function (element) {
    element.addEventListener("dblclick", function () {
      handleEditIncomplete(element.getAttribute("data-id"));
    });
  });
});
