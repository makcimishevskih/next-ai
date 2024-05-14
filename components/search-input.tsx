"use client";

import qs from 'query-string';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const SearchInput = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const name = searchParams.get('name');
  const categoryId = searchParams.get('categoryId');

  const [value, setValue] = useState(name || '');
  const debounceValue = useDebounce(value, 500);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }

  useEffect(() => {
    const query = {
      name: debounceValue,
      categoryId
    };

    const url = qs.stringifyUrl({
      url: window.location.href,
      query
    }, { skipEmptyString: true, skipNull: true });

    router.push(url);
  }, [debounceValue, router, categoryId])

  return (
    <div className='relative'>
      <Search className='absolute h-4 w-4 top-3 left-4' />
      <Input placeholder='Search...' name='search' className='pl-10 bg-primary/10' value={value} onChange={onChange} />
    </div>
  );
};

export default SearchInput;