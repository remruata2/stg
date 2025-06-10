'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useToast } from '@/components/ui/Toast'
import { PencilIcon, TrashIcon, ArrowLeftIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import TagBadge from '@/components/ui/TagBadge'
import Markdown from 'react-markdown'

interface GuidelineDetail {
  id: string
  title: string
  slug: string
  content: string
  createdAt: string
  updatedAt: string
  category: {
    id: string
    name: string
    slug: string
  }
  tags: {
    id: string
    name: string
    slug: string
  }[],
  references?: {
    id: string;
    title: string;
    url?: string | null;
    description?: string | null;
  }[];
}

export default function AdminViewGuideline({ params }: { params: Promise<{ slug: string }> }) {
  const [guideline, setGuideline] = useState<GuidelineDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { addToast } = useToast()
  const { slug } = use(params)

  useEffect(() => {
    fetchGuideline()
  }, [slug])

  const fetchGuideline = async () => {
    setIsLoading(true)
    try {
      console.log('Fetching guideline with slug:', slug)
      const response = await fetch(`/api/guidelines/slug/${slug}`, { cache: 'no-store' })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Response not OK:', response.status, errorData);
        throw new Error(`Failed to fetch guideline: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      console.log('Guideline data received:', data)
      setGuideline(data)
    } catch (error) {
      console.error('Error fetching guideline:', error)
      addToast('Failed to load guideline', 'error')
      router.push('/admin/guidelines')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteGuideline = async () => {
    if (!guideline) return
    
    setIsSubmitting(true)
    
    try {
      const response = await fetch(`/api/guidelines/${guideline.id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete guideline')
      }
      
      addToast('Guideline deleted successfully', 'success')
      router.push('/admin/guidelines')
    } catch (error) {
      console.error('Error deleting guideline:', error)
      addToast('Failed to delete guideline', 'error')
    } finally {
      setIsSubmitting(false)
      setShowDeleteModal(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!guideline) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900">Guideline not found</h2>
        <p className="mt-2 text-gray-500">The guideline you're looking for doesn't exist or has been removed.</p>
        <Link
          href="/admin/guidelines"
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <ArrowLeftIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Back to Guidelines
        </Link>
      </div>
    )
  }

  return (
    <div className="py-4">
      {/* Header with actions */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center">
            <Link
              href="/admin/guidelines"
              className="mr-4 inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
            >
              <ArrowLeftIcon className="mr-1 h-4 w-4" />
              Back to Guidelines
            </Link>
            <Link 
              href={`/guidelines/${guideline.slug}`} 
              target="_blank"
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
            >
              View Public Page
              <ArrowTopRightOnSquareIcon className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">{guideline.title}</h1>
        </div>
        <div className="mt-4 flex space-x-3 sm:mt-0">
          <Link
            href={`/admin/guidelines/edit/${guideline.id}`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PencilIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" aria-hidden="true" />
            Edit
          </Link>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <TrashIcon className="-ml-1 mr-2 h-5 w-5 text-red-500" aria-hidden="true" />
            Delete
          </button>
        </div>
      </div>

      {/* Metadata */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Guideline Information</h3>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Category</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <Link href={`/admin/categories`} className="text-blue-600 hover:text-blue-800">
                  {guideline.category.name}
                </Link>
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Tags</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div className="flex flex-wrap gap-2">
                  {guideline.tags.length > 0 ? (
                    guideline.tags.map((tag) => (
                      <TagBadge key={tag.id} tag={tag} interactive={false} />
                    ))
                  ) : (
                    <span className="text-gray-500">No tags</span>
                  )}
                </div>
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {formatDate(guideline.updatedAt)}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Created</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {formatDate(guideline.createdAt)}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Content</h3>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6 prose max-w-none">
          <Markdown>{guideline.content}</Markdown>
        </div>
      </div>

      {guideline.references && guideline.references.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-900">References</h2>
          <div className="mt-4 bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-6">
            <ul className="space-y-4">
              {guideline.references.map((ref) => (
                <li key={ref.id} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                  <p className="font-semibold text-gray-800">{ref.title}</p>
                  {ref.url && (
                    <a 
                      href={ref.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline break-all"
                    >
                      {ref.url}
                    </a>
                  )}
                  {ref.description && (
                    <p className="text-sm text-gray-600 mt-1">{ref.description}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Delete Guideline Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Delete Guideline</h2>
            <p className="text-sm text-gray-500">
              Are you sure you want to delete the guideline "{guideline.title}"? This action cannot be undone.
            </p>
            <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
              <button
                type="button"
                onClick={handleDeleteGuideline}
                disabled={isSubmitting}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:col-start-2 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </span>
                ) : (
                  'Delete'
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
