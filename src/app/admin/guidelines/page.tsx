"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import TagBadge from "@/components/ui/TagBadge";

interface GuidelineItem {
  id: string;
  title: string;
  slug: string;
  content: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  tags: {
    id: string;
    name: string;
    slug: string;
  }[];
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

export default function AdminGuidelinesPage() {
  const [guidelines, setGuidelines] = useState<GuidelineItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentGuideline, setCurrentGuideline] =
    useState<GuidelineItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { addToast } = useToast();

  useEffect(() => {
    fetchGuidelines();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      addToast('Failed to load categories', 'error');
    }
  };

  const filteredGuidelines = guidelines
    .filter(guideline => 
      guideline.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedCategory === '' || guideline.categoryId === selectedCategory)
    )
    .sort((a, b) => a.title.localeCompare(b.title));

  const fetchGuidelines = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/guidelines");
      if (!response.ok) {
        throw new Error("Failed to fetch guidelines");
      }
      const data = await response.json();
      setGuidelines(data);
    } catch (error) {
      console.error("Error fetching guidelines:", error);
      addToast("Failed to load guidelines", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteGuideline = async () => {
    if (!currentGuideline) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/guidelines/${currentGuideline.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete guideline");
      }

      addToast("Guideline deleted successfully", "success");
      setShowDeleteModal(false);
      fetchGuidelines();
    } catch (error) {
      console.error("Error deleting guideline:", error);
      addToast("Failed to delete guideline", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDeleteModal = (guideline: GuidelineItem) => {
    setCurrentGuideline(guideline);
    setShowDeleteModal(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6 px-6 py-6">
      <div className="border-b border-gray-200 dark:border-gray-700 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className="text-3xl font-bold leading-tight text-gray-900 dark:text-gray-100 mb-4 sm:mb-0">
            Guidelines
          </h1>
          <Link
            href="/admin/guidelines/new"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto w-full"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            New Guideline
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <input
              type="text"
              placeholder="Search guidelines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base px-3 py-2"
            />
          </div>
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base px-3 py-2"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredGuidelines.length > 0 ? (
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredGuidelines.map((guideline) => (
              <li key={guideline.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col flex-grow">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        {guideline.title}
                      </h3>
                      <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                        <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <span className="mr-1 font-medium">Category:</span>
                          <Link
                            href={`/categories/${guideline.category.slug}`}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                          >
                            {guideline.category.name}
                          </Link>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <span className="mr-1 font-medium">
                            Last updated:
                          </span>
                          {formatDate(guideline.updatedAt)}
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {guideline.tags && guideline.tags.length > 0 ? (
                          guideline.tags.map((tag) => (
                            <TagBadge key={tag.id} tag={tag} />
                          ))
                        ) : (
                          <span className="text-sm text-gray-500">No tags</span>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        href={`/admin/guidelines/view/${guideline.slug}`}
                        className="inline-flex items-center p-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        title="View"
                      >
                        <EyeIcon className="h-4 w-4" aria-hidden="true" />
                      </Link>
                      <Link
                        href={`/admin/guidelines/edit/${guideline.id}`}
                        className="inline-flex items-center p-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        title="Edit"
                      >
                        <PencilIcon className="h-4 w-4" aria-hidden="true" />
                      </Link>
                      <button
                        onClick={() => openDeleteModal(guideline)}
                        className="inline-flex items-center p-1.5 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        title="Delete"
                      >
                        <TrashIcon className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="text-center py-12 bg-white shadow overflow-hidden sm:rounded-md">
          <p className="text-gray-500">No guidelines found</p>
          <Link
            href="/admin/guidelines/new"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Create First Guideline
          </Link>
        </div>
      )}

      {/* Delete Guideline Modal */}
      {showDeleteModal && currentGuideline && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Delete Guideline
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Are you sure you want to delete the guideline "
              {currentGuideline.title}"? This action cannot be undone.
            </p>
            <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
              <button
                type="button"
                onClick={handleDeleteGuideline}
                disabled={isSubmitting}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:col-start-2 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Deleting...
                  </span>
                ) : (
                  "Delete"
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
