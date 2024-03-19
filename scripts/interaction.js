import { openModal } from "../app.js";
import { getLocalData, setLocalData } from "./db.js";

function handleDeleteTask(itemId) {
  const tasks = getLocalData("task-groups");
  const find = tasks?.find((tg) => itemId == tg?.id);

  if (find) {
    const filtered = tasks?.filter((task) => find !== task);
    setLocalData("task-groups", [...filtered]);
  }
}

function loadTasks() {
  const tasksGroup = getLocalData("task-groups");
  const tasks = getLocalData("tasks");

  if (Array.isArray(tasksGroup) || Array.isArray(tasks)) {
    const groupedTasks = {};

    tasksGroup.forEach((group) => {
      const groupTasks = tasks?.filter((task) => task?.group === group?.title);
      groupedTasks[group.title] = groupTasks;
    });

    const tasksContainer = document.getElementById("task-group-data");

    const taskGroupHTML = tasksGroup?.map((taskGroup) => {
      const groupTasks = groupedTasks[taskGroup.title];
      const totalTasksCount = groupTasks?.length;
      const completedTasksCount = groupTasks?.filter(
        (task) => task?.status === true
      )?.length;
      const completionRate =
        totalTasksCount > 0 ? (completedTasksCount / totalTasksCount) * 100 : 0;

      return ` 
        <div data-id="${
          taskGroup.id
        }" id="task-delete" class="task-box flex justify-between items-center px-15 cursor-pointer" title="Double click to remove">
          <div class="flex items-center">
            <div class="task-logo flex justify-center items-center">
              <h1>${taskGroup.title ? taskGroup.title[0] : ""}</h1>
            </div>
            <div class="task-info">
              <h3 class="capitalize">${taskGroup.title}</h3>
              <p>${
                completedTasksCount ? completedTasksCount : 0
              } tasks out of ${totalTasksCount ? totalTasksCount : 0}</p>
            </div>
          </div>
          <div class="task-progress flex items-center justify-center">
            <p>${completionRate.toFixed(0)}%</p>
          </div>
        </div>`;
    });
    tasksContainer.innerHTML = taskGroupHTML.join("");
  }

  const totalTaskCount = document.getElementById("totalTaskItem");
  totalTaskCount.innerHTML = `
    <p class="text-primary">${tasksGroup?.length}</p>
  `;
}

function loadAllTasks() {
  const tasks = getLocalData("tasks");

  const totalTasks = document.getElementById("allCount");
  totalTasks.innerText = tasks?.length;
  const totalTaskCount = document.getElementById("totalTask");
  totalTaskCount.innerHTML = `
  <h3 class="text-primary ml-3">${tasks?.length}</h3>
  `;

  const tasksContainer = document.getElementById("task-data");
  const taskHTML = tasks?.map((task) => {
    return ` 
    <div class="task-box flex justify-between items-center px-15 py-8">
            <div class="task-info flex items-center">
            <div class="checkbox">
            <input type="checkbox" id=${task?.id}>
            </div>
              <div>
              <h3>${task?.group}</h3>
              <p>${task?.description}</p>
              <p>${task?.date}</p>
              <p>${task?.time}</p>
              </div>
            </div>
            <div>
            <p class="px-15 py-4 status ${
              task?.status ? "bg-primary text-white" : "bg-secondary text-white"
            }">${task?.status ? "completed" : "incomplete"}</p>
            </div>
          </div>
`;
  });
  tasksContainer.innerHTML = taskHTML.join("");
  return;
}

