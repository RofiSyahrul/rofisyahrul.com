const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss/tailwind-config').TailwindConfig} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}'],
  darkMode: 'class',
  plugins: [
    require('@tailwindcss/line-clamp'),
    require('tailwind-scrollbar'),
    plugin(
      ({ addVariant, addUtilities, e, matchUtilities, theme }) => {
        addVariant(
          'aria-selected',
          ({ modifySelectors, separator }) => {
            modifySelectors(
              ({ className }) =>
                '.' +
                e(`aria-selected${separator}${className}`) +
                '[aria-selected="true"]',
            );
          },
        );

        addVariant(
          'aria-current-step',
          ({ modifySelectors, separator }) => {
            modifySelectors(
              ({ className }) =>
                '.' +
                e(`aria-current-step${separator}${className}`) +
                '[aria-current="step"]',
            );
          },
        );

        addUtilities({
          '.flex-basis': {
            'flex-basis': '100%',
          },
          '.flex-basis-auto': {
            'flex-basis': 'auto',
          },
          '.scroll-snap-x': {
            'scroll-snap-type': 'x mandatory',
          },
          '.scroll-snap-start': {
            'scroll-snap-align': 'start',
          },
        });

        matchUtilities({
          'flex-basis': value => ({
            'flex-basis': value,
          }),
        });
      },
    ),
  ],
  theme: {
    colors: {
      current: 'currentColor',
      inherit: 'inherit',
      danger: {
        bright: 'var(--color-danger-bright)',
        bright1: 'var(--color-danger-bright1)',
        dim: 'var(--color-danger-dim)',
        dim1: 'var(--color-danger-dim1)',
      },
      neutral: {
        bright: 'var(--color-neutral-bright)',
        bright0: 'var(--color-neutral-bright0)',
        bright1: 'var(--color-neutral-bright1)',
        bright2: 'var(--color-neutral-bright2)',
        dim: 'var(--color-neutral-dim)',
        dim0: 'var(--color-neutral-dim0)',
        dim1: 'var(--color-neutral-dim1)',
        dim2: 'var(--color-neutral-dim2)',
      },
      primary: {
        bright: 'var(--color-primary-bright)',
        dim: 'var(--color-primary-dim)',
      },
      secondary: {
        bright: 'var(--color-secondary-bright)',
        dim: 'var(--color-secondary-dim)',
      },
      transparent: 'transparent',
    },
    fill: theme => theme('colors'),
    stroke: theme => theme('colors'),
  },
  variants: {
    extend: {
      stroke: ['dark'],
      fill: ['dark'],
    },
  },
};
