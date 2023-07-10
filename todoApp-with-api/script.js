const delButton = document.querySelector(".delete");
const form = document.querySelector("form");
const inputText = document.querySelector("input[type=text]");
const todoList = document.querySelector("#todo-list");
const filterArea = document.querySelector(".filter-area");

let todos = [];

function loadTodos() {
  fetch("http://localhost:4730/todos")
    .then((res) => res.json())
    .then((todosFromApi) => {
      todos = todosFromApi;
      console.log(todos);
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
  todos.forEach((todo) => {
    id = todo.id;
    if (todo.done === true) {
      fetch(`http://localhost:4730/todos/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then(console.log("Delete successful"));
      loadTodos();
    }
  });
}

delButton.addEventListener("click", deleteDoneTodos);

function renderTodos() {
  todoList.innerHTML = "";

  todos.forEach((todo) => {
    const newLiElement = document.createElement("li");
    const checkboxElement = document.createElement("input");
    checkboxElement.setAttribute("type", "checkbox");
    checkboxElement.checked = todo.done;
    newLiElement.appendChild(checkboxElement);

    const todoText = document.createTextNode(todo.description);
    newLiElement.appendChild(todoText);

    newLiElement.todo = todo;

    todoList.append(newLiElement);
  });
}

function addNewTodo() {
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
      console.log(todos);
      renderTodos();
    });
}

form.addEventListener("submit", addNewTodo);

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
