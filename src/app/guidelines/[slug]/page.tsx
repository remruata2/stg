import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";

import TagBadge from "@/components/ui/TagBadge";

export const dynamic = "force-dynamic";

interface GuidelinePageProps {
  params: Promise<{ slug: string }>; // params is a Promise
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>; // Also type searchParams as Promise
}

async function getGuideline(slug: string) {
  const guideline = await prisma.guideline.findUnique({
    where: { slug },
    include: {
      category: true,
      references: true,
      tags: true,
      revisions: {
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      },
    },
  });

  if (!guideline) {
    return null;
  }

  return guideline;
}

export default async function GuidelinePage({
  params: paramsPromise,
  searchParams: searchParamsPromise,
}: GuidelinePageProps) {
  const { slug } = await paramsPromise; // Await the promise to get slug
  // const searchParams = searchParamsPromise ? await searchParamsPromise : {}; // Example if searchParams were needed
  const guideline = await getGuideline(slug);

  if (!guideline) {
    notFound();
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar - Wikipedia style */}
      <div className="lg:w-64 flex-shrink-0">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 sticky top-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
            Contents
          </h3>
          <nav className="space-y-1">
            <a
              href="#overview"
              className="block px-3 py-2 text-sm rounded-md text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-700 font-medium"
            >
              Overview
            </a>
            <a
              href="#treatment"
              className="block px-3 py-2 text-sm rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100"
            >
              Treatment
            </a>
            <a
              href="#references"
              className="block px-3 py-2 text-sm rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100"
            >
              References
            </a>
            <a
              href="#history"
              className="block px-3 py-2 text-sm rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100"
            >
              Revision History
            </a>
          </nav>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
              Category
            </h3>
            <div className="space-y-2">
              <a
                href={`/categories/${guideline.category.slug}`}
                className="block text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                {guideline.category.name}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 w-full flex flex-col">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 self-stretch">
          <div className="border-b border-gray-200 dark:border-gray-700 pb-5 mb-6">
            <div className="flex flex-col">
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                <a
                  href={`/categories/${guideline.category.slug}`}
                  className="hover:underline"
                >
                  {guideline.category.name}
                </a>
              </div>
              <h1 className="text-3xl font-bold leading-tight text-gray-900 dark:text-gray-100">
                {guideline.title}
              </h1>
              <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                <span>
                  Last updated:{" "}
                  {new Date(guideline.updatedAt).toLocaleDateString()}
                </span>
              </div>

              {/* Tags */}
              {guideline.tags && guideline.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {guideline.tags.map(
                    (tag: { id: string; name: string; slug: string }) => (
                      <TagBadge key={tag.id} tag={tag} />
                    )
                  )}
                </div>
              )}
            </div>
          </div>

          <div
            id="overview"
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: guideline.content }}
          />

          {/* References section */}
          <div
            id="references"
            className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              References
            </h2>
            {guideline.references.length > 0 ? (
              <ol className="list-decimal pl-5 space-y-2">
                {guideline.references.map(
                  (reference: {
                    id: string;
                    title: string;
                    url?: string | null;
                    description?: string | null;
                  }) => (
                    <li
                      key={reference.id}
                      className="text-gray-700 dark:text-gray-300"
                    >
                      {reference.title}
                      {reference.url && (
                        <a
                          href={reference.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          [Link]
                        </a>
                      )}
                      {reference.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {reference.description}
                        </p>
                      )}
                    </li>
                  )
                )}
              </ol>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                No references available
              </p>
            )}
          </div>

          {/* Revision history */}
          <div
            id="history"
            className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Revision History
            </h2>
            <div className="space-y-4">
              {guideline.revisions.map(
                (
                  revision: {
                    id: string;
                    createdAt: Date | string;
                  },
                  index: number
                ) => (
                  <div key={revision.id} className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 relative mt-1">
                      <div className="absolute h-full w-0.5 bg-gray-200 dark:bg-gray-600 left-2.5 -translate-x-1/2" />
                      <div className="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center">
                        <span className="h-3 w-3 rounded-full bg-white" />
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {index === 0
                          ? "Current version"
                          : `Revision ${guideline.revisions.length - index}`}
                      </div>
                      <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(revision.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
