"use client";
import { CldUploadButton } from 'next-cloudinary';
import Image from 'next/image';
import { useEffect, useState } from 'react';

type ImageUploadProps = {
  value: string;
  onChange: (src: string) => void;
  disabled?: boolean
}

const uploadPreset = 'wq0ubuhm';

const ImageUpload = ({ value, onChange, disabled = false }: ImageUploadProps) => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <div className='space-y-4 w-full flex flex-col justify-center items-center'>
      <CldUploadButton
        options={{
          maxFiles: 1
        }}
        onUpload={(result: any) => onChange(result.info.secure_url)}
        uploadPreset={uploadPreset}
      >
        <div className='relative p-20 border-4 border-dashed border-primary/10 rounded-lg hover:opacity-75 transition flex flex-col space-y-2 items-center justify-center'>
          <Image
            fill
            alt='Upload'
            priority={true}
            src={value || '/placeholder.svg'}
            className='object-cover p-2 rounded-lg'
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </CldUploadButton>
    </div >
  );
};
export default ImageUpload;