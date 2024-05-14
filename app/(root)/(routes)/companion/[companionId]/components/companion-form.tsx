"use client";

import { z } from "zod";
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category, Companion } from '@prisma/client';

import { formSchema } from './schema';
import { PREAMBLE, SEED_CHAT } from './placeholder-text';

import { Wand } from 'lucide-react';
import FormTitleSection from './form-title-section';
import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";
import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormMessage,
  FormControl,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from '@/components/image-upload';
import { useToast } from '@/components/ui/use-toast';

type CompanionFormProps = {
  initialData: Companion | null;
  categories: Category[];
}

const CompanionForm = ({ initialData, categories }: CompanionFormProps) => {
  const { toast } = useToast()
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues:
      initialData || {
        src: '',
        name: '',
        seed: '',
        description: '',
        instructions: "",
        categoryId: undefined
      }
  });

  async function onSubmit (values: z.infer<typeof formSchema>) {
    let message = ''

    try {
      if (initialData) {
        message = 'UPDATE';
        // Update companion
        // @ts-ignore-next-line
        await axios(`/api/companion/${initialData.id}`, values);
      } else {
        message = 'CREATE';
        // Create Companiont
        await axios.post("/api/companion", values);
      }

      toast({
        title: `${message} COMPANION SUCCESS`,
      });
    } catch (err) {
      toast({
        title: `${message} COMPANION FORM ERROR`,
        description: `ERROR IS: ${err}`
      });
    }
    console.log(values)
  }

  const isLoading = form.formState.isSubmitting;

  return (
    <div className='h-full p-4 space-y-2 max-w-3xl mx-auto'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 pb-10'>

          <FormTitleSection
            title='General Information'
            description='General Information about your Companion'
          />

          <FormField
            control={form.control}
            name='src' render={(({ field }) => (
              <FormItem className='flex flex-col items-center justify-center space-y-4'>
                <FormControl>
                  <ImageUpload
                    disabled={isLoading}
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )
            )} />

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <FormField
              name='name'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <Input
                    placeholder='Elon Musk...'
                    disabled={isLoading}
                    {...field}
                  />
                  <FormDescription>
                    This i how your AI Companion will be named
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )} />
            <FormField
              name='description'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Surname</FormLabel>
                  <Input
                    disabled={isLoading}
                    placeholder='CEO and Founder of Tesla, SpaceX, X-social...'
                    {...field}
                  />
                  <FormDescription>
                    Short description for your AI Companion
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )} />

            <FormField
              name='categoryId'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder='Select a category...'
                        >
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem
                          key={category.id}
                          value={category.id}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select a category for your AI Companion
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )} />
          </div>


          <FormTitleSection
            title='Configuration'
            description='Detailed instructions for AI Companion Behaviour'
          />

          <FormField
            name='instructions'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instructions</FormLabel>
                <Textarea
                  className='resize-none'
                  rows={7}
                  disabled={isLoading}
                  placeholder={PREAMBLE}
                  {...field}
                />
                <FormDescription>
                  Describe in detail your companion&apos;s backstory and relevant details
                </FormDescription>
                <FormMessage />
              </FormItem>
            )} />

          <FormField
            name='seed'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Example conversation</FormLabel>
                <Textarea
                  className='resize-none'
                  rows={7}
                  disabled={isLoading}
                  placeholder={SEED_CHAT}
                  {...field}
                />
                <FormDescription>
                  Describe in detail your companion&apos;s backstory and relevant details
                </FormDescription>
                <FormMessage />
              </FormItem>
            )} />

          <div className='w-full flex justify-center'>
            <Button size='lg' disabled={isLoading}>
              {initialData ? "Edit your companion" : "Create your companion"}
              <Wand className='w-4 h-4 ml-2' />
            </Button>
          </div>
        </form>
      </Form >
    </div >
  )
};

export default CompanionForm;
