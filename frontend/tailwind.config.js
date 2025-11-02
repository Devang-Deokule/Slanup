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
          primary: '#7FB069', // matcha green
          'primary-hover': '#6AA35A',
          background: '#FBFDF8',
          'text-primary': '#15321F',
          'text-secondary': '#557A5B',
          border: '#E8F2E8',
          'card-bg': '#F6F9F5',
          success: '#2F8F3A',
          error: '#C92A2A',
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

