import { prisma } from "@/lib/db";
import Link from "next/link";
import PublicTagsList from "@/components/PublicTagsList";

export const dynamic = "force-dynamic";

async function getTags() {
  const tags = await prisma.tag.findMany({
    include: {
      _count: {
        select: { guidelines: true },
      },
    },
    orderBy: {
      name: "asc",
    },
  });
  return tags;
}

export default async function TagsPage() {
  const tags = await getTags();

  return (
    <div className="space-y-6 w-full">
      <div className="border-b border-gray-200 dark:border-gray-700 pb-5">
        <h1 className="text-3xl font-bold leading-tight text-gray-900 dark:text-gray-100">
          Tags
        </h1>
        <p className="mt-2 max-w-4xl text-sm text-gray-500 dark:text-gray-400">
          Browse all tags in the Standard Treatment Guidelines
        </p>
      </div>

      <PublicTagsList tags={tags} />
    </div>
  );
}
