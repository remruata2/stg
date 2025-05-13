'use client'

import { useState, useEffect } from 'react'
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
  const [isLoading, setIsLoading] = useState(false)
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
  
  const handleSubmit = async (data: any) => {
    setIsLoading(true)
    
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
    } finally {
      setIsLoading(false)
    }
  }
  
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
          <GuidelineForm 
            categories={mockCategories} 
            availableTags={availableTags}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  )
}
