import { useState, useEffect } from "react";
import { Container, VStack, HStack, Input, Button, Checkbox, Text, IconButton, Box, Progress } from "@chakra-ui/react";
import { FaPlus, FaTrash, FaChevronDown, FaChevronUp } from "react-icons/fa";

const TodoList = () => {
  const [items, setItems] = useState(() => {
    try {
      const storedItems = JSON.parse(localStorage.getItem("items"));
      return storedItems || [];
    } catch (error) {
      console.error("Failed to load items from local storage:", error);
      return [];
    }
  });
  const [itemInput, setItemInput] = useState("");
  const [subitemInput, setSubitemInput] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [expandedItems, setExpandedItems] = useState(() => {
    try {
      const storedItems = JSON.parse(localStorage.getItem("items"));
      if (storedItems) {
        const expanded = {};
        storedItems.forEach((item) => {
          expanded[item.id] = false;
        });
        return expanded;
      }
      return {};
    } catch (error) {
      console.error("Failed to load items from local storage:", error);
      return {};
    }
  });

  useEffect(() => {
    console.log("Saving items to local storage:", items);
    localStorage.setItem("items", JSON.stringify(items));
  }, [items]);

  const addItem = () => {
    if (itemInput.trim() === "") return;
    const newItem = { id: Date.now(), text: itemInput, completed: false, subitems: [] };
    setItems([...items, newItem]);
    setExpandedItems({ ...expandedItems, [newItem.id]: false });
    console.log("Added new item:", newItem);
    setItemInput("");
  };

  const addSubitem = (itemId) => {
    if (subitemInput.trim() === "") return;
    const newSubitem = { id: Date.now(), text: subitemInput, completed: false };
    setItems(items.map((item) => (item.id === itemId ? { ...item, subitems: [...item.subitems, newSubitem] } : item)));
    console.log("Added new subitem to itemId", itemId, ":", newSubitem);
    setExpandedItems({ ...expandedItems, [itemId]: true });
    setSubitemInput("");
    setSelectedItem(null);
  };

  const toggleItemCompletion = (itemId) => {
    setItems(items.map((item) => (item.id === itemId ? { ...item, completed: !item.completed } : item)));
  };

  const toggleSubitemCompletion = (itemId, subitemId) => {
    setItems(items.map((item) => (item.id === itemId ? { ...item, subitems: item.subitems.map((subitem) => (subitem.id === subitemId ? { ...subitem, completed: !subitem.completed } : subitem)) } : item)));
  };

  const deleteItem = (itemId) => {
    setItems(items.filter((item) => item.id !== itemId));
    const newExpandedItems = { ...expandedItems };
    delete newExpandedItems[itemId];
    setExpandedItems(newExpandedItems);
  };

  const deleteSubitem = (itemId, subitemId) => {
    setItems(items.map((item) => (item.id === itemId ? { ...item, subitems: item.subitems.filter((subitem) => subitem.id !== subitemId) } : item)));
  };

  const handleKeyPress = (e, callback) => {
    if (e.key === "Enter") {
      callback();
    }
  };

  const toggleExpandItem = (itemId) => {
    setExpandedItems((prevState) => ({
      ...prevState,
      [itemId]: !prevState[itemId],
    }));
  };

  const totalItems = items.length;
  const completedItems = items.filter((item) => item.completed).length;
  const progress = totalItems === 0 ? 0 : (completedItems / totalItems) * 100;

  return (
    <Container centerContent maxW="container.md" py={8}>
      <VStack spacing={4} width="100%">
        <Progress value={progress} width="100%" mb={4} />
        <HStack width="100%">
          <Input placeholder="Add a new item" value={itemInput} onChange={(e) => setItemInput(e.target.value)} onKeyDown={(e) => handleKeyPress(e, addItem)} />
          <IconButton aria-label="Add Item" icon={<FaPlus />} onClick={addItem} />
        </HStack>
        {[...items]
          .sort((a, b) => a.completed - b.completed)
          .map((item) => (
            <Box key={item.id} width="100%" p={4} borderWidth={1} borderRadius="md">
              <HStack justifyContent="space-between" className="item-item">
                <Checkbox isChecked={item.completed} onChange={() => toggleItemCompletion(item.id)}>
                  <Text as={item.completed ? "s" : ""}>{item.text}</Text>
                </Checkbox>
                <HStack>
                  <IconButton aria-label="Add Subitem" icon={<FaPlus />} size="sm" onClick={() => setSelectedItem(item.id)} />
                  <IconButton aria-label="Toggle Subitems" icon={expandedItems[item.id] ? <FaChevronUp /> : <FaChevronDown />} size="sm" onClick={() => toggleExpandItem(item.id)} />
                  <IconButton aria-label="Delete Item" icon={<FaTrash />} size="sm" className="delete-button" onClick={() => deleteItem(item.id)} />
                </HStack>
              </HStack>
              {item.id === selectedItem && (
                <HStack mt={2}>
                  <Input placeholder="Add a subitem" value={subitemInput} onChange={(e) => setSubitemInput(e.target.value)} onKeyDown={(e) => handleKeyPress(e, () => addSubitem(item.id))} />
                  <Button onClick={() => addSubitem(item.id)}>Add</Button>
                </HStack>
              )}
              {expandedItems[item.id] && (
                <VStack mt={2} pl={4} alignItems="start">
                  {item.subitems.map((subitem) => (
                    <HStack key={subitem.id} justifyContent="space-between" width="100%" className="subitem-item">
                      <Checkbox isChecked={subitem.completed} onChange={() => toggleSubitemCompletion(item.id, subitem.id)}>
                        <Text as={subitem.completed ? "s" : ""}>{subitem.text}</Text>
                      </Checkbox>
                      <IconButton aria-label="Delete Subitem" icon={<FaTrash />} size="sm" className="delete-button" onClick={() => deleteSubitem(item.id, subitem.id)} />
                    </HStack>
                  ))}
                </VStack>
              )}
            </Box>
          ))}
      </VStack>
      <style>{`
        .item-item:hover .delete-button,
        .subitem-item:hover .delete-button {
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
