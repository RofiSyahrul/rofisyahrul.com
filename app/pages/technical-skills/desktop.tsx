import clsx from 'clsx';

import Popup from '~/components/popup';
import { useBack } from '~/hooks/use-back';

import TechSkillList from './tech-skill-list';

export default function DesktopTechnicalSkillsPopup() {
  const back = useBack();

  return (
    <Popup
      className='flex-col w-[500px]'
      isCloseButtonShown
      isForceRender
      isOpen
      onClose={back}
    >
      <header
        className={clsx(
          'sticky top-0 left-0 bg-inherit z-10',
          'w-full p-2 shadow-lg rounded-tr-lg rounded-tl-lg',
        )}
      >
        <h4>Technical Skills</h4>
      </header>
      <article className='w-full pt-2'>
        <TechSkillList />
      </article>
    </Popup>
  );
}
