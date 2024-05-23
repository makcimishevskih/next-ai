import { ChatRequestOptions } from 'ai';
import { ChangeEventHandler, FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SendHorizonal } from 'lucide-react';

type ChatFormProps = {
  input: string,
  isLoading: boolean,
  onSubmit: (e: FormEvent<HTMLFormElement>, chatRequestOptions?: ChatRequestOptions) => void
  handleInputChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
}

const ChatForm = ({
  input,
  onSubmit,
  isLoading,
  handleInputChange
}: ChatFormProps) => {
  return (
    <form onSubmit={onSubmit} className='border-primary/10 py-4 flex items-center gap-x-2'>
      <Input
        value={input}
        disabled={isLoading}
        onChange={handleInputChange}
        placeholder="Type a message..."
        className='rounded-lg bg-primary/10'
      />

      <Button className='' variant='ghost'>
        <SendHorizonal className='h-6 w-6' />
      </Button>
    </form>
  );
};

export default ChatForm;