import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs/server';
// @ts-ignore-next-line
import CompanionForm from '@/(root)/(routes)/companion/[companionId]/components/companion-form';

type CompanionIdPageProps = {
  params: {
    companionId: string
  }
}

// TODO check subscription 
const CompanionIdPage = async ({ params: { companionId } }: CompanionIdPageProps) => {
  const { userId, redirectToSignIn } = auth();

  if (!userId) {
    redirectToSignIn();
  }

  const companion = await prismadb.companion.findUnique({
    where: {
      id: companionId,
      // @ts-ignore-next-line
      userId
    },
  });

  const categories = await prismadb.category.findMany();

  return (
    <div>
      <CompanionForm
        initialData={companion}
        categories={categories}
      />
    </div >
  );
};

export default CompanionIdPage;