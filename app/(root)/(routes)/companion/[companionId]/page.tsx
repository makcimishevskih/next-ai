import prismadb from '@/lib/prismadb';
import CompanionForm from './components/companion-form';

type CompanionIdPageProps = {
  params: {
    companionId: string
  }
}

// TODO check subscription 
const CompanionIdPage = async ({ params: { companionId } }: CompanionIdPageProps) => {
  const companion = await prismadb.companion.findUnique({
    where: {
      id: companionId,
    },
  })

  const categories = await prismadb.category.findMany();

  console.log(companionId);

  const isNew = companionId === 'new';

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