import { Fragment } from 'react';

import { useLoaderData } from '@remix-run/react';
import clsx from 'clsx';

import VisuallyHidden from '~/components/visually-hidden';
import ExternalLinkIcon from '~/icons/external-link';
import GithubIcon from '~/icons/github';
import type { PortfolioDetail } from '~/repositories/portfolio/types';

interface LinksProps {
  className?: string;
  component?: 'div' | 'footer';
  withText?: boolean;
}

export default function Links({
  className,
  component: Component = 'div',
  withText,
}: LinksProps) {
  const { repository, url } = useLoaderData<PortfolioDetail>();
  const TextComponent = withText ? Fragment : VisuallyHidden;

  return (
    <Component className={clsx('flex gap-2', className)}>
      {repository && (
        <a
          className={clsx(
            'btn btn-solid btn-secondary h-8 shadow-md',
            { 'gap-1 flex-1': withText },
          )}
          href={repository}
          target='_blank'
          rel='noreferrer noopener'
          title='Repository'
        >
          <GithubIcon />
          <TextComponent>Repository</TextComponent>
        </a>
      )}
      {url && (
        <a
          className={clsx(
            'btn btn-solid btn-secondary h-8 shadow-md',
            { 'gap-1 flex-1': withText },
          )}
          href={url}
          target='_blank'
          rel='noreferrer noopener'
          title='Demo'
        >
          <ExternalLinkIcon />
          <TextComponent>Demo</TextComponent>
        </a>
      )}
    </Component>
  );
}
