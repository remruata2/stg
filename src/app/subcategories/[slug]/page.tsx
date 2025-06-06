import { notFound } from 'next/navigation'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'

interface SubcategoryRedirectProps {
  params: Promise<{ slug: string }>; // params is a Promise
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>; // Also type searchParams as Promise
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

export default async function SubcategoryRedirect({ params: paramsPromise, searchParams: searchParamsPromise }: SubcategoryRedirectProps) {
  const { slug } = await paramsPromise; // Await the promise to get slug
  // const searchParams = searchParamsPromise ? await searchParamsPromise : {}; // Example if searchParams were needed
  
  // Find the appropriate category to redirect to
  const redirectUrl = await findCategoryForSlug(slug)
  
  // Redirect to the category page
  redirect(redirectUrl)
}
