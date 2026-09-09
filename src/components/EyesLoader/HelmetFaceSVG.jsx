import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import styles from './EyesLoader.module.css';

const HelmetFaceSVG = forwardRef(function HelmetFaceSVG(props, ref) {
  const irisLeftRef = useRef(null);
  const irisRightRef = useRef(null);
  const gogglesRef = useRef(null);
  const helmetRef = useRef(null);
  const scleraLeftRef = useRef(null);
  const scleraRightRef = useRef(null);

  useImperativeHandle(ref, () => ({
    irisLeft: irisLeftRef.current,
    irisRight: irisRightRef.current,
    goggles: gogglesRef.current,
    helmet: helmetRef.current,
    scleraLeft: scleraLeftRef.current,
    scleraRight: scleraRightRef.current,
  }));

  return (
    <div className={styles.svgWrapper}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1000" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="el-skin" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFD9B0" />
            <stop offset="1" stopColor="#FBC08A" />
          </linearGradient>
          <linearGradient id="el-helmet" x1="0.1" y1="0" x2="0.9" y2="1">
            <stop offset="0" stopColor="#FFE45C" />
            <stop offset="0.55" stopColor="#FFCC26" />
            <stop offset="1" stopColor="#F2A900" />
          </linearGradient>
          <linearGradient id="el-brim" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFCF33" />
            <stop offset="1" stopColor="#E9A400" />
          </linearGradient>
          <radialGradient id="el-lensOuter" cx="0.35" cy="0.3" r="0.8">
            <stop offset="0" stopColor="#3A4A57" />
            <stop offset="0.5" stopColor="#1C262E" />
            <stop offset="1" stopColor="#05080B" />
          </radialGradient>
          <radialGradient id="el-lensInner" cx="0.4" cy="0.35" r="0.75">
            <stop offset="0" stopColor="#5FA9D6" />
            <stop offset="0.45" stopColor="#1D5C86" />
            <stop offset="1" stopColor="#08202E" />
          </radialGradient>
          <linearGradient id="el-glass" x1="0.1" y1="0" x2="0.8" y2="1">
            <stop offset="0" stopColor="#565F6B" />
            <stop offset="0.4" stopColor="#23282F" />
            <stop offset="1" stopColor="#08090C" />
          </linearGradient>
        </defs>

        {/* FACE */}
        <ellipse cx="308" cy="655" rx="58" ry="78" fill="url(#el-skin)" stroke="#2A2620" strokeWidth="9" />
        <ellipse cx="892" cy="655" rx="58" ry="78" fill="url(#el-skin)" stroke="#2A2620" strokeWidth="9" />
        <path d="M296 625 Q330 645 300 690" fill="none" stroke="#E3A374" strokeWidth="7" strokeLinecap="round" />
        <path d="M904 625 Q870 645 900 690" fill="none" stroke="#E3A374" strokeWidth="7" strokeLinecap="round" />

        <path d="M320 470 Q300 560 305 660 Q310 790 400 860 Q480 915 600 918 Q720 915 800 860 Q890 790 895 660 Q900 560 880 470 Q750 420 600 420 Q450 420 320 470 Z" fill="url(#el-skin)" stroke="#2A2620" strokeWidth="11" />

        <path d="M420 545 Q470 505 545 528" fill="none" stroke="#221F1B" strokeWidth="26" strokeLinecap="round" />
        <path d="M780 545 Q730 505 655 528" fill="none" stroke="#221F1B" strokeWidth="26" strokeLinecap="round" />

        <ellipse ref={scleraLeftRef} cx="490" cy="618" rx="70" ry="76" fill="#FFFFFF" stroke="#221F1B" strokeWidth="9" />
        <g ref={irisLeftRef} style={{ willChange: 'transform' }}>
          <circle cx="472" cy="628" r="40" fill="#221F1B" />
          <circle cx="458" cy="612" r="12" fill="#FFFFFF" />
          <circle cx="486" cy="646" r="6" fill="#FFFFFF" opacity=".6" />
        </g>

        <ellipse ref={scleraRightRef} cx="710" cy="618" rx="70" ry="76" fill="#FFFFFF" stroke="#221F1B" strokeWidth="9" />
        <g ref={irisRightRef} style={{ willChange: 'transform' }}>
          <circle cx="692" cy="628" r="40" fill="#221F1B" />
          <circle cx="678" cy="612" r="12" fill="#FFFFFF" />
          <circle cx="706" cy="646" r="6" fill="#FFFFFF" opacity=".6" />
        </g>

        <path d="M505 790 Q600 840 695 790" fill="none" stroke="#221F1B" strokeWidth="11" strokeLinecap="round" />

        {/* GOGGLES */}
        <g ref={gogglesRef} style={{ transform: 'translateY(-1500px)' }}>
          <path d="M330 555 Q325 535 350 528 L565 522 Q600 520 600 552 Q600 520 635 522 L850 528 Q875 535 870 555 L845 700 Q838 745 795 752 L660 752 Q615 748 605 700 L600 610 L595 700 Q585 748 540 752 L405 752 Q362 745 355 700 Z" fill="#17191C" stroke="#0A0B0D" strokeWidth="10" />
          <path d="M372 560 L558 558 Q572 558 570 578 L548 690 Q542 718 512 722 L432 722 Q400 716 392 686 Z" fill="url(#el-glass)" />
          <path d="M828 560 L642 558 Q628 558 630 578 L652 690 Q658 718 688 722 L768 722 Q800 716 808 686 Z" fill="url(#el-glass)" />
          <path d="M400 585 L520 640" stroke="#8B95A0" strokeWidth="16" strokeLinecap="round" opacity=".5" />
          <path d="M660 585 L780 640" stroke="#8B95A0" strokeWidth="16" strokeLinecap="round" opacity=".5" />
          <path d="M330 560 Q290 570 285 600" fill="none" stroke="#0A0B0D" strokeWidth="16" strokeLinecap="round" />
          <path d="M870 560 Q910 570 915 600" fill="none" stroke="#0A0B0D" strokeWidth="16" strokeLinecap="round" />
        </g>

        {/* HELMET */}
        <g ref={helmetRef} style={{ transform: 'translateY(-1800px)' }}>
          <path d="M270 470 Q290 270 600 235 Q910 270 930 470 L930 500 Q600 555 270 500 Z" fill="#E9A400" />
          <path d="M255 460 Q272 235 600 200 Q928 235 945 460 L995 490 Q1030 512 995 540 Q920 585 600 590 Q280 585 205 540 Q170 512 205 490 Z" fill="url(#el-helmet)" stroke="#2A2620" strokeWidth="13" />
          <path d="M600 208 L600 330" stroke="#E3A400" strokeWidth="8" opacity=".6" strokeLinecap="round" />
          <path d="M520 214 Q515 260 522 330" fill="none" stroke="#E3A400" strokeWidth="7" opacity=".5" strokeLinecap="round" />
          <path d="M680 214 Q685 260 678 330" fill="none" stroke="#E3A400" strokeWidth="7" opacity=".5" strokeLinecap="round" />
          <path d="M270 440 Q300 300 430 250" fill="none" stroke="#FFF3B0" strokeWidth="20" strokeLinecap="round" opacity=".85" />
          <path d="M205 490 Q600 545 995 490 L1015 520 Q600 585 185 520 Z" fill="url(#el-brim)" stroke="#2A2620" strokeWidth="12" />
          <path d="M255 515 Q600 565 945 515" fill="none" stroke="#FFE58A" strokeWidth="12" opacity=".75" />

          <g fill="#2B2F35" stroke="#101215" strokeWidth="6">
            <rect x="330" y="350" width="52" height="22" rx="7" />
            <rect x="330" y="384" width="52" height="22" rx="7" />
            <rect x="330" y="418" width="52" height="22" rx="7" />
          </g>
          <circle cx="356" cy="460" r="17" fill="#EF4444" stroke="#7A1F1F" strokeWidth="6" />

          <g fill="#2B2F35" stroke="#101215" strokeWidth="6">
            <rect x="818" y="350" width="52" height="22" rx="7" />
            <rect x="818" y="384" width="52" height="22" rx="7" />
            <rect x="818" y="418" width="52" height="22" rx="7" />
          </g>
          <circle cx="844" cy="460" r="17" fill="#4ADE80" stroke="#1F7A3D" strokeWidth="6" />

          <circle cx="600" cy="420" r="98" fill="#12151A" stroke="#2A2620" strokeWidth="12" />
          <circle cx="600" cy="420" r="78" fill="url(#el-lensOuter)" />
          <circle cx="600" cy="420" r="55" fill="url(#el-lensInner)" />
          <circle cx="600" cy="420" r="30" fill="#08161F" />
          <circle cx="575" cy="396" r="16" fill="#FFFFFF" />
          <circle cx="612" cy="432" r="7" fill="#8FD4FF" opacity=".8" />
        </g>
      </svg>
    </div>
  );
});

export default HelmetFaceSVG;
