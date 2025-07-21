"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useToast } from "@/components/ui/Toast";
import { ThemeToggle } from "@/components/ThemeToggle";
import Image from "next/image";
import { useTheme } from "next-themes";

export default function NavBar() {
	const { data: session, status } = useSession();
	const pathname = usePathname();
	const { addToast } = useToast();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const { theme } = useTheme();

	const isAdmin = session?.user?.role === "ADMIN";

	const handleSignOut = async () => {
		await signOut({ callbackUrl: "/" });
		addToast("You have been signed out", "success");
	};

	const navLinkClasses = (path: string) => {
		const isActive = pathname.startsWith(path);
		return `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
			isActive
				? "border-blue-500 text-gray-900 dark:text-white"
				: "border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-900 dark:hover:text-white"
		}`;
	};

	return (
		<header className="bg-white dark:bg-gray-900 shadow-md">
			<div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-24">
					{/* Left Section: Logo and Title */}
					<div className="flex items-center space-x-4">
						<Link href="/" className="flex-shrink-0">
							<Image
								src={theme === "dark" ? "/ashokawhite.png" : "/ashoka.png"}
								alt="Ashoka Pillar"
								width={45}
								height={64}
								objectFit="contain"
							/>
						</Link>
						<div>
							<h1 className="text-lg font-bold text-gray-800 dark:text-white">
								STANDARD TREATMENT GUIDELINES
							</h1>
							<p className="text-sm text-gray-600 dark:text-gray-300">
								Health & Family Welfare Department, Government of Mizoram
							</p>
						</div>
					</div>

					{/* Center Section: Navigation Links */}
					<div className="hidden md:flex items-center space-x-8">
						{isAdmin && (
							<Link
								href="/admin/dashboard"
								className={navLinkClasses("/admin")}
							>
								Admin
							</Link>
						)}
					</div>

					{/* Right Section: Logos and Theme Toggle */}
					<div className="flex items-center space-x-4">
						<div className="hidden lg:flex items-center space-x-3">
							<Image
								src="/Logomhssp.png"
								alt="MHSSP Logo"
								width={80}
								height={64}
								objectFit="contain"
							/>
						</div>
						<ThemeToggle />
						{isAdmin && (
							<Link
								href="/admin/guidelines/new"
								className="hidden lg:inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
							>
								New Guideline
							</Link>
						)}
					</div>

					{/* Mobile Menu Button */}
					<div className="-mr-2 flex md:hidden">
						<button
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
						>
							<span className="sr-only">Open main menu</span>
							{isMenuOpen ? (
								<svg
									className="block h-6 w-6"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							) : (
								<svg
									className="block h-6 w-6"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M4 6h16M4 12h16M4 18h16"
									/>
								</svg>
							)}
						</button>
					</div>
				</div>
			</div>

			{/* Mobile Menu */}
			{isMenuOpen && (
				<div className="md:hidden">
					<div className="pt-2 pb-3 space-y-1 px-2">
						<Link
							href="/categories"
							className={navLinkClasses("/categories") + " block"}
						>
							Categories
						</Link>
						{isAdmin && (
							<Link
								href="/admin/dashboard"
								className={navLinkClasses("/admin") + " block"}
							>
								Admin
							</Link>
						)}
					</div>
					{/* Add other mobile menu items if needed */}
				</div>
			)}
		</header>
	);
}
