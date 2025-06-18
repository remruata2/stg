"use client";

import { useState, useRef, useEffect } from "react";
import TagBadge from "./TagBadge";
import CreateTagDialog from "./CreateTagDialog";

interface Tag {
  id: string;
  name: string;
  slug: string;
}

interface TagSelectorProps {
  selectedTags: Tag[];
  availableTags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
}

export default function TagSelector({
  selectedTags,
  availableTags,
  onTagsChange,
}: TagSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter available tags based on search query and exclude already selected tags
  const filteredTags = availableTags
    .filter(
      (tag) => !selectedTags.some((selectedTag) => selectedTag.id === tag.id)
    )
    .filter((tag) =>
      tag.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAddTag = (tag: Tag) => {
    onTagsChange([...selectedTags, tag]);
    setSearchQuery("");
  };

  const handleRemoveTag = (tagId: string) => {
    onTagsChange(selectedTags.filter((tag) => tag.id !== tagId));
  };

  const handleTagCreated = (newTag: Tag) => {
    // Add the new tag to selected tags
    onTagsChange([...selectedTags, newTag]);
    setShowCreateDialog(false);
    setIsOpen(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedTags.map((tag) => (
          <TagBadge key={tag.id} tag={tag} onRemove={handleRemoveTag} />
        ))}

        {selectedTags.length === 0 && (
          <span className="text-sm text-gray-500 dark:text-gray-400 italic">
            No tags selected
          </span>
        )}
      </div>

      <div className="relative" ref={dropdownRef}>
        <div className="flex">
          <input
            type="text"
            placeholder="Search for tags..."
            className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base px-3 py-2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
          />
          <button
            type="button"
            className="ml-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? "Close" : "Browse"}
          </button>
        </div>

        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md py-1 text-base overflow-auto max-h-60">
            <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
              <button
                type="button"
                className="w-full inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => {
                  setShowCreateDialog(true);
                  setIsOpen(false);
                }}
              >
                <svg
                  className="mr-1.5 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Create New Tag
              </button>
            </div>
            {filteredTags.length > 0 ? (
              <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                {filteredTags.map((tag) => (
                  <li
                    key={tag.id}
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => handleAddTag(tag)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {tag.name}
                      </span>
                      <button
                        type="button"
                        className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddTag(tag);
                        }}
                      >
                        <svg
                          className="h-3 w-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 space-y-2">
                <p>
                  {searchQuery ? "No matching tags found" : "No available tags"}
                </p>
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => {
                    setShowCreateDialog(true);
                    setIsOpen(false);
                  }}
                >
                  Create new tag
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {showCreateDialog && (
        <CreateTagDialog
          onTagCreated={handleTagCreated}
          onCancel={() => setShowCreateDialog(false)}
        />
      )}
    </div>
  );
}
