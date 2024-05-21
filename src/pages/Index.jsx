import { useState, useEffect, useRef } from "react";
import { Container, VStack, HStack, Input, Button, Checkbox, Text, IconButton, Box, Progress } from "@chakra-ui/react";
import { FaPlus, FaTrash, FaChevronDown, FaChevronUp } from "react-icons/fa";

const TodoList = () => {
  const [tasks, setTasks] = useState(() => {
    try {
      const storedTasks = JSON.parse(localStorage.getItem("tasks"));
      return storedTasks || [];
    } catch (error) {
      console.error("Failed to load tasks from local storage:", error);
      return [];
    }
  });
  const [taskInput, setTaskInput] = useState("");
  const [subtaskInput, setSubtaskInput] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingSubtaskId, setEditingSubtaskId] = useState(null);
  const [expandedTasks, setExpandedTasks] = useState(() => {
    try {
      const storedTasks = JSON.parse(localStorage.getItem("tasks"));
      if (storedTasks) {
        const expanded = {};
        storedTasks.forEach((task) => {
          expanded[task.id] = false; // Set initial expanded state to false for all tasks
        });
        return expanded;
      }
      return {};
    } catch (error) {
      console.error("Failed to load tasks from local storage:", error);
      return {};
    }
  });

  // Save tasks to local storage whenever tasks state changes
  useEffect(() => {
    console.log("Saving tasks to local storage:", tasks);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (taskInput.trim() === "") return;
    const newTask = { id: Date.now(), text: taskInput, completed: false, subtasks: [] };
    setTasks([...tasks, newTask]);
    setExpandedTasks({ ...expandedTasks, [newTask.id]: false });
    console.log("Added new task:", newTask);
    setTaskInput("");
  };

  const addSubtask = (taskId) => {
    if (subtaskInput.trim() === "") return;
    const newSubtask = { id: Date.now(), text: subtaskInput, completed: false };
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, subtasks: [...task.subtasks, newSubtask] } : task)));
    console.log("Added new subtask to taskId", taskId, ":", newSubtask);
    setExpandedTasks({ ...expandedTasks, [taskId]: true });
    setSubtaskInput("");
    setSelectedTask(null);
  };

  const editTask = (taskId, newText) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, text: newText } : task)));
    setEditingTaskId(null);
  };

  const editSubtask = (taskId, subtaskId, newText) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, subtasks: task.subtasks.map((subtask) => (subtask.id === subtaskId ? { ...subtask, text: newText } : subtask)) } : task)));
    setEditingSubtaskId(null);
  };

  const toggleTaskCompletion = (taskId) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)));
  };

  const toggleSubtaskCompletion = (taskId, subtaskId) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, subtasks: task.subtasks.map((subtask) => (subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask)) } : task)));
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
    const newExpandedTasks = { ...expandedTasks };
    delete newExpandedTasks[taskId];
    setExpandedTasks(newExpandedTasks);
  };

  const deleteSubtask = (taskId, subtaskId) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, subtasks: task.subtasks.filter((subtask) => subtask.id !== subtaskId) } : task)));
  };

  const handleKeyPress = (e, callback) => {
    if (e.key === "Enter") {
      callback();
    }
  };

  const toggleExpandTask = (taskId) => {
    setExpandedTasks((prevState) => ({
      ...prevState,
      [taskId]: !prevState[taskId],
    }));
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const progress = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;

  return (
    <Container centerContent maxW="container.md" py={8}>
      <VStack spacing={4} width="100%">
        <Progress value={progress} width="100%" mb={4} />
        <HStack width="100%">
          <Input placeholder="Add a new task" value={taskInput} onChange={(e) => setTaskInput(e.target.value)} onKeyDown={(e) => handleKeyPress(e, addTask)} />
          <IconButton aria-label="Add Task" icon={<FaPlus />} onClick={addTask} />
        </HStack>
        {[...tasks]
          .sort((a, b) => a.completed - b.completed)
          .map((task) => (
            <Box key={task.id} width="100%" p={4} borderWidth={1} borderRadius="md">
              <HStack justifyContent="space-between" className="task-item">
                {editingTaskId === task.id ? (
                  <Input value={task.text} onChange={(e) => editTask(task.id, e.target.value)} onBlur={() => setEditingTaskId(null)} autoFocus size="sm" />
                ) : (
                  <Checkbox isChecked={task.completed} onChange={() => toggleTaskCompletion(task.id)}>
                    <Text as={task.completed ? "s" : ""} onDoubleClick={() => setEditingTaskId(task.id)}>
                      {task.text}
                    </Text>
                  </Checkbox>
                )}
                <HStack>
                  <IconButton aria-label="Add Subtask" icon={<FaPlus />} size="sm" onClick={() => setSelectedTask(task.id)} />
                  <IconButton aria-label="Toggle Subtasks" icon={expandedTasks[task.id] ? <FaChevronUp /> : <FaChevronDown />} size="sm" onClick={() => toggleExpandTask(task.id)} />
                  <IconButton aria-label="Delete Task" icon={<FaTrash />} size="sm" className="delete-button" onClick={() => deleteTask(task.id)} />
                </HStack>
              </HStack>
              {task.id === selectedTask && (
                <HStack mt={2}>
                  <Input placeholder="Add a subtask" value={subtaskInput} onChange={(e) => setSubtaskInput(e.target.value)} onKeyDown={(e) => handleKeyPress(e, () => addSubtask(task.id))} />
                  <Button onClick={() => addSubtask(task.id)}>Add</Button>
                </HStack>
              )}
              {expandedTasks[task.id] && (
                <VStack mt={2} pl={4} alignItems="start">
                  {task.subtasks.map((subtask) => (
                    <HStack key={subtask.id} justifyContent="space-between" width="100%" className="subtask-item">
                      {editingSubtaskId === subtask.id ? (
                        <Input value={subtask.text} onChange={(e) => editSubtask(task.id, subtask.id, e.target.value)} onBlur={() => setEditingSubtaskId(null)} autoFocus size="sm" />
                      ) : (
                        <Checkbox isChecked={subtask.completed} onChange={() => toggleSubtaskCompletion(task.id, subtask.id)}>
                          <Text as={subtask.completed ? "s" : ""} onDoubleClick={() => setEditingSubtaskId(subtask.id)}>
                            {subtask.text}
                          </Text>
                        </Checkbox>
                      )}
                      <IconButton aria-label="Delete Subtask" icon={<FaTrash />} size="sm" className="delete-button" onClick={() => deleteSubtask(task.id, subtask.id)} />
                    </HStack>
                  ))}
                </VStack>
              )}
            </Box>
          ))}
      </VStack>
      <style>{`
        .task-item:hover .delete-button,
        .subtask-item:hover .delete-button {
          visibility: visible;
        }
        .delete-button {
          visibility: hidden;
        }
      `}</style>
    </Container>
  );
};

export default TodoList;
