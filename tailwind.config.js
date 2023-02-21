/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,tsx}'],
  important: false,
  theme: {
    extend: {
      animation: {
        loaderl: 'loaderl 3s ease-in-out infinite',
        loaderm: 'loaderm 3s ease-in-out infinite',
        loaderr: 'loaderr 3s ease-in-out infinite',
      },
      keyframes: {
        loaderl: {
          '0%': {
            backgroundColor: 'rgba(12, 101, 253, 0.2)',
          },
          '25%': {
            backgroundColor: 'rgba(12, 101, 253, 1)',
          },
          '50%': {
            backgroundColor: 'rgba(12, 101, 253, 0.2)',
          },
          '75%': {
            backgroundColor: 'rgba(12, 101, 253, 0.2)',
          },
          '100%': {
            backgroundColor: 'rgba(12, 101, 253, 0.2)',
          },
        },
        loaderm: {
          '0%': {
            backgroundColor: 'rgba(12, 101, 253, 0.2)',
          },
          '25%': {
            backgroundColor: 'rgba(12, 101, 253, 0.2)',
          },
          '50%': {
            backgroundColor: 'rgba(12, 101, 253, 1)',
          },
          '75%': {
            backgroundColor: 'rgba(12, 101, 253, 0.2)',
          },
          '100%': {
            backgroundColor: 'rgba(12, 101, 253, 0.2)',
          },
        },
        loaderr: {
          '0%': {
            backgroundColor: 'rgba(12, 101, 253, 0.2)',
          },
          '25%': {
            backgroundColor: 'rgba(12, 101, 253, 0.2)',
          },
          '50%': {
            backgroundColor: 'rgba(12, 101, 253, 0.2)',
          },
          '75%': {
            backgroundColor: 'rgba(12, 101, 253, 1)',
          },
          '100%': {
            backgroundColor: 'rgba(12, 101, 253, 0.2)',
          },
        },
      },
    },
  },
  plugins: [],
};
