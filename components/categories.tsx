"use client"

import { cn } from '@/lib/utils';
import { Category } from '@prisma/client';
import { useRouter, useSearchParams } from 'next/navigation';
import qs from 'query-string';

type CategoriesProps = {
  data: Category[]
}

//
// companion creation form 1:37
//

const Categories = ({ data }: CategoriesProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categoryId = searchParams.get('categoryId');

  const onClick = (id: string | undefined) => {
    const query = {
      categoryId: id
    }

    const url = qs.stringifyUrl({
      url: window.location.href,
      query
    }, { skipNull: true })

    router.push(url);
  }

  const btnCss = (styles: string) => cn(
    'flex items-center text-center text-sm md:text-sm px-2 md:px-4 py-2 md:py-3 rounded-md bg-primary hover:opacity-75 transition',
    styles
  );

  return (
    <div className='w-full overflow-x-auto space-x-2 flex p-1'>
      <button
        className={btnCss(!categoryId ? 'bg-primary/25' : 'bg-primary/10')}
        onClick={() => onClick(undefined)}
      >
        Newest
      </button>

      {data.map(category => <button
        className={btnCss(category.id === categoryId ? 'bg-primary/25' : 'bg-primary/10')}
        onClick={() => onClick(category.id)}
        key={category.id}
      >
        {category.name}
      </button>
      )}
    </div>
  );
};
export default Categories;