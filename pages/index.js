import {signOut, useSession} from "next-auth/react";
import SignInPrompt from "../components/sign-in-prompt";
import ChatInput from "../components/chat-input";

export default function Home() {
  const {data: session} = useSession();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
      {session ? (
        <div>
          <button
            onClick={signOut}
            className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Sign Out
          </button>
        </div>
      ) : null}
      {!session ? <SignInPrompt/> : <ChatInput/>}
    </div>
  )
}