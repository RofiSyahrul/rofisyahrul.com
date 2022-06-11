import type { ReactNode } from 'react';

import type { ThrownResponse } from 'remix';

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
  const fancyStatus = String(status).replace(/0/g, '<span>0</span>');
  return (
    <>
      <HeaderNav title={title || `${status} ${statusText}`} />
      <main className='centered-page'>
        <div
          className='fancy-text'
          dangerouslySetInnerHTML={{ __html: fancyStatus }}
        />
        <h1>{statusText}</h1>
        {children}
      </main>
    </>
  );
}
