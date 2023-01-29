const plugin = require('tailwindcss/plugin');

const colors = {
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
};

/** @type {import('tailwindcss/tailwind-config').TailwindConfig} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}'],
  darkMode: 'class',
  plugins: [
    require('@tailwindcss/line-clamp'),
    require('tailwind-scrollbar'),
    plugin(
      ({
        addComponents,
        addVariant,
        addUtilities,
        e,
        matchUtilities,
      }) => {
        addComponents({
          '.btn': {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 0.375rem',
            fontWeight: 600,
            fontSize: '1rem',
            lineHeight: '1.5rem',
            border: 'none',
            outline: 'none',
            borderRadius: '0.25rem',
            cursor: 'pointer',
            '&:disabled': {
              cursor: 'not-allowed',
              opacity: '30%',
            },
            '&:hover:not(:disabled)': {
              filter: 'brightness(80%)',
            },
            '&.btn-solid': {
              color: colors.neutral.bright,
              '&:disabled': {
                opacity: '50%',
              },
              '&.btn-primary': {
                backgroundColor: colors.primary.dim,
              },
              '&.btn-secondary': {
                backgroundColor: colors.secondary.dim,
              },
              '&.btn-danger': {
                backgroundColor: colors.danger.dim,
              },
            },
            '&.btn-text': {
              backgroundColor: colors.transparent,
              '&:hover:not(:disabled)': {
                filter: 'none',
                textDecoration: 'underline',
              },
              '&.btn-primary': {
                color: colors.primary.dim,
              },
              '&.btn-secondary': {
                color: colors.secondary.dim,
              },
            },
          },
          '.dark .btn': {
            '&.btn-solid': {
              color: colors.neutral.dim,
              '&.btn-primary': {
                backgroundColor: colors.primary.bright,
              },
              '&.btn-secondary': {
                backgroundColor: colors.secondary.bright,
              },
              '&.btn-danger': {
                backgroundColor: colors.danger.bright,
              },
            },
            '&.btn-text': {
              '&.btn-primary': {
                color: colors.primary.bright,
              },
              '&.btn-secondary': {
                color: colors.secondary.bright,
              },
            },
          },
          '.spinner': {
            boxSizing: 'border-box',
            border: '2px solid transparent',
            borderTopColor: colors.primary.dim,
            borderLeftColor: colors.primary.dim,
            borderRadius: '50%',
            animation: 'nprogress-spinner 0.4s linear infinite',
          },
          '.dark .spinner': {
            borderTopColor: colors.primary.bright,
            borderLeftColor: colors.primary.bright,
          },
        });

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

        addVariant('desktop', ({ modifySelectors, separator }) => {
          modifySelectors(
            ({ className }) =>
              '.desktop .' + e(`desktop${separator}${className}`),
          );
        });

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
    colors,
    fill: theme => theme('colors'),
    stroke: theme => theme('colors'),
    extend: {
      animation: {
        globe: 'globe 1000ms ease-in-out infinite',
      },
      keyframes: {
        globe: {
          from: {
            transform: 'rotate3d(0, 1, 0, 0deg)',
          },
          '50%': {
            transform: 'rotate3d(0, 1, 0, 180deg)',
          },
          to: {
            transform: 'rotate3d(0, 1, 0, 0deg)',
          },
        },
      },
    },
  },
  variants: {
    extend: {
      stroke: ['dark'],
      fill: ['dark'],
    },
  },
};
