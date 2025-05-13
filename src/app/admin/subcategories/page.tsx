'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/Toast'

export default function AdminSubcategoriesRedirect() {
  const router = useRouter()
  const { addToast } = useToast()
  
  useEffect(() => {
    // Redirect to categories page
    addToast('Subcategories have been merged into categories. Redirecting...', 'info')
    router.push('/admin/categories')
  }, [router, addToast])
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  )
}
