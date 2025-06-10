import { prisma } from '@/lib/db';
import {
  AcademicCapIcon,
  HeartIcon,
  ClipboardDocumentListIcon,
  UsersIcon,
  BeakerIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline';

const icons = [
  AcademicCapIcon,
  HeartIcon,
  ClipboardDocumentListIcon,
  UsersIcon,
  BeakerIcon,
  BookOpenIcon,
];

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
  const categories = await getCategories();

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="bg-slate-50 rounded-xl p-8 text-center shadow-sm">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Explore Medical Categories
        </h1>
        <p className="mt-4 text-lg leading-8 text-slate-600 max-w-2xl mx-auto">
          Browse all medical categories in the Standard Treatment Guidelines. Each category contains detailed guidelines to assist healthcare professionals.
        </p>
      </div>

      {/* Categories grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.length > 0 ? (
          categories.map((category, index) => {
            const IconComponent = icons[index % icons.length];
            return (
              <div
                key={category.id}
                className="group relative bg-white p-8 shadow-lg rounded-xl hover:shadow-2xl transition-all duration-300 border-t-4 border-transparent hover:border-blue-500 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-600 flex flex-col items-center text-center"
              >
                {/* Icon centered at the top */}
                <div className="mb-5 p-3 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors duration-300">
                  <IconComponent className="h-14 w-14 text-blue-600 group-hover:text-blue-700 transition-colors duration-300" />
                </div>

                {/* Text content */}
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold text-gray-900">
                    <a href={`/categories/${category.slug}`} className="focus:outline-none">
                      <span className="absolute inset-0" aria-hidden="true" />
                      {category.name}
                    </a>
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-3 flex-grow">
                    {category.description || 'No description available.'}
                  </p>
                </div>

                {/* Guideline count at the bottom */}
                <p className="mt-6 pt-4 border-t border-gray-200 text-sm font-medium text-blue-700 w-full">
                  {category._count.guidelines} guidelines
                </p>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">No categories found at the moment.</p>
            {/* You could add a button or link here to suggest creating categories if the user is an admin */}
          </div>
        )}
      </div>
    </div>
  );
}
