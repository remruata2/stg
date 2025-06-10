import { prisma } from "@/lib/db";
import SearchBar from "@/components/SearchBar";
import Link from "next/link";
import Image from "next/image";
import {
	AcademicCapIcon,
	HeartIcon,
	ClipboardDocumentListIcon,
	UsersIcon,
	BeakerIcon,
	BookOpenIcon,
} from "@heroicons/react/24/outline";

export const dynamic = "force-dynamic";

// Icons for Categories
const categoryIconsList = [
	AcademicCapIcon,
	HeartIcon,
	ClipboardDocumentListIcon,
	UsersIcon,
	BeakerIcon,
	BookOpenIcon,
];

// Fetch all categories
async function getAllCategories() {
	const categories = await prisma.category.findMany({
		include: {
			_count: {
				select: { guidelines: true },
			},
		},
		orderBy: {
			name: "asc",
		},
	});
	return categories;
}

export default async function Home() {
	const allCategories = await getAllCategories();

	return (
		<div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center px-4 py-8">
			{/* Logo */}
			<div className="mb-4">
				<Image
					src="/logostg.png"
					alt="STG Wiki Logo"
					width={200}
					height={200}
					priority
				/>
			</div>

			{/* Title and Subtitle */}
			<h1 className="sr-only">Standard Treatment Guidelines</h1>
			<p className="text-2xl text-slate-600 dark:text-slate-500 mb-8">
				Standard Treatment Guidelines
			</p>

			{/* Search Bar */}
			<div className="w-full max-w-2xl mb-12">
				<SearchBar />
			</div>

			{/* Category Cards Grid */}
			{allCategories.length > 0 && (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
					{allCategories.map((category, index) => {
						const IconComponent =
							categoryIconsList[index % categoryIconsList.length];
						return (
							<Link
								key={category.id}
								href={`/categories/${category.slug}`}
								className="group bg-white dark:bg-slate-800 p-6 shadow-lg rounded-xl hover:shadow-xl transition-shadow duration-300 flex items-center space-x-4 text-left hover:bg-slate-50 dark:hover:bg-slate-700"
							>
								<div className="flex-shrink-0">
									<IconComponent className="h-10 w-10 text-blue-600 dark:text-blue-400" />
								</div>
								<div>
									<h3 className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
										{category.name}
									</h3>
									<p className="text-sm text-slate-500 dark:text-slate-400">
										{category._count.guidelines.toLocaleString()} guidelines
									</p>
								</div>
							</Link>
						);
					})}
				</div>
			)}
		</div>
	);
}
