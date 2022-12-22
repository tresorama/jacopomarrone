import React from 'react';
import { wait } from '../utils/wait';
import { HomeGridAnimation } from '../animations/HomeGridAnimation';


/* Custom Hook for create the animation */
function useAnimation(nodeRef: React.RefObject<HTMLDivElement>) {
  const animationRef = React.useRef<HomeGridAnimation | null>(null);

  React.useEffect(() => {
    if (nodeRef.current) {
      animationRef.current = new HomeGridAnimation(nodeRef.current);
      wait(1).then(() => animationRef.current?.FADE_IN());
    }
  }, [nodeRef]);

}

export const HomeGrid = ({ onWorksClick, onContactMeClick }: {
  onWorksClick: () => void;
  onContactMeClick: () => void;
}) => {
  const nodeWrapperRef = React.useRef<HTMLDivElement>(null);
  useAnimation(nodeWrapperRef);

  React.useEffect(() => {
    // Add body classes, CSS need this
    document.body.classList.add("variation--20", "hover-fx--0", "hover-fx-b--1");
  }, []);

  return (
    <div className="home-grid__wrapper" ref={nodeWrapperRef}>
      <div className="home-grid home-grid--shrinked">
        <div className="home-grid__box home-grid__box--no-bg home-grid__box-different home-grid-animate animate-from-left"><span>Jacopo Marrone</span></div>
        <button className="home-grid__box home-grid-animate" data-gtm-el="home-box" data-gtm-el-key="works" onClick={onWorksClick}><span>Works</span></button>
        <button className="home-grid__box home-grid-animate" data-gtm-el="home-box" data-gtm-el-key="contact-me" onClick={onContactMeClick}><span>Contact Me</span></button>
      </div>
      <div className="home-grid home-grid--expanded"></div>
    </div>
  );

};