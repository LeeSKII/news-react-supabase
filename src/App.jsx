import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

function App() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    getNews();
  }, []);

  async function getNews() {
    const { data } = await supabase.from("News").select();
    setNews(data);
  }

  return (
    <>
      <h1 class="text-3xl font-bold underline">Hello world!</h1>
      <ul>
        {news.map((news_item) => (
          <li key={news_item.id}>{news_item.title}</li>
        ))}
      </ul>
    </>
  );
}

export default App;
