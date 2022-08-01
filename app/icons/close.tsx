import type { SVGProps } from 'react';

export default function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width='16'
      height='16'
      viewBox='0 0 16 16'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='m7.1 7.985-3.8 3.8.884.884 3.8-3.8 3.801 3.8.884-.884-3.8-3.8 3.8-3.801-.884-.884-3.8 3.8-3.801-3.8-.884.884 3.8 3.8Z'
        fill='currentColor'
      />
    </svg>
  );
}
