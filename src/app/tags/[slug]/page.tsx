import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import TagBadge from '@/components/ui/TagBadge'

export const dynamic = 'force-dynamic'

interface TagPageProps {
  params: {
    slug: string
  }
}

async function getTagWithGuidelines(slug: string) {
  const tag = await prisma.tag.findUnique({
    where: { slug },
    include: {
      guidelines: {
        include: {
          category: true,
          tags: true
        },
        orderBy: {
          title: 'asc'
        }
      }
    }
  })
  
  if (!tag) {
    return null
  }
  
  return tag
}

export default async function TagPage(props: TagPageProps) {
  // In Next.js 15, we need to ensure params is fully resolved
  const params = await Promise.resolve(props.params)
  const tag = await getTagWithGuidelines(params.slug)
  
  if (!tag) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center">
              <h1 className="text-3xl font-bold leading-tight text-gray-900">
                Tag: {tag.name}
              </h1>
            </div>
            {tag.description && (
              <p className="mt-2 max-w-4xl text-sm text-gray-500">
                {tag.description}
              </p>
            )}
          </div>
          <div className="mt-4 sm:mt-0">
            <a
              href="/tags"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              ← Browse all tags
            </a>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Guidelines with this tag ({tag.guidelines.length})
          </h2>
          
          {tag.guidelines.length > 0 ? (
            <div className="space-y-6">
              {tag.guidelines.map((guideline) => (
                <div key={guideline.id} className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        <a href={`/guidelines/${guideline.slug}`} className="hover:underline">
                          {guideline.title}
                        </a>
                      </h3>
                      <div className="mt-1 text-sm text-gray-500">
                        <a href={`/categories/${guideline.category.slug}`} className="hover:underline">
                          {guideline.category.name}
                        </a>
                      </div>
                    </div>
                    <div className="mt-2 sm:mt-0">
                      <div className="flex flex-wrap gap-2">
                        {guideline.tags
                          .filter(t => t.id !== tag.id) // Don't show the current tag
                          .map(otherTag => (
                            <TagBadge 
                              key={otherTag.id} 
                              tag={otherTag} 
                              size="sm" 
                            />
                          ))
                        }
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No guidelines found with this tag</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
