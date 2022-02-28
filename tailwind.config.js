module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx,ejs}'],
  theme: {
    extend: {
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
