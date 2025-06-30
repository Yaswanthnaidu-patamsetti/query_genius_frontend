import { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaRobot } from "react-icons/fa";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";
import { askQuestion } from "../../services/chatService";
import "./Chat.css";

const availableTables = [
  { value: "", label: "Select Table (optional)" },
  { value: "chocolates", label: "chocolates" },
  { value: "products", label: "Products" },
];

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [guestMessageSent, setGuestMessageSent] = useState(false);
  const [selectedTable, setSelectedTable] = useState("");

  const { accessToken } = useContext(AuthContext);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    if (!accessToken) {
      if (guestMessageSent) {
        toast.info("Please login to continue");
        setTimeout(() => navigate("/login"), 2000);
        return;
      }

      setIsTyping(true);
      setTimeout(() => {
        const botMessage = {
          text: "Hi, I'm Query_Genius here to help you regarding any queries. But please log in to access all features.",
          sender: "bot",
          type: "generic",
        };
        setMessages((prev) => [...prev, botMessage]);
        setIsTyping(false);
        setGuestMessageSent(true);
        scrollToBottom();
      }, 1000);
    } else {
      try {
        setIsTyping(true);
        const response = await askQuestion(
          { question: input.toString().trim(), targetTableName: selectedTable },
          accessToken
        );

        let botMessage;

        switch (response.type) {
          case "restricted":
          case "noData":
          case "generic":
            botMessage = {
              text: response.message || response.response || "No response",
              sender: "bot",
              type: response.type,
            };
            break;

          case "data":
            botMessage = {
              text: response.response, // This is the data array/object
              sender: "bot",
              type: "data",
            };
            break;

          default:
            botMessage = {
              text: "Sorry, I couldn't understand the response.",
              sender: "bot",
              type: "error",
            };
        }

        setMessages((prev) => [...prev, botMessage]);
        setIsTyping(false);
        scrollToBottom();
      } catch (error) {
        setIsTyping(false);
        toast.error(error.message || "Error communicating with server.");
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message-wrapper ${msg.sender}`}>
            <div className="avatar">
              {msg.sender === "user" ? <FaUser /> : <FaRobot />}
            </div>

            <div className={`message ${msg.sender}`}>
              {msg.type === "data" &&
              Array.isArray(msg.text) &&
              msg.text.length > 0 ? (
                <table className="response-table">
                  <thead>
                    <tr>
                      {Object.keys(msg.text[0]).map((header) => (
                        <th key={header}>{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {msg.text.map((row, idx) => (
                      <tr key={idx}>
                        {Object.values(row).map((value, i) => (
                          <td key={i}>{value?.toString()}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <pre>
                  <code>
                    {typeof msg.text === "string"
                      ? msg.text
                      : JSON.stringify(msg.text, null, 2)}
                  </code>
                </pre>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="message-wrapper bot">
            <div className="avatar">
              <FaRobot />
            </div>
            <div className="message bot typing">
              <p>Typing...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <select
          value={selectedTable}
          onChange={(e) => setSelectedTable(e.target.value)}
          className="table-select"
        >
          {availableTables.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={isTyping}
        />
        <button onClick={handleSend} disabled={isTyping}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
