import { Routes, Route } from "react-router-dom";
import NewsList from "./pages/NewsList";
import NewsDetail from "./pages/NewsDetail";

function App() {
  return (
    <Routes>
      <Route path="/news-react-supabase" element={<NewsList />} />
      <Route path="/news-react-supabase/news/:id" element={<NewsDetail />} />
    </Routes>
  );
}

export default App;
