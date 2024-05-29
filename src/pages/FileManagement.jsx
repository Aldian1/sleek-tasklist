import { useState } from "react";
import { Box, Button, Input, Textarea } from "@chakra-ui/react";

function FileManagement() {
  const [fileContent, setFileContent] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      setFileContent(e.target.result);
    };
    reader.readAsText(file);
    setUploadedFile(file);
  };

  const handleFileDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([fileContent], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "data.txt";
    document.body.appendChild(element);
    element.click();
  };

  return (
    <Box p={4}>
      <Input type="file" onChange={handleFileUpload} />
      <Textarea value={fileContent} onChange={(e) => setFileContent(e.target.value)} placeholder="File content will appear here" mt={4} rows={10} />
      <Button onClick={handleFileDownload} mt={4}>
        Download File
      </Button>
    </Box>
  );
}

export default FileManagement;
