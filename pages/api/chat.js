import {PrismaClient} from "@prisma/client";
import llmModelFactory from "../../lib/llmModelFactory";
import {getServerSession} from "next-auth/next"
import {authOptions} from "./auth/[...nextauth]"

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({message: "Method not allowed"});
  }
  const session = await getServerSession(req, res, authOptions)
  //
  // const session = await getSession({req});
  if (!session) {
    // console.log(req)
    return res.status(401).json({message: "Unauthorized"});
  }

  const {user} = session;
  const {threadId, userMessage} = req.body;

  let thread;
  if (!threadId) {
    //TODO: make this selectable, for now default to openai
    const llmModel = await prisma.llmModel.findFirst({
      where: {name: "gpt-3.5-turbo"}
    });

    if (!llmModel) {
      return res.status(400).json({message: "LLM model not found"});
    }

    thread = await prisma.chatThread.create({
      data: {
        userId: user.id,
        llmModelId: llmModel.id,
      },
      include: {llmModel: true}
    });
  } else {
    thread = await prisma.chatThread.findUnique({
      where: {id: threadId},
      include: {llmModel: true},
    });

    if (!thread || thread.userId !== user.id) {
      return res.status(403).json({message: "Forbidden"});
    }
  }

  await prisma.chatMessage.create({
    data: {
      threadId: thread.id,
      role: "user",
      content: userMessage,
    },
  });

  const messages = await prisma.chatMessage.findMany({
    where: {threadId: thread.id},
    orderBy: {createdAt: "asc"},
  });

  //TODO: make this abstracted against other providers
  const openaiMessages = messages.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));

  const assistantMessage = await new llmModelFactory(thread.llmModel.name).createChat(openaiMessages);

  await prisma.chatMessage.create({
    data: {
      threadId: thread.id,
      role: "assistant",
      content: assistantMessage,
    },
  });

  res.status(200).json({
    threadId: thread.id,
    assistantMessage,
  });
}