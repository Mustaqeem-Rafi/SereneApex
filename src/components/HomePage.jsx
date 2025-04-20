// HomePage.jsx - Enhanced Version
import React, { useState, useEffect, useRef, useMemo, createContext, useContext } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  useSortable,
  sortableKeyboardCoordinates
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FiPlus, FiSearch, FiSun, FiMoon, FiCheck, FiTrash2, FiClock } from 'react-icons/fi';
import styles from './HomePage.module.css';
import { SlothIllustration } from '../assets/sloth-illustration';
import { motion, useAnimate, stagger, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { MdDarkMode, MdLightMode, MdAdd } from 'react-icons/md';


// Update color scheme constants
const COSMIC_COLORS = {
  cosmicPurple: '#2A2356',
  nebulaBlue: '#3B82F6',
  stardustYellow: '#F59E0B',
  spaceBlack: '#0F172A',
  plasmaPink: '#EC4899',
  voidBlack: '#020617'
};

// Initial task data
const initialTasks = [
  {
    id: '1',
    title: 'Complete project proposal',
    due: '2023-10-24',
    dueTime: '10:00',
    priority: 'high',
    completed: false,
    duration: 2 // in hours
  },
  {
    id: '2',
    title: 'Weekly team check-in',
    due: '2023-10-24',
    dueTime: '13:00',
    priority: 'medium',
    completed: false,
    duration: 1 // in hours
  },
  {
    id: '3',
    title: 'Review client feedback',
    due: '2023-10-24',
    dueTime: '16:30',
    priority: 'low',
    completed: false,
    duration: 1.5 // in hours
  },
  {
    id: '4',
    title: 'Prepare presentation slides',
    due: '2023-10-24',
    dueTime: '14:30',
    priority: 'medium',
    completed: false,
    duration: 1.5 // in hours
  }
];

// Default state for a new task in the modal
const defaultNewTaskState = {
  title: '',
  duration: 1,
  due: '',
  dueTime: '',
  priority: 'medium',
  completed: false
};

// Enhanced Task Card Component
const SortableTask = ({ task, onToggleComplete, onDelete, isOverlay = false }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: task.id,
    disabled: isOverlay,
  });
  
  const [scope, animate] = useAnimate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const handleMouseMove = (e) => {
    const { currentTarget, clientX, clientY } = e;
    const { left, top } = currentTarget.getBoundingClientRect();
    
    // Calculate relative position
    setMousePosition({
      x: clientX - left,
      y: clientY - top,
    });
  };

  const hoverAnimations = {
    initial: { scale: 1, boxShadow: '0 4px 24px -6px rgba(0,0,0,0.1)' },
    hover: { 
      scale: 1.02,
      boxShadow: `${COSMIC_COLORS.nebulaBlue} 0px 8px 48px -12px`,
      transition: { duration: 0.3 }
    }
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    "--x": `${mousePosition.x}px`,
    "--y": `${mousePosition.y}px`
  };

  return (
    <motion.div 
      ref={(node) => {
        // Combine refs from useSortable and motion
        setNodeRef(node);
        if (scope) scope.current = node;
      }}
      style={style}
      initial="initial"
      whileHover={!isOverlay ? "hover" : undefined}
      variants={hoverAnimations}
      className={`${styles.taskCard} ${task.completed ? styles.completed : ''} ${styles[`priority${task.priority}`]} ${isOverlay ? styles.dragOverlay : ''}`}
      onMouseMove={!isOverlay ? handleMouseMove : undefined}
      {...attributes}
      {...listeners}
    >
      <div className={styles.taskContent}>
        <h3>{task.title}</h3>
        <div className={styles.taskMeta}>
          <span><FiClock size="0.7em" style={{ verticalAlign: 'middle', marginRight: '3px' }}/> {task.duration}h</span>
          <span>Due {task.due} {task.dueTime && `at ${task.dueTime}`}</span>
        </div>
      </div>
      
      <div className={styles.taskActions}>
        <button 
          onClick={(e) => { e.stopPropagation(); onToggleComplete(task.id); }}
          onPointerDown={(e) => e.stopPropagation()}
          className={`${styles.actionButton} ${styles.completeButton}`}
          aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
        >
          <FiCheck />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
          onPointerDown={(e) => e.stopPropagation()}
          className={`${styles.actionButton} ${styles.deleteButton}`}
          aria-label="Delete task"
        >
          <FiTrash2 />
        </button>
      </div>
      
      <div className={styles.hoverEffect} />
    </motion.div>
  );
};

