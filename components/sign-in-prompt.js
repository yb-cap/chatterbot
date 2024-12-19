import {signIn} from "next-auth/react";

export default function SignInPrompt() {
  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Welcome to the Chatterbot</h1>
      <button
        onClick={() => signIn("google")}
        className="block w-full p-0 bg-transparent border-none cursor-pointer"
      >
        <img
          src="/google-icon.svg"
          alt="Sign in with Google"
          className="w-auto h-12"
        />
      </button>
    </div>
  );
}