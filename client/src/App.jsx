import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [reminder, setReminder] = useState('');
  const [error, setError] = useState('');

  // Remove the local address entirely
const API_URL = '/api/tasks';

  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_URL);
      setTasks(response.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const addTask = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Priority is removed from the request
      await axios.post(API_URL, { title, reminder });
      setTitle('');
      setReminder('');
      fetchTasks();
    } catch (err) {
      const msg = err.response?.data?.message || "Please check your inputs";
      setError(msg);
      setTimeout(() => setError(''), 4000);
    }
  };

  const toggleComplete = async (id, status) => {
    await axios.put(`${API_URL}/${id}`, { completed: !status });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchTasks();
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercent = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  return (
    <div className="App">
      <h1>Task Manager</h1>

      {error && <div className="error-banner">⚠️ {error}</div>}
      
      <form onSubmit={addTask} className="task-form">
        <div className="input-group">
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="What needs to be done?"
            required 
          />
          <input 
            type="datetime-local" 
            value={reminder}
            onChange={(e) => setReminder(e.target.value)}
            className="date-input"
            required 
          />
        </div>
        <button type="submit">Add Task</button>
      </form>

      <ul className="task-list">
        {tasks.map(task => (
          <li key={task._id} className="task-item">
            <input 
              type="checkbox" 
              checked={task.completed} 
              onChange={() => toggleComplete(task._id, task.completed)} 
            />
            <div className="task-content">
              <span className={`task-text ${task.completed ? 'completed' : ''}`}>
                {task.title}
              </span>
              {task.reminder && (
                <small className="reminder-display">
                   ⏰ {new Date(task.reminder).toLocaleString([], { 
                     month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                   })}
                </small>
              )}
            </div>
            <button className="delete-btn" onClick={() => deleteTask(task._id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>

      {tasks.length > 0 && (
        <div className="status-bar">
          <div className="status-text">
            <span>{completedCount} of {tasks.length} tasks completed</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <div className="progress-bg">
            <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;