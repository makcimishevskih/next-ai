import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Next.js sign-in and sign-up layout",
  description: "Sign-in or sing-up in to the app with your companions",
};

export default function RootLayout ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='flex justify-center items-center h-full m-2'>
      {children}
    </div>

  );
}
