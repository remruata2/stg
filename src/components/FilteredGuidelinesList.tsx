'use client'

import { useState } from 'react'
import TagBadge from '@/components/ui/TagBadge'

// Define the types based on Prisma schema (simplified here)
interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Guideline {
  id: string;
  title: string;
  slug: string;
  category: Category;
  tags: Tag[];
  // Add other guideline fields if needed for display
}

interface FilteredGuidelinesListProps {
  guidelines: Guideline[];
  currentTagId: string;
}

export default function FilteredGuidelinesList({ guidelines, currentTagId }: FilteredGuidelinesListProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredGuidelines = guidelines.filter(guideline =>
    guideline.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
          <h2 className="text-xl font-semibold text-gray-900 whitespace-nowrap">
            Guidelines with this tag ({filteredGuidelines.length})
          </h2>
          <input
            type="text"
            placeholder="Search guidelines..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full sm:w-72 rounded-md border-gray-300 bg-white dark:bg-slate-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base px-3 py-2"
          />
        </div>

        {filteredGuidelines.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGuidelines.map((guideline) => (
              <div
                key={guideline.id}
                className="bg-gray-50 dark:bg-slate-800 p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors duration-200"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between h-full">
                  <div className='flex flex-col justify-between flex-grow'>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        <a href={`/guidelines/${guideline.slug}`} className="hover:underline">
                          {guideline.title}
                        </a>
                      </h3>
                      <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        <a href={`/categories/${guideline.category.slug}`} className="hover:underline">
                          {guideline.category.name}
                        </a>
                      </div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-gray-200 dark:border-slate-700">
                      <div className="flex flex-wrap gap-2">
                        {guideline.tags
                          .filter((t) => t.id !== currentTagId) // Don't show the current tag
                          .map((otherTag) => (
                            <TagBadge
                              key={otherTag.id}
                              tag={otherTag}
                              size="sm"
                            />
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No guidelines found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  )
}
