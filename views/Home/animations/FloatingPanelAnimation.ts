import gsap from "gsap";

/** The Vanilla Js animation, with gsap */
export function getFloatingPanelAnimation(domNode: Element) {
  const duration = 0.4;
  const ease = "ease";
  return gsap.timeline({
    paused: true,
    defaults: { duration, ease },
    onStart: () => { gsap.set(domNode, { visibility: 'visible' }) },
    onReverseComplete: () => { gsap.set(domNode, { visibility: 'hidden' }) },
  })
    .fromTo(domNode, { scaleX: 0 }, { scaleX: 1 })
    .fromTo(Array.from(domNode.children), { stagger: duration, opacity: 0 }, { opacity: 1 });
}