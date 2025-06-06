"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  HomeIcon,
  DocumentTextIcon,
  FolderIcon,
  TagIcon,
  UsersIcon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

interface AdminSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
  { name: 'Guidelines', href: '/admin/guidelines', icon: DocumentTextIcon },
  { name: 'Categories', href: '/admin/categories', icon: FolderIcon },
  { name: 'Tags', href: '/admin/tags', icon: TagIcon },
  { name: 'Users', href: '/admin/users', icon: UsersIcon },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function AdminSidebar({ isOpen, setIsOpen }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Off-canvas menu for mobile, show/hide based on off-canvas menu state. */}
      <div
        className={`fixed inset-0 bg-gray-600 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-80 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-900 transform transition-transform duration-300 z-50 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:z-0`}
      >
        {/* No need for duplicate overlay */}
        
        {/* Sidebar Panel */}
        <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-gray-800 dark:bg-gray-900">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setIsOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>
          <div className="flex-shrink-0 flex items-center px-4">
            <Link href="/admin/dashboard" className="text-white text-2xl font-bold" onClick={() => setIsOpen(false)}>
              Admin Panel
            </Link>
          </div>
          <div className="mt-5 flex-1 flex flex-col h-0 overflow-y-auto">
            <nav className="px-2 space-y-1 flex-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)} // Close sidebar on link click for mobile
                  className={classNames(
                    pathname.startsWith(item.href) || (pathname === '/admin' && item.href === '/admin/dashboard')
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'group flex items-center px-2 py-2 text-base font-medium rounded-md'
                  )}
                >
                  <item.icon
                    className={classNames(
                      pathname.startsWith(item.href) || (pathname === '/admin' && item.href === '/admin/dashboard')
                        ? 'text-gray-300'
                        : 'text-gray-400 group-hover:text-gray-300',
                      'mr-4 flex-shrink-0 h-6 w-6'
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
            
            {/* Sign Out Button at Bottom */}
            <div className="px-2 py-4 border-t border-gray-700 mt-auto">
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="group flex w-full items-center px-2 py-2 text-base font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                <ArrowRightOnRectangleIcon className="mr-4 flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-300" aria-hidden="true" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
        <div className="flex-shrink-0 w-14" aria-hidden="true">
          {/* Dummy element to force sidebar to shrink to fit close icon */}
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:bg-gray-800 dark:bg-gray-900">
        <div className="flex items-center flex-shrink-0 px-6 h-16 border-b border-gray-700">
          <Link href="/admin/dashboard" className="text-white text-2xl font-bold">
            Admin Panel
          </Link>
        </div>
        <div className="mt-5 h-0 flex-1 flex flex-col overflow-y-auto">
          <nav className="flex-1 px-2 pb-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={classNames(
                  pathname.startsWith(item.href) || (pathname === '/admin' && item.href === '/admin/dashboard')
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                )}
                aria-current={pathname.startsWith(item.href) || (pathname === '/admin' && item.href === '/admin/dashboard') ? 'page' : undefined}
              >
                <item.icon
                  className={classNames(
                    pathname.startsWith(item.href) || (pathname === '/admin' && item.href === '/admin/dashboard')
                      ? 'text-gray-300'
                      : 'text-gray-400 group-hover:text-gray-300',
                    'mr-3 flex-shrink-0 h-6 w-6'
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            ))}
          </nav>
          
          {/* Sign Out Button at Bottom */}
          <div className="px-2 py-4 border-t border-gray-700 mt-auto">
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="group flex w-full items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <ArrowRightOnRectangleIcon className="mr-3 flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-300" aria-hidden="true" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
