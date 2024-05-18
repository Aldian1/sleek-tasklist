import { useState, useEffect } from "react";
import { Container, VStack, HStack, Input, Button, Checkbox, Text, IconButton, Box } from "@chakra-ui/react";
import { FaPlus, FaTrash } from "react-icons/fa";

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState("");
  const [subtaskInput, setSubtaskInput] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (storedTasks) {
      setTasks(storedTasks);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (taskInput.trim() === "") return;
    setTasks([...tasks, { id: Date.now(), text: taskInput, completed: false, subtasks: [] }]);
    setTaskInput("");
  };

  const addSubtask = (taskId) => {
    if (subtaskInput.trim() === "") return;
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, subtasks: [...task.subtasks, { id: Date.now(), text: subtaskInput, completed: false }] } : task)));
    setSubtaskInput("");
    setSelectedTask(null);
  };

  const toggleTaskCompletion = (taskId) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)));
  };

  const toggleSubtaskCompletion = (taskId, subtaskId) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, subtasks: task.subtasks.map((subtask) => (subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask)) } : task)));
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const deleteSubtask = (taskId, subtaskId) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, subtasks: task.subtasks.filter((subtask) => subtask.id !== subtaskId) } : task)));
  };

  const handleKeyPress = (e, callback) => {
    if (e.key === "Enter") {
      callback();
    }
  };

  return (
    <Container centerContent maxW="container.md" py={8}>
      <VStack spacing={4} width="100%">
        <HStack width="100%">
          <Input
            placeholder="Add a new task"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            onKeyDown={(e) => handleKeyPress(e, addTask)}
          />
          <IconButton aria-label="Add Task" icon={<FaPlus />} onClick={addTask} />
        </HStack>
        {tasks.map((task) => (
          <Box key={task.id} width="100%" p={4} borderWidth={1} borderRadius="md">
            <HStack justifyContent="space-between">
              <Checkbox isChecked={task.completed} onChange={() => toggleTaskCompletion(task.id)}>
                <Text as={task.completed ? "s" : ""}>{task.text}</Text>
              </Checkbox>
              <HStack>
                <IconButton aria-label="Add Subtask" icon={<FaPlus />} size="sm" onClick={() => setSelectedTask(task.id)} />
                <IconButton aria-label="Delete Task" icon={<FaTrash />} size="sm" onClick={() => deleteTask(task.id)} />
              </HStack>
            </HStack>
            {task.id === selectedTask && (
              <HStack mt={2}>
                <Input
                  placeholder="Add a subtask"
                  value={subtaskInput}
                  onChange={(e) => setSubtaskInput(e.target.value)}
                  onKeyDown={(e) => handleKeyPress(e, () => addSubtask(task.id))}
                />
                <Button onClick={() => addSubtask(task.id)}>Add</Button>
              </HStack>
            )}
            <VStack mt={2} pl={4} alignItems="start">
              {task.subtasks.map((subtask) => (
                <HStack key={subtask.id} justifyContent="space-between" width="100%">
                  <Checkbox isChecked={subtask.completed} onChange={() => toggleSubtaskCompletion(task.id, subtask.id)}>
                    <Text as={subtask.completed ? "s" : ""}>{subtask.text}</Text>
                  </Checkbox>
                  <IconButton aria-label="Delete Subtask" icon={<FaTrash />} size="sm" onClick={() => deleteSubtask(task.id, subtask.id)} />
                </HStack>
              ))}
            </VStack>
          </Box>
        ))}
      </VStack>
    </Container>
  );
};

export default TodoList;
