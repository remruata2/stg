import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import { ChevronRightIcon } from '@heroicons/react/24/outline'

export const dynamic = 'force-dynamic'

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
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

export default async function CategoryPage({ params: paramsPromise }: CategoryPageProps) {
  const { slug } = await paramsPromise;
  const category = await getCategory(slug)
  
  if (!category) {
    notFound()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <section className="bg-slate-100 dark:bg-slate-800 rounded-xl p-8 mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
          {category.name}
        </h1>
        {category.description && (
          <p className="mt-4 max-w-3xl mx-auto text-lg text-slate-600 dark:text-slate-300">
            {category.description}
          </p>
        )}
        <div className="mt-6">
          <Link
            href="/categories"
            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
          >
            ← Back to all categories
          </Link>
        </div>
      </section>

      {/* Guidelines List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {category.guidelines.length > 0 ? (
          category.guidelines.map((guideline) => (
            <Link
              key={guideline.id}
              href={`/guidelines/${guideline.slug}`}
              className="group block bg-white dark:bg-slate-800 p-6 shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300 border-l-4 border-transparent hover:border-blue-500 dark:hover:border-blue-400"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {guideline.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Last updated: {new Date(guideline.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <ChevronRightIcon className="h-6 w-6 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200">No Guidelines Found</h3>
            <p className="mt-2 text-slate-500 dark:text-slate-400">There are currently no guidelines in this category.</p>
          </div>
        )}
      </div>
    </div>
  )
}
