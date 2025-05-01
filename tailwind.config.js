module.exports = {
  // ... other config
  theme: {
    extend: {
      // ... other extensions
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      keyframes: {
        shine: {
          '0%': { transform: 'translateX(-100%) skewX(-20deg)' },
          '100%': { transform: 'translateX(200%) skewX(-20deg)' },
        },
      },
      animation: {
        'shine': 'shine 6s ease-in-out infinite',
      },
    },
  },
  // ... other config
};