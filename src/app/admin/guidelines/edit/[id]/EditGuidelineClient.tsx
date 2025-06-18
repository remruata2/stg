"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { guidelineSchema, GuidelineFormValues } from '@/types/guideline';
import GuidelineForm from "@/components/GuidelineForm";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

// Define interfaces for our form data (renamed to avoid conflicts with Prisma types)
interface AdminCategoryItem {
	id: string;
	name: string;
	slug: string;
	description?: string;
}

interface AdminTagItem {
	id: string;
	name: string;
	slug: string;
	description?: string;
}

interface AdminGuidelineItem {
	id: string;
	title: string;
	slug: string;
	content: string;
	categoryId: string;
	tags: AdminTagItem[];
	references?: {
		title: string;
		url?: string;
		description?: string;
	}[];
	category: {
		id: string;
		name: string;
	};
}

export default function EditGuidelineClient({ id }: { id: string }) {
	const [isLoading, setIsLoading] = useState(true);
	const [guideline, setGuideline] = useState<AdminGuidelineItem | null>(null);
	const [categories, setCategories] = useState<AdminCategoryItem[]>([]);

	const [availableTags, setAvailableTags] = useState<AdminTagItem[]>([]);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();
	const { addToast } = useToast();

  

  const { register, control, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<GuidelineFormValues>({
    resolver: zodResolver(guidelineSchema),
    defaultValues: {
      title: guideline?.title || '',
      content: guideline?.content || '',
      categoryId: guideline?.categoryId || '',
      tags: guideline?.tags.map((t: any) => t.id) || [],
      references: guideline?.references || [],
    }
  });

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			try {
				// Fetch the guideline data
				const guidelineResponse = await fetch(`/api/guidelines/${id}`, { cache: 'no-store' });
				if (!guidelineResponse.ok) {
					throw new Error("Failed to fetch guideline");
				}
				const guidelineData = await guidelineResponse.json();
				console.log('[EditGuidelineClient] Fetched guidelineData:', JSON.stringify(guidelineData, null, 2)); // Log fetched data
				setGuideline(guidelineData);
        setValue('title', guidelineData.title);
        setValue('content', guidelineData.content);
        setValue('categoryId', guidelineData.categoryId);
        setValue('tags', guidelineData.tags.map((t: any) => t.id));
        setValue('references', guidelineData.references || []);

				// Fetch categories
				const categoriesResponse = await fetch("/api/categories");
				if (!categoriesResponse.ok) {
					throw new Error("Failed to fetch categories");
				}
				const categoriesData = await categoriesResponse.json();
				setCategories(categoriesData);

				// No need to fetch subcategories as they've been removed from the schema

				// Fetch all tags
				const tagsResponse = await fetch("/api/tags");
				if (!tagsResponse.ok) {
					throw new Error("Failed to fetch tags");
				}
				const tagsData = await tagsResponse.json();
				setAvailableTags(tagsData);
			} catch (error) {
				console.error("Error fetching data:", error);
				setError("Failed to load guideline data. Please try again.");
				addToast(`Failed to load guideline data: ${error instanceof Error ? error.message : 'Unknown error'}`, "error");
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, [id, addToast]);

	// No need for handleCategoryChange function as subcategories have been removed

	const handleTagsChange = (tags: AdminTagItem[]) => {
    setValue('tags', tags.map(t => t.id), { shouldValidate: true });
  };

	const onSubmit = async (formData: GuidelineFormValues) => {
		console.log('EditGuidelineClient onSubmit called with:', formData);
		console.log('Guideline ID:', id);
		
		try {
			const requestBody = {
				title: formData.title,
				content: formData.content,
				categoryId: formData.categoryId,
				tagIds: formData.tags,
				references: formData.references,
			};
			
			console.log('Sending PUT request to:', `/api/guidelines/${id}`);
			console.log('Request body:', requestBody);
			
			const response = await fetch(`/api/guidelines/${id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(requestBody),
			});

			console.log('Response status:', response.status);
			console.log('Response ok:', response.ok);
			
			if (!response.ok) {
				const errorData = await response.json();
				console.error('Error data received:', errorData);
				throw new Error(errorData.error || "Failed to update guideline");
			}

			const responseData = await response.json();
			console.log('Success response:', responseData);
			
			addToast("Guideline updated successfully", "success");
			router.push("/admin/guidelines");
		} catch (error) {
			console.error('Error updating guideline:', error);
			// Display more detailed error message
			addToast(`Failed to update guideline: ${error instanceof Error ? error.message : 'Unknown error'}`, "error");
		}
	};

	if (isLoading) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
			</div>
		);
	}

	if (error || !guideline) {
		return (
			<div className="text-center py-12">
				<h1 className="text-2xl font-bold text-red-600">Error</h1>
				<p className="mt-4 text-gray-600">{error || "Guideline not found"}</p>
				<Link
					href="/admin/guidelines"
					className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
				>
					<ArrowLeftIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
					Back to Guidelines
				</Link>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="border-b border-gray-200 pb-5 sm:flex sm:items-center sm:justify-between">
				<h1 className="text-3xl font-bold leading-tight text-gray-900">
					Edit Guideline
				</h1>
				<div className="mt-3 sm:mt-0 sm:ml-4">
					<Link
						href="/admin/guidelines"
						className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
					>
						<ArrowLeftIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
						Back to Guidelines
					</Link>
				</div>
			</div>

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <GuidelineForm
          control={control}
          register={register}
          errors={errors}
          categories={categories}
          availableTags={availableTags}
          selectedTags={availableTags.filter(t => watch('tags', []).includes(t.id))}
          onTagsChange={handleTagsChange}
          initialContent={guideline.content}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isSubmitting ? 'Updating...' : 'Update Guideline'}
        </button>
      </form>
		</div>
	);
}
