import { notFound } from 'next/navigation'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'

interface SubcategoryRedirectProps {
  params: { slug: string }
}

async function findCategoryForSlug(slug: string) {
  'use server'
  // Try to find a category with this slug first
  const category = await prisma.category.findUnique({
    where: { slug },
    select: { slug: true }
  })
  
  if (category) {
    return `/categories/${category.slug}`
  }
  
  // If no category is found, redirect to the categories index
  return '/categories'
}

export default async function SubcategoryRedirect(props: SubcategoryRedirectProps) {
  const { params } = props
  
  // Find the appropriate category to redirect to
  const redirectUrl = await findCategoryForSlug(params.slug)
  
  // Redirect to the category page
  redirect(redirectUrl)
}
