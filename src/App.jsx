import { Routes, Route } from "react-router-dom";
import NewsList from "./pages/NewsList";
import NewsDetail from "./pages/NewsDetail";

function App() {
  return (
    <Routes>
      <Route path="/" element={<NewsList />} />
      <Route path="/news/:id" element={<NewsDetail />} />
    </Routes>
  );
}

export default App;
