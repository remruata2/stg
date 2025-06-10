'use client'

import { useState } from 'react'
import Link from 'next/link'

// Define the type for a Tag, including the _count field
export interface PublicTag {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  _count: {
    guidelines: number;
  };
}

interface PublicTagsListProps {
  tags: PublicTag[];
}

export default function PublicTagsList({ tags }: PublicTagsListProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="w-full bg-white dark:bg-slate-900 shadow rounded-lg divide-y divide-gray-200 dark:divide-slate-700">
      <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap">
          All Tags ({filteredTags.length})
        </h2>
        <input
          type="text"
          placeholder="Search tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full sm:w-72 rounded-md border-gray-300 bg-white dark:bg-slate-800 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base px-3 py-2"
        />
      </div>

      {filteredTags.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filteredTags.map((tag) => (
            <div
              key={tag.id}
              className="group relative bg-gray-50 dark:bg-slate-800 p-4 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors duration-200 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  <Link href={`/tags/${tag.slug}`} className="focus:outline-none">
                    <span className="absolute inset-0" aria-hidden="true" />
                    {tag.name}
                  </Link>
                </h3>
                {tag.description && (
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-3">
                    {tag.description}
                  </p>
                )}
              </div>
              <p className="mt-4 text-sm font-medium text-blue-600 dark:text-blue-400">
                {tag._count.guidelines} {tag._count.guidelines === 1 ? 'guideline' : 'guidelines'}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="col-span-full text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No tags found matching your search.</p>
        </div>
      )}
      </div>
    </div>
  )
}
