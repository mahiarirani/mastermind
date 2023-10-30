module.exports = {
    content: ["./**/*.{html,js}"],
    theme: {
        extend: {
            colors: {
                'light-cloud': '#ecf0f1',
                'dark-cloud': '#bdc3c7',
                'light-gray': '#95a5a6',
                'dark-gray': '#7f8c8d',
                'light-midnight': '#34495e',
                'dark-midnight': '#2c3e50',
                'light-purple': '#a55eea',
                'dark-purple': '#8854d0',
                'light-blue': '#4b7bec',
                'dark-blue': '#3867d6',
                'light-sky': '#45aaf2',
                'dark-sky': '#2d98da',
                'light-green': '#26de81',
                'dark-green': '#20bf6b',
                'light-yellow': '#fed330',
                'dark-yellow': '#f7b731',
                'light-orange': '#fd9644',
                'dark-orange': '#fa8231',
                'light-red': '#fc5c65',
                'dark-red': '#eb3b5a',
                'flat-green': '#2ecc71',
                'flat-red': '#e74c3c',
                'flat-yellow': '#f1c40f',
                'flat-blue': '#3498db',
            }
        },
    },
    safelist: [
        {
            pattern: /bg-(light|dark)-(red|green|blue|yellow|sky|purple|orange|cloud)/,
            variants: ['hover']
        }
    ],
    plugins: [],
}