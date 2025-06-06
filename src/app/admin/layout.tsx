"use client";

import { useState, ReactNode, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { ToastProvider } from "@/components/ui/Toast";
import SessionProvider from "@/components/SessionProvider";

// Custom style to hide the global NavBar in admin pages
const hideNavStyle = `
  header.global-nav { display: none !important; }
  main.global-main { max-width: 100% !important; padding: 0 !important; margin: 0 !important; }
  footer.global-footer { display: none !important; }
`;

export default function AdminLayout({ children }: { children: ReactNode }) {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	// Add custom style to hide the global navbar when in admin pages
	useEffect(() => {
		// Add style to hide global navbar
		const styleEl = document.createElement("style");
		styleEl.id = "admin-override-styles";
		styleEl.innerHTML = hideNavStyle;
		document.head.appendChild(styleEl);

		// Cleanup on unmount
		return () => {
			const existingStyle = document.getElementById("admin-override-styles");
			if (existingStyle) {
				existingStyle.remove();
			}
		};
	}, []);

	return (
		<SessionProvider>
			<ToastProvider>
				<div className="min-h-screen bg-gray-100 flex w-full">
					<AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
					<div className="flex flex-col flex-1 w-full">
						<div className="sticky top-0 z-50 bg-gray-100 lg:hidden">
							<div className="flex h-16 items-center px-4">
								<button
									type="button"
									className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
									onClick={() => setSidebarOpen(true)}
								>
									<span className="sr-only">Open sidebar</span>
									<Bars3Icon className="h-6 w-6" aria-hidden="true" />
								</button>
							</div>
						</div>
						<main className="flex-1 w-full px-6 md:px-8 lg:px-10">
							{children}
						</main>
					</div>
				</div>
			</ToastProvider>
		</SessionProvider>
	);
}
