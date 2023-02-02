import Footer from '~/components/footer';
import HeaderNav from '~/components/header-nav';
import VisuallyHidden from '~/components/visually-hidden';

interface ComingSoonPageProps {
  title?: string;
}

const originalText = 'Coming Soon';
const fancyText = originalText.replace('o', '<span>o</span>');

export default function ComingSoonPage({
  title,
}: ComingSoonPageProps) {
  return (
    <>
      <HeaderNav title={title} />
      <main className='centered-page'>
        <h1
          className='fancy-text_small'
          dangerouslySetInnerHTML={{ __html: fancyText }}
          title={originalText}
        />
        <VisuallyHidden>{originalText}</VisuallyHidden>
      </main>
      <Footer className='absolute bottom-0 left-0 right-0' />
    </>
  );
}
