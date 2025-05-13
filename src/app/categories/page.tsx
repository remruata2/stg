import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

async function getCategories() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { guidelines: true }
      }
    },
    orderBy: {
      name: 'asc'
    }
  })
  return categories
}

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-5">
        <h1 className="text-3xl font-bold leading-tight text-gray-900">Categories</h1>
        <p className="mt-2 max-w-4xl text-sm text-gray-500">
          Browse all medical categories in the Standard Treatment Guidelines
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.length > 0 ? (
          categories.map((category) => (
            <div 
              key={category.id} 
              className="group relative bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 shadow rounded-lg hover:shadow-md transition-shadow duration-200"
            >
              <h3 className="text-lg font-medium text-gray-900">
                <a href={`/categories/${category.slug}`} className="focus:outline-none">
                  <span className="absolute inset-0" aria-hidden="true" />
                  {category.name}
                </a>
              </h3>
              <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                {category.description || 'No description available'}
              </p>
              <p className="mt-4 text-sm font-medium text-blue-600">
                {category._count.guidelines} guidelines
              </p>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">No categories found</p>
          </div>
        )}
      </div>
    </div>
  )
}
