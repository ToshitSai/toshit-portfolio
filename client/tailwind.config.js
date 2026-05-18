/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "ui-monospace", "monospace"]
      },
      boxShadow: {
        glow: "0 0 45px rgba(99, 102, 241, 0.28)",
        panel: "0 24px 80px rgba(0, 0, 0, 0.35)"
      },
      animation: {
        "pulse-soft": "pulseSoft 1.6s ease-in-out infinite",
        float: "float 8s ease-in-out infinite"
      },
      keyframes: {
        pulseSoft: {
          "0%, 100%": { opacity: 0.45, transform: "scale(0.98)" },
          "50%": { opacity: 1, transform: "scale(1.02)" }
        },
        float: {
          "0%, 100%": { transform: "translate3d(0, 0, 0)" },
          "50%": { transform: "translate3d(0, -12px, 0)" }
        }
      }
    }
  },
  plugins: []
};
