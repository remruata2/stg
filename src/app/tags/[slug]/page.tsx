import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import TagBadge from "@/components/ui/TagBadge";
import FilteredGuidelinesList from '@/components/FilteredGuidelinesList';

export const dynamic = "force-dynamic";

interface TagPageProps {
	params: Promise<{ slug: string }>; // params is a Promise
	searchParams?: Promise<{ [key: string]: string | string[] | undefined }>; // Also type searchParams as Promise
}

async function getTagWithGuidelines(slug: string) {
	const tag = await prisma.tag.findUnique({
		where: { slug },
		include: {
			guidelines: {
				include: {
					category: true,
					tags: true,
				},
				orderBy: {
					title: "asc",
				},
			},
		},
	});

	if (!tag) {
		return null;
	}

	return tag;
}

export default async function TagPage({
	params: paramsPromise,
	searchParams: searchParamsPromise,
}: TagPageProps) {
	const { slug } = await paramsPromise; // Await the promise to get slug
	// const searchParams = searchParamsPromise ? await searchParamsPromise : {}; // Example if searchParams were needed
	const tag = await getTagWithGuidelines(slug);

	if (!tag) {
		notFound();
	}

	return (
		<div className="space-y-6 w-full">
			<div className="border-b border-gray-200 pb-5">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
					<div>
						<div className="flex items-center">
							<h1 className="text-3xl font-bold leading-tight text-gray-900">
								Tag: {tag.name}
							</h1>
						</div>
						{tag.description && (
							<p className="mt-2 max-w-4xl text-sm text-gray-500">
								{tag.description}
							</p>
						)}
					</div>
					<div className="mt-4 sm:mt-0">
						<a
							href="/tags"
							className="text-sm font-medium text-blue-600 hover:text-blue-500"
						>
							← Browse all tags
						</a>
					</div>
				</div>
			</div>

			<FilteredGuidelinesList guidelines={tag.guidelines} currentTagId={tag.id} />
		</div>
	);
}
