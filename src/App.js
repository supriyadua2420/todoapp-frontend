import React, { useState, useEffect } from "react";
import axios from "axios";
import './App.css';

const TodoApp = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [selectedTaskIds, setSelectedTaskIds] = useState([]);


  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await axios.get("http://localhost:8000/tasks");
    setTasks(res.data);
  };

  const addTask = async () => {
    if (!title.trim()) return;
    await axios.post("http://localhost:8000/tasks/", { title });
    setTitle("");
    fetchTasks();
  };

    const deleteTask = async (task) => {
    await Promise.all(
        selectedTaskIds.map((id) =>
        axios.delete(`http://localhost:8000/tasks/${id}`)
      )
    );
    setSelectedTaskIds([]); 
    fetchTasks();
  };

  const toggleTask = async (task) => {
    await axios.put(`http://localhost:8000/tasks/${task.id}/`, {
      ...task,
      completed: !task.completed,
    });
    fetchTasks();
  };

  const handleCheckboxChange = (taskId) => {
      setSelectedTaskIds((prevSelected) =>
        prevSelected.includes(taskId)
          ? prevSelected.filter((id) => id !== taskId)
          : [...prevSelected, taskId]
      );
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-white rounded-2xl shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">Todo List</h1>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="flex-1 border rounded px-2 py-1"
          placeholder="New task"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="flex items-center space-x-4 mt-4">
          <button onClick={addTask} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Add
          </button>
          <button onClick={deleteTask} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            Delete
          </button>
        </div>
      </div>
      <ul>
        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex justify-between items-center p-2 border-b"
          >

            <div className="flex items-center gap-2">

            <input 
              type = "checkbox"
              checked = {selectedTaskIds.includes(task.id)}
              onChange={() => handleCheckboxChange(task.id)}
            />
            <span className={task.completed ? "line-through text-gray-400" : ""}>
              {task.title}
            </span>

             </div>
            {/* <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task)}
            /> */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;
