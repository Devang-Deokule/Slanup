/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Provide a top-level `slanup` color group so classes like `bg-slanup-primary` work.
        slanup: {
          primary: '#007BFF',
          'primary-hover': '#0069D9',
          background: '#FFFFFF',
          'text-primary': '#212529',
          'text-secondary': '#6C757D',
          border: '#E9ECEF',
          'card-bg': '#F8F9FA',
          success: '#28A745',
          error: '#DC3545',
        },
        accent: {
          blue: '#007BFF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'button': '12px',
      },
      boxShadow: {
        'accent': '0 4px 20px rgba(0, 178, 169, 0.3)',
        'accent-hover': '0 6px 30px rgba(0, 178, 169, 0.5)',
      },
    },
  },
  plugins: [],
}

