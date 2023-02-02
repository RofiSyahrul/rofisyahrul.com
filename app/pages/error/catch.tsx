import type { ReactNode } from 'react';

import type { ThrownResponse } from '@remix-run/react';

import Footer from '~/components/footer';
import HeaderNav from '~/components/header-nav';

interface CatchPageProps
  extends Pick<ThrownResponse, 'status' | 'statusText'> {
  children?: ReactNode;
  title?: string;
}

export default function CatchPage({
  children,
  status,
  statusText,
  title,
}: CatchPageProps) {
  const isOffline = statusText === 'You are offline';
  const fancyStatus = isOffline
    ? ''
    : String(status).replace(/0/g, '<span>0</span>');

  return (
    <>
      <HeaderNav
        title={
          title ||
          (isOffline ? statusText : `${status} ${statusText}`)
        }
        shouldHideColorModeToggle
      />
      <main className='centered-page'>
        {fancyStatus && (
          <div
            className='fancy-text'
            dangerouslySetInnerHTML={{ __html: fancyStatus }}
          />
        )}
        <h1>{statusText}</h1>
        {children}
      </main>
      <Footer className='absolute bottom-0 left-0 right-0' />
    </>
  );
}