function removeFunc(deleteAll) {
  deleteAll.addEventListener("click", function () {
    const checkedTaskIds = [];

    // Select all checkboxes
    const checkboxes = document.querySelectorAll(
      '.task-box input[type="checkbox"]'
    );

    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        checkedTaskIds.push(checkbox.id);
      }
    });

    const allTasks = getLocalData("tasks");
    const parsedCheckedTaskIds = checkedTaskIds?.map((id) => parseInt(id, 10));
    if (parsedCheckedTaskIds == 0) {
      const errorMessage = `<p class="text-red">No item marked</p>`;
      const errorContainer = document.getElementById("taskError");
      errorContainer.innerHTML = errorMessage;
    } else {
      const errorContainer = document.getElementById("taskError");
      errorContainer.innerHTML = "";

      const filteredTasks = allTasks.filter(
        (task) => !parsedCheckedTaskIds.includes(task.id)
      );

      setLocalData("tasks", [...filteredTasks]);
      loadAllTasks();
      loadAllIncompleteTasks();
      loadAllCompletedTasks();
    }
  });
  return;
}

function completeAllFunc(completeAll) {
  completeAll.addEventListener("click", function () {
    const checkedTaskIds = [];
    const checkboxes = document.querySelectorAll(
      '.task-box input[type="checkbox"]'
    );

    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        checkedTaskIds.push(checkbox.id);
      }
    });
    const allTasks = getLocalData("tasks");
    const parsedCheckedTaskIds = checkedTaskIds?.map((id) => parseInt(id, 10));
    if (parsedCheckedTaskIds == 0) {
      const errorMessage = `<p class="text-red">No item marked</p>`;
      const errorContainer = document.getElementById("taskErrorComplete");
      errorContainer.innerHTML = errorMessage;
    } else {
      const errorContainer = document.getElementById("taskErrorComplete");
      errorContainer.innerHTML = "";

      const filteredTasks = allTasks.filter((task) =>
        parsedCheckedTaskIds.includes(task.id)
      );

      const updatedTasks = allTasks.map((task) => {
        if (parsedCheckedTaskIds.includes(task.id)) {
          return {
            ...task,
            status: true,
          };
        }
        return task;
      });

      setLocalData("tasks", updatedTasks);
      loadAllTasks();
      loadAllCompletedTasks();
      loadAllIncompleteTasks();
    }
  });
  return;
}

function loadAllCompletedTasks() {
  const tasks = getLocalData("tasks");

  const completed = tasks?.filter((task) => task.status == true);

  const totalTasks = document.getElementById("allCompleteCount");
  totalTasks.innerText = completed?.length;

  const totalTaskCount = document.getElementById("completedTotalTask");
  totalTaskCount.innerHTML = `
  <h3 class="text-primary ml-3">${completed?.length}</h3>
  `;

  const tasksContainer = document.getElementById("task-data-completed");
  const taskHTML = completed?.map((task) => {
    return ` 
    <div class="task-box flex justify-between items-center px-15 py-8">
            <div class="task-info flex items-center">
            <div class="checkbox">
            <input type="checkbox" id=${task?.id}>
            </div>
              <div>
              <h3>${task?.group}</h3>
              <p>${task?.description}</p>
              <p>${task?.date}</p>
              <p>${task?.time}</p>
              </div>
            </div>
            <div>
            <p class="px-15 py-4 status ${
              task?.status ? "bg-primary text-white" : "bg-secondary text-white"
            }">${task?.status ? "completed" : "incomplete"}</p>
            </div>
          </div>
`;
  });
  tasksContainer.innerHTML = taskHTML.join("");
  return;
}

function removeCompletedFunc(deleteAll) {
  deleteAll.addEventListener("click", function () {
    const checkedTaskIds = [];

    // Select all checkboxes
    const checkboxes = document.querySelectorAll(
      '.task-box input[type="checkbox"]'
    );

    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        checkedTaskIds.push(checkbox.id);
      }
    });

    const allTasks = getLocalData("tasks");
    const parsedCheckedTaskIds = checkedTaskIds?.map((id) => parseInt(id, 10));
    if (parsedCheckedTaskIds == 0) {
      const errorMessage = `<p class="text-red">No item marked</p>`;
      const errorContainer = document.getElementById("taskErrorC");
      errorContainer.innerHTML = errorMessage;
    } else {
      const errorContainer = document.getElementById("taskErrorC");
      errorContainer.innerHTML = "";

      const trueTasks = allTasks?.filter((t) => t.status == true);

      const incompleteTasks = allTasks?.filter((task) => task.status !== true);

      const filteredCompletedTasks = trueTasks.filter(
        (task) => !parsedCheckedTaskIds.includes(task.id)
      );

      const updatedTasks = [...incompleteTasks, ...filteredCompletedTasks];
      console.log(updatedTasks);

      setLocalData("tasks", updatedTasks);
      loadAllCompletedTasks();
      loadAllTasks();
    }
  });
  return;
}

