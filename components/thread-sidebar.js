import Link from 'next/link';
import {useRouter} from 'next/router';

export default function ThreadSidebar({threads}) {
  const router = useRouter();
  const currentThreadId = router.query.id;

  return (
    <div className="w-64 h-screen bg-white border-r overflow-y-auto fixed left-0 top-0 p-4">
      <Link
        href="/"
        className="block mb-4 text-center py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        New Chat
      </Link>
      <div className="space-y-2">
        {threads.map((thread) => {
          // Get the first user message or use a default
          const firstMessage = thread.messages.find(m => m.role === 'user')?.content || 'New conversation';
          const preview = firstMessage.substring(0, 30) + (firstMessage.length > 30 ? '...' : '');

          return (
            <Link
              key={thread.id}
              href={`/thread/${thread.id}`}
              className={`block p-3 rounded hover:bg-gray-100 ${
                currentThreadId === thread.id ? 'bg-gray-100' : ''
              }`}
            >
              <div className="text-sm font-medium truncate text-gray-800">{preview}</div>
              <div className="text-xs text-gray-500">
                {new Date(thread.createdAt).toLocaleString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}