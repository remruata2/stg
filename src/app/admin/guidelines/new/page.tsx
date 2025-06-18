'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { guidelineSchema, GuidelineFormValues } from '@/types/guideline';
import { useToast } from '@/components/ui/Toast';
import GuidelineForm from '@/components/GuidelineForm';


interface TagItem {
  id: string
  name: string
  slug: string
  description?: string
}

interface CategoryItem {
  id: string
  name: string
  slug: string
  description?: string
  _count?: {
    guidelines: number
  }
}



export default function AdminNewGuidelinePage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [availableTags, setAvailableTags] = useState<TagItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { addToast } = useToast();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catResponse, tagsResponse] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/tags'),
        ]);
        if (!catResponse.ok || !tagsResponse.ok) {
          throw new Error('Failed to fetch initial data');
        }
        const cats = await catResponse.json();
        const tags = await tagsResponse.json();
        setCategories(cats);
        setAvailableTags(tags);
      } catch (error) {
        console.error('Error fetching data:', error);
        addToast('Failed to load categories and tags.', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [addToast]);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<GuidelineFormValues>({
    resolver: zodResolver(guidelineSchema),
    defaultValues: {
      title: '',
      content: '',
      categoryId: '',
      tags: [],
      references: [],
    },
  });

  const selectedTags = watch('tags');

  const handleTagsChange = (tags: TagItem[]) => {
    setValue('tags', tags.map(t => t.id), { shouldValidate: true });
  };

  const onSubmit = async (data: GuidelineFormValues) => {
    try {
      const response = await fetch('/api/guidelines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create guideline');
      }

      addToast('Guideline created successfully!', 'success');
      router.push('/admin/guidelines');
      router.refresh();
    } catch (error) {
      console.error('Error creating guideline:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      addToast(errorMessage, 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-5">
        <h1 className="text-3xl font-bold leading-tight text-gray-900">Create New Guideline</h1>
        <p className="mt-2 max-w-4xl text-sm text-gray-500">
          Create a new treatment guideline with detailed information
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        {isLoading ? (
          <p>Loading form...</p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <GuidelineForm
              control={control}
              register={register}
              errors={errors}
              categories={categories}
              availableTags={availableTags}
              selectedTags={availableTags.filter(t => selectedTags.includes(t.id))}
              onTagsChange={handleTagsChange}
            />

            

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Guideline'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
