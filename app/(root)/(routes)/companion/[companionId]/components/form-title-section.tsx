import { Separator } from '@/components/ui/separator';

type FormTitleSectionProps = {
  title: string;
  description: string;
}

const FormTitleSection = ({ title, description }: FormTitleSectionProps) => {
  return (
    <div className='space-y-2'>
      <div>
        <h3 className='text-lg font-medium'>
          {title}
        </h3>
        <p className='text-sm text-muted-foreground'>
          {description}
        </p>
      </div>
      <Separator className='bg-primary/10' />
    </div>);
};
export default FormTitleSection