import {useSession} from "next-auth/react";
import ThreadChat from "../../components/thread-chat";
import {PrismaClient} from "@prisma/client";
import {getServerSession} from "next-auth/next";
import {authOptions} from "../api/auth/[...nextauth]";
import UserMenu from "../../components/user-menu";

const prisma = new PrismaClient();

export default function ThreadPage({threadId, messages}) {
  const {data: session} = useSession();

  if (!session) {
    return <p>You must be signed in to view this page.</p>;
  }

  return (
    <div className="relative min-h-screen bg-gray-100">
      <UserMenu user={session.user}/>
      <ThreadChat
        threadId={threadId}
        messages={messages}
      />
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

  const thread = await prisma.chatThread.findUnique({
    where: {id},
    include: {messages: true},
  });

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
      messages: JSON.parse(JSON.stringify(thread.messages)), // Serialize dates
    },
  };
}