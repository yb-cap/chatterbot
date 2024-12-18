import {signIn, signOut, useSession} from "next-auth/react";

export default function Home() {
    const {data: session} = useSession();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
            {!session ? (
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
            ) : (
                <div className="p-6 bg-white shadow rounded-lg">
                    <h1 className="text-2xl font-bold mb-6">Welcome, {session.user.name}</h1>
                    <button
                        onClick={() => signOut()}
                        className="px-4 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-700"
                    >
                        Sign Out
                    </button>
                </div>
            )}
        </div>
    );
}
