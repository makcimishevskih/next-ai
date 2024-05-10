import Link from 'next/link';

const RootPage = () => {
  return (
    <div >
      <div className='text-green-500 text-3xl mb-5'>
        Hello ai companion (Protected)
      </div>

      <Link href='/login'>Go to test Link</Link>
    </div>);
};
export default RootPage;