import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState("all");

  const fetchTodos = async () => {
    const res = await axios.get("http://localhost:5000/api/todos");
    setTodos(res.data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addOrUpdateTodo = async () => {
    if (todo.trim() === "") return;

    if (editId) {
      await axios.put(`http://localhost:5000/api/todos/${editId}`, {
        title: todo,
      });
      setEditId(null);
    } else {
      await axios.post("http://localhost:5000/api/todos", {
        title: todo,
      });
    }

    setTodo("");
    fetchTodos();
  };

  const editTodo = (item) => {
    setTodo(item.title);
    setEditId(item._id);
  };

  const deleteTodo = async (id) => {
    await axios.delete(`http://localhost:5000/api/todos/${id}`);
    fetchTodos();
  };

  const toggleComplete = async (item) => {
    await axios.put(`http://localhost:5000/api/todos/${item._id}`, {
      completed: !item.completed,
    });

    fetchTodos();
  };

  const filteredTodos = todos.filter((item) => {
  if (filter === "completed") return item.completed;
  if (filter === "pending") return !item.completed;
  return true;
});

const completedCount = todos.filter((t) => t.completed).length;
const pendingCount = todos.filter((t) => !t.completed).length;

  return (
    <div className="app">
      <div className="todo-card">
        <h1>Todo App</h1>
        <p className="subtitle">Manage your daily tasks easily</p>

        <div className="input-box">
          <input
            type="text"
            placeholder="Enter your task..."
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
          />

          <button onClick={addOrUpdateTodo}>
            {editId ? "Update" : "Add"}
          </button>
        </div>

        <div className="filter-box">
          <button onClick={() => setFilter("all")}>All</button>
          <button onClick={() => setFilter("pending")}>Pending</button>
          <button onClick={() => setFilter("completed")}>Completed</button>
        </div>

        <div className="counts">
          <p>Total: {todos.length}</p>
          <p>Pending: {pendingCount}</p>
          <p>Completed: {completedCount}</p>
        </div>

        <div className="todo-list">
            {filteredTodos.map((item) => (
              <div className="todo-item" key={item._id}>
              <span className={item.completed ? "completed" : ""}>
                {item.title}
              </span>

              <div className="actions">
                <button
                  className="complete-btn"
                  onClick={() => toggleComplete(item)}
                >
                  {item.completed ? "Undo" : "Complete"}
                </button>

                <button
                  className="edit-btn"
                  onClick={() => editTodo(item)}
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => deleteTodo(item._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

            {todos.length === 0 && (
              <p className="empty-text">No tasks added yet.</p>
            )}
        </div>
      </div>
    </div>
  );
}

export default App;