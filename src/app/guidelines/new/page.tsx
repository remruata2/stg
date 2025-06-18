'use client'

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { guidelineSchema, GuidelineFormValues } from '@/types/guideline';
import { useRouter } from 'next/navigation'
import GuidelineForm from '@/components/GuidelineForm'
import { useToast } from '@/components/ui/Toast'

// This would typically come from an API call
const mockCategories = [
  {
    id: 'cat1',
    name: 'Cardiovascular'
  },
  {
    id: 'cat2',
    name: 'Respiratory'
  }
]

interface Tag {
  id: string
  name: string
  slug: string
}

export default function NewGuidelinePage() {
  const { register, control, handleSubmit: formHandleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<GuidelineFormValues>({
    resolver: zodResolver(guidelineSchema),
    defaultValues: {
      title: '',
      content: '',
      categoryId: '', // Make sure mockCategories has a default or handle empty selection
      tags: [],
      references: [],
    },
  });

  
  const [availableTags, setAvailableTags] = useState<Tag[]>([])
  const [isLoadingTags, setIsLoadingTags] = useState(true)
  const router = useRouter()
  const { addToast } = useToast()
  
  // Fetch tags when component mounts
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch('/api/tags')
        if (response.ok) {
          const tags = await response.json()
          setAvailableTags(tags)
        }
      } catch (error) {
        console.error('Error fetching tags:', error)
      } finally {
        setIsLoadingTags(false)
      }
    }
    
    fetchTags()
  }, [])
  
  const actualSubmitHandler = async (data: GuidelineFormValues) => {
    
    
    try {
      // In a real app, you would call your API here
      const response = await fetch('/api/guidelines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        throw new Error('Failed to create guideline')
      }
      
      const guideline = await response.json()
      
      // Show success toast notification
      addToast('Guideline created successfully', 'success')
      
      // Redirect to the newly created guideline
      router.push(`/guidelines/${guideline.slug}`)
      router.refresh()
    } catch (error) {
      console.error('Error creating guideline:', error)
      // Show error toast notification
      addToast('Failed to create guideline. Please try again.', 'error')
    }
  }

  const watchedTags = watch('tags', []);
  const handleTagsChange = (newTags: Tag[]) => {
    setValue('tags', newTags.map(t => t.id), { shouldValidate: true });
  };
  
  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-5">
        <h1 className="text-3xl font-bold leading-tight text-gray-900">Create New Guideline</h1>
        <p className="mt-2 max-w-4xl text-sm text-gray-500">
          Add a new treatment guideline to the wiki. Use Markdown for formatting.
        </p>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        {isLoadingTags ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
            <form onSubmit={formHandleSubmit(actualSubmitHandler)} className="space-y-6">
              <GuidelineForm 
                categories={mockCategories} 
                availableTags={availableTags}
                control={control}
                register={register}
                errors={errors}
                selectedTags={availableTags.filter(tag => watchedTags.includes(tag.id))}
                onTagsChange={handleTagsChange}

                initialContent=""
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
