/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./public/**/*.{html,js}", "./js/**/*.js"],
    theme: {
        extend: {
            colors: {
                coffee: {
                    900: '#1a1818', // Rich Black
                    800: '#2c2420', // Dark Roast
                    600: '#6f4e37', // Coffee Bean
                    400: '#a38068', // Light Roast
                },
                gold: {
                    500: '#c5a059', // Brass/Gold
                    400: '#d4b06a',
                },
                cream: '#f9f9f7',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Oswald', 'sans-serif'],
                serif: ['Playfair Display', 'serif'],
                lickety: ['"Permanent Marker"', 'cursive'],
            },
            backgroundImage: {
                'hero-pattern': "url('../assets/images/Roasting_Images/roast-hero-1.jpg')",
            }
        }
    },
    plugins: [],
}
