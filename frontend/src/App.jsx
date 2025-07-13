import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import DocPreview from "./pages/DocPreview";
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound";
import RepoView from "./pages/RepoView";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/repo/:owner/:repoName" element={<RepoView />} />
        <Route path="/docs/:repoId/:filePath/*" element={<DocPreview />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;