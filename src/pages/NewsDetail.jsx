import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Link, useParams } from "react-router-dom";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

export default function NewsDetail() {
  const [newsItem, setNewsItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    getNewsDetail();
  }, [id]);

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("zh-CN", options);
  };

  async function getNewsDetail() {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("News")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setNewsItem(data);
    } catch (error) {
      console.error("获取新闻详情失败:", error);
      setError("获取新闻详情失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            返回新闻列表
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
            <button
              onClick={getNewsDetail}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              重试
            </button>
          </div>
        ) : newsItem ? (
          <article className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
                {newsItem.title || "无标题"}
              </h1>

              <div className="text-sm text-gray-500 mb-8 pb-4 border-b flex flex-wrap items-center">
                {newsItem.host && (
                  <span className="mr-4 mb-2">
                    <span className="font-medium">来源:</span> {newsItem.host}
                  </span>
                )}
                <span className="mr-4 mb-2">
                  <span className="font-medium">搜集时间:</span> {formatDate(newsItem.created_at)}
                </span>
                {newsItem.word_count && (
                  <span className="mb-2">
                    <span className="font-medium">字数:</span> {newsItem.word_count}
                  </span>
                )}
              </div>

              <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed mb-8">
                {newsItem.article ? (
                  <div className="whitespace-pre-line text-lg leading-relaxed">
                    {newsItem.article.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="mb-4 text-justify">{paragraph}</p>
                    ))}
                  </div>
                ) : (
                  <div className="whitespace-pre-line text-lg leading-relaxed">
                    {(newsItem.text || "暂无内容").split('\n\n').map((paragraph, index) => (
                      <p key={index} className="mb-4 text-justify">{paragraph}</p>
                    ))}
                  </div>
                )}
              </div>

              {newsItem.summarizer && (
                <div className="mt-8 p-5 bg-blue-50 rounded-lg border border-blue-100">
                  <h3 className="text-base font-semibold text-blue-800 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    摘要
                  </h3>
                  <p className="text-blue-700 leading-relaxed">
                    {newsItem.summarizer}
                  </p>
                </div>
              )}

              {newsItem.url && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <a
                    href={newsItem.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-5 py-2.5 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    查看原文
                  </a>
                </div>
              )}
            </div>
          </article>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">新闻不存在</p>
          </div>
        )}
      </div>
    </div>
  );
}