import { PlusIcon } from "@heroicons/react/24/outline";
import TagSelector from "./ui/TagSelector";
import { useFieldArray, Controller } from "react-hook-form";
import TiptapEditor from "./TiptapEditor";

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
  control: any; // from react-hook-form
  register: any; // from react-hook-form
  errors: any; // from react-hook-form
  selectedTags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
  initialContent?: string;
}

export default function GuidelineForm({
  categories,
  availableTags,
  control,
  register,
  errors,
  selectedTags,
  onTagsChange,
  initialContent = "",
}: GuidelineFormProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "references",
  });

  return (
    <div className="space-y-6">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          {...register("title")}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base px-3 py-2"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">
            {errors.title.message as string}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label
            htmlFor="categoryId"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Category
          </label>
          <select
            id="categoryId"
            {...register("categoryId")}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base px-3 py-2"
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
              {errors.categoryId.message as string}
            </p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Content
        </label>
        <Controller
          name="content"
          control={control}
          defaultValue={initialContent}
          render={({ field }) => (
            <TiptapEditor
              content={field.value}
              onChange={field.onChange}
              placeholder="Start writing your guideline here..."
            />
          )}
        />
        {errors.content && (
          <p className="mt-1 text-sm text-red-600">
            {errors.content.message as string}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Tags
        </label>
        <TagSelector
          selectedTags={selectedTags}
          availableTags={availableTags}
          onTagsChange={onTagsChange}
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Add tags to categorize this guideline and make it easier to find.
        </p>
        {errors.tags && (
          <p className="mt-1 text-sm text-red-600">
            {errors.tags.message as string}
          </p>
        )}
      </div>

      {/* References Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          References (Optional)
        </h3>
        <div className="mt-4 space-y-4">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-md space-y-2 relative bg-gray-50 dark:bg-gray-800"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor={`references.${index}.title`}
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Reference Title
                  </label>
                  <input
                    type="text"
                    {...register(`references.${index}.title`)}
                    id={`references.${index}.title`}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base px-3 py-2"
                  />
                  {errors.references?.[index]?.title && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.references[index].title.message as string}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor={`references.${index}.url`}
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    URL
                  </label>
                  <input
                    type="url"
                    {...register(`references.${index}.url`)}
                    id={`references.${index}.url`}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base px-3 py-2"
                  />
                  {errors.references?.[index]?.url && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.references[index].url.message as string}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label
                  htmlFor={`references.${index}.description`}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Description
                </label>
                <textarea
                  {...register(`references.${index}.description`)}
                  id={`references.${index}.description`}
                  rows={2}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base px-3 py-2"
                />
              </div>
              <button
                type="button"
                onClick={() => remove(index)}
                className="absolute top-2 right-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-2xl font-bold"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => append({ title: "", url: "", description: "" })}
          className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="-ml-0.5 mr-1 h-4 w-4" aria-hidden="true" />
          Add Reference
        </button>
      </div>
    </div>
  );
}
