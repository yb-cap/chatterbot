import {useSession} from "next-auth/react";
import SignInPrompt from "../components/sign-in-prompt";
import ChatInput from "../components/chat-input";
import UserMenu from "../components/user-menu";
import ThreadSidebar from "../components/thread-sidebar";
import {getServerSession} from "next-auth/next";
import {authOptions} from "./api/auth/[...nextauth]";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

export default function Home({threads}) {
  const {data: session} = useSession();

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      {session?.user && <UserMenu user={session.user}/>}
      {!session ? (
        <div className="flex items-center justify-center flex-grow">
          <SignInPrompt/>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row flex-grow">
          <ThreadSidebar threads={threads}/>
          <main className="flex-1 ml-64 md:mt-0 md:ml-64">
            <div className="max-w-2xl mx-auto pt-6 px-4">
              <ChatInput/>
            </div>
          </main>
        </div>
      )}
    </div>
  )
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      props: {
        threads: [],
      },
    };
  }

  const threads = await prisma.chatThread.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      messages: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return {
    props: {
      threads: JSON.parse(JSON.stringify(threads)),
    },
  };
}