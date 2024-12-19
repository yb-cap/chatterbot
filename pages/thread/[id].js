import {useSession} from "next-auth/react";
import ThreadChat from "../../components/thread-chat";
import {PrismaClient} from "@prisma/client";
import {getServerSession} from "next-auth/next";
import {authOptions} from "../api/auth/[...nextauth]";
import UserMenu from "../../components/user-menu";
import ThreadSidebar from "../../components/thread-sidebar";

const prisma = new PrismaClient();

export default function ThreadPage({threadId, messages, threads}) {
  const {data: session} = useSession();

  if (!session) {
    return <p>You must be signed in to view this page.</p>;
  }

  return (
    <div className="relative min-h-screen bg-gray-100">
      <UserMenu user={session.user}/>
      <div className="flex">
        <ThreadSidebar threads={threads}/>
        <main className="flex-1 ml-64">
          <div className="max-w-2xl mx-auto pt-20 px-4">
            <ThreadChat
              key={threadId}
              threadId={threadId}
              messages={messages}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const {id} = context.params;
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const [thread, threads] = await Promise.all([
    prisma.chatThread.findUnique({
      where: {id},
      include: {messages: true},
    }),
    prisma.chatThread.findMany({
      where: {userId: session.user.id},
      include: {messages: true},
      orderBy: {createdAt: 'desc'},
    }),
  ]);

  if (!thread || thread.userId !== session.user.id) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      threadId: id,
      messages: JSON.parse(JSON.stringify(thread.messages)),
      threads: JSON.parse(JSON.stringify(threads)),
    },
  };
}