"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useToast } from "@/components/ui/Toast";

export default function NavBar() {
	const { data: session, status } = useSession();
	const pathname = usePathname();
	const { addToast } = useToast();
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const isAdmin = session?.user?.role === "ADMIN";

	const handleSignOut = async () => {
		await signOut({ redirect: false });
		addToast("You have been signed out", "success");
	};

	return (
		<nav className="bg-white dark:bg-gray-800 shadow-sm">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16">
					<div className="flex">
						<div className="flex-shrink-0 flex items-center">
							<Link href="/" className="font-bold text-xl text-blue-600 dark:text-blue-400">
								STG Mizoram
							</Link>
						</div>
						<div className="hidden sm:ml-6 sm:flex sm:space-x-8">
							<Link
								href="/"
								className={`${
									pathname === "/"
										? "border-blue-500 text-gray-900 dark:text-white"
										: "border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white"
								} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
							>
								Home
							</Link>
							<Link
								href="/categories"
								className={`${
									pathname.startsWith("/categories")
										? "border-blue-500 text-gray-900 dark:text-white"
										: "border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white"
								} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
							>
								Categories
							</Link>
							<Link
								href="/tags"
								className={`${
									pathname.startsWith("/tags")
										? "border-blue-500 text-gray-900 dark:text-white"
										: "border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white"
								} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
							>
								Tags
							</Link>
							{isAdmin && (
								<Link
									href="/admin/dashboard"
									className={`${
										pathname.startsWith("/admin")
											? "border-blue-500 text-gray-900 dark:text-white"
											: "border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white"
									} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
								>
									Admin
								</Link>
							)}
						</div>
					</div>
					<div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
						{isAdmin && (
							<Link
								href="/admin/guidelines/new"
								className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:focus:ring-offset-gray-900"
							>
								New Guideline
							</Link>
						)}

						{status === "authenticated" ? (
							<div className="ml-3 relative flex items-center space-x-4">
								<span className="text-sm text-gray-700 dark:text-gray-300">
									{session.user.name || session.user.email}
								</span>
								<button
									onClick={handleSignOut}
									className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
								>
									Sign out
								</button>
							</div>
						) : null}
					</div>
					<div className="-mr-2 flex items-center sm:hidden">
						<button
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 dark:focus:ring-blue-400"
						>
							<span className="sr-only">Open main menu</span>
							{isMenuOpen ? (
								<svg
									className="block h-6 w-6"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									aria-hidden="true"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							) : (
								<svg
									className="block h-6 w-6"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									aria-hidden="true"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M4 6h16M4 12h16M4 18h16"
									/>
								</svg>
							)}
						</button>
					</div>
				</div>
			</div>

			{/* Mobile menu */}
			{isMenuOpen && (
				<div className="sm:hidden">
					<div className="pt-2 pb-3 space-y-1 bg-white dark:bg-gray-800">
						<Link
							href="/"
							className={`${
								pathname === "/"
									? "bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-700 dark:text-blue-400"
									: "border-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-200"
							} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
						>
							Home
						</Link>
						<Link
							href="/categories"
							className={`${
								pathname.startsWith("/categories")
									? "bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-700 dark:text-blue-400"
									: "border-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-200"
							} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
						>
							Categories
						</Link>
						<Link
							href="/tags"
							className={`${
								pathname.startsWith("/tags")
									? "bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-700 dark:text-blue-400"
									: "border-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-200"
							} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
						>
							Tags
						</Link>
						{isAdmin && (
							<Link
								href="/admin/dashboard"
								className={`${
									pathname.startsWith("/admin")
										? "bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-700 dark:text-blue-400"
										: "border-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-200"
								} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
							>
								Admin
							</Link>
						)}
					</div>
					<div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
						{status === "authenticated" ? (
							<div className="flex items-center px-4 space-x-4">
								<div className="flex-shrink-0">
									<div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
										<span className="text-gray-500 dark:text-gray-300">
											{session.user.name?.[0] || session.user.email?.[0] || "U"}
										</span>
									</div>
								</div>
								<div className="ml-3">
									<div className="text-base font-medium text-gray-800 dark:text-gray-200">
										{session.user.name || session.user.email}
									</div>
									<div className="text-sm font-medium text-gray-500 dark:text-gray-400">
										{session.user.email}
									</div>
								</div>
								<button
									onClick={handleSignOut}
									className="ml-auto bg-white dark:bg-gray-700 p-1 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:focus:ring-offset-gray-900"
								>
									<span className="sr-only">Sign out</span>
									Sign out
								</button>
							</div>
						) : null}
					</div>
				</div>
			)}
		</nav>
	);
}
