import clsx from 'clsx';

interface BioProps {
  className?: string;
  component?: keyof JSX.IntrinsicElements;
}

export default function Bio({
  component: Component = 'div',
  className,
}: BioProps) {
  return (
    <Component className={clsx('w-full', className)}>
      <h3 className='font-semibold text-base'>Rofi</h3>
      <p className='text-neutral-dim2 dark:text-neutral-bright2'>
        Software Engineer (Web Platform)
      </p>
      <p>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit.
        Praesentium consequuntur labore ipsam delectus quos. Atque in
        nobis quis neque porro ut iusto eveniet, mollitia sed. Itaque
        architecto ducimus sequi saepe. Lorem ipsum dolor sit, amet
        consectetur adipisicing elit. Praesentium consequuntur labore
        ipsam delectus quos. Atque in nobis quis neque porro ut iusto
        eveniet, mollitia sed. Itaque architecto ducimus sequi saepe.
      </p>
    </Component>
  );
}
