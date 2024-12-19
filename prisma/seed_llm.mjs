// prisma/seed.js
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.llmModel.upsert({
    where: {name: "gpt-3.5-turbo"},
    update: {},
    create: {
      name: "gpt-3.5-turbo",
      display_name: "OpenAI GPT-3.5",
      provider: "openai",
    },
  });
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
