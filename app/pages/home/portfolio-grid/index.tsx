import { Link } from 'remix';

import VisuallyHidden from '~/components/visually-hidden';

interface PortfolioItem {
  slug: string;
  thumbnailURL: string;
  title: string;
}

const imagePlaceholder = 'https://via.placeholder.com/150';

const data: PortfolioItem[] = [
  {
    slug: 'gif-finder',
    thumbnailURL: imagePlaceholder,
    title: 'GIF Finder',
  },
  {
    slug: 'rofi.link',
    thumbnailURL: imagePlaceholder,
    title: 'rofi.link',
  },
  {
    slug: 'age-calculator',
    thumbnailURL: imagePlaceholder,
    title: 'Age Calculator',
  },
  {
    slug: 'catch-pokemons',
    thumbnailURL: imagePlaceholder,
    title: 'Catch Pokemons',
  },
  {
    slug: 'movie-explorer',
    thumbnailURL: imagePlaceholder,
    title: 'Movie Explorer',
  },
];

export default function PortfolioGrid() {
  return (
    <ul className='grid grid-cols-3 gap-0.5 border-top-mobile sm:px-3'>
      {data.map(item => (
        <li key={item.title} className='w-full aspect-square'>
          <Link to={`/p/${item.slug}`}>
            <img
              alt={item.title}
              className='object-cover w-full aspect-square'
              height={150}
              src={item.thumbnailURL}
              width={150}
            />
            <VisuallyHidden>{item.title}</VisuallyHidden>
          </Link>
        </li>
      ))}
    </ul>
  );
}
