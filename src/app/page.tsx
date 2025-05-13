import { prisma } from '@/lib/db'
import SearchBar from '@/components/SearchBar'

export const dynamic = 'force-dynamic'

async function getFeaturedCategories() {
  // Get top 3 categories with the most guidelines
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { guidelines: true }
      }
    },
    orderBy: {
      guidelines: {
        _count: 'desc'
      }
    },
    take: 3
  })
  return categories
}

async function getRecentGuidelines() {
  // Get 3 most recently updated guidelines
  const guidelines = await prisma.guideline.findMany({
    include: {
      category: true
    },
    orderBy: {
      updatedAt: 'desc'
    },
    take: 3
  })
  return guidelines
}

export default async function Home() {
  const [featuredCategories, recentGuidelines] = await Promise.all([
    getFeaturedCategories(),
    getRecentGuidelines()
  ])

  return (
    <div className="space-y-8">
      {/* Hero section */}
      <div className="text-center py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
          Standard Treatment Guidelines
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          A comprehensive resource for medical professionals, providing evidence-based treatment guidelines.
        </p>
        
        {/* Prominent Search Bar */}
        <div className="mt-8 max-w-2xl mx-auto">
          <div className="relative rounded-md shadow-lg">
            <SearchBar />
          </div>
          <p className="mt-2 text-sm text-gray-500">Search for guidelines, categories, or medical conditions</p>
        </div>
      </div>

      {/* Featured Categories */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Categories</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredCategories.length > 0 ? (
            featuredCategories.map((category) => (
              <div key={category.id} className="group relative bg-gray-50 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                <h3 className="text-lg font-medium text-gray-900">
                  <a href={`/categories/${category.slug}`} className="focus:outline-none">
                    <span className="absolute inset-0" aria-hidden="true" />
                    {category.name}
                  </a>
                </h3>
                <p className="mt-2 text-sm text-gray-500">{category._count.guidelines} guidelines</p>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-6">
              <p className="text-gray-500">No categories found</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Guidelines */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Guidelines</h2>
        <div className="space-y-4">
          {recentGuidelines.length > 0 ? (
            recentGuidelines.map((guideline) => (
              <div key={guideline.id} className="relative bg-gray-50 p-4 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                <h3 className="text-lg font-medium text-gray-900">
                  <a href={`/guidelines/${guideline.slug}`} className="hover:underline">
                    {guideline.title}
                  </a>
                </h3>
                <div className="mt-2 flex items-center text-sm text-gray-500 space-x-4">
                  <span>{guideline.category.name}</span>
                  <span>•</span>
                  <time dateTime={guideline.updatedAt.toISOString()}>
                    {new Date(guideline.updatedAt).toLocaleDateString()}
                  </time>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500">No guidelines found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
