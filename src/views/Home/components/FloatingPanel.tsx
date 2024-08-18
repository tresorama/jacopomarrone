import { useRef, useMemo, useEffect } from 'react';
import { useIsomorphicLayoutEffect } from 'usehooks-ts';
import { ArrowLeft } from '@/views/_components/icons';
import { getFloatingPanelAnimation } from '../animations/FloatingPanelAnimation';

function useAnimation(nodeRef: React.RefObject<HTMLDivElement>) {
  const animationRef = useRef<gsap.core.Timeline | null>(null);

  useIsomorphicLayoutEffect(() => {
    if (nodeRef.current) {
      animationRef.current = getFloatingPanelAnimation(nodeRef.current);
      return () => { animationRef.current?.kill(); };
    }
  }, [nodeRef]);

  return useMemo(() => ({
    FADE_IN: () => animationRef.current?.play(),
    FADE_OUT: () => animationRef.current?.reverse(),
  }), []);
}

export const FloatingPanel = ({ as: Tag = 'div', isVisible, onCloseClick, children }: {
  as?: React.ElementType,
  isVisible: boolean;
  onCloseClick: () => void;
  children: React.ReactNode;
}) => {
  const nodeWrapperRef = useRef<HTMLDivElement>(null);
  const animation = useAnimation(nodeWrapperRef);

  // on "isVisible" change, show/hide the panel
  useEffect(() => {
    if (isVisible) animation.FADE_IN();
    if (!isVisible) animation.FADE_OUT();
  }, [isVisible, animation]);

  // on "esc" key press close the panel
  useEffect(() => {
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
    <Tag className="floating-panel" ref={nodeWrapperRef} >
      <div className="floating-panel__inner">
        {children}
      </div>
    </Tag>
  );
};

const FloatingPanelHeader = ({ children }: { children: React.ReactNode; }) => (
  <div className="floating-panel__header">
    {children}
  </div>
);
FloatingPanel.Header = FloatingPanelHeader;

const FloatingPanelHeaderBackButton = ({ onClick, children }: { onClick: () => void, children: React.ReactNode; }) => (
  <button className="floating-panel__close-panel" type="button" onClick={onClick}>
    <ArrowLeft />
    <span className="floating-panel__close-panel-text">{children}</span>
  </button>
);
FloatingPanel.HeaderBackButton = FloatingPanelHeaderBackButton;

const FloatingPanelContent = ({ children }: { children: React.ReactNode; }) => (
  <div className="floating-panel__content">
    {children}
  </div>
);
FloatingPanel.Content = FloatingPanelContent;