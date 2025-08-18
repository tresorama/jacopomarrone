import { useEffect, useMemo, useRef, useState } from "react";
import { useIsomorphicLayoutEffect } from "usehooks-ts";
import { getFloatingPanelAnimation } from "../animations/FloatingPanelAnimation";

function useAnimation(nodeRef: React.RefObject<HTMLDivElement>) {
  const [animation, setAnimation] = useState<gsap.core.Timeline | null>(null);

  useIsomorphicLayoutEffect(() => {
    if (nodeRef.current) {
      setAnimation(getFloatingPanelAnimation(nodeRef.current));
      return () => { animation?.kill(); };
    }
  }, [nodeRef]);

  return useMemo(() => ({
    FADE_IN: (options: { onAnimationEnd: () => void; }) => animation?.call(options.onAnimationEnd).play(),
    FADE_OUT: () => animation?.reverse(),
  }), [animation]);
}

const PageExitAnimation = ({ onAnimationEnd }: {
  onAnimationEnd: () => void;
}) => {
  const nodeWrapperRef = useRef<HTMLDivElement>(null);
  const animation = useAnimation(nodeWrapperRef);
  useEffect(() => {
    animation.FADE_IN({ onAnimationEnd });
  }, [animation]);

  return (
    <>
      <div className="floating-panel works" ref={nodeWrapperRef} >
        <div className="floating-panel__inner">
          {/* <div className="floating-panel__header"></div> */}
          <div className="floating-panel__content"></div>
        </div>
      </div>
    </>
  );
};

export const usePageExitAnimation = ({ onAnimationEnd }: {
  onAnimationEnd: () => void;
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  return {
    startAnimation: () => setIsPlaying(true),
    Component: () => isPlaying ? <PageExitAnimation onAnimationEnd={onAnimationEnd} /> : null
  };
};