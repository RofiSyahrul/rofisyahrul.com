import type { MouseEvent, RefObject, UIEvent } from 'react';
import { useMemo, useCallback, useRef, useState } from 'react';

import clsx from 'clsx';

import ArrowIcon from '~/icons/arrow';
import type { SimpleMediaItem } from '~/types/general';

import LazyImage from './lazy-image';
import VisuallyHidden from './visually-hidden';

interface CarouselItemProps extends SimpleMediaItem {
  isActive: boolean;
  className: string;
  scrollerRef: RefObject<HTMLDivElement>;
}

function CarouselItem({
  alt,
  className,
  height,
  isActive,
  mime,
  resourceType,
  scrollerRef,
  url,
  width,
}: CarouselItemProps) {
  return (
    <div
      aria-current={isActive}
      className='scroll-snap-start flex-grow flex-shrink-0 flex-basis items-center justify-center'
    >
      <div className='relative w-full pb-[100%]'>
        {resourceType === 'image' && (
          <LazyImage
            alt={alt}
            className={className}
            height={height}
            src={url}
            title={alt}
            rootMargin='-8px'
            rootRef={scrollerRef}
            width={width}
          />
        )}
        {resourceType === 'video' &&
          (mime === 'video/webm' || mime === 'video/mp4') && (
            <video
              className={className}
              controls
              height={height}
              title={alt}
              width={width}
            >
              <source src={url} type={mime} />
              Sorry, your browser doesn't support embedded videos.
            </video>
          )}
      </div>
    </div>
  );
}

interface CarouselProps {
  mediaList: SimpleMediaItem[];
}

export default function Carousel({ mediaList }: CarouselProps) {
  const totalMedia = mediaList.length;
  const isMultiple = totalMedia > 1;

  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isFirstIndex = activeIndex === 0;
  const isLastIndex = activeIndex === totalMedia - 1;

  const translateXIndicator = useMemo(() => {
    const startThreshold = 2;

    if (activeIndex >= startThreshold) {
      const endThreshold = totalMedia - 4;
      if (activeIndex > endThreshold) {
        const endCenteringIndex = totalMedia - 5;
        return endCenteringIndex * 10;
      }

      const startCenteringIndex = activeIndex - startThreshold;
      return startCenteringIndex * 10;
    }

    return 0;
  }, [activeIndex, totalMedia]);

  const handleScroll = useCallback(
    (e: UIEvent<HTMLDivElement>) => {
      const scroller = e.currentTarget;
      const nextIndex = Math.round(
        scroller.scrollLeft / scroller.clientWidth,
      );
      if (nextIndex !== activeIndex) setActiveIndex(nextIndex);
    },
    [activeIndex],
  );

  const updateIndex = useCallback(
    (index: number) => {
      if (!totalMedia) return;

      let newIndex = index;
      if (index < 0) newIndex = 0;
      else if (index >= totalMedia) newIndex = totalMedia - 1;

      const scroller = scrollerRef.current;
      scroller?.scrollTo({
        left: scroller?.clientWidth * newIndex,
        top: 0,
        behavior: 'smooth',
      });
    },
    [totalMedia],
  );

  const handleClickNext = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      updateIndex(activeIndex + 1);
    },
    [activeIndex, updateIndex],
  );

  const handleClickPrev = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      updateIndex(activeIndex - 1);
    },
    [activeIndex, updateIndex],
  );

  return (
    <div className='carousel'>
      <div
        className='scrollbar-none relative w-full overflow-x-scroll scroll-snap-x'
        onScroll={handleScroll}
        ref={scrollerRef}
      >
        <div className='flex transition-transform'>
          {mediaList.map((mediaItem, index) => (
            <CarouselItem
              key={`${mediaItem.url}-${index}`}
              className='absolute top-0 left-0 w-full h-full'
              isActive={activeIndex === index}
              {...mediaItem}
              scrollerRef={scrollerRef}
            />
          ))}
        </div>
      </div>

      {isMultiple && (
        <div
          className={clsx(
            'my-4 mx-auto max-w-[56px] overflow-x-hidden',
            'flex transition-all gap-1',
          )}
          style={{ transform: `translateX(${translateXIndicator})` }}
        >
          {Array.from({ length: totalMedia }, (_, index) => (
            <span
              aria-current={index === activeIndex ? 'step' : 'false'}
              key={`carousel-indicator-${index}`}
              className='carousel__indicator-item'
            />
          ))}
        </div>
      )}

      {isMultiple && (
        <>
          <button
            aria-hidden={isFirstIndex}
            className='carousel__arrow carousel__arrow_prev'
            onClick={handleClickPrev}
          >
            <ArrowIcon />
            <VisuallyHidden>Previous</VisuallyHidden>
          </button>
          <button
            aria-hidden={isLastIndex}
            className='carousel__arrow carousel__arrow_next'
            onClick={handleClickNext}
          >
            <ArrowIcon />
            <VisuallyHidden>Next</VisuallyHidden>
          </button>
        </>
      )}
    </div>
  );
}
