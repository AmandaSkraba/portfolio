import {
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  Output,
  ViewChild
} from '@angular/core';

import gsap from 'gsap';
import { FxService } from '../../core/fx.service';

@Component({
  selector: 'app-memoji',
  standalone: true,
  templateUrl: './memoji.component.html',
  styleUrl: './memoji.component.scss'
})
export class MemojiComponent {
  @HostBinding('style.left.%')
  get positionX() {
    return this.x;
  }

  @HostBinding('style.top.%')
  get positionY() {
    return this.y;
  }

  @ViewChild('memoji') memoji!: ElementRef<HTMLImageElement>;
  @Input() magnetic = false;
  @Input() depth = 1;
  @Input() x = 50;
  @Input() y = 50;
  @Input() size = 200;
  @Input() clicked = true;
  @Input() img?: string;
  @Input() rotation? = 0;

  expressions = Array.from(
    { length: 20 },
    (_, i) => `memoji-${String(i + 1).padStart(2, '0')}`
  );

  currentExpression = this.getRandomExpression();

  private getRandomExpression(): string {
    return this.expressions[
      Math.floor(Math.random() * this.expressions.length)
    ];
  }

  get imagePath(): string {
    return `/assets/memoji/${this.img ?? this.currentExpression }.png`;
  }

  private inner = { i: 40 };
  private clicks = 0;
  private off = () => { };
  private float?: gsap.core.Tween;
  private io?: IntersectionObserver;

  constructor(private el: ElementRef<HTMLElement>, private fx: FxService) { }

  changeExpression(): void {
    const available = this.expressions.filter(
      expression => expression !== this.currentExpression
    );

    const nextExpression =
      available[Math.floor(Math.random() * available.length)];

    // Troca a imagem imediatamente
    this.currentExpression = nextExpression;

    // Reinicia a animação
    const element = this.memoji.nativeElement;

    gsap.killTweensOf(element);

    gsap.fromTo(
      element,
      {
        scale: 0.7,
        rotation: -12,
        opacity: 0.5
      },
      {
        scale: 1,
        rotation: 0,
        opacity: 1,
        duration: 0.35,
        ease: 'back.out(2)',
        overwrite: true
      }
    );
  }

}