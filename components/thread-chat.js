import {useState} from "react";
import axios from "axios";

export default function ThreadChat({threadId, messages}) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState(messages);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    setLoading(true);

    try {
      const response = await axios.post("/api/chat", {
        threadId,
        userMessage: input,
      }, {withCredentials: true});

      setChatMessages((prev) => [
        ...prev,
        {role: "user", content: input},
        {role: "assistant", content: response.data.assistantMessage},
      ]);
      setInput("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="w-full max-w-2xl mx-auto bg-white shadow rounded relative p-6">
        <h1 className="text-2xl font-bold mb-4">Chat Thread</h1>
        <div className="flex flex-col space-y-4 mb-4">
          {chatMessages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg ${
                msg.role === "user"
                  ? "bg-blue-100 text-blue-800 self-end"
                  : "bg-gray-100 text-gray-800 self-start"
              }`}
            >
              {msg.content}
            </div>
          ))}
        </div>
        <textarea
          className="w-full border p-2 rounded mb-4"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          rows={3}
        ></textarea>
        <button
          className="w-full bg-blue-600 text-white p-2 rounded disabled:opacity-50"
          onClick={sendMessage}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}