import { useLoaderData } from '@remix-run/react';
import dayjs from 'dayjs';

import type { PortfolioDetail } from '~/repositories/portfolio/types';

export default function InitialDate() {
  const { initialDate } = useLoaderData<PortfolioDetail>();
  return (
    <small className=''>
      {`Initial commit: ${dayjs(initialDate).format(
        'MMMM Do, YYYY',
      )}`}
    </small>
  );
}
