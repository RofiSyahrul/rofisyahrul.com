import type { SVGProps } from 'react';

export default function ArrowIcon(props: SVGProps<SVGSVGElement>) {
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
        d='M10 3.5L6 8L10 12.5'
        stroke='currentColor'
        strokeWidth='1.25'
      />
    </svg>
  );
}
