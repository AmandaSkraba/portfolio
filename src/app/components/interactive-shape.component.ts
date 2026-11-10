import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { gsap } from 'gsap';
import { FxService, PALETTE } from '../core/fx.service';

@Component({
  selector: 'app-shape', standalone: true,
  host: {
    class: 'shape', role: 'button', tabindex: '0', 'aria-label': 'Forma interativa: clique para explodir',
    '[style.left.%]': 'x', '[style.top.%]': 'y', '(click)': 'pop()', '(keydown.enter)': 'pop()', '(keydown.space)': 'pop(); $event.preventDefault()'
  },
  template: `<svg [attr.width]="size" [attr.height]="size" viewBox="-50 -50 100 100" style="overflow:visible;display:block">
    <polygon #poly [attr.fill]="kind==='ring' ? 'none' : color" [attr.stroke]="color" stroke-width="5" stroke-linejoin="round"/></svg>`,
})
export class InteractiveShapeComponent implements AfterViewInit, OnDestroy {
  @Input() x = 50;
  @Input() y = 50;
  @Input() size = 80;
  @Input() color = PALETTE[2];
  @Input() kind: 'morph' | 'ring' | 'star' = 'morph';
  @Input() clickKind: 'morph' | 'ring' | 'star' = 'ring';
  @Input() magnetic = false;
  @Input() depth = 1;
  @ViewChild('poly', { static: true }) poly!: ElementRef<SVGPolygonElement>;
  @Input() originalKind: 'morph' | 'ring' | 'star' = 'morph';

  private inner = { i: 40 };
  private clicks = 0;
  private off = () => { };
  private float?: gsap.core.Tween;
  private io?: IntersectionObserver;

  constructor(private el: ElementRef<HTMLElement>, private fx: FxService) { }

  private draw() {
    let p = '';

    if (this.kind === 'star') {
      for (let k = 0; k < 8; k++) {
        const a = k / 8 * Math.PI * 2 - Math.PI / 2;
        const r = k % 2 ? 12 : 50;

        p += `${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)} `;
      }
    } else {
      // Formas originais
      for (let k = 0; k < 20; k++) {
        const a = k / 20 * Math.PI * 2 - Math.PI / 2;
        const r = k % 2 ? this.inner.i : 40;

        p += `${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)} `;
      }
    }

    this.poly.nativeElement.setAttribute('points', p);
  }

  ngAfterViewInit() {
    this.draw();
    if (this.fx.reduced) return;
    const host = this.el.nativeElement, svg = host.firstElementChild!;
    this.float = gsap.to(svg, { y: 14 + Math.random() * 10, rotation: (Math.random() - .5) * 40, duration: 3 + Math.random() * 2, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    this.io = new IntersectionObserver(([e]) => this.float?.paused(!e.isIntersecting)); this.io.observe(host);
    if (this.magnetic) this.off = this.fx.magnet(host, 200, .45);
    else {
      const o = { duration: 1.2, ease: 'power3.out' }, qx = gsap.quickTo(host, 'x', o), qy = gsap.quickTo(host, 'y', o);
      const mv = (e: PointerEvent) => { qx((e.clientX / innerWidth - .5) * -40 * this.depth); qy((e.clientY / innerHeight - .5) * -40 * this.depth); };
      const out = () => { qx(0); qy(0); };
      addEventListener('pointermove', mv, { passive: true }); document.documentElement.addEventListener('mouseleave', out);
      this.off = () => { removeEventListener('pointermove', mv); document.documentElement.removeEventListener('mouseleave', out); gsap.killTweensOf(host); };
    }
  }

  pop() {
    const svg = this.el.nativeElement.firstElementChild!;

    this.fx.burst(
      this.el.nativeElement,
      [this.color, ...PALETTE.filter(c => c !== this.color).slice(0, 2)]
    );

    this.clicks++;

    this.color = PALETTE[
      (PALETTE.indexOf(this.color) + 1 + this.clicks) % PALETTE.length
    ];

    if (this.fx.reduced) return;

    gsap.timeline()
      .to(svg, { scale: .55, duration: .12 })
      .to(svg, { scale: 1, duration: 1, ease: 'elastic.out(1,.35)' });

    const nextKind = this.kind === this.clickKind
      ? this.originalKind
      : this.clickKind;

    this.kind = nextKind;

    gsap.to(this.inner, {
      i: nextKind === 'morph' ? 40 : 16,
      duration: .9,
      ease: 'elastic.out(1,.5)',
      onUpdate: () => this.draw()
    });
  }

  ngOnDestroy() {
    this.off();
    this.io?.disconnect();
    this.float?.kill();
    gsap.killTweensOf([this.el.nativeElement.firstElementChild, this.inner]);
  }
}
