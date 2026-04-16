// Atlassian-inspired Design System for TaskFlow

export const colors = {
  // Primary colors
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9', // Main primary color
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  
  // Gray scale for clean, professional look
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  
  // Semantic colors
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  
  // Background colors
  background: '#ffffff',
  backgroundSecondary: '#f9fafb',
  border: '#e5e7eb',
};

export const spacing = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '0.75rem',    // 12px
  lg: '1rem',       // 16px
  xl: '1.25rem',    // 20px
  '2xl': '1.5rem',  // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem', // 36px
  '5xl': '3rem',    // 48px
};

export const typography = {
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
};

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  none: 'none',
};

export const borderRadius = {
  none: '0',
  sm: '0.125rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  full: '9999px',
};

export const transitions = {
  fast: '150ms ease-in-out',
  normal: '200ms ease-in-out',
  slow: '300ms ease-in-out',
};

// Component-specific styles
export const cardStyles = {
  base: `
    bg-white 
    border border-gray-200 
    rounded-md 
    shadow-sm
    transition-shadow ${transitions.normal}
    text-gray-900
  `,
  hover: `
    hover:shadow-md
    hover:border-gray-300
  `,
  interactive: `
    cursor-pointer
    hover:bg-gray-50
    active:bg-gray-100
  `,
};

export const buttonStyles = {
  primary: `
    bg-blue-500 
    text-white 
    px-4 py-2 
    rounded-md 
    font-medium
    transition-colors ${transitions.fast}
    hover:bg-blue-600
    active:bg-blue-700
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
  `,
  secondary: `
    bg-white 
    text-gray-700 
    border border-gray-300
    px-4 py-2 
    rounded-md 
    font-medium
    transition-colors ${transitions.fast}
    hover:bg-gray-50
    hover:border-gray-400
    active:bg-gray-100
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
  `,
  ghost: `
    text-gray-600 
    px-3 py-1.5 
    rounded-md 
    font-medium
    transition-colors ${transitions.fast}
    hover:bg-gray-100
    hover:text-gray-800
    active:bg-gray-200
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
  `,
};

export const inputStyles = `
  w-full 
  px-3 py-2 
  border border-gray-300 
  rounded-md 
  text-sm
  transition-colors ${transitions.fast}
  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
  placeholder-gray-400
`;

export const sidebarStyles = {
  base: `
    w-64 
    bg-white 
    border-r border-gray-200 
    h-screen 
    fixed 
    left-0 
    top-0 
    z-40
  `,
  item: `
    flex 
    items-center 
    gap-3 
    px-4 
    py-2.5 
    text-sm 
    font-medium 
    text-gray-700
    transition-colors ${transitions.fast}
    hover:bg-gray-100
    hover:text-gray-900
    cursor-pointer
  `,
  itemActive: `
    bg-blue-50 
    text-blue-700
    border-r-2 border-blue-500
  `,
};

export const layoutStyles = {
  main: `
    min-h-screen 
    bg-gray-50
  `,
  content: `
    ml-64 
    flex-1 
    min-h-screen
  `,
  topBar: `
    h-16 
    bg-white 
    border-b border-gray-200 
    flex 
    items-center 
    justify-between 
    px-6
    sticky top-0 z-30
  `,
};
