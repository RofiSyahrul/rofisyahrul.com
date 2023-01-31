import VisuallyHidden from '~/components/visually-hidden';
import {
  useActiveStory,
  goToPrevStory,
  goToNextStory,
} from '~/store/stories';

export default function InvisibleNavButtonss() {
  const { canNext, canPrev } = useActiveStory();

  return (
    <>
      <button
        disabled={!canPrev}
        onClick={goToPrevStory}
        className='btn btn-text w-1/3 h-full absolute top-0 left-0'
        title='Prev'
      >
        <VisuallyHidden>Previous story</VisuallyHidden>
      </button>
      <button
        disabled={!canNext}
        onClick={goToNextStory}
        className='btn btn-text w-1/3 h-full absolute top-0 right-0'
        title='Next'
      >
        <VisuallyHidden>Next story</VisuallyHidden>
      </button>
    </>
  );
}
