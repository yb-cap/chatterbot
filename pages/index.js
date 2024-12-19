import {useSession} from "next-auth/react";
import SignInPrompt from "../components/sign-in-prompt";
import ChatInput from "../components/chat-input";
import UserMenu from "../components/user-menu";

export default function Home() {
  const {data: session} = useSession();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
      {session?.user && <UserMenu user={session.user}/>}
      {!session ? <SignInPrompt/> : <ChatInput/>}
    </div>
  )
}