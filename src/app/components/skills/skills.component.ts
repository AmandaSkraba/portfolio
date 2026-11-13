import {
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  ViewChild,
  afterNextRender,
  inject,
} from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface Skill {
  name: string;
  filled: boolean; // true = letra preenchida, false = só contorno
  color: string; // cor da paleta do site
}

interface Ball {
  size: number; // px
  color: string;
  top?: string;
  left?: string;
  right?: string;
  speed: number; // quanto a bolinha anda no scroll (px)
}

@Component({
  selector: 'app-skills',
  standalone: true,
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss',
})
export class SkillsComponent implements OnDestroy {
  @ViewChild('section', { static: true }) section!: ElementRef<HTMLElement>;

  private zone = inject(NgZone);
  private ctx?: gsap.Context;

  skills: Skill[] = [
    { name: 'angular', filled: true, color: '#B5836A' },
    { name: '.net', filled: false, color: '#494E41' },
    { name: 'typescript', filled: true, color: '#8B9386' },
    { name: 'sql', filled: false, color: '#92716A' }
    // { name: 'git', filled: true, color: '#B5836A' },
  ];

  // quantas vezes a palavra se repete na faixa (precisa ser maior que a tela)
  repeat = Array.from({ length: 8 });

  constructor() {
    afterNextRender(() => {
      this.zone.runOutsideAngular(() => this.init());
    });
  }

  private init(): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const section = this.section.nativeElement;

    this.ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.row').forEach((row, i) => {
        const track = row.querySelector('.track');
        const toLeft = i % 2 === 0; // alterna a direção
        const shift = () => window.innerWidth * 0.35;

        gsap.fromTo(
          track,
          { x: () => (toLeft ? 0 : -shift()) },
          {
            x: () => (toLeft ? -shift() : 0),
            ease: 'none',
            scrollTrigger: {
              trigger: row,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );
      });

      
      gsap.from('.label', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 80%' },
      });
    }, section);

    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}