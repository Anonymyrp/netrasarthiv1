import React, { useRef, useEffect, useCallback } from 'react';
import anime from 'animejs';
import styles from './EyesLoader.module.css';
import HelmetFaceSVG from './HelmetFaceSVG';

const TIMING = {
  eyesFadeIn: 600,
  mouseTrackPhase: 1500,
  sweepOneWay: 500,
  sweepCenter: 400,
  gogglesDrop: 700,
  gogglesPause: 400,
  helmetDrop: 550,
  shudder: 300,
  overlayFade: 700,
};
const MAX_IRIS_TRAVEL = 20;

export default function EyesLoader({ onComplete }) {
  const overlayRef = useRef(null);
  const svgRef = useRef(null);
  const trackingActive = useRef(false);

  const handleMouseMove = useCallback((e) => {
    if (!trackingActive.current) return;
    const svgEl = svgRef.current;
    if (!svgEl) return;
    const svgDomEl = svgEl.irisLeft?.closest('svg');
    if (!svgDomEl) return;
    const svgCssWidth = svgDomEl.getBoundingClientRect().width;
    const scaleFactor = 1200 / svgCssWidth;

    [
      { scleraEl: svgEl.scleraLeft, irisEl: svgEl.irisLeft },
      { scleraEl: svgEl.scleraRight, irisEl: svgEl.irisRight },
    ].forEach(({ scleraEl, irisEl }) => {
      if (!scleraEl || !irisEl) return;
      const rect = scleraEl.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
      const rawDist = Math.hypot(e.clientX - centerX, e.clientY - centerY);
      const distCSS = Math.min(rawDist, MAX_IRIS_TRAVEL / scaleFactor);
      const distSVG = distCSS * scaleFactor;
      const targetX = Math.cos(angle) * distSVG;
      const targetY = Math.sin(angle) * distSVG;
      anime({ targets: irisEl, translateX: targetX, translateY: targetY, duration: 80, easing: 'linear' });
    });
  }, []);

  useEffect(() => {
    console.log('EyesLoader useEffect mounted', {
      overlay: overlayRef.current,
      svg: svgRef.current,
      irisLeft: svgRef.current?.irisLeft,
      goggles: svgRef.current?.goggles,
      helmet: svgRef.current?.helmet
    });
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onComplete?.();
      return;
    }
    const svgEl = svgRef.current;
    if (!overlayRef.current || !svgEl?.irisLeft || !svgEl?.irisRight || !svgEl?.goggles || !svgEl?.helmet) {
      console.warn('EyesLoader missing refs:', svgEl);
      return;
    }
    const handleTouchMove = (e) => {
      const touch = e.touches[0];
      handleMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
    };
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('mousemove', handleMouseMove);

    const tl = anime.timeline({ autoplay: true });

    tl.add({
      targets: [svgEl.irisLeft, svgEl.irisRight],
      opacity: [0, 1],
      scaleY: [0.05, 1],
      duration: TIMING.eyesFadeIn,
      delay: anime.stagger(120),
      easing: 'easeOutBack',
      complete: () => { trackingActive.current = true; },
    });

    tl.add({ duration: TIMING.mouseTrackPhase });

    tl.add({
      targets: [svgEl.irisLeft, svgEl.irisRight],
      translateX: -MAX_IRIS_TRAVEL,
      translateY: 0,
      duration: TIMING.sweepOneWay,
      easing: 'easeInOutSine',
      begin: () => { trackingActive.current = false; },
    });

    tl.add({
      targets: [svgEl.irisLeft, svgEl.irisRight],
      translateX: MAX_IRIS_TRAVEL,
      translateY: 0,
      duration: TIMING.sweepOneWay,
      easing: 'easeInOutSine',
    });

    tl.add({
      targets: [svgEl.irisLeft, svgEl.irisRight],
      translateX: 0,
      translateY: 0,
      duration: TIMING.sweepCenter,
      easing: 'easeOutElastic(1, .6)',
    });

    // ponytail: hardcoded translateY drop values (-1500 goggles, -1800 helmet); upgrade when SVG bounds change
    tl.add({
      targets: svgEl.goggles,
      translateY: ['-1500', '0'],
      duration: TIMING.gogglesDrop,
      easing: 'easeOutBounce',
    }, '-=100');

    tl.add({ duration: TIMING.gogglesPause });

    tl.add({
      targets: svgEl.helmet,
      translateY: ['-1800', '0'],
      duration: TIMING.helmetDrop,
      easing: 'easeInQuart',
    });

    tl.add({
      targets: overlayRef.current,
      translateY: [0, -10, 6, -4, 2, 0],
      duration: TIMING.shudder,
      easing: 'easeInOutSine',
    });

    tl.add({
      targets: overlayRef.current,
      opacity: [1, 0],
      duration: TIMING.overlayFade,
      easing: 'easeInCubic',
      complete: () => {
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('mousemove', handleMouseMove);
        onComplete?.();
      },
    });

    return () => {
      tl.pause();
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove, onComplete]);

  return (
    <div ref={overlayRef} className={styles.overlay}>
      <HelmetFaceSVG ref={svgRef} />
    </div>
  );
}
