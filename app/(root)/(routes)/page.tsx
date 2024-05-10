import { auth } from '@clerk/nextjs/server';
import { UserButton } from '@clerk/nextjs';

import Link from 'next/link';

const RootPage = () => {
  const Auth = auth();

  console.log(`------\n------\n${JSON.stringify(Auth)}\n------\n------`);

  return (
    <div >
      <div className='text-green-500 text-3xl mb-5'>
        <h1 className='mr-4'>
          Hello ai companion (Protected)
        </h1>
        <UserButton afterSignOutUrl='/' />
      </div>


      {/* <Link href='/sign-in' className='block mb-2 text-xl'>Go to <b className='text-red-500'>SIGN-IN</b> Page</Link><br />
      <Link href='/sign-up' className='block mb-2 text-xl'>Go to <b className='text-red-500'>SIGN-UP</b> Page</Link> */}
    </div>);
};
export default RootPage;