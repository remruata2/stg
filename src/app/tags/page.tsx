import { prisma } from '@/lib/db'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

async function getTags() {
  const tags = await prisma.tag.findMany({
    include: {
      _count: {
        select: { guidelines: true }
      }
    },
    orderBy: {
      name: 'asc'
    }
  })
  return tags
}

export default async function TagsPage() {
  const tags = await getTags()

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-5">
        <h1 className="text-3xl font-bold leading-tight text-gray-900">Tags</h1>
        <p className="mt-2 max-w-4xl text-sm text-gray-500">
          Browse all tags in the Standard Treatment Guidelines
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tags.length > 0 ? (
            tags.map((tag) => (
              <div 
                key={tag.id} 
                className="group relative bg-gray-50 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <h3 className="text-lg font-medium text-gray-900">
                  <Link href={`/tags/${tag.slug}`} className="focus:outline-none">
                    <span className="absolute inset-0" aria-hidden="true" />
                    {tag.name}
                  </Link>
                </h3>
                {tag.description && (
                  <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                    {tag.description}
                  </p>
                )}
                <p className="mt-4 text-sm font-medium text-blue-600">
                  {tag._count.guidelines} {tag._count.guidelines === 1 ? 'guideline' : 'guidelines'}
                </p>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">No tags found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
