import { Work } from '@/contents/works.types';
import { ArrowLeft } from '@/views/components/icons/icons/ArrowLeft';
import React from 'react';
import { useIsFirstRender, useIsomorphicLayoutEffect } from 'usehooks-ts';
import { getFloatingPanelAnimation } from '../animations/FloatingPanelAnimation';
// import { works } from '../assets/works';

function useAnimation(nodeRef: React.MutableRefObject<HTMLDivElement | null>) {
  const animationRef = React.useRef<gsap.core.Timeline | null>(null);

  useIsomorphicLayoutEffect(() => {
    if (nodeRef.current) {
      animationRef.current = getFloatingPanelAnimation(nodeRef.current);
      return () => { animationRef.current?.kill(); }
    }
  }, []);

  return {
    FADE_IN: () => animationRef.current?.play(),
    FADE_OUT: () => animationRef.current?.reverse(),
  }
}

export const Works = ({
  isVisible,
  setIsVisible,
  works = []
}: {
  isVisible: boolean,
  setIsVisible: (...args: any[]) => unknown,
  works: Work[]
}) => {
  const nodeWrapperRef = React.useRef<HTMLDivElement | null>(null);
  const animation = useAnimation(nodeWrapperRef);
  const isFirstRender = useIsFirstRender();

  // on "isVisible" change, show/hide the panel
  React.useEffect(() => {
    if (isFirstRender) return;
    if (!nodeWrapperRef.current) return;
    if (isVisible) animation.FADE_IN();
    if (!isVisible) animation.FADE_OUT();
  }, [isVisible]);

  // on "esc" key press close the panel
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // on "esc" press
      if (e.keyCode === 27) {
        if (isVisible) setIsVisible(false);
      }
    }
    document.addEventListener('keyup', handler);
    return () => { document.removeEventListener('keyup', handler); }
  }, [isVisible]);

  return (
    <>
      <div className="floating-panel works" ref={nodeWrapperRef} >
        <div className="floating-panel__inner">
          <div className="floating-panel__header">
            <button className="floating-panel__close-panel" type="button" onClick={() => setIsVisible(false)}>
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
                permalink,
                content
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
                        dangerouslySetInnerHTML={{ __html: content }}
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
}