// New Vertical Timeline Component to replace DailyRhythm
const VerticalTimeline = ({ sortedTasks }) => {
  if (!sortedTasks || sortedTasks.length === 0) {
    return (
      <div className={styles.verticalTimelineContainer}>
        <p className={styles.emptyText}>No upcoming tasks scheduled.</p>
      </div>
    );
  }

  return (
    <div className={styles.verticalTimelineContainer}>
      {sortedTasks.map((task, index) => (
        <div key={task.id} className={styles.timelineItem}>
          {/* Time Marker */}
          <div className={styles.timelineMarker}>
            {task.dueTime || "Any Time"}
          </div>

          {/* Connector */}
          <div className={styles.timelineConnector}>
            <div className={styles.connectorDot}></div>
            <div className={styles.connectorLine}></div>
          </div>

          {/* Task Card Representation */}
          <div className={`${styles.timelineTaskCard} ${styles[`priority${task.priority}`]}`}>
            <h4>{task.title}</h4>
            <span>Duration: {task.duration}h</span>
          </div>
        </div>
      ))}
    </div>
  );
};

const HomePage = () => {
  const { theme, toggleTheme } = useTheme();
  const [tasks, setTasks] = useState(initialTasks);
  const [leftPanelWidth, setLeftPanelWidth] = useState(40);
  const [isDraggingPanel, setIsDraggingPanel] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortedTimelineTasks, setSortedTimelineTasks] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTask, setNewTask] = useState(defaultNewTaskState);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formattedDate = currentTime.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  // Function to convert HH:mm to minutes for sorting
  const timeToMinutes = (timeString) => {
    if (!timeString || !timeString.includes(':')) return Infinity; // Place tasks without time at the end
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Calculate and SORT time blocks for the timeline
  useEffect(() => {
    const upcomingTasks = tasks
      .filter(task => !task.completed && task.due) // Ensure task has a due time
      .sort((a, b) => timeToMinutes(a.due) - timeToMinutes(b.due)); // Sort by time

    setSortedTimelineTasks(upcomingTasks);
  }, [tasks]);

  // Handle panel resize
  const handlePanelDragStart = (e) => {
    e.preventDefault();
    setIsDraggingPanel(true);
    document.addEventListener('mousemove', handlePanelDrag);
    document.addEventListener('mouseup', handlePanelDragEnd);
  };

  const handlePanelDrag = (e) => {
    if (isDraggingPanel) {
      const containerWidth = document.querySelector(`.${styles.mainContent}`).offsetWidth;
      const newLeftPanelWidth = (e.clientX / containerWidth) * 100;
      setLeftPanelWidth(Math.min(Math.max(20, newLeftPanelWidth), 80));
    }
  };

  const handlePanelDragEnd = () => {
    setIsDraggingPanel(false);
    document.removeEventListener('mousemove', handlePanelDrag);
    document.removeEventListener('mouseup', handlePanelDragEnd);
  };

  // Task operations
  const handleToggleComplete = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Updated Add Task Handler (for modal)
  const handleAddTask = () => {
    if (newTask.title.trim()) {
      const taskToAdd = {
        ...newTask,
        id: Date.now().toString(),
      };
      setTasks([...tasks, taskToAdd]);
      setNewTask(defaultNewTaskState);
      setIsAddingTask(false);
    }
  };

  // Handle input changes in the modal form
  const handleNewTaskChange = (e) => {
    const { name, value, type } = e.target;
    setNewTask(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value // Use parseFloat for decimal values
    }));
  };

  // Handle drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setTasks((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        if (oldIndex === -1 || newIndex === -1) return items;
        return arrayMove(items, oldIndex, newIndex);
      });
    }
    setActiveId(null);
  };

  // Filter tasks for search
  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Find the active task data for DragOverlay
  const activeTask = useMemo(() =>
    tasks.find(task => task.id === activeId),
    [activeId, tasks]
  );

  // Current Time Indicator positioning (simplified for vertical timeline)
  // This calculation gives us a percentage between 0-100 for the current time
  const currentHour = new Date().getHours();
  const currentMinute = new Date().getMinutes();
  const totalMinutesNow = currentHour * 60 + currentMinute;
  const totalWorkMinutes = (22 - 8) * 60; // 8 AM to 10 PM range
  const timelinePosition = ((totalMinutesNow - (8 * 60)) / totalWorkMinutes) * 100;
  const timelinePos = Math.min(Math.max(0, timelinePosition), 100);

  return (
    <div className={`${styles.appContainer} ${theme === 'dark' ? styles.dark : ''}`}>
      <div className={styles.container}>
        <header className={styles.topBar}>
          <h1 className={styles.logo}>SereneApex</h1>
          <div className={styles.topBarControls}>
            <button className={styles.themeToggle} onClick={toggleTheme}>
              {theme === 'dark' ? <MdLightMode className={styles.icon} /> : <MdDarkMode className={styles.icon} />}
            </button>
          </div>
        </header>
        <main className={styles.mainContent}>
          <div 
            className={styles.leftPanel} 
            style={{ width: `${leftPanelWidth}%` }}
          >
            <div className={styles.panelHeader}>
              <div className={styles.dateTimeContainer}>
                <div className={styles.clock}>{formattedTime}</div>
                <div className={styles.date}>{formattedDate}</div>
              </div>
              <h2 className={styles.title}>Today's Tasks</h2>
              <div className={styles.searchContainer}>
                <input 
                  type="text" 
                  className={styles.searchInput} 
                  placeholder="Search tasks..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FiSearch className={styles.searchIcon} />
              </div>
              <button 
                className={styles.addButton} 
                onClick={() => setIsAddingTask(true)}
              >
                <MdAdd className={styles.buttonIcon} /> New Task
              </button>
            </div>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext 
                items={filteredTasks.map(task => task.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className={styles.taskList}>
                  {filteredTasks.length > 0 ? (
                    filteredTasks.map(task => (
                      <SortableTask 
                        key={task.id} 
                        task={task} 
                        onToggleComplete={handleToggleComplete}
                        onDelete={handleDeleteTask}
                      />
                    ))
                  ) : (
                    <div className={styles.emptyState}>
                      <SlothIllustration className={styles.illustration} />
                      <p className={styles.emptyText}>
                        No tasks found. Add your first task to get started!
                      </p>
                    </div>
                  )}
                </div>
              </SortableContext>
              <DragOverlay>
                {activeId ? (
                  <SortableTask
                    task={activeTask}
                    onToggleComplete={() => {}}
                    onDelete={() => {}}
                    isOverlay={true}
                  />
                ) : null}
              </DragOverlay>
            </DndContext>
          </div>
          <div
            className={`${styles.divider} ${isDraggingPanel ? styles.dragging : ''}`}
            onMouseDown={handlePanelDragStart}
          ></div>
          <div 
            className={styles.rightPanel} 
            style={{ width: `${100 - leftPanelWidth}%` }}
          >
            <div className={styles.panelHeader}>
              <h2 className={styles.title}>Today's Schedule</h2>
            </div>
            <VerticalTimeline sortedTasks={sortedTimelineTasks} />
            <div className={styles.timeline} style={{ position: 'relative', height: '100%' }}>
              <div 
                className={styles.currentTimeIndicator} 
                style={{ top: `${timelinePos}%` }}
              />
            </div>
          </div>
        </main>
      </div>

      {isAddingTask && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Add New Task</h2>
            <div className={styles.formGroup}>
              <label htmlFor="taskTitle">Task Title</label>
              <input
                id="taskTitle"
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                placeholder="Enter task title"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="taskDue">Due Date</label>
              <input
                id="taskDue"
                type="date"
                value={newTask.due}
                onChange={(e) => setNewTask({...newTask, due: e.target.value})}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="taskDueTime">Due Time</label>
              <input
                id="taskDueTime"
                type="time"
                value={newTask.dueTime}
                onChange={(e) => setNewTask({...newTask, dueTime: e.target.value})}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="taskDuration">Duration (hours)</label>
              <input
                id="taskDuration"
                type="number"
                min="0.5"
                step="0.5"
                value={newTask.duration}
                onChange={(e) => setNewTask({...newTask, duration: parseFloat(e.target.value)})}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="taskPriority">Priority</label>
              <select
                id="taskPriority"
                value={newTask.priority}
                onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className={styles.modalActions}>
              <button 
                className={styles.cancelButton} 
                onClick={() => setIsAddingTask(false)}
              >
                Cancel
              </button>
              <button 
                className={styles.saveButton} 
                onClick={handleAddTask}
                disabled={!newTask.title.trim()}
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;