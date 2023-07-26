const delButton = document.querySelector(".delete");
const form = document.querySelector("form");
const inputText = document.querySelector("input[type=text]");
const todoList = document.querySelector("#todo-list");
const filterArea = document.querySelector(".filter-container");

let todos = [];

function loadTodos() {
  fetch("http://localhost:4730/todos")
    .then((res) => res.json())
    .then((todosFromApi) => {
      todos = todosFromApi;
      renderTodos();
    });
}

function updateTodos(updatedTodo) {
  const id = updatedTodo.id;
  fetch(`http://localhost:4730/todos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedTodo),
  })
    .then((res) => res.json())
    .then(console.log("Update successful"));
}

function deleteDoneTodos() {
  const urls = [];
  for (let todo of todos) {
    id = todo.id;
    if (todo.done === true) {
      urls.push(`http://localhost:4730/todos/${id}`);
    }
  }

  Promise.all(
    urls.map((url) => {
      fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => console.log(response.status))
        .then(console.log("Delete successful"));
    })
  );

  loadTodos();
}

/* 
#### Alternative way to wait for all delete repsonses from api ####

async function deleteDoneTodos() {
  const deleteResults = await Promise.allSettled(
    todos
      .filter(({ done }) => done)
      .map(({ id }) =>
        fetch(`http://localhost:4730/todos/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        })
      )
  );
  loadTodos();
  const isAllOk = deleteResults.every(
    (result) => result.status === "fulfilled" && result.value.ok
  );
  if (!isAllOk) {
    throw new Error("Delete not successful");
  }
} */

delButton.addEventListener("click", deleteDoneTodos);

function renderTodos() {
  todoList.innerHTML = "";

  todos.forEach((todo) => {
    const newLiElement = document.createElement("li");
    const checkboxElement = document.createElement("input");
    checkboxElement.setAttribute("type", "checkbox");
    checkboxElement.checked = todo.done;
    checkboxElement.id = `todo-${todo.id}`;
    newLiElement.appendChild(checkboxElement);

    const description = document.createElement("label");
    description.setAttribute("for", checkboxElement.id);
    description.innerText = todo.description;
    newLiElement.append(description);

    if (todo.done === true) {
      newLiElement.classList.add("done");
    }

    newLiElement.todo = todo;

    todoList.appendChild(newLiElement);
  });
}

function addNewTodo(event) {
  event.preventDefault();

  if (checkForDuplicate(inputText.value)) {
    return;
  }

  const newTodo = {
    description: inputText.value,
    done: false,
  };

  fetch("http://localhost:4730/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newTodo),
  })
    .then((res) => res.json())
    .then((newtodoFromApi) => {
      todos.push(newtodoFromApi);
      renderTodos();
    });

  inputText.value = "";
}

form.addEventListener("submit", addNewTodo);

function checkForDuplicate(newTodo) {
  newTodo = newTodo.toLowerCase();

  for (let i = 0; i < todos.length; i++) {
    const currentTodo = todos[i];
    if (currentTodo.description.toLowerCase() === newTodo) {
      return true;
    }
  }
  return false;
}

function updateDoneState(event) {
  const checkbox = event.target;

  if (checkbox.checked === true) {
    checkbox.parentElement.classList.add("done");
    checkbox.parentElement.todo.done = true;
    updateTodos(checkbox.parentElement.todo);
  } else {
    checkbox.parentElement.classList.remove("done");
    checkbox.parentElement.todo.done = false;
    updateTodos(checkbox.parentElement.todo);
  }
}

todoList.addEventListener("change", updateDoneState);

function filterTodos() {
  filterValue = document.querySelector("input[type=radio]:checked").value;

  for (let element of todoList.children) {
    if (filterValue === "all") {
      element.hidden = false;
    } else if (filterValue === "open") {
      element.hidden = element.todo.done;
    } else if (filterValue === "done") {
      element.hidden = !element.todo.done;
    }
  }
}

filterArea.addEventListener("change", filterTodos);

loadTodos();
inputText.focus();
