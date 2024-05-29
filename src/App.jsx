import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Link } from "react-router-dom";
import Index from "./pages/Index.jsx";
import FileManagement from "./pages/FileManagement.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Index />} />
        <Route path="/file-management" element={<FileManagement />} />
      </Routes>
    </Router>
  );
}

export default App;
