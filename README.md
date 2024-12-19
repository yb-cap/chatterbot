This project is a chatbot application built using a three-tier architecture to showcase a complete web application
with authentication, data persistence, and an interactive user experience. The chatbot allows users to interact with AI
language models (OpenAPI only for now), log their chat history, and access it later.
The app is deployed on Vercel for scalability and ease of deployment.

## Getting Started

### Local

Prereqs:

- Postgres database
- Google Cloud OAuth App
- OpenAI account with credits available

1. Clone the repo and install dependencies:

```bash
pnpm i
```

2. Set up environment variables in `.env`:

```text
DATABASE_URL=your-database-url
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
OPENAI_API_KEY=your-openai-api-key
NEXTAUTH_SECRET=<generate in shell using openssl rand -base64 32>
```

3. Run database migrations on connected DB:

```bash
pnpm generate
pnpm migrate dev --name init
node prisma/seed_llm.mjs
```

4. Start application:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to proceed.

## Architecture Design

1. Presentation Tier (Client Layer): This is the user-facing layer where users interact with the chatbot.

   Technologies:

   - Framework: Next.js - Pages Router / React
   - Styling: TailwindCSS for responsive and polished UI

   Responsibilities:

   - Render a responsive chat interface.
   - Handle user input and display chatbot responses.
   - Manage client-side logic for authentication and session persistence.

2. Application Tier (Server Layer): This layer processes requests from the client, communicates with the AI API, and
   interacts with the database.
   Technologies:

   - Framework: Next.js - API Routes
   - Authentication: NextAuth.js with Google SSO and Prisma Adapter

   Responsibilities:

   - Authenticate users via Google SSO or username/password.
   - Process chat messages and send them to the AI API.
   - Retrieve chat-related data models from the database and return it to the client.

3. Data Tier (Database Layer): This layer stores user data, including authentication credentials and chat histories.

   Technologies:

   - Database: PostgreSQL
   - ORM: Prisma

   Responsibilities:

   - Persist user & auth-related models required for NextAuth to work
   - Store chat histories in a structured format for retrieval.

## Extensions

- Sidebar should be infinite scrolling, or; simpler, fixed number of threads and if more,
  navigate to a ChatThread index page which supports search
- Choice of LLM Model - data models already designed to allow for this but would require UI/API changes
- Chat Streaming UX - the current chatbot interface waits for the entire response from the LLM Provider to be generated
  before presenting to the user, a streaming approach would reduce waiting time.
- More responsive UI - the sidebar toggle in both mobile and compressed web views don't result in the ChatInput or UserMenu shifting to account for the expanded sidebar. This would require lifting the state/setter of whether the sidebarIsOpen to the parent component to be passed down to the sidebar and its sibling components in the view.
