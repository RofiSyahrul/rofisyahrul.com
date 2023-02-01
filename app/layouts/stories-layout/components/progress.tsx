import { useStoryProgress } from '~/store/stories';

interface ProgressProps {
  slug: string;
}

export default function Progress({ slug }: ProgressProps) {
  const progress = useStoryProgress(slug);

  return (
    <div
      className='absolute top-0 transition-[width] will-change-[width] bg-neutral-bright'
      style={{
        width: `${Math.min(progress, 100)}%`,
        transitionTimingFunction: 'linear',
        transitionDuration: '10ms',
      }}
    />
  );
}
