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
    <div className="fixed bottom-4 left-4 right-4 md:static md:w-full md:max-w-2xl p-4 bg-white shadow rounded">
      <h1 className="text-xl md:text-2xl font-bold mb-4 text-gray-800">Chat with the Chatterbot</h1>
      <textarea
        className="w-full border p-3 rounded mb-4 min-h-[80px] resize-y text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 outline-none"
        placeholder="Type your message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyPress}
        rows={3}
      ></textarea>
      <button
        className="w-full bg-blue-600 text-white p-3 rounded disabled:opacity-50 hover:bg-blue-700"
        onClick={sendMessage}
        disabled={loading}
      >
        {loading ? "Sending..." : "Send"}
      </button>
    </div>
  );
}