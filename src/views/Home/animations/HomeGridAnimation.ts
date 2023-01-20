import { gsap } from 'gsap';
import { Flip } from 'gsap/dist/Flip';
import { getChildren } from './utils/gsap-utils';

/* The Vanilla JS animation, with GSAP FLip */
export class HomeGridAnimation {
  nodeWrapper: HTMLElement;
  is_visible: boolean;

  constructor(nodeWrapper: HTMLElement) {
    gsap.registerPlugin(Flip);
    this.nodeWrapper = nodeWrapper;
    this.is_visible = false;
  }
  //
  FADE_IN() {
    this.is_visible = true;
    this.animationAtoB();
  }
  FADE_OUT() {
    this.is_visible = false;
    this.animationBtoA();
  }
  TOGGLE() {
    if (this.is_visible) {
      this.FADE_OUT();
    }
    else {
      this.FADE_IN();
    }
  }
  SKIP_ANIMATION() {
    this.is_visible = true;
    this.animationAtoB(0);
  }
  animationAtoB(duration = 2.6) {
    const nodes = {
      grid_shrinked: this.nodeWrapper.querySelector('.home-grid.home-grid--shrinked'),
      grid_expanded: this.nodeWrapper.querySelector('.home-grid.home-grid--expanded'),
      grid_items: Array.from(this.nodeWrapper.querySelectorAll('.home-grid__box'))
    };
    if (!nodes.grid_shrinked || !nodes.grid_expanded || nodes.grid_items.length === 0) {
      return;
    }

    const ease = "power4.out";
    const stagger = {
      each: duration * 0.15
    };


    function expandBoxes() {
      const flipState = Flip.getState(nodes.grid_items);
      nodes.grid_items.forEach((node) => {
        nodes.grid_expanded?.appendChild(node);
      });
      return Flip.from(flipState, {
        duration,
        ease,
        stagger,
        absolute: true,
      });
    }
    function fadeBoxes() {
      const tl = gsap.timeline();
      tl.to(nodes.grid_items, {
        autoAlpha: 1,
        duration: duration * 0.5,
        ease,
        stagger
      });

      return tl;
    }
    function fadeBoxesChildren() {
      const tl = gsap.timeline();
      tl.to(getChildren(nodes.grid_items), {
        autoAlpha: 1,
        duration,
        ease,
        stagger
      });
      return tl;
    }

    return gsap
      .timeline({
        paused: false,
        onStart: () => {
          this.deactivate_transition();
          gsap.set([...nodes.grid_items, ...getChildren(nodes.grid_items)], { visibility: 'hidden' });
        },
        onComplete: () => {
          this.reactivate_transition();
        },
      })
      .addLabel('t0', duration * 0)
      .addLabel('t1', duration * 0.5)
      .add(fadeBoxes(), 't0')
      .add(fadeBoxesChildren(), 't1')
      .add(expandBoxes(), 't1');
  }
  animationBtoA() {
    const nodes = {
      grid_shrinked: this.nodeWrapper.querySelector('.home-grid.home-grid--shrinked'),
      grid_expanded: this.nodeWrapper.querySelector('.home-grid.home-grid--expanded'),
      grid_items: Array.from(this.nodeWrapper.querySelectorAll('.home-grid__box'))
    };
    if (!nodes.grid_shrinked || !nodes.grid_expanded || nodes.grid_items.length === 0) {
      return;
    }

    const duration = 2.6;
    const ease = "power4.out";
    const stagger = {
      each: 0.4
    };


    function expandBoxes() {
      const flipState = Flip.getState(nodes.grid_items);
      nodes.grid_items.forEach((node) => {
        nodes.grid_shrinked?.appendChild(node);
      });
      return Flip.from(flipState, {
        duration: duration,
        ease,
        stagger,
        absolute: true,
      });
    }
    function fadeBoxes() {
      const tl = gsap.timeline();
      tl.to(nodes.grid_items, {
        autoAlpha: 0,
        duration: duration * 0.5,
        ease,
        stagger
      });

      return tl;
    }
    function fadeBoxesChildren() {
      const tl = gsap.timeline();
      tl.to(getChildren(nodes.grid_items), {
        autoAlpha: 0,
        duration,
        ease,
        stagger
      });
      return tl;
    }

    return gsap
      .timeline({
        paused: false,
        onStart: () => {
          this.deactivate_transition();
        },
        onComplete: () => {
          this.reactivate_transition();
        },
      })
      .addLabel('t0', duration * 0)
      .addLabel('t1', duration * 0.5)
      .add(fadeBoxes(), 't1')
      .add(fadeBoxesChildren(), 't0')
      .add(expandBoxes(), 't0');
  }
  deactivate_transition() {
    document.body.classList.toggle('GSAP-IS-ANIMATING', true);
  }
  reactivate_transition() {
    document.body.classList.toggle('GSAP-IS-ANIMATING', false);
  }

}