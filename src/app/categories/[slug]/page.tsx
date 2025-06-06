import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

interface CategoryPageProps {
  params: Promise<{ slug: string }>; // params is a Promise
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>; // Also type searchParams as Promise
}

async function getCategory(slug: string) {
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      guidelines: {
        orderBy: {
          title: 'asc'
        }
      }
    }
  })
  
  if (!category) {
    return null
  }
  
  return category
}

export default async function CategoryPage({ params: paramsPromise, searchParams: searchParamsPromise }: CategoryPageProps) {
  const { slug } = await paramsPromise; // Await the promise to get slug
  // const searchParams = searchParamsPromise ? await searchParamsPromise : {}; // Example if searchParams were needed
  const category = await getCategory(slug)
  
  if (!category) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold leading-tight text-gray-900">{category.name}</h1>
            {category.description && (
              <p className="mt-2 max-w-4xl text-sm text-gray-500">
                {category.description}
              </p>
            )}
          </div>
          <div className="mt-4 sm:mt-0">
            <a
              href="/categories"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              ← Back to all categories
            </a>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-gray-900 mb-4">Guidelines</h2>
      
      <div className="grid grid-cols-1 gap-4">
        {category.guidelines.length > 0 ? (
          category.guidelines.map((guideline) => (
            <div
              key={guideline.id}
              className="group relative bg-white p-4 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 shadow rounded-lg hover:shadow-md transition-shadow duration-200"
            >
              <h3 className="text-lg font-medium text-gray-900">
                <a href={`/guidelines/${guideline.slug}`} className="hover:underline focus:outline-none">
                  <span className="absolute inset-0" aria-hidden="true" />
                  {guideline.title}
                </a>
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Last updated: {new Date(guideline.updatedAt).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No guidelines found in this category</p>
          </div>
        )}
      </div>
    </div>
  )
}
