import Image from 'next/image';
import {signOut} from 'next-auth/react';
import {Tooltip} from '@nextui-org/react';

export default function UserMenu({user}) {
  return (
    <div className="absolute top-4 right-4 flex items-center gap-3">
      {user?.image && (
        <Tooltip content={user?.name} placement="bottom">
          <div className="w-10 h-10 rounded-full overflow-hidden cursor-pointer">
            <Image
              src={user.image}
              alt={user?.name || 'User'}
              width={40}
              height={40}
              className="object-cover"
            />
          </div>
        </Tooltip>
      )}
      <button
        onClick={() => signOut()}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Sign Out
      </button>
    </div>
  );
}