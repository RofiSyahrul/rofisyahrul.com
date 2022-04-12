import Header from '~/components/header';

interface Social {
  name: string;
  url: string;
}

const socials: Social[] = [
  { name: 'github', url: 'https://github.com/RofiSyahrul' },
  {
    name: 'linkedin',
    url: 'https://www.linkedin.com/in/syahrul-rofi/',
  },
  { name: 'twitter', url: 'https://twitter.com/RofiSyahrul' },
  {
    name: 'instagram',
    url: 'https://www.instagram.com/rofisyahrul/',
  },
];

function TopFold() {
  return (
    <section className='flex gap-4 w-full items-center'>
      <img
        alt='Syahrul Rofi'
        src='https://res.cloudinary.com/rofi/image/upload/v1640233522/samples/rho-pi.png'
        width={176}
        height={176}
        loading='eager'
        className='w-20 h-20 rounded-full sm:w-32 sm:h-32 md:w-44 md:h-44'
      />
      <div className='flex flex-col gap-2 w-auto'>
        <h2 className='font-bold text-3xl'>Syahrul Rofi</h2>
        <div className='flex w-full gap-2'>
          {socials.map(social => (
            <a
              key={social.name}
              href={social.url}
              target='_blank'
              rel='noreferrer'
              title={social.name}
            >
              <div
                title={social.name}
                className={`icon icon-${social.name} w-8 h-8 rounded bg-primary-dim dark:bg-primary-bright`}
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

const highlights = ['Blog', 'Portfolio', 'Experiences'];

function Highlights() {
  return (
    <section className='flex w-full gap-3 flex-nowrap overflow-x-auto p-2 sm:p-0'>
      {highlights.map(title => (
        <div
          key={title}
          className='flex flex-col gap-2 items-center justify-center'
        >
          <div className='w-24 h-24 rounded-full p-0.5 border border-solid border-neutral-dim2 dark:border-neutral-bright2'>
            <div className='w-full h-full rounded-full bg-primary-dim dark:bg-primary-bright'>
              <span className={`icon icon-${title.toLowerCase()}`} />
            </div>
          </div>
          <h6 className='font-semibold text-primary-dim dark:text-primary-bright'>
            {title}
          </h6>
        </div>
      ))}
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <Header />
      <main className='relative flex flex-col p-3 w-full max-w-5xl mx-auto gap-3'>
        <TopFold />
        <section className='bio'>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit.
            Praesentium consequuntur labore ipsam delectus quos. Atque
            in nobis quis neque porro ut iusto eveniet, mollitia sed.
            Itaque architecto ducimus sequi saepe.
          </p>
        </section>
        <Highlights />
        <ul className='counts'>
          <li>
            <strong>5</strong>
            <span>Portfolios</span>
          </li>
          <li>
            <strong>10</strong>
            <span>Technical Skills</span>
          </li>
        </ul>
        <div className='portfolio-list-grid'>
          <div>latest porto</div>
          <div>2nd latest porto</div>
          <div>and so on</div>
        </div>
        <article>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Molestiae tempora incidunt sed repellendus voluptatum
            nulla quod tempore vitae pariatur accusamus praesentium,
            consequatur molestias provident omnis illo voluptate
            quaerat sit quasi! Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Ut nostrum optio tempora ducimus odio
            est ab tempore delectus iure, quasi quas. Praesentium nam
            pariatur mollitia optio amet necessitatibus sequi quaerat?
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Molestiae tempora incidunt sed repellendus voluptatum
            nulla quod tempore vitae pariatur accusamus praesentium,
            consequatur molestias provident omnis illo voluptate
            quaerat sit quasi! Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Ut nostrum optio tempora ducimus odio
            est ab tempore delectus iure, quasi quas. Praesentium nam
            pariatur mollitia optio amet necessitatibus sequi quaerat?
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Molestiae tempora incidunt sed repellendus voluptatum
            nulla quod tempore vitae pariatur accusamus praesentium,
            consequatur molestias provident omnis illo voluptate
            quaerat sit quasi! Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Ut nostrum optio tempora ducimus odio
            est ab tempore delectus iure, quasi quas. Praesentium nam
            pariatur mollitia optio amet necessitatibus sequi quaerat?
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Molestiae tempora incidunt sed repellendus voluptatum
            nulla quod tempore vitae pariatur accusamus praesentium,
            consequatur molestias provident omnis illo voluptate
            quaerat sit quasi! Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Ut nostrum optio tempora ducimus odio
            est ab tempore delectus iure, quasi quas. Praesentium nam
            pariatur mollitia optio amet necessitatibus sequi quaerat?
          </p>
        </article>
      </main>
    </>
  );
}
