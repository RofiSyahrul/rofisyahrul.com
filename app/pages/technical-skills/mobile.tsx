import HeaderNav from '~/components/header-nav';

import TechSkillList from './tech-skill-list';

export default function MobileTechnicalSkillsPage() {
  return (
    <>
      <HeaderNav title='Technical Skills' />
      <main className='w-full pt-2'>
        <TechSkillList />
      </main>
    </>
  );
}
