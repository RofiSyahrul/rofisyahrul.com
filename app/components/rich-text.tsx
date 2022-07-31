import clsx from 'clsx';

interface RichTextProps {
  className?: string;
  component?: keyof JSX.IntrinsicElements;
  text: string;
}

export default function RichText({
  className,
  component: Component = 'div',
  text,
}: RichTextProps) {
  return (
    <Component
      className={clsx('rich-text', className)}
      dangerouslySetInnerHTML={{ __html: text }}
    />
  );
}
