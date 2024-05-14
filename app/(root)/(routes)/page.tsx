import SearchInput from '@/components/search-input';
import Categories from '@/components/categories';
import prismadb from '@/lib/prismadb';


const RootPage = async () => {
  const categories = await prismadb.category.findMany();

  return (
    <div className='h-full p-4 space-y-2'>
      <h1 className='mr-4'>
        Root page (Protected)
      </h1>

      <Categories data={categories} />

      <SearchInput />


    </div>
  );
};
export default RootPage;