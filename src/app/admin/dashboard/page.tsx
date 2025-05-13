'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useToast } from '@/components/ui/Toast'

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { addToast } = useToast()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return
    
    if (status === 'unauthenticated') {
      addToast('You must be logged in as an admin to access this page', 'error')
      router.push('/auth/login')
      return
    }
    
    if (session?.user?.role !== 'ADMIN') {
      addToast('You do not have permission to access this page', 'error')
      router.push('/')
      return
    }
    
    setIsLoading(false)
  }, [session, status, router, addToast])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="border-b border-gray-200 pb-5 mb-8">
        <h1 className="text-3xl font-bold leading-tight text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 max-w-4xl text-sm text-gray-500">
          Manage categories, guidelines, and tags
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Categories Management */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Categories</h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>Manage medical categories for organizing guidelines</p>
            </div>
            <div className="mt-5">
              <Link
                href="/admin/categories"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Manage Categories
              </Link>
            </div>
          </div>
        </div>



        {/* Guidelines Management */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Guidelines</h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>Create, edit, and manage treatment guidelines</p>
            </div>
            <div className="mt-5">
              <Link
                href="/admin/guidelines"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Manage Guidelines
              </Link>
            </div>
          </div>
        </div>

        {/* Tags Management */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Tags</h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>Manage tags for categorizing and filtering guidelines</p>
            </div>
            <div className="mt-5">
              <Link
                href="/admin/tags"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Manage Tags
              </Link>
            </div>
          </div>
        </div>

        {/* Users Management */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Users</h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>Manage admin users who can edit content</p>
            </div>
            <div className="mt-5">
              <Link
                href="/admin/users"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Manage Users
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
