import Navbar from '@/components/navbar';
import Sidebar from '@/components/sidebar';
import { Toaster } from "@/components/ui/toaster"


export default function RootLayout ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='h-full'>
      <Navbar />
      <div className='hidden md:flex mt-16 w-20 flex-col fixed inset-y-0'>
        <Sidebar />
      </div>
      <main className='md:pl-20 pt-16 h-full'>
        {children}
        <Toaster />
      </main>
    </div>
  );
}
