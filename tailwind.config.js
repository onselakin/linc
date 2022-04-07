module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx,ejs}'],
  theme: {
    fontFamily: {
      mono: ['Ubuntu Mono'],
    },
    extend: {
      colors: {
        container: '#2B2F42',
        component: '#262739',
        icon: '#788AB6',
        green: '#02FBA2',
        orange: '#FD9900',
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#bbb',
            h1: {
              color: '#788AB6',
              fontSize: '1.75em',
              margin: '0 0 1em 0',
            },
            h2: {
              color: '#788AB6',
              fontSize: '1.5em',
              margin: '0 0 1em 0',
            },
            h3: {
              color: '#788AB6',
              fontSize: '1.25em',
              margin: '0 0 1em 0',
            },
            blockquote: {
              color: '#bbb',
            },
            hr: {
              'border-color': '#788AB6',
              margin: '1.5em 0',
            },
            strong: {
              color: '#bbb',
            },
            pre: {
              margin: '0',
              'border-top-left-radius': 0,
              'border-top-right-radius': 0,
              'background-color': '#2B2F42',
              'border-radius': '5px',
            },
            th: {
              color: '#bbb',
            },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
