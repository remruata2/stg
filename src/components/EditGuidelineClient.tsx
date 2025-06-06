'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/Toast'
import GuidelineForm from '@/components/GuidelineForm'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

// Define interfaces for our form data (renamed to avoid conflicts with Prisma types)
interface AdminCategoryItem {
  id: string
  name: string
  slug: string
  description?: string
}

interface AdminTagItem {
  id: string
  name: string
  slug: string
  description?: string
}

interface AdminGuidelineItem {
  id: string
  title: string
  slug: string
  content: string
  categoryId: string
  tags: AdminTagItem[]
  category: {
    id: string
    name: string
  }
}

export default function EditGuidelineClient({ id }: { id: string }) {
  const [isLoading, setIsLoading] = useState(true)
  const [guideline, setGuideline] = useState<AdminGuidelineItem | null>(null)
  const [categories, setCategories] = useState<AdminCategoryItem[]>([])

  const [availableTags, setAvailableTags] = useState<AdminTagItem[]>([])
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { addToast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch the guideline data
        const guidelineResponse = await fetch(`/api/guidelines/${id}`)
        if (!guidelineResponse.ok) {
          throw new Error('Failed to fetch guideline')
        }
        const guidelineData = await guidelineResponse.json()
        setGuideline(guidelineData)

        // Fetch categories
        const categoriesResponse = await fetch('/api/categories')
        if (!categoriesResponse.ok) {
          throw new Error('Failed to fetch categories')
        }
        const categoriesData = await categoriesResponse.json()
        setCategories(categoriesData)

        // No need to fetch subcategories as they've been removed from the schema

        // Fetch all tags
        const tagsResponse = await fetch('/api/tags')
        if (!tagsResponse.ok) {
          throw new Error('Failed to fetch tags')
        }
        const tagsData = await tagsResponse.json()
        setAvailableTags(tagsData)
      } catch (error) {
        console.error('Error fetching data:', error)
        setError('Failed to load guideline data. Please try again.')
        addToast('Failed to load guideline data', 'error')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id, addToast])

  // No need for handleCategoryChange function as subcategories have been removed

  const handleSubmit = async (formData: {
    title: string
    content: string
    categoryId: string
    tags: AdminTagItem[]
  }) => {
    try {
      const response = await fetch(`/api/guidelines/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          categoryId: formData.categoryId,
          tagIds: formData.tags.map((tag: AdminTagItem) => tag.id),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update guideline')
      }

      addToast('Guideline updated successfully', 'success')
      router.push('/admin/guidelines')
    } catch (error) {
      console.error('Error updating guideline:', error)
      addToast('Failed to update guideline', 'error')
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error || !guideline) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-red-600">Error</h1>
        <p className="mt-4 text-gray-600">{error || 'Guideline not found'}</p>
        <Link href="/admin/guidelines" className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
          <ArrowLeftIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Back to Guidelines
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-5 sm:flex sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold leading-tight text-gray-900">Edit Guideline</h1>
        <div className="mt-3 sm:mt-0 sm:ml-4">
          <Link
            href="/admin/guidelines"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowLeftIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Back to Guidelines
          </Link>
        </div>
      </div>

      <GuidelineForm
        initialValues={{
          title: guideline.title,
          content: guideline.content,
          categoryId: guideline.categoryId
        }}
        initialTags={guideline.tags}
        categories={categories}
        availableTags={availableTags}
        onSubmit={handleSubmit}
        submitButtonText="Update Guideline"
      />
    </div>
  )
}
