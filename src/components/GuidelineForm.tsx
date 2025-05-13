import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import TagSelector from './ui/TagSelector'

const guidelineSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
  content: z.string().min(20, { message: 'Content must be at least 20 characters' }),
  categoryId: z.string().min(1, { message: 'Category is required' }),
  references: z.array(
    z.object({
      title: z.string().min(1, { message: 'Reference title is required' }),
      url: z.string().url({ message: 'Please enter a valid URL' }).optional().or(z.literal('')),
      description: z.string().optional()
    })
  ).optional()
})

type GuidelineFormValues = z.infer<typeof guidelineSchema>

interface Category {
  id: string
  name: string
}

interface Tag {
  id: string
  name: string
  slug: string
}

interface GuidelineFormProps {
  categories: Category[]
  availableTags: Tag[]
  initialTags?: Tag[]
  initialValues?: {
    title?: string
    content?: string
    categoryId?: string
  }
  onSubmit: (data: GuidelineFormValues & { tags: Tag[] }) => Promise<void>
  isLoading?: boolean
  submitButtonText?: string
}

export default function GuidelineForm({ 
  categories, 
  availableTags,
  initialTags = [],
  initialValues = {
    title: '',
    content: '',
    categoryId: ''
  },
  onSubmit, 
  isLoading = false,
  submitButtonText = 'Save'
}: GuidelineFormProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('')
  const [selectedTags, setSelectedTags] = useState<Tag[]>(initialTags)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<GuidelineFormValues>({
    resolver: zodResolver(guidelineSchema),
    defaultValues: {
      title: initialValues.title || '',
      content: initialValues.content || '',
      categoryId: initialValues.categoryId || '',
      references: [{ title: '', url: '', description: '' }]
    }
  })
  
  const categoryId = watch('categoryId')
  
  // No longer need a separate handleCategoryChange function as it's handled inline in the select onChange
  
  const handleTagsChange = (tags: Tag[]) => {
    setSelectedTags(tags)
  }
  
  const handleFormSubmit = async (data: GuidelineFormValues) => {
    try {
      // Include selected tags with the form data
      await onSubmit({ ...data, tags: selectedTags })
      reset()
      setSelectedTags([])
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }
  
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          id="title"
          {...register('title')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="categoryId"
            {...register('categoryId')}
            onChange={(e) => {
              setSelectedCategoryId(e.target.value);
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>
          )}
        </div>
      </div>
      
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          Content (Markdown supported)
        </label>
        <textarea
          id="content"
          rows={10}
          {...register('content')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
        {errors.content && (
          <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          You can use Markdown to format your content. For example, use # for headings, * for lists, etc.
        </p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tags
        </label>
        <TagSelector
          selectedTags={selectedTags}
          availableTags={availableTags}
          onTagsChange={handleTagsChange}
        />
        <p className="mt-1 text-xs text-gray-500">
          Add tags to categorize this guideline and make it easier to find.
        </p>
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : submitButtonText}
        </button>
      </div>
    </form>
  )
}
