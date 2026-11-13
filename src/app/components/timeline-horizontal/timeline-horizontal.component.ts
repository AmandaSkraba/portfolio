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

interface Job {
  year: string;
  role: string;
  cargo: string;
  company: string;
  stack: string;
  color: string; // cor do painel (usa as cores do site)
}

@Component({
  selector: 'app-timeline-horizontal',
  standalone: true,
  templateUrl: './timeline-horizontal.component.html',
  styleUrl: './timeline-horizontal.component.scss',
})
export class TimelineHorizontalComponent implements OnDestroy {
  @ViewChild('section', { static: true }) section!: ElementRef<HTMLElement>;
  @ViewChild('track', { static: true }) track!: ElementRef<HTMLElement>;

  private zone = inject(NgZone);
  private ctx?: gsap.Context;

  jobs: Job[] = [
    { year: '2020', role: 'APRENDIZ', cargo: 'Dev Front-End', company: 'UNC Solutions', stack: 'HTML, CSS, JavaScript e JQuery', color: '#b98873' },
    { year: '2024', role: 'JÚNIOR', cargo: 'Dev FullStack',company: 'Sisand', stack: 'Angular, TypeScript e .NET', color: '#8B9386' },
    { year: '2025', role: 'JÚNIOR', cargo: 'Dev FullStack',company: 'UNC Solutions', stack: 'Angular, TypeScript, .NET e SQL', color: '#92716A' },
  ];

  constructor() {
    afterNextRender(() => {
      this.zone.runOutsideAngular(() => this.init());
    });
  }

  private init(): void {
    gsap.registerPlugin(ScrollTrigger);

    const section = this.section.nativeElement;
    const track = this.track.nativeElement;
    const distance = () => track.scrollWidth - window.innerWidth;
    // rolagem extra com o último painel já parado, antes de a página voltar a descer
    const hold = () => window.innerHeight * 0.6;

    // gsap.context limita os seletores ao componente e facilita a limpeza
    this.ctx = gsap.context(() => {
      // 1) o movimento principal: a faixa anda para a esquerda enquanto a seção fica fixa
      //    O pin dura distance + hold; a faixa só anda durante a distance.
      //    Assim, no fim, a seção fica parada um pouco antes de liberar a página.
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        pin: true,
        end: () => '+=' + (distance() + hold()),
        invalidateOnRefresh: true,
      });

      const scroll = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          scrub: 1,
          end: () => '+=' + distance(),
          invalidateOnRefresh: true, // recalcula no resize
        },
      });

      // 2) barra de progresso
      gsap.to('.bar-fill', {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => '+=' + distance(),
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      // 3) animações de cada painel, ligadas ao movimento horizontal
      gsap.utils.toArray<HTMLElement>('.panel:not(.intro)').forEach((panel) => {
        gsap.from(panel.querySelectorAll('.txt > *'), {
          y: 60,
          opacity: 0,
          stagger: 0.12,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: panel,
            containerAnimation: scroll, // <- a chave do scroll horizontal
            start: 'left 70%',
            toggleActions: 'play none none reverse',
          },
        });

        gsap.fromTo(
          panel.querySelector('.year'),
          { x: () => -window.innerWidth * 0.12 },
          {
            x: () => window.innerWidth * 0.12,
            ease: 'none',
            scrollTrigger: {
              trigger: panel,
              containerAnimation: scroll,
              start: 'left right',
              end: 'right left',
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );
      });
      // 4) durante o hold, o último ano termina o movimento: desliza para a esquerda
      const years = gsap.utils.toArray<HTMLElement>('.panel:not(.intro) .year');
      gsap.fromTo(
        years[years.length - 1],
        { x: 0 },
        {
          x: () => -window.innerWidth * 0.12,
          ease: 'none',
          immediateRender: false,
          scrollTrigger: {
            trigger: section,
            start: () => 'top+=' + distance() + ' top',
            end: () => '+=' + hold(),
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );
    }, section);

    // recalcula depois que as fontes carregam (muda a largura do conteúdo)
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  }

  ngOnDestroy(): void {
    this.ctx?.revert(); // remove animações e ScrollTriggers ao sair da rota
  }
}