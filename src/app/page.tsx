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
		<div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center px-4">
			{/* Logo and Search Section */}
			<div className="w-full max-w-4xl mb-12 flex flex-col items-center">
				<Image
					src="/logostg.png"
					alt="STG Mizoram Logo"
					width={200}
					height={200}
					className="mb-8"
				/>
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
								className="group bg-gray-800 dark:bg-slate-800 p-6 shadow-lg rounded-xl hover:shadow-xl transition-shadow duration-300 flex items-center space-x-4 text-left hover:bg-gray-700 dark:hover:bg-slate-700"
							>
								<div className="flex-shrink-0">
									<IconComponent className="h-10 w-10 text-cyan-400" />
								</div>
								<div>
									<h3 className="text-lg font-semibold text-white dark:text-white group-hover:text-gray-300 dark:group-hover:text-blue-400">
										{category.name}
									</h3>
									<p className="text-sm text-gray-400 dark:text-slate-400">
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
