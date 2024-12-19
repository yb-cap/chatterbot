import {useState} from "react";
import {useRouter} from "next/router";
import axios from "axios";

export default function ChatInput() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    setLoading(true);

    try {
      const response = await axios.post("/api/chat", {
        userMessage: input,
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        }
      });

      setInput("");
      router.push(`/thread/${response.data.threadId}`);
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
    <div className="w-full max-w-2xl p-6 bg-white shadow rounded relative">
      <h1 className="text-2xl font-bold mb-4">Chat with the AI</h1>
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
  );
}