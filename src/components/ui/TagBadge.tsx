"use client";

import { useState } from "react";
import Link from "next/link";

interface TagBadgeProps {
  tag: {
    id: string;
    name: string;
    slug: string;
  };
  size?: "sm" | "md";
  interactive?: boolean;
  onRemove?: (tagId: string) => void;
}

export default function TagBadge({
  tag,
  size = "md",
  interactive = true,
  onRemove,
}: TagBadgeProps) {
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-0.5 text-sm",
  };

  const baseClasses = `inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium ${sizeClasses[size]}`;

  if (!interactive) {
    return <span className={baseClasses}>{tag.name}</span>;
  }

  return (
    <span
      className={`${baseClasses} ${
        onRemove ? "pr-1" : ""
      } hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href={`/tags/${tag.slug}`}
        className="focus:outline-none focus:underline"
      >
        {tag.name}
      </Link>

      {onRemove && (
        <button
          type="button"
          className="ml-1 flex-shrink-0 h-4 w-4 rounded-full inline-flex items-center justify-center text-blue-400 dark:text-blue-500 hover:bg-blue-200 dark:hover:bg-blue-800 hover:text-blue-600 dark:hover:text-blue-300 focus:outline-none focus:bg-blue-200 dark:focus:bg-blue-800 focus:text-blue-600 dark:focus:text-blue-300"
          onClick={(e) => {
            e.preventDefault();
            onRemove(tag.id);
          }}
          aria-label={`Remove ${tag.name} tag`}
        >
          <svg
            className="h-2 w-2"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 8 8"
          >
            <path
              strokeLinecap="round"
              strokeWidth="1.5"
              d="M1 1l6 6m0-6L1 7"
            />
          </svg>
        </button>
      )}
    </span>
  );
}
