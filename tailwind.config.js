module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx,ejs}'],
  theme: {
    extend: {
      colors: {
        container: '#2B2F42',
        component: '#262739',
        icon: '#788AB6',
        green: '#02FBA2',
      },
      typography: {
        DEFAULT: {
          css: {
            pre: {
              margin: '0',
              'border-top-left-radius': 0,
              'border-top-right-radius': 0,
            },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
