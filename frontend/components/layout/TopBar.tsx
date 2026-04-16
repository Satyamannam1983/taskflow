'use client';

import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import ProfileDropdown from '@/components/auth/ProfileDropdown';
import LoginModal from '@/components/auth/LoginModal';
import { layoutStyles, buttonStyles } from '@/components/design-system/DesignSystem';

interface TopBarProps {
  onMenuToggle?: () => void;
  title?: string;
}

export default function TopBar({ onMenuToggle, title = 'TaskFlow' }: TopBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { user } = useAuth();

  return (
    <>
      <header className={layoutStyles.topBar}>
        <div className="flex items-center gap-4 flex-1">
          {/* Mobile menu toggle */}
          <button
            onClick={onMenuToggle}
            className={`
              lg:hidden
              p-2 
              text-gray-600 
              hover:text-gray-900 
              hover:bg-gray-100 
              rounded-md
              transition-colors duration-150
            `}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>

          {/* Page title */}
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        </div>

        {/* Search bar */}
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search boards, lists, or cards..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              {/* Notifications */}
              <button className={buttonStyles.ghost}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>

              {/* Profile dropdown */}
              <ProfileDropdown />
            </>
          ) : (
            /* Login button */
            <button
              onClick={() => setShowLoginModal(true)}
              className={buttonStyles.primary}
            >
              Sign In
            </button>
          )}
        </div>
    </header>

    {/* Login Modal */}
    <LoginModal 
      isOpen={showLoginModal} 
      onClose={() => setShowLoginModal(false)} 
    />
  </>
);
}
