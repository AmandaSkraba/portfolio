import { AfterViewInit, Directive, ElementRef, Injectable, OnDestroy, inject } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import confetti from 'canvas-confetti';
gsap.registerPlugin(ScrollTrigger);
export const PALETTE = ['#cfbeac', '#936e67', '#b6846b', '#464c3f', '#8c9487'];

@Injectable({ providedIn: 'root' })
export class FxService {
  readonly reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


  text(el: HTMLElement, duration = 1, delay = 1.5) {
  gsap.registerPlugin(SplitText);

  document.fonts.ready.then(() => {

    const split = SplitText.create(el, {
      type: 'words',
      wordsClass: 'word',
      ignore: 'sup'
    });

    console.log('Palavras encontradas:', split.words);

    gsap.set(split.words, {
      opacity: 0,
      y: -100
    });

    gsap.to(split.words, {
      opacity: 1,
      y: 0,
      duration,
      delay,
      stagger: 0.1,
      ease: 'back.out(1.7)',
      onComplete: () => {
        console.log('Animação concluída!');
      }
    });

  });
}

  /** Confetes saindo do centro exato do elemento. */
  burst(el: Element, colors = PALETTE, count = 45) {
    const r = el.getBoundingClientRect();
    confetti({
      particleCount: count, spread: 360, startVelocity: 24, gravity: 1.2, decay: .9, ticks: 140, scalar: .9,
      colors, shapes: ['square', 'circle'], disableForReducedMotion: true,
      origin: { x: (r.left + r.width / 2) / innerWidth, y: (r.top + r.height / 2) / innerHeight }
    });
  }

  /** Efeito magnético com retorno elástico. Devolve função de limpeza. */
  magnet(el: HTMLElement, radius = 140, pull = .35): () => void {
    if (this.reduced) return () => { };
    const o = { duration: .9, ease: 'elastic.out(1,.4)' };
    const qx = gsap.quickTo(el, 'x', o), qy = gsap.quickTo(el, 'y', o);
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2 - (gsap.getProperty(el, 'x') as number));
      const dy = e.clientY - (r.top + r.height / 2 - (gsap.getProperty(el, 'y') as number));
      if (Math.hypot(dx, dy) < radius) { qx(dx * pull); qy(dy * pull); } else { qx(0); qy(0); }
    };
    addEventListener('pointermove', move, { passive: true });
    return () => { removeEventListener('pointermove', move); gsap.killTweensOf(el); };
  }

  scramble(el: HTMLElement) {
    if (this.reduced) return;
    const t = el.dataset['t'] ?? (el.dataset['t'] = el.textContent ?? '');
    const o = { p: 0 };
    gsap.to(o, {
      p: 1, duration: .6, ease: 'none', overwrite: true,
      onUpdate: () => { const n = Math.floor(o.p * t.length); el.textContent = t.slice(0, n) + [...t.slice(n)].map(c => c === ' ' ? c : '#*+=/<>'[Math.random() * 7 | 0]).join(''); },
      onComplete: () => { el.textContent = t; }
    });
  }

  /** Revela .reveal ao rolar e aplica parallax em [data-speed]. */
  reveal(host: HTMLElement): gsap.Context | null {
    if (this.reduced) return null;
    return gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.reveal').forEach(el =>
        gsap.from(el, { y: 50, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } }));
      gsap.utils.toArray<HTMLElement>('[data-speed]').forEach(el =>
        gsap.to(el, { y: -(+el.dataset['speed']!) * 120, ease: 'none', scrollTrigger: { trigger: host, scrub: true, start: 'top bottom', end: 'bottom top' } }));
    }, host);
  }
}

@Directive({ selector: '[appReveal]', standalone: true })
export abstract class Revealing implements AfterViewInit, OnDestroy {
  protected h = inject<ElementRef<HTMLElement>>(ElementRef);
  protected fx = inject(FxService);
  private ctx: gsap.Context | null = null;
  ngAfterViewInit() { this.ctx = this.fx.reveal(this.h.nativeElement); }
  ngOnDestroy() { this.ctx?.revert(); }
}

@Directive({ selector: '[appMagnetic]', standalone: true })
export class MagneticDirective implements AfterViewInit, OnDestroy {
  private el = inject<ElementRef<HTMLElement>>(ElementRef); private fx = inject(FxService); private off = () => { };
  ngAfterViewInit() { this.off = this.fx.magnet(this.el.nativeElement, 120, .3); }
  ngOnDestroy() { this.off(); }
}

@Directive({ selector: '[appScramble]', standalone: true, host: { '(pointerenter)': 'go()', '(focus)': 'go()' } })
export class ScrambleDirective {
  private el = inject<ElementRef<HTMLElement>>(ElementRef); private fx = inject(FxService);
  go() { this.fx.scramble(this.el.nativeElement); }
}

@Directive({ selector: '[appText]', standalone: true })
export class TextDirective {
  private el = inject<ElementRef<HTMLElement>>(ElementRef);
  private fx = inject(FxService);

  ngAfterViewInit() {
    this.fx.text(this.el.nativeElement);
  }
}