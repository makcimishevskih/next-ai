import prismadb from '@/lib/prismadb';

import Categories from '@/components/categories';
import SearchInput from '@/components/search-input';
import Companions from '@/components/companions';


type RootPageProps = {
  searchParams: {
    name: string;
    categoryId: string;
  }
}

const RootPage = async ({ searchParams }: RootPageProps) => {
  const categories = await prismadb.category.findMany();

  const companions = await prismadb.companion.findMany({
    where: {
      categoryId: searchParams.categoryId,
      name: {
        search: searchParams.name
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      _count: {
        select: {
          messages: true
        }
      }
    }
  });



  return (
    <div className='h-full p-4 space-y-2'>
      <SearchInput />
      <Categories data={categories} />
      <Companions data={companions} />
    </div>
  );
};
export default RootPage;