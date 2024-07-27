import React, { useState } from 'react';
import styles from './ToDo.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faArrowUp, faArrowDown, faCheck, faPlus, faListUl } from '@fortawesome/free-solid-svg-icons';
import { useAutoAnimate } from '@formkit/auto-animate/react';

function ToDo() {
    const [tasks, setTasks] = useState([
        { id: 1, text: "Task 1", completed: false },
        { id: 2, text: "Task 2", completed: false },
        { id: 3, text: "Task 3", completed: false },
        { id: 4, text: "Task 4", completed: false },
        { id: 5, text: "Task 5", completed: false },
        { id: 6, text: "Task 6", completed: false }
    ]);
    const [newTask, setNewTask] = useState("");
    const [totalTasks, setTotalTasks] = useState(tasks.length);
    const [cmpTask, setCmpTasks] = useState(0);
    const [parent] = useAutoAnimate(); // Enable animations

    const currentDate = new Date();
    const dayName = currentDate.toLocaleString('default', { weekday: 'long' });
    const monthName = currentDate.toLocaleString('default', { month: 'long' });
    const dateString = {
        day: currentDate.getDate(),
        month: monthName,
        year: currentDate.getFullYear(),
        weekday: dayName
    };
    const [date, setDate] = useState(dateString);

    function handleInputChange(event) {
        setNewTask(event.target.value);
    }

    function addNewTask() {
        if (newTask.trim() !== "") {
            setTasks(t => [{ id: Date.now(), text: newTask, completed: false }, ...t]);
            setNewTask("");
            setTotalTasks(t => t + 1);
        }
    }

    function deleteTask(id) {
        const updatedTasks = tasks.filter(task => task.id !== id);
        setTasks(updatedTasks);
        setTotalTasks(updatedTasks.length);
        setCmpTasks(updatedTasks.filter(task => task.completed).length);
    }

    function moveUp(id) {
        const index = tasks.findIndex(task => task.id === id);
        if (index > 0) {
            const updatedTasks = [...tasks];
            [updatedTasks[index], updatedTasks[index - 1]] = [updatedTasks[index - 1], updatedTasks[index]];
            setTasks(updatedTasks);
        }
    }

    function moveDown(id) {
        const index = tasks.findIndex(task => task.id === id);
        if (index < tasks.length - 1) {
            const updatedTasks = [...tasks];
            [updatedTasks[index], updatedTasks[index + 1]] = [updatedTasks[index + 1], updatedTasks[index]];
            setTasks(updatedTasks);
        }
    }

    function completeTask(id) {
        const updatedTasks = tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        );
    
        setTasks(updatedTasks);
        reorderTasks(updatedTasks);
        setCmpTasks(updatedTasks.filter(task => task.completed).length);
    }

    function reorderTasks(updatedTasks) {
        const incompleteTasks = updatedTasks.filter(task => !task.completed);
        const completedTasks = updatedTasks.filter(task => task.completed);
        setTasks([...incompleteTasks, ...completedTasks]);
    }

    function deleteAll() {
        setTasks([]);
        setTotalTasks(0);
        setCmpTasks(0);
    }

    function resetCmp() {
        const updatedTasks = tasks.map(task => ({ ...task, completed: false }));
        setTasks(updatedTasks);
        setCmpTasks(0);
    }

    return (
        <>
            <h1 className={styles.title}>
                <FontAwesomeIcon icon={faListUl} />&nbsp; To-Do List 
            </h1>
            <div ref={parent}className={styles.hero}>
                {tasks.length > 0 ? (
                    <>
                        <ol className={styles.listt}>
                            <h1>Your List</h1>
                            <div ref={parent} className={styles.list}>
                                {tasks.map((task) => (
                                    <li key={task.id} className={`${styles.listItem} ${task.completed ? styles.completed : ""}`}>
                                        <span>{task.text}</span>
                                        <div className={styles.btns}>
                                            <button className={styles.dltBtn} onClick={() => deleteTask(task.id)}>
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                            <button className={styles.upBtn} onClick={() => moveUp(task.id)}>
                                                <FontAwesomeIcon icon={faArrowUp} />
                                            </button>
                                            <button className={styles.downBtn} onClick={() => moveDown(task.id)}>
                                                <FontAwesomeIcon icon={faArrowDown} />
                                            </button>
                                            <button className={styles.cmpBtn} onClick={() => completeTask(task.id)}>
                                                <FontAwesomeIcon icon={faCheck} />
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </div>
                            <button className={styles.addBtn} onClick={deleteAll}>
                                Delete All
                            </button>
                        </ol>
                    </>
                ) : (
                    <p className={styles.noTasks}>No tasks yet.</p>
                )}
                <div className={styles.inputs}>
                    <h1>Enter New Task</h1>
                    <div className={styles.inputSection}>
                        <input
                            type="text"
                            placeholder="Enter a Task..."
                            value={newTask}
                            onChange={handleInputChange}
                        />
                        <button className={styles.addBtn} onClick={addNewTask}>
                            <FontAwesomeIcon icon={faPlus} />
                        </button>
                    </div>
                </div>
                <div className={styles.total}>
                    <h1>Total Tasks</h1>
                    <p>{totalTasks}</p>
                </div>
                <div className={styles.comp}>
                    <h1>Completed Tasks</h1>
                    <p>
                        <button className={styles.resetCmp} onClick={resetCmp}>
                            Reset
                        </button>
                        {cmpTask}
                    </p>
                </div>
                <div className={styles.dates}>
                    <div className={styles.first}>
                        <span className={styles.month}>{date.month}</span>
                        <span className={styles.weekday}>{date.weekday}</span>
                    </div>
                    <div className={styles.second}>
                        <span className={styles.day}>{date.day}</span>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ToDo;
