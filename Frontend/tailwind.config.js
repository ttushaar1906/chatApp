/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      primary: '#4A90E2', // Cool Blue
      secondary: '#50E3C2', // Turquoise Green
      chatBubbleSent: '#E1F5FE', // Light Blue
      chatBubbleReceived: '#FFFFFF', // White
      notification: '#FF6F61', // Soft Red
      textColor : '#4A4A4A ',
      white: '#fff'
    },
  },
  plugins: [],
}

