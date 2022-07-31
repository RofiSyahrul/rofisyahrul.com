import clsx from 'clsx';

import { useBack } from '~/hooks/use-back';

import Header from './header';
import VisuallyHidden from './visually-hidden';

interface HeaderNavProps {
  shouldHideColorModeToggle?: boolean;
  title?: string;
}

function BackButton() {
  const back = useBack();

  return (
    <button
      className={clsx(
        'bg-transparent border-solid border border-transparent p-2 rounded',
        'hover:shadow-sm hover:text-neutral-dim0 dark:hover:text-neutral-bright0',
        'hover:border-neutral-bright1 dark:hover:border-neutral-dim1',
      )}
      onClick={back}
    >
      <svg
        aria-label='Go Back'
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M15 18L9 12L15 6'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
      <VisuallyHidden>Go Back</VisuallyHidden>
    </button>
  );
}

export default function HeaderNav(props: HeaderNavProps) {
  return (
    <Header {...props}>
      <BackButton />
    </Header>
  );
}
