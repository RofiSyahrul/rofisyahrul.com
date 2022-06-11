import type { HTMLAttributes } from 'react';

export default function VisuallyHidden(
  props: Omit<HTMLAttributes<HTMLSpanElement>, 'className'>,
) {
  return (
    <span {...props} className='block w-0 h-0 overflow-hidden' />
  );
}
