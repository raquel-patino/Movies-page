import { useState, useEffect, useRef } from "react";
import { getSuggestions } from "../services/api";
import "../css/Chat.css";

function Chat({ favorites = [] }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null); // 👇 para scroll automático

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    try {
      const data = await getSuggestions(input, favorites);
      setMessages((prev) => [
        ...prev,
        { role: "user", content: input },
        { role: "assistant", content: data.suggestion }
      ]);
      setInput(""); // limpia el textarea
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "user", content: input },
        { role: "assistant", content: "Hubo un error al obtener la sugerencia." }
      ]);
      setInput("");
    }
  };

  // 👇 Scroll automático al final del chat
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-container">
      <h2 className="header">Ask our AI NEMO</h2>

      <div className="chat-history">
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.role === "user" ? "msg-user" : "msg-assistant"}>
            <strong>{msg.role === "user" ? "You" : "Nemo"}:</strong>
            <p>{msg.content}</p>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form className="form" onSubmit={handleSubmit}>
        <textarea
          className="textarea"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={3}
          placeholder="Write your next question..."
        />
        <button className="button" type="submit">Ask</button>
      </form>
    </div>
  );
}

export default Chat;

