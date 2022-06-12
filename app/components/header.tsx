import type { ReactNode } from 'react';

import { useToggleColorMode } from '~/store/color-mode';

import VisuallyHidden from './visually-hidden';

interface HeaderProps {
  children?: ReactNode;
  shouldHideColorModeToggle?: boolean;
  title?: string;
}

function MoonIcon() {
  return (
    <svg
      className='fill-primary-bright w-5 h-5 dark:hidden'
      viewBox='0 0 20 20'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path d='M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z' />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg
      className='fill-primary-dim w-5 h-5 hidden dark:block'
      viewBox='0 0 20 20'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        fillRule='evenodd'
        d={`M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4
        4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1
        1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0
        11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7
        4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1
        1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1
        1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z`}
        clipRule='evenodd'
      />
    </svg>
  );
}

const toggleColorModeDesc = 'Change color mode';

function ToggleColorModeButton() {
  const toggleColorMode = useToggleColorMode();

  return (
    <button
      className='p-2 rounded bg-primary-dim dark:bg-primary-bright hover:[filter:brightness(0.8)]'
      onClick={toggleColorMode}
      title={toggleColorModeDesc}
    >
      <SunIcon />
      <MoonIcon />
      <VisuallyHidden>{toggleColorModeDesc}</VisuallyHidden>
    </button>
  );
}

export default function Header({
  children,
  shouldHideColorModeToggle,
  title = 'rofisyahrul.com',
}: HeaderProps) {
  return (
    <header className='relative z-10 h-12 md:h-16'>
      <div className='w-full fixed shadow-lg dark:shadow-sm dark:shadow-neutral-dim2 top-0 px-3 bg-neutral-bright dark:bg-neutral-dim'>
        <div className='flex justify-between items-center w-full max-w-5xl mx-auto h-12 md:h-16'>
          {children}
          <h1 className='font-bold text-lg'>{title}</h1>
          {shouldHideColorModeToggle ? (
            <div style={{ height: 42, width: 42 }} />
          ) : (
            <ToggleColorModeButton />
          )}
        </div>
      </div>
    </header>
  );
}