function loadAllIncompleteTasks() {
  const tasks = getLocalData("tasks");

  const incomplete = tasks?.filter((task) => task.status == !true);

  const incompleteTask = document.getElementById("allInCompleteCount");
  incompleteTask.innerText = incomplete?.length;

  const totalTaskCount = document.getElementById("incompleteTotalTask");
  totalTaskCount.innerHTML = `
  <h3 class="text-primary ml-3">${incomplete?.length}</h3>
  `;

  const tasksContainer = document.getElementById("task-data-incomplete");
  const taskHTML = incomplete?.map((task) => {
    return ` 
    <div data-id=${
      task?.id
    } class="task-box-1 flex justify-between items-center px-15 py-8">
            <div class="task-info flex items-center">
            <div class="checkbox">
            <input type="checkbox" id=${task?.id}>
            </div>
              <div>
              <h3>${task?.group}</h3>
              <p>${task?.description}</p>
              <p>${task?.date}</p>
              <p>${task?.time}</p>
              </div>
            </div>
            <div>
            <p class="px-15 py-4 status ${
              task?.status ? "bg-primary text-white" : "bg-secondary text-white"
            }">${task?.status ? "completed" : "incomplete"}</p>
            </div>
          </div>
          
`;
  });
  tasksContainer.innerHTML = taskHTML.join("");
  return;
}

function removeIncompleteFunc(deleteAll) {
  deleteAll.addEventListener("click", function () {
    const checkedTaskIds = [];

    // Select all checkboxes
    const checkboxes = document.querySelectorAll(
      '.task-box input[type="checkbox"]'
    );

    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        checkedTaskIds.push(checkbox.id);
      }
    });

    const allTasks = getLocalData("tasks");
    const parsedCheckedTaskIds = checkedTaskIds?.map((id) => parseInt(id, 10));
    if (parsedCheckedTaskIds == 0) {
      const errorMessage = `<p class="text-red">No item marked</p>`;
      const errorContainer = document.getElementById("taskErrorI");
      errorContainer.innerHTML = errorMessage;
    } else {
      const errorContainer = document.getElementById("taskErrorI");
      errorContainer.innerHTML = "";

      const trueTasks = allTasks?.filter((t) => t.status == true);

      const incompleteTasks = allTasks?.filter((task) => task.status !== true);

      const filteredIncompleteTasks = incompleteTasks?.filter(
        (task) => !parsedCheckedTaskIds?.includes(task.id)
      );

      const updatedTasks = [...trueTasks, ...filteredIncompleteTasks];
      // console.log(updatedTasks);

      setLocalData("tasks", updatedTasks);
      loadAllIncompleteTasks();
      loadAllTasks();
    }
  });
  return;
}

function handleEditIncomplete(id) {
  const tasks = getLocalData("tasks");
  const parsedId = parseInt(id);
  const incompleteTask = tasks?.find((task) => task.id === parsedId);

  if (incompleteTask) {
    console.log("found");
  } else {
    console.log("Task not found");
  }
}

export {
  handleDeleteTask,
  loadTasks,
  loadAllTasks,
  removeFunc,
  completeAllFunc,
  loadAllCompletedTasks,
  removeCompletedFunc,
  loadAllIncompleteTasks,
  removeIncompleteFunc,
  handleEditIncomplete,
};
