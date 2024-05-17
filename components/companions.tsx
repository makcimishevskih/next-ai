import { Companion } from '@prisma/client';

import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from 'next/link';
import { MessageSquare } from 'lucide-react';

type CompanionsProps = {
  data: (Companion & {
    _count: {
      messages: number
    }
  })[]
}

// --------------------------- 3:03 - 3:04

const Companions = ({ data }: CompanionsProps) => {
  if (data.length === 0) {
    return (
      <div className='pt-10 flex flex-col items-center justify-center space-y-3'>
        <div className='relative w-60 h-60'>
          <Image
            fill
            alt='Empty'
            src='/empty.png'
            className='grayscale'
            priority={true}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <p className='text-sm text-muted-foreground'>
          No companions found.
        </p>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-2 sm:grid-cols-4 md:grid-col-5 lg:grid-col-5 xl:grid-cols-6 gap-2 pb-10'>
      {data.map(companion => (
        <Card
          key={companion.id}
          className='bg-primary/10 rounded-xl cursor-pointer hover:opacity-75 transition border-0'
        >
          <Link href={`/chat/${companion.id}`}>
            <CardHeader className='flex items-center justify-center
          text-center text-muted-foreground'>
              <div className='relative w-32 h-32'>
                <Image
                  fill
                  priority={true}
                  alt="Companion"
                  src={companion.src}
                  className='rounded-xl object-cover'
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            </CardHeader>
            <CardContent className='font-bold'>
              <p>
                {companion.name}
              </p>
              <p>
                {companion.description}
              </p>
            </CardContent>
            <CardFooter className='flex items-center justify-between text-xs text-muted-foreground'>
              <p className='lowercase'>
                {companion.userName}
              </p>
              <div className='flex items-center'>
                <MessageSquare className='w-3 h-3 mr-1' />
                {companion._count.messages}
              </div>
            </CardFooter>
          </Link>
        </Card>
      ))}
    </div>
  );
};

export default Companions;