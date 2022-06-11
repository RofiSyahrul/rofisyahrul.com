import clsx from 'clsx';
import { Link } from 'remix';

import { countData } from './config';

interface CountsProps {
  className: string;
}

export default function Counts({ className }: CountsProps) {
  return (
    <ul
      className={clsx(
        'counts-container',
        'border-top-mobile',
        className,
      )}
    >
      {countData.map(({ title, url, value }) => (
        <li key={title}>
          <Link to={url}>
            <strong>{value}</strong>
            {` ${title}`}
          </Link>
        </li>
      ))}
    </ul>
  );
}
