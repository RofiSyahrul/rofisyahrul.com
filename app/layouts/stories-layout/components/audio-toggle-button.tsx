import VisuallyHidden from '~/components/visually-hidden';
import SoundOffIcon from '~/icons/sound-off';
import SoundOnIcon from '~/icons/sound-on';
import { useStoryIsMuted, toggleStoryAudio } from '~/store/stories';

export default function AudioToggleButton() {
  const isMuted = useStoryIsMuted();

  return (
    <button
      className='btn btn-text text-inherit'
      onClick={toggleStoryAudio}
      title='Toggle audio'
    >
      {isMuted ? (
        <SoundOffIcon
          aria-label='Audio is muted'
          width={16}
          height={16}
        />
      ) : (
        <SoundOnIcon
          aria-label='Audio is playing'
          width={16}
          height={16}
        />
      )}
      <VisuallyHidden>Toggle audio</VisuallyHidden>
    </button>
  );
}
