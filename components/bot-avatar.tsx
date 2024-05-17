import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type BotAvatar = {
  src: string
}

const BotAvatar = ({ src }: BotAvatar) => {
  return (
    <Avatar>
      <AvatarImage
        className='h-12 w-12' src={src ? src : "https://github.com/shadcn.png"} />
      <AvatarFallback>EN</AvatarFallback>
    </Avatar>
  );
};

export default BotAvatar;
