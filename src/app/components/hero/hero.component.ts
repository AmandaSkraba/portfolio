import { AfterViewInit, Component, ElementRef, OnDestroy } from '@angular/core';
import { gsap } from 'gsap';
import { FxService, MagneticDirective, PALETTE, ScrambleDirective, TextDirective } from '../../core/fx.service';
import { PROFILE } from '../../core/data';
import { InteractiveShapeComponent } from '../interactive-shape.component';
import { ThreeSceneComponent } from '../three-scene.component';
import { MemojiComponent } from '../memoji/memoji.component';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [InteractiveShapeComponent, ThreeSceneComponent, MagneticDirective, ScrambleDirective, TextDirective, MemojiComponent],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent implements AfterViewInit, OnDestroy {
  p = PROFILE; pal = PALETTE; chars = [...PROFILE.name]; private ctx?: gsap.Context;
  shapes = [
    { x: 6, y: 20, size: 92, kind: 'morph' as const, clickKind: 'ring' as const, c: 2, m: false, d: 1 },
    { x: 74, y: 10, size: 64, kind: 'ring' as const, clickKind: 'morph' as const, c: 1, m: false, d: 2 },
    { x: 86, y: 64, size: 112, kind: 'morph' as const, clickKind: 'star' as const, c: 4, m: false, d: 1.5 },
    { x: 44, y: 9, size: 34, kind: 'star' as const, clickKind: 'ring' as const, c: 3, m: false, d: 3 },
    { x: 22, y: 74, size: 44, kind: 'ring' as const, clickKind: 'star' as const, c: 1, m: false, d: 2.5 },
    { x: 93, y: 33, size: 26, kind: 'star' as const, clickKind: 'morph' as const, c: 2, m: false, d: 3 },
  ];

  memojis = [
    { x: 26, y: 25, size: 150},
    { x: 80, y: 35, size: 150 },
    { x: 72, y: 82, size: 150 },
    { x: 15, y: 80, size: 150 }
  ];

  constructor(private h: ElementRef<HTMLElement>, private fx: FxService) { }


  ngAfterViewInit() {
    if (this.fx.reduced) return;
    this.ctx = gsap.context(() => {
      gsap.from('.ch', { yPercent: 120, rotate: 6, duration: 1.1, stagger: .05, ease: 'power4.out' });
      gsap.from('.fade', { y: 30, opacity: 0, duration: 1, stagger: .15, delay: .5, ease: 'power3.out' });
      gsap.from('app-shape', { scale: 0, duration: 1.2, stagger: .1, delay: .3, ease: 'elastic.out(1,.5)' });
    }, this.h.nativeElement);
  }
  ngOnDestroy() { this.ctx?.revert(); }
}
