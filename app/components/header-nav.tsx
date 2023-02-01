import { useBack } from '~/hooks/use-back';

import Header from './header';
import VisuallyHidden from './visually-hidden';

interface HeaderNavProps {
  className?: string;
  shouldHideColorModeToggle?: boolean;
  title?: string;
}

function BackButton() {
  const back = useBack();

  return (
    <button
      className='btn btn-text py-2 px-0 umami--click--header__go-back'
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
