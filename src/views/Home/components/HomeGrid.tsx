import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { HomeGridAnimation } from '../animations/HomeGridAnimation';


/* Custom Hook for create the animation */
function useAnimation(nodeRef: React.RefObject<HTMLDivElement>) {
  const [animation, setAnimation] = useState<HomeGridAnimation | null>(null);

  useEffect(() => {
    if (nodeRef.current) {
      setAnimation(new HomeGridAnimation(nodeRef.current));
    }
  }, [nodeRef]);

  return animation;

}

export const HomeGrid = ({ onWorksClick, onContactMeClick, onBlogClick }: {
  onWorksClick: () => void;
  onContactMeClick: () => void;
  onBlogClick: () => void;
}) => {
  const router = useRouter();
  const nodeWrapperRef = useRef<HTMLDivElement>(null);
  const animation = useAnimation(nodeWrapperRef);
  useEffect(() => {
    // Add body classes, CSS need this
    document.body.classList.add("variation--20", "hover-fx--0", "hover-fx-b--1");
  }, []);

  // execute intro animation
  // or skip it based on query string
  useEffect(() => {
    if (router.query["skip-intro-animation"] === 'true') {
      animation?.SKIP_ANIMATION();
      return;
    }
    animation?.FADE_IN();
  }, [router.query, animation]);

  return (
    <nav className="home-grid__wrapper" ref={nodeWrapperRef}>
      <div className="home-grid home-grid--shrinked">
        <div className="home-grid__box home-grid__box--no-bg home-grid__box--different home-grid-animate animate-from-left"><span>Jacopo Marrone</span></div>
        <button className="home-grid__box home-grid-animate" data-gtm-el="home-box" data-gtm-el-key="blog" onClick={onBlogClick} type='button'><span>Blog</span></button>
        <button className="home-grid__box home-grid-animate" data-gtm-el="home-box" data-gtm-el-key="works" onClick={onWorksClick} type='button'><span>Works</span></button>
        <button className="home-grid__box home-grid-animate" data-gtm-el="home-box" data-gtm-el-key="contact-me" onClick={onContactMeClick} type='button'><span>Contact Me</span></button>
      </div>
      <div className="home-grid home-grid--expanded"></div>
    </nav>
  );

};