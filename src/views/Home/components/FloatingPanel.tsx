import React from 'react';
import { ArrowLeft } from '@/views/shared/components/icons';
import { useIsomorphicLayoutEffect } from 'usehooks-ts';
import { getFloatingPanelAnimation } from '../animations/FloatingPanelAnimation';

function useAnimation(nodeRef: React.RefObject<HTMLDivElement>) {
  const animationRef = React.useRef<gsap.core.Timeline | null>(null);

  useIsomorphicLayoutEffect(() => {
    if (nodeRef.current) {
      animationRef.current = getFloatingPanelAnimation(nodeRef.current);
      return () => { animationRef.current?.kill(); };
    }
  }, [nodeRef]);

  return React.useMemo(() => ({
    FADE_IN: () => animationRef.current?.play(),
    FADE_OUT: () => animationRef.current?.reverse(),
  }), []);
}

export const FloatingPanel = ({ isVisible, onCloseClick, children }: {
  isVisible: boolean;
  onCloseClick: () => void;
  children: React.ReactNode;
}) => {
  const nodeWrapperRef = React.useRef<HTMLDivElement>(null);
  const animation = useAnimation(nodeWrapperRef);

  // on "isVisible" change, show/hide the panel
  React.useEffect(() => {
    if (isVisible) animation.FADE_IN();
    if (!isVisible) animation.FADE_OUT();
  }, [isVisible, animation]);

  // on "esc" key press close the panel
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // on "esc" press
      if (e.keyCode === 27) {
        if (isVisible) onCloseClick();
      }
    };
    document.addEventListener('keyup', handler);
    return () => { document.removeEventListener('keyup', handler); };
  }, [isVisible, onCloseClick]);

  return (
    <div className="floating-panel works" ref={nodeWrapperRef} >
      <div className="floating-panel__inner">
        {children}
      </div>
    </div>
  );
};

FloatingPanel.Header = ({ children }: { children: React.ReactNode; }) => (
  <div className="floating-panel__header">
    {children}
  </div>
);

FloatingPanel.HeaderBackButton = ({ onClick, children }: { onClick: () => void, children: React.ReactNode; }) => (
  <button className="floating-panel__close-panel" type="button" onClick={onClick}>
    <ArrowLeft />
    <span className="floating-panel__close-panel-text">{children}</span>
  </button>
);

FloatingPanel.Content = ({ children }: { children: React.ReactNode; }) => (
  <div className="floating-panel__content">
    {children}
  </div>
);