import { useState, useEffect } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import TagSelector from "./ui/TagSelector";

const guidelineSchema = z.object({
	title: z.string().min(3, { message: "Title must be at least 3 characters" }),
	content: z
		.string()
		.min(20, { message: "Content must be at least 20 characters" }),
	categoryId: z.string().min(1, { message: "Category is required" }),
	references: z
		.array(
			z.object({
				title: z.string().min(1, { message: "Reference title is required" }),
				url: z
					.string()
					.url({ message: "Please enter a valid URL" })
					.optional()
					.or(z.literal("")),
				description: z.string().optional(),
			})
		)
		.optional(),
});

type GuidelineFormValues = z.infer<typeof guidelineSchema>;

interface Category {
	id: string;
	name: string;
}

interface Tag {
	id: string;
	name: string;
	slug: string;
}

interface GuidelineFormProps {
	categories: Category[];
	availableTags: Tag[];
	initialData?: any; // Using `any` to be flexible with the incoming data structure
	onSubmit: (data: GuidelineFormValues & { tags: string[] }) => Promise<void>;
	isLoading?: boolean;
	submitButtonText?: string;
}

export default function GuidelineForm({
	categories,
	availableTags,
	initialData,
	onSubmit,
	isLoading = false,
	submitButtonText = "Save",
}: GuidelineFormProps) {
	const [selectedTags, setSelectedTags] = useState<Tag[]>(
		initialData?.tags || []
	);

	const {
		register,
		handleSubmit,
		control,
		reset,
		watch,
		setValue,
		formState: { errors },
	} = useForm<GuidelineFormValues>({
		resolver: zodResolver(guidelineSchema),
		defaultValues: {
			title: initialData?.title || "",
			content: initialData?.content || "",
			categoryId: initialData?.categoryId || "",
			references: initialData?.references || [],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: "references",
	});

	const handleValidationErrors = (validationErrors: any) => {
		console.error("Form validation errors:", validationErrors);
	};

	const categoryId = watch("categoryId");

	// No longer need a separate handleCategoryChange function as it's handled inline in the select onChange

	const handleTagsChange = (tags: Tag[]) => {
		setSelectedTags(tags);
	};

	// const { addToast } = useToast(); // Already declared in parent components, ensure it's passed if needed here or use context directly

	const handleFormSubmit = async (data: GuidelineFormValues) => {
		try {
			console.log("Form submit triggered", data);
			console.log("Selected tags:", selectedTags);

			const formDataWithTags = {
				...data,
				tags: selectedTags.map((tag) => tag.id),
			};

			console.log("Submitting data:", formDataWithTags);

			// Make sure to handle the Promise correctly
			await onSubmit(formDataWithTags);
			console.log("onSubmit completed");

			reset();
			setSelectedTags([]);
		} catch (error) {
			console.error("Error submitting form:", error);
			throw error; // Re-throw to ensure form handling knows about the error
		}
	};

	return (
		<form
			onSubmit={handleSubmit(handleFormSubmit, handleValidationErrors)}
			className="space-y-6"
		>
			<div>
				<label
					htmlFor="title"
					className="block text-sm font-medium text-gray-700"
				>
					Title
				</label>
				<input
					type="text"
					id="title"
					{...register("title")}
					className="mt-1 block w-full rounded-md border-gray-300 bg-white dark:bg-slate-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base px-3 py-2"
				/>
				{errors.title && (
					<p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
				)}
			</div>

			<div className="grid grid-cols-1 gap-6">
				<div>
					<label
						htmlFor="categoryId"
						className="block text-sm font-medium text-gray-700"
					>
						Category
					</label>
					<select
						id="categoryId"
						{...register("categoryId")}
						onChange={(e) => {
							setValue("categoryId", e.target.value, { shouldValidate: true });
						}}
						className="mt-1 block w-full rounded-md border-gray-300 bg-white dark:bg-slate-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base px-3 py-2"
					>
						<option value="">Select a category</option>
						{categories.map((category) => (
							<option key={category.id} value={category.id}>
								{category.name}
							</option>
						))}
					</select>
					{errors.categoryId && (
						<p className="mt-1 text-sm text-red-600">
							{errors.categoryId.message}
						</p>
					)}
				</div>
			</div>

			<div>
				<label
					htmlFor="content"
					className="block text-sm font-medium text-gray-700"
				>
					Content (Markdown supported)
				</label>
				<textarea
					id="content"
					rows={10}
					{...register("content")}
					className="mt-1 block w-full rounded-md border-gray-300 bg-white dark:bg-slate-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base px-3 py-2"
				/>
				{errors.content && (
					<p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
				)}
				<p className="mt-1 text-xs text-gray-500">
					You can use Markdown to format your content. For example, use # for
					headings, * for lists, etc.
				</p>
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">
					Tags
				</label>
				<TagSelector
					selectedTags={selectedTags}
					availableTags={availableTags}
					onTagsChange={handleTagsChange}
				/>
				<p className="mt-1 text-xs text-gray-500">
					Add tags to categorize this guideline and make it easier to find.
				</p>
			</div>

			{/* References Section */}
			<div>
				<h3 className="text-lg font-medium text-gray-900">
					References (Optional)
				</h3>
				<div className="mt-4 space-y-4">
					{fields.map((field, index) => (
						<div
							key={field.id}
							className="p-4 border rounded-md space-y-2 relative bg-gray-50"
						>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label
										htmlFor={`references.${index}.title`}
										className="block text-sm font-medium text-gray-700"
									>
										Reference Title
									</label>
									<input
										type="text"
										{...register(`references.${index}.title`)}
										id={`references.${index}.title`}
										className="mt-1 block w-full rounded-md border-gray-300 bg-white dark:bg-slate-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base px-3 py-2"
									/>
									{errors.references?.[index]?.title && (
										<p className="mt-1 text-sm text-red-600">
											{errors.references[index].title.message}
										</p>
									)}
								</div>
								<div>
									<label
										htmlFor={`references.${index}.url`}
										className="block text-sm font-medium text-gray-700"
									>
										URL
									</label>
									<input
										type="url"
										{...register(`references.${index}.url`)}
										id={`references.${index}.url`}
										className="mt-1 block w-full rounded-md border-gray-300 bg-white dark:bg-slate-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base px-3 py-2"
									/>
									{errors.references?.[index]?.url && (
										<p className="mt-1 text-sm text-red-600">
											{errors.references[index].url.message}
										</p>
									)}
								</div>
							</div>
							<div>
								<label
									htmlFor={`references.${index}.description`}
									className="block text-sm font-medium text-gray-700"
								>
									Description
								</label>
								<textarea
									{...register(`references.${index}.description`)}
									id={`references.${index}.description`}
									rows={2}
									className="mt-1 block w-full rounded-md border-gray-300 bg-white dark:bg-slate-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base px-3 py-2"
								/>
							</div>
							<button
								type="button"
								onClick={() => remove(index)}
								className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl font-bold"
							>
								&times;
							</button>
						</div>
					))}
				</div>
				<button
					type="button"
					onClick={() => append({ title: "", url: "", description: "" })}
					className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
				>
					<PlusIcon className="-ml-0.5 mr-1 h-4 w-4" aria-hidden="true" />
					Add Reference
				</button>
			</div>

			<div className="flex justify-end">
				<button
					type="submit"
					disabled={isLoading}
					className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{isLoading ? "Saving..." : submitButtonText}
				</button>
			</div>
		</form>
	);
}
