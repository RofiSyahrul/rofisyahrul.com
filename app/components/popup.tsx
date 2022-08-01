import type { ReactNode } from 'react';
import { useEffect, useCallback, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import clsx from 'clsx';

import { useScrollLock } from '~/hooks/use-scroll-lock';
import CloseIcon from '~/icons/close';

import VisuallyHidden from './visually-hidden';

type PopupAnimationType = 'enter' | 'leave';

interface PopupProps {
  children: ReactNode;
  className?: string;
  isCloseButtonShown?: boolean;
  isForceRender?: boolean;
  isOpen?: boolean;
  onClose?(): void;
}

export default function Popup({
  children,
  className,
  isCloseButtonShown = false,
  isForceRender = false,
  isOpen = false,
  onClose,
}: PopupProps) {
  const containerRef = useRef<HTMLElement>();
  const isShownRef = useRef(false);

  const [isShown, setIsShown] = useState(false);
  const [animationType, setAnimationType] =
    useState<PopupAnimationType>('leave');

  useScrollLock(isShown);

  const handleAnimationEnd = useCallback(() => {
    if (animationType !== 'leave') return;
    setIsShown(false);
    isShownRef.current = false;
    if (typeof onClose === 'function') onClose();
  }, [animationType, onClose]);

  const handleClose = useCallback(() => {
    setAnimationType('leave');
  }, []);

  useEffect(() => {
    if (isOpen === isShownRef.current) return;

    if (isOpen) {
      if (!containerRef.current && !isForceRender) {
        containerRef.current = document.createElement('div');
        containerRef.current.classList.add('popup-container');
        document.body.appendChild(containerRef.current);
      }
      setAnimationType('enter');
      setIsShown(true);
    } else {
      setAnimationType('leave');
    }

    isShownRef.current = isOpen;
  }, [isOpen, isForceRender]);

  const popupNode = (
    <div
      aria-hidden={!isShown}
      className={clsx('popup', `popup_${animationType}`)}
      onAnimationEnd={handleAnimationEnd}
    >
      <div className='popup__mask' onClick={handleClose} />
      {isCloseButtonShown && (
        <button
          className='popup__close-button'
          onClick={handleClose}
          title='Close'
        >
          <CloseIcon />
          <VisuallyHidden>Close</VisuallyHidden>
        </button>
      )}
      <dialog
        className={clsx('popup__dialog w-[800px]', className)}
        open={isShown}
      >
        {children}
      </dialog>
    </div>
  );

  if (isForceRender) return popupNode;
  if (!containerRef.current) return null;
  return createPortal(popupNode, containerRef.current);
}
