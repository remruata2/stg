'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import GuidelineForm from '@/components/GuidelineForm'
import { useToast } from '@/components/ui/Toast'

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
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [availableTags, setAvailableTags] = useState<TagItem[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)
  const [isLoadingTags, setIsLoadingTags] = useState(true)
  const router = useRouter()
  const { addToast } = useToast()
  
  // Fetch categories when component mounts
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/categories')
        if (!response.ok) {
          throw new Error('Failed to fetch categories')
        }
        const data = await response.json()
        setCategories(data)
      } catch (error) {
        console.error('Error fetching categories:', error)
        addToast('Failed to load categories', 'error')
      } finally {
        setIsLoadingCategories(false)
      }
    }
    
    fetchCategories()
  }, [addToast])
  
  // Fetch tags when component mounts
  useEffect(() => {
    async function fetchTags() {
      try {
        const response = await fetch('/api/tags')
        if (!response.ok) {
          throw new Error('Failed to fetch tags')
        }
        const data = await response.json()
        setAvailableTags(data)
      } catch (error) {
        console.error('Error fetching tags:', error)
        addToast('Failed to load tags', 'error')
      } finally {
        setIsLoadingTags(false)
      }
    }
    
    fetchTags()
  }, [addToast])
  
  const handleSubmit = async (data: any) => {
    setIsLoading(true)
    
    try {
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
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-5">
        <h1 className="text-3xl font-bold leading-tight text-gray-900">Create New Guideline</h1>
        <p className="mt-2 max-w-4xl text-sm text-gray-500">
          Create a new treatment guideline with detailed information
        </p>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        {isLoadingCategories || isLoadingTags ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <GuidelineForm 
            categories={categories as any} 
            availableTags={availableTags as any}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  )
}
