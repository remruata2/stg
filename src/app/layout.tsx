import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";
import SessionProvider from "@/components/SessionProvider";
import NavBar from "@/components/NavBar";
import { ThemeProvider } from "@/components/ThemeProvider";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Standard Treatment Guidelines",
	description: "A comprehensive wiki for medical treatment guidelines",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${inter.className} min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col`}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="light"
					enableSystem={false}
					disableTransitionOnChange={false}
				>
					<SessionProvider>
						<ToastProvider>
							<header className="global-nav">
								<NavBar />
							</header>
							<main className="global-main max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 flex-grow">
								{children}
							</main>
							<footer className="global-footer bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
								<div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
									<div className="flex flex-col items-center space-y-4">
										{/* Powered by MHSSP */}
										<div className="flex items-center space-x-3">
											<span className="text-sm text-gray-500 dark:text-gray-400">
												Powered by MHSSP
											</span>
										</div>

										{/* Copyright */}
										<p className="text-center text-gray-500 dark:text-gray-400 text-sm">
											© {new Date().getFullYear()} Health & Family Welfare
											Department, Government of Mizoram. All rights reserved.
										</p>
									</div>
								</div>
							</footer>
						</ToastProvider>
					</SessionProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
