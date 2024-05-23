"use client";

import { useUser } from '@clerk/nextjs';

import { Avatar, AvatarImage } from "@/components/ui/avatar"

const UserAvatar = () => {
  const { user } = useUser();

  return (
    <Avatar>
      <AvatarImage
        className='h-12 w-12'
        src={user?.imageUrl ?
          user.imageUrl :
          "https://github.com/shadcn.png"
        }
      />
    </Avatar>
  );
};

export default UserAvatar;
