import clsx from 'clsx';

import { usePublicEnv } from '~/store/public-env';

function FooterNav() {
  const { PUBLIC_ANALYTICS_VIEW_URL, REPOSITORY_URL } =
    usePublicEnv();

  if (!PUBLIC_ANALYTICS_VIEW_URL && !REPOSITORY_URL) return null;

  return (
    <nav>
      <ul className='flex gap-2'>
        {PUBLIC_ANALYTICS_VIEW_URL && (
          <li>
            <a
              href={PUBLIC_ANALYTICS_VIEW_URL}
              target='_blank'
              rel='noreferrer noopener'
              className='btn btn-text btn-primary umami--click--footer__see-analytics'
            >
              Analytics
            </a>
          </li>
        )}

        {REPOSITORY_URL && (
          <li>
            <a
              href={REPOSITORY_URL}
              target='_blank'
              rel='noreferrer noopener'
              className='btn btn-text btn-primary umami--click--footer__see-repository'
            >
              GitHub
            </a>
          </li>
        )}
      </ul>
    </nav>
  );
}

interface FooterProps {
  className?: string;
}

export default function Footer({ className }: FooterProps) {
  return (
    <footer
      className={clsx(
        'w-full max-w-5xl mx-auto border-t border-solid',
        'border-t-neutral-bright1 dark:border-t-neutral-dim1 p-3',
        'flex flex-col gap-2 items-center',
        className,
      )}
    >
      <FooterNav />
      <p className='text-sm'>{`© ${new Date().getFullYear()} Syahrul Rofi`}</p>
    </footer>
  );
}
