import { ArrowLeft } from '@/views/Home/components/icons';
import React from 'react';
import { useIsomorphicLayoutEffect } from 'usehooks-ts';
import { getFloatingPanelAnimation } from '../animations/FloatingPanelAnimation';
import { works } from '../assets/works';

function useAnimation(nodeRef: React.RefObject<HTMLDivElement>) {
  const animationRef = React.useRef<gsap.core.Timeline | null>(null);

  useIsomorphicLayoutEffect(() => {
    if (nodeRef.current) {
      animationRef.current = getFloatingPanelAnimation(nodeRef.current);
      return () => { animationRef.current?.kill(); };
    }
  }, []);

  return React.useMemo(() => ({
    FADE_IN: () => animationRef.current?.play(),
    FADE_OUT: () => animationRef.current?.reverse(),
  }), []);
}

export const Works = ({ isVisible, onCloseClick }: {
  isVisible: boolean;
  onCloseClick: () => void;
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
    <>
      <div className="floating-panel works" ref={nodeWrapperRef} >
        <div className="floating-panel__inner">
          <div className="floating-panel__header">
            <button className="floating-panel__close-panel" type="button" onClick={onCloseClick}>
              <ArrowLeft />
              <span className="floating-panel__close-panel-text">Close</span>
            </button>
            <div className="works__headline"><span>Works</span></div>
          </div>
          <div className="floating-panel__content">
            <div className="works__list">
              {works.map(({
                name,
                caption,
                image,
                slug,
                description,
                permalink
              }) => (
                <React.Fragment key={slug}>
                  <div className="works__list-item work">
                    <div className="work__header">
                      <h2 className="work__title">{name}</h2>
                      <span className="work__caption">{caption}</span>
                    </div>
                    <img className="work__image" src={image} />
                    <div className="work__content">
                      <div className="work__description"
                        data-gtm-el="works-description"
                        data-gtm-el-key={slug}
                        dangerouslySetInnerHTML={{ __html: description }}
                      >
                      </div>
                      <div className="work__actions">
                        <a
                          className="button"
                          href={permalink}
                          target="_blank"
                          rel="noreferrer"
                          data-gtm-el="works-permalink"
                          data-gtm-el-key={slug}
                        >
                          <span>View Live</span>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="works__list-item-separator works__list-item-separator--full-width" data-shape-divider="arrow-down"></div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};