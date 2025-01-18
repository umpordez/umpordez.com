const plugin = require('tailwindcss/plugin');

const rotateX = plugin(function ({ addUtilities }) {
    addUtilities({
        '.rotate-y-180': {
            transform: 'rotateY(180deg)',
        }
    });
});

module.exports = {
    content: [
        './http/views/**/*.ejs',
        './http/public/src/**/*.{css,js,ts,jsx,tsx}',
        "./node_modules/preline/dist/*.js"
    ],

    darkMode: 'class',
    theme: {
        container: {
            center: true,
            padding: '1rem',
        },

        screens: {
            sm: '640px',
            md: '768px',
            lg: '1024px',
            xl: '1142px',
        },

        fontFamily: {
            mulish: ['Mulish', 'sans-serif'],
            reey: ['reey', 'sans-serif'],
        },

        colors: {
            transparent: 'transparent',
            current: 'currentColor',
            white: '#ffffff',
            black: '#08111F',
            primary: '#31a344',
            secondary: '#02e027',

            gray: {
                DEFAULT: '#7780A1',
                dark: '#1C2331',
            },
            green: {
                '50': '#e4ffe6',
                '100': '#c5ffcb',
                '200': '#92ffa1',
                '300': '#53ff70',
                '400': '#20fb4b',
                '500': '#00f935',
                '600': '#00b52c',
                '700': '#028923',
                '800': '#086c22',
                '900': '#0c5b22',
                '950': '#003310',
            },
            gold: {
                '50': '#fefde8',
                '100': '#fdfac4',
                '200': '#fcf18c',
                '300': '#f9e24b',
                '400': '#f5ce12',
                '500': '#e5b70d',
                '600': '#c68f08',
                '700': '#9e650a',
                '800': '#835010',
                '900': '#6f4214',
                '950': '#412207',
            },
            orange: {
                '50': '#fef7ee',
                '100': '#fcedd8',
                '200': '#f9d7af',
                '300': '#f5b97c',
                '400': '#ee8a3a',
                '500': '#eb7524',
                '600': '#dc5b1a',
                '700': '#b74517',
                '800': '#92371a',
                '900': '#752f19',
                '950': '#3f160b',
            },
            orange: {
                '50': '#fffcea',
                '100': '#fff7c5',
                '200': '#ffee87',
                '300': '#ffdf48',
                '400': '#ffcd1e',
                '500': '#fcac04',
                '600': '#e08300',
                '700': '#b95b04',
                '800': '#96460a',
                '900': '#7b390c',
                '950': '#471c01',
            },

        },

        extend: {
            animation: {
                'spin-slow': 'spin 5s linear infinite'
            },

            typography: ({ theme }) => ({
                DEFAULT: {
                    css: {
                        color: theme('colors.gray'),
                        fontSize: '1.125rem'
                    },
                },
            })
        }
    },

    plugins: [
        require('@tailwindcss/line-clamp'),
        rotateX,
        require('@tailwindcss/typography')
    ]
};
