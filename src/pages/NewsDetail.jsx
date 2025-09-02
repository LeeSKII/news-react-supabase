import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

export default function NewsDetail() {
  const [newsItem, setNewsItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [metaData, setMetaData] = useState(null);
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
        .select(
          "title, host, created_at, word_count, meta_filter, article, text, summarizer, url"
        )
        .eq("id", id)
        .single();

      if (error) throw error;
      setNewsItem(data);

      // 解析 meta_filter 字段
      if (data.meta_filter) {
        try {
          const parsedMeta = data.meta_filter;
          setMetaData(parsedMeta);
        } catch (parseError) {
          console.error("解析 meta_filter 失败:", parseError);
        }
      }
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
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              ></path>
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

              <div className="text-sm text-gray-500 mb-8 pb-4 border-b">
                <div className="flex flex-wrap items-center mb-3">
                  {newsItem.host && (
                    <span className="mr-4 mb-2">
                      <span className="font-medium">来源:</span> {newsItem.host}
                    </span>
                  )}
                  <span className="mr-4 mb-2">
                    <span className="font-medium">搜集时间:</span>{" "}
                    {formatDate(newsItem.created_at)}
                  </span>
                  {newsItem.word_count && (
                    <span className="mb-2">
                      <span className="font-medium">字数:</span>{" "}
                      {newsItem.word_count}
                    </span>
                  )}
                </div>

                {/* 显示 meta_filter 中的信息 */}
                {metaData && (
                  <div className="space-y-4">
                    {/* 标题和类型 */}
                    <div className="flex flex-wrap items-center gap-3">
                      {metaData.title && (
                        <h2 className="text-lg font-semibold text-gray-800">
                          {metaData.title}
                        </h2>
                      )}
                      {metaData.type && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                          {metaData.type}
                        </span>
                      )}
                    </div>

                    {/* 作者和发布时间 */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      {metaData.author && (
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                          <span className="font-medium">作者:</span> {metaData.author}
                        </div>
                      )}
                      {metaData.published_date && (
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                          <span className="font-medium">发布时间:</span> {formatDate(metaData.published_date)}
                        </div>
                      )}
                    </div>

                    {/* 标签 */}
                    {metaData.tags && (
                      <div className="flex flex-wrap gap-2">
                        {metaData.tags.split(',').map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
                          >
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-8">
                {/* AI摘要 */}
                {newsItem.summarizer && (
                  <div>
                    <div className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-100 shadow-sm">
                      <h3 className="text-lg font-bold text-indigo-900 mb-4 flex items-center">
                        <svg
                          className="w-5 h-5 mr-2 text-indigo-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clipRule="evenodd"
                          />
                        </svg>
                        AI摘要
                      </h3>
                      <div className="prose prose-sm max-w-none prose-headings:text-indigo-800 prose-p:text-gray-700 prose-strong:text-indigo-700 prose-em:text-indigo-600 prose-li:text-gray-700 prose-a:text-indigo-600 prose-a:hover:text-indigo-800 prose-a:underline prose-code:text-indigo-700 prose-pre:bg-indigo-100 prose-pre:text-indigo-800">
                        <ReactMarkdown>{newsItem.summarizer}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                )}

                {/* 文章内容 */}
                <div>
                  <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
                    {newsItem.article ? (
                      <div className="whitespace-pre-line text-lg leading-relaxed">
                        {newsItem.article
                          .split("\n\n")
                          .map((paragraph, index) => (
                            <p key={index} className="mb-4 text-justify">
                              {paragraph}
                            </p>
                          ))}
                      </div>
                    ) : (
                      <div className="whitespace-pre-line text-lg leading-relaxed">
                        {(newsItem.text || "暂无内容")
                          .split("\n\n")
                          .map((paragraph, index) => (
                            <p key={index} className="mb-4 text-justify">
                              {paragraph}
                            </p>
                          ))}
                      </div>
                    )}
                  </div>

                  {newsItem.url && (
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <a
                        href={newsItem.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-5 py-2.5 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                      >
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                        查看原文
                      </a>
                    </div>
                  )}
                </div>
              </div>
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
