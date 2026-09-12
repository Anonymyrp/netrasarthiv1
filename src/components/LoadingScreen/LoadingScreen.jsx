import React, { useEffect, useRef, useState } from 'react'
import styles from './LoadingScreen.module.css'

export default function LoadingScreen({ onComplete }) {
  const [fadingOut, setFadingOut] = useState(false)
  const containerRef = useRef(null)
  const animRef = useRef(null)

  useEffect(() => {
    const NS = 'http://www.w3.org/2000/svg'
    const root = containerRef.current
    if (!root) return

    const $ = (id) => root.querySelector(`#${id}`)
    const rot = (a) => `rotate(${((a % 360) + 360) % 360} 150 150)`

    // Tiny tween engine
    const tweens = new Set()
    const linear = (p) => p
    const easeOutCubic = (p) => 1 - Math.pow(1 - p, 3)
    const easeInCubic = (p) => p * p * p
    const easeOutBack = (p) => {
      const c = 1.70158
      return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2)
    }

    function tween(cfg) {
      cfg.start = performance.now() + (cfg.delay || 0)
      cfg.ease = cfg.ease || easeOutCubic
      tweens.add(cfg)
      return cfg
    }

    function stepTweens(nowMs) {
      for (const tw of [...tweens]) {
        const p = (nowMs - tw.start) / tw.dur
        if (p < 0) continue
        if (p >= 1) {
          tw.update && tw.update(tw.to)
          tweens.delete(tw)
          tw.done && tw.done()
        } else {
          tw.update && tw.update(tw.from + (tw.to - tw.from) * tw.ease(p))
        }
      }
    }

    // Populate focus ticks (72 ticks)
    const ticks = []
    const gTicks = $('ticks')
    if (gTicks) {
      gTicks.innerHTML = ''
      for (let i = 0; i < 72; i++) {
        const major = i % 6 === 0
        const len = major ? 11 : 5
        const line = document.createElementNS(NS, 'line')
        line.setAttribute('x1', '150')
        line.setAttribute('x2', '150')
        line.setAttribute('y1', '12')
        line.setAttribute('y2', '12')
        line.setAttribute('stroke', i % 18 === 0 ? '#2559c4' : major ? 'rgba(242,248,255,.9)' : 'rgba(242,248,255,.35)')
        line.setAttribute('stroke-width', major ? '2' : '1.2')
        line.setAttribute('opacity', '0')

        const holder = document.createElementNS(NS, 'g')
        holder.setAttribute('transform', `rotate(${i * 5} 150 150)`)
        holder.appendChild(line)
        gTicks.appendChild(holder)
        ticks.push({ line, len })

        tween({
          from: 0,
          to: 1,
          dur: 700,
          delay: 260 + i * 12,
          ease: easeOutBack,
          update: (v) => {
            line.setAttribute('y2', (12 + len * Math.max(0, v)).toFixed(2))
            line.setAttribute('opacity', Math.min(1, Math.max(0, v * 1.4)).toFixed(2))
          },
        })
      }
    }

    // 8-blade aperture iris
    const bladeFills = []
    const bladeLines = []
    const gBlades = $('blades')
    const gBladeLines = $('bladeLines')
    if (gBlades && gBladeLines) {
      gBlades.innerHTML = ''
      gBladeLines.innerHTML = ''
      for (let k = 0; k < 8; k++) {
        const c = document.createElementNS(NS, 'circle')
        c.setAttribute('r', '52')
        c.setAttribute('fill', k % 2 ? '#142e63' : '#132a5c')
        gBlades.appendChild(c)
        bladeFills.push(c)

        const s = document.createElementNS(NS, 'circle')
        s.setAttribute('r', '52')
        s.setAttribute('fill', 'none')
        s.setAttribute('stroke', 'rgba(242,248,255,.13)')
        s.setAttribute('stroke-width', '1.2')
        gBladeLines.appendChild(s)
        bladeLines.push(s)
      }
    }

    function layoutBlades(o, twist) {
      const d = 30 + o * 76
      for (let k = 0; k < 8; k++) {
        if (!bladeFills[k] || !bladeLines[k]) continue
        const a = twist + (k * Math.PI) / 4
        const cx = (150 + Math.cos(a) * d).toFixed(2)
        const cy = (150 + Math.sin(a) * d).toFixed(2)
        bladeFills[k].setAttribute('cx', cx)
        bladeFills[k].setAttribute('cy', cy)
        bladeLines[k].setAttribute('cx', cx)
        bladeLines[k].setAttribute('cy', cy)
      }
    }

    // Radar ping
    function ping(strong) {
      const gPing = $('ping')
      if (!gPing) return
      const to = strong ? 175 : 150
      const o0 = strong ? 0.8 : 0.5
      const c = document.createElementNS(NS, 'circle')
      c.setAttribute('cx', '150')
      c.setAttribute('cy', '150')
      c.setAttribute('r', '40')
      c.setAttribute('fill', 'none')
      c.setAttribute('stroke', strong ? '#f2f8ff' : '#bcd4f4')
      c.setAttribute('stroke-width', strong ? '2' : '1.4')
      gPing.appendChild(c)

      tween({
        from: 40,
        to,
        dur: strong ? 1300 : 1100,
        ease: easeOutCubic,
        update: (v) => {
          c.setAttribute('r', v.toFixed(1))
          c.setAttribute('opacity', (o0 * (1 - (v - 40) / (to - 40))).toFixed(3))
        },
        done: () => c.remove(),
      })
    }

    // Pixel Eye
    const eye = { level: 0, px: 0, py: 0, tx: 0, ty: 0, dirty: true, blinking: false }
    const CELL = 7,
      COLS = 15,
      ROWS = 9,
      CXc = 7,
      CYc = 4

    function renderEye() {
      const eyePixels = $('eyePixels')
      if (!eyePixels) return
      let s = ''
      for (let y = 0; y < ROWS; y++) {
        if (eye.level === 3 && y !== CYc) continue
        if (eye.level === 2 && Math.abs(y - CYc) > 1) continue
        if (eye.level === 1 && Math.abs(y - CYc) > 3) continue
        const ty = (y - CYc) / 5
        const w = Math.round(7.2 * Math.sqrt(Math.max(0, 1 - ty * ty)))
        for (let x = 0; x < COLS; x++) {
          const dx = x - CXc,
            dy = y - CYc
          if (Math.abs(dx) > w) continue
          let fill
          if (eye.level === 3) {
            fill = '#16357e'
          } else {
            const ex = dx - eye.px,
              ey = dy - eye.py
            const r = Math.sqrt(ex * ex + ey * ey * 1.15)
            if (ex === -2 && ey === -2) fill = '#ffffff'
            else if (r < 1.7) fill = '#0b1c3f'
            else if (r < 3.4) fill = (x + y) & 1 ? '#3a6cc9' : '#4d7cd9'
            else if (Math.abs(dx) > w - 1) fill = '#d7e4f6'
            else fill = '#f2f8ff'
          }
          s += `<rect x="${150 + dx * CELL - 3.5}" y="${150 + dy * CELL - 3.5}" width="${CELL}" height="${CELL}" fill="${fill}"/>`
        }
      }
      eyePixels.innerHTML = s
    }

    function setEyeLevel(lv) {
      if (lv !== eye.level) {
        eye.level = lv
        eye.dirty = true
      }
    }

    function eyeBlink() {
      if (eye.blinking) return
      eye.blinking = true
      tween({
        from: 0,
        to: 1,
        dur: 420,
        ease: linear,
        update: (e) => {
          setEyeLevel([0, 1, 2, 3, 3, 2, 1, 0][Math.min(7, Math.floor(e * 8))])
        },
        done: () => {
          setEyeLevel(0)
          eye.blinking = false
        },
      })
    }

    // State machine
    const state = { mode: 'lens', trans: false, modeT: 0, oVal: 0, oBusy: false }

    function apertureTo(to, dur, ease, cb) {
      state.oBusy = true
      tween({
        from: state.oVal,
        to,
        dur,
        ease,
        update: (v) => (state.oVal = v),
        done: () => {
          state.oBusy = false
          cb && cb()
        },
      })
    }

    function transitionMode() {
      if (state.trans) return
      state.trans = true
      apertureTo(0, 300, easeInCubic, () => {
        state.mode = state.mode === 'lens' ? 'eye' : 'lens'
        state.modeT = now
        const glassEl = $('glass')
        const eyeGEl = $('eyeG')
        if (glassEl) glassEl.style.display = state.mode === 'lens' ? '' : 'none'
        if (eyeGEl) eyeGEl.style.display = state.mode === 'eye' ? '' : 'none'
        if (state.mode === 'eye') {
          eye.level = -1
          setEyeLevel(0)
          eye.px = eye.py = eye.tx = eye.ty = 0
          eye.dirty = true
        }
        setTimeout(() => {
          ping(true)
          apertureTo(0.8, 560, easeOutCubic, () => {
            state.trans = false
          })
        }, 150)
      })
    }

    const lensEl = $('lens')
    if (lensEl) {
      lensEl.addEventListener('click', transitionMode)
    }

    // Pointer parallax
    let mx = 0,
      my = 0,
      lastMouse = -9
    const handlePointerMove = (e) => {
      mx = (e.clientX / window.innerWidth) * 2 - 1
      my = (e.clientY / window.innerHeight) * 2 - 1
      lastMouse = now
      if (state.mode === 'eye' && !state.trans) {
        eye.tx = Math.max(-3, Math.min(3, Math.round(mx * 3)))
        eye.ty = Math.max(-2, Math.min(2, Math.round(my * 2)))
      }
    }
    window.addEventListener('pointermove', handlePointerMove)

    // Escape to skip
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        finishAndExit()
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    // Loading stages
    const STATUSES = [
      [0, 'INITIALIZING CORE'],
      [18, 'CALIBRATING OPTIC MODULE'],
      [38, 'LOADING SHADER CACHE'],
      [58, 'ALIGNING APERTURE'],
      [78, 'SYNCING TELEMETRY'],
      [94, 'FINALIZING PASS'],
    ]
    const MODULES = [
      'MODULE 01 — CORE BOOT',
      'MODULE 02 — OPTIC CALIBRATION',
      'MODULE 03 — SHADER CACHE',
      'MODULE 04 — APERTURE ALIGN',
      'MODULE 05 — TELEMETRY SYNC',
      'MODULE 06 — FINAL CHECK',
    ]
    let pctTarget = 0,
      pctShown = 0,
      ready = false,
      completed = false

    let now = 0,
      tPrev = 0
    let blinkTimer = 1.6,
      pingTimer = 1.2,
      progTimer = 0.4,
      pupilTimer = 0,
      lookTimer = 1.2
    const LOOKS = [
      [0, 0],
      [3, 0],
      [-2, 1],
      [2, -1],
      [-3, 0],
      [1, 1],
      [0, -1],
      [3, -1],
    ]

    function finishAndExit() {
      if (completed) return
      completed = true
      setFadingOut(true)
      setTimeout(() => {
        onComplete?.()
      }, 600)
    }

    function loop(ms) {
      animRef.current = requestAnimationFrame(loop)
      const t = ms / 1000
      const dt = Math.min(0.05, t - tPrev || 0.016)
      tPrev = t
      now = t
      stepTweens(ms)

      // Ring rotations
      const dashed = $('dashedRing')
      const dotted = $('dottedRing')
      const textR = $('textRing')
      if (dashed) dashed.setAttribute('transform', rot(t * 8))
      if (dotted) dotted.setAttribute('transform', rot(-t * 15))
      if (textR) textR.setAttribute('transform', rot(t * 3.2))

      // Aperture breathing
      if (!state.oBusy) {
        const base = state.mode === 'eye' ? 0.8 : 0.78
        const amp = state.mode === 'eye' ? 0.018 : 0.03
        state.oVal = base + Math.sin(t * 1.15) * amp
      }
      layoutBlades(state.oVal, t * 1.6 + (1 - state.oVal) * 46)

      // Glass glare parallax
      const glare = $('glare')
      if (glare) {
        glare.setAttribute('transform', `translate(${(mx * 5).toFixed(1)} ${(my * 5).toFixed(1)})`)
      }

      // Eye animation
      if (state.mode === 'eye') {
        pupilTimer -= dt
        if (pupilTimer <= 0) {
          pupilTimer = 0.15
          if (eye.px !== eye.tx) {
            eye.px += Math.sign(eye.tx - eye.px)
            eye.dirty = true
          }
          if (eye.py !== eye.ty) {
            eye.py += Math.sign(eye.ty - eye.py)
            eye.dirty = true
          }
        }
        lookTimer -= dt
        if (lookTimer <= 0) {
          lookTimer = 1.4 + Math.random() * 1.2
          if (now - lastMouse > 2.5) {
            const L = LOOKS[(Math.random() * LOOKS.length) | 0]
            eye.tx = L[0]
            eye.ty = L[1]
          }
        }
        blinkTimer -= dt
        if (blinkTimer <= 0) {
          blinkTimer = 1.4 + Math.random() * 1.1
          eyeBlink()
        }
        if (eye.dirty) {
          eye.dirty = false
          renderEye()
        }
      } else {
        blinkTimer = 1.2
      }

      // Auto toggle mode
      if (!state.trans && now - state.modeT > 5.4) {
        transitionMode()
      }

      // Ping timer
      pingTimer -= dt
      if (pingTimer <= 0) {
        pingTimer = 2.7
        ping(false)
      }

      // Progress increment
      progTimer -= dt
      if (progTimer <= 0) {
        progTimer = 0.2 + Math.random() * 0.3
        if (pctTarget < 100) {
          pctTarget = Math.min(100, pctTarget + 4 + Math.random() * 9)
        }
      }

      pctShown += (pctTarget - pctShown) * Math.min(1, dt * 5)
      const pctEl = $('pct')
      const fillEl = $('fill')
      if (pctEl) pctEl.textContent = Math.round(pctShown) + '%'
      if (fillEl) fillEl.style.width = pctShown.toFixed(1) + '%'

      if (pctTarget >= 100 && !ready) {
        ready = true
        ping(true)
        const barEl = $('bar')
        if (barEl) barEl.classList.add(styles.barReady)
        const statusEl = $('status')
        if (statusEl) statusEl.textContent = 'READY — ENTERING DASHBOARD'

        // Smoothly exit after 900ms
        setTimeout(() => {
          finishAndExit()
        }, 900)
      }

      if (!ready) {
        let st = 'INITIALIZING CORE'
        for (const [th, txt] of STATUSES) {
          if (pctShown >= th) st = txt
        }
        const statusEl = $('status')
        if (statusEl) statusEl.textContent = st
      }

      const modEl = $('module')
      if (modEl) {
        modEl.textContent = MODULES[Math.min(5, Math.floor((pctShown / 100) * 6))]
      }
      const dotsEl = $('dots')
      if (dotsEl) {
        dotsEl.textContent = '·'.repeat(1 + (Math.floor(t / 0.4) % 3))
      }
    }

    animRef.current = requestAnimationFrame(loop)

    // Intro timings
    setTimeout(() => apertureTo(0.8, 1000, easeOutCubic), 500)
    setTimeout(() => ping(true), 1600)

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('keydown', handleKeyDown)
      tweens.clear()
    }
  }, [onComplete])

  const wordmark = 'NetraSarthi'.split('').map((ch, i) => (
    <span
      key={i}
      className={i >= 5 ? styles.dimLetter : ''}
      style={{ animationDelay: `${120 + i * 45}ms` }}
    >
      {ch}
    </span>
  ))

  const captionText = 'NETRASARTHI — PROTOTYPE DEMONSTRATION — LOADING · '

  return (
    <div
      ref={containerRef}
      className={`${styles.loaderOverlay} ${fadingOut ? styles.fadeOut : ''}`}
    >
      <button
        onClick={() => {
          setFadingOut(true)
          setTimeout(() => onComplete?.(), 500)
        }}
        className={styles.skipBtn}
        title="Skip loading screen [ESC]"
      >
        SKIP →
      </button>

      <div className={`${styles.blob} ${styles.b1}`} />
      <div className={`${styles.blob} ${styles.b2}`} />
      <div className={`${styles.blob} ${styles.b3}`} />

      <div className={styles.stage}>
        <div className={styles.mark} id="mark">
          {wordmark}
        </div>
        <div className={styles.sub2}>PROTOTYPE DEMONSTRATION</div>

        <div className={styles.lensWrap}>
          <svg id="lens" className={styles.lensSvg} viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="glassGrad" cx="42%" cy="38%" r="78%">
                <stop offset="0%" stopColor="#dfe9f8" />
                <stop offset="45%" stopColor="#8fb0e0" />
                <stop offset="100%" stopColor="#33589e" />
              </radialGradient>
              <clipPath id="housingClip">
                <circle cx="150" cy="150" r="80" />
              </clipPath>
              <path id="tcirc" d="M 150 54 A 96 96 0 1 1 149.99 54" />
            </defs>

            {/* Outer bezel */}
            <circle cx="150" cy="150" r="138" fill="none" stroke="#10254e" strokeWidth="3" opacity=".85" />
            <circle cx="150" cy="150" r="131" fill="none" stroke="rgba(255,255,255,.28)" strokeWidth="1" />

            {/* Focus ticks */}
            <g id="ticks" />

            {/* Counter-rotating rings */}
            <g id="dashedRing">
              <circle
                cx="150"
                cy="150"
                r="112"
                fill="none"
                stroke="#f2f8ff"
                strokeOpacity=".5"
                strokeWidth="1.5"
                strokeDasharray="2 7"
              />
            </g>
            <g id="dottedRing">
              <circle
                cx="150"
                cy="150"
                r="104"
                fill="none"
                stroke="#2559c4"
                strokeOpacity=".85"
                strokeWidth="2.4"
                strokeDasharray="0.1 9"
                strokeLinecap="round"
              />
            </g>
            <g id="textRing">
              <text className={styles.tring}>
                <textPath id="tpath" href="#tcirc" textLength="600" lengthAdjust="spacingAndGlyphs">
                  {captionText + captionText}
                </textPath>
              </text>
            </g>

            {/* Barrel housing */}
            <circle cx="150" cy="150" r="84" fill="#0e2044" />
            <circle cx="150" cy="150" r="84" fill="none" stroke="rgba(255,255,255,.22)" strokeWidth="1.4" />

            {/* Content inside barrel */}
            <g clipPath="url(#housingClip)">
              <g id="glass">
                <circle cx="150" cy="150" r="66" fill="url(#glassGrad)" />
                <circle cx="150" cy="150" r="66" fill="none" stroke="rgba(255,255,255,.25)" strokeWidth="1" />
                <circle cx="150" cy="150" r="44" fill="none" stroke="rgba(255,255,255,.14)" />
                <circle cx="150" cy="150" r="26" fill="none" stroke="rgba(255,255,255,.10)" />
                <g id="glare">
                  <ellipse
                    cx="132"
                    cy="128"
                    rx="17"
                    ry="8"
                    fill="#ffffff"
                    opacity=".4"
                    transform="rotate(-32 132 128)"
                  />
                  <circle cx="164" cy="166" r="4" fill="#ffffff" opacity=".25" />
                </g>
              </g>
              <g id="eyeG" style={{ display: 'none' }}>
                <g id="eyePixels" shapeRendering="crispEdges" />
              </g>
              <g id="blades" />
              <g id="bladeLines" />
            </g>

            {/* Inner rim */}
            <circle cx="150" cy="150" r="80" fill="none" stroke="rgba(255,255,255,.35)" strokeWidth="2" />

            {/* Radar pings */}
            <g id="ping" />
          </svg>
        </div>

        {/* Loading card */}
        <div className={`${styles.load} ${styles.glass}`}>
          <div className={styles.row}>
            <span className={styles.st}>
              <span id="status">INITIALIZING CORE</span>
              <span id="dots" className={styles.dots} />
            </span>
            <span id="pct">0%</span>
          </div>
          <div className={styles.bar} id="bar">
            <i id="fill" className={styles.barFill} />
          </div>
          <div className={styles.module} id="module">
            MODULE 01 — CORE BOOT
          </div>
        </div>
        <div className={styles.hint}>CLICK LENS — SWAP OPTIC / EYE</div>
      </div>

      <div className={`${styles.corner} ${styles.cTl}`} />
      <div className={`${styles.corner} ${styles.cTr}`} />
      <div className={`${styles.corner} ${styles.cBl}`} />
      <div className={`${styles.corner} ${styles.cBr}`} />
      <div className={styles.foot}>NETRASARTHI — PROTOTYPE DEMONSTRATION — LOADER 01</div>
    </div>
  )
}
