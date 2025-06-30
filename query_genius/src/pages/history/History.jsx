import { useContext, useEffect, useState, useRef, useCallback } from "react";
import { AuthContext } from "../../context/AuthContext";
import { fetchChat, clearChat } from "../../services/chatService";
import { toast, ToastContainer } from "react-toastify";
import { FaUser, FaRobot } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import "./History.css";

const History = () => {
  const { accessToken } = useContext(AuthContext);
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoaded, setInitialLoaded] = useState(false);
  const observer = useRef();
  const limit = 5;

  const lastChatElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    const fetchHistory = async () => {
      if (!accessToken) return;
      setLoading(true);
      try {
        const userChat = await fetchChat(accessToken, page, limit);
        if (userChat.status === 200) {
          const newChats = userChat.data.data || [];
          setChatHistory((prev) =>
            page === 1 ? newChats : [...prev, ...newChats]
          );
          if (newChats.length < limit) setHasMore(false);
          setInitialLoaded(true);
        }
      } catch (error) {
        console.error("Error fetching history:", error);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [accessToken, page]);

  const handleClearChat = async () => {
    if (!window.confirm("Are you sure you want to clear chat history?")) return;
    try {
      await clearChat(accessToken);
      setChatHistory([]);
      setPage(1);
      setHasMore(true);
      toast.success("Chat history cleared!");
    } catch (error) {
      toast.error("Failed to clear chat history.");
      console.error(error);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => toast.success("Copied to clipboard!"))
      .catch(() => toast.error("Failed to copy."));
  };

  if (!accessToken) {
    return (
      <p className="no-access-message">
        No chat available. Please log in to view your chat history.
      </p>
    );
  }

  return (
    <div className="history-container">
      <h2 className="history-title">Chat History</h2>

      {loading && chatHistory.length === 0 ? (
        <p className="loading-message">Loading chat history...</p>
      ) : chatHistory.length === 0 ? (
        <p className="no-history-message">No chat history available.</p>
      ) : (
        <ul className="chat-history-list">
          {initialLoaded && chatHistory.length > 0 && (
            <li className="chat-clear-button-container">
              <button
                className="clear-chat-button-inside"
                onClick={handleClearChat}
                title="Clear Chat"
                aria-label="Clear Chat"
              >
                🗑️
              </button>
            </li>
          )}

          {chatHistory.map((chat, index) => {
            let parsedResponse;
            try {
              parsedResponse = JSON.parse(chat.llmResponse);
            } catch {
              parsedResponse = chat.llmResponse;
            }

            const isTable = chat.isDbRealted && Array.isArray(parsedResponse);
            const isLast = index === chatHistory.length - 1;

            let textToCopy;
            if (isTable) {
              const headers = Object.keys(parsedResponse[0] || {});
              const rows = parsedResponse.map((row) =>
                headers.map((h) => row[h]).join("\t")
              );
              textToCopy = [headers.join("\t"), ...rows].join("\n");
            } else {
              textToCopy = parsedResponse.toString();
            }

            return (
              <li
                key={index}
                className="chat-history-item"
                ref={isLast ? lastChatElementRef : null}
              >
                <div className="message-wrapper user">
                  <div className="avatar user-avatar">
                    <FaUser />
                  </div>
                  <div className="message user">{chat.questionText}</div>
                </div>

                <div className="message-wrapper bot">
                  <div className="avatar bot-avatar">
                    <FaRobot />
                  </div>
                  <div className={`message bot ${isTable ? "table-container" : ""}`}>
                    {isTable ? (
                      <>
                        <table className="response-table">
                          <thead>
                            <tr>
                              {Object.keys(parsedResponse[0] || {}).map((key) => (
                                <th key={key}>{key}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {parsedResponse.map((row, i) => (
                              <tr key={i}>
                                {Object.values(row).map((val, j) => (
                                  <td key={j}>{val}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <button
                          className="copy-button"
                          onClick={() => copyToClipboard(textToCopy)}
                          title="Copy table to clipboard"
                        >
                          📋
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="copy-button"
                          onClick={() => copyToClipboard(textToCopy)}
                          title="Copy response to clipboard"
                        >
                          📋
                        </button>
                        <div className="message-content">{parsedResponse}</div>
                      </>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {loading && chatHistory.length > 0 && (
        <p className="loading-message">Loading more chats...</p>
      )}

      {!hasMore && !loading && chatHistory.length > 0 && (
        <p className="end-message">No more chat history.</p>
      )}

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default History;
