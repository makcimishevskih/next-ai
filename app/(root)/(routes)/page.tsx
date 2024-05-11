import { auth } from '@clerk/nextjs/server';

import SearchInput from '@/components/search-input';

const RootPage = () => {
  const Auth = auth();

  console.log(`------\n------\n${JSON.stringify(Auth)}\n------\n------`);

  return (
    <div className='h-full p-4 space-y-2'>
      <h1 className='mr-4'>
        Root page (Protected)
      </h1>

      <SearchInput />
    </div>
  );
};
export default RootPage;