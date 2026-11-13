import {
  Component,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewChild
} from '@angular/core';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-timeline',
  standalone: true,
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss'
})
export class TimelineComponent implements AfterViewInit, OnDestroy {

  @ViewChild('section') section!: ElementRef<HTMLElement>;
  @ViewChild('viewport') viewport!: ElementRef<HTMLElement>;
  @ViewChild('track') track!: ElementRef<HTMLElement>;

  private ctx?: gsap.Context;

  experiences = [
    {
      year: '2020',
      category: 'O COMEÇO',
      title: 'Primeiros códigos',
      description:
        'Início da minha trajetória profissional no desenvolvimento Front-End, construindo interfaces e aprendendo na prática.',
      technologies: ['HTML', 'CSS', 'JavaScript']
    },
    {
      year: '2022',
      category: 'EVOLUÇÃO',
      title: 'Novos desafios',
      description:
        'Ampliação da experiência com desenvolvimento web, interfaces e evolução de aplicações.',
      technologies: ['Angular', 'TypeScript']
    },
    {
      year: '2024',
      category: 'FULL STACK',
      title: 'Uma nova dimensão',
      description:
        'Atuação no desenvolvimento Full Stack, trabalhando com aplicações, APIs e regras de negócio.',
      technologies: ['C#', '.NET', 'Angular', 'MySQL']
    },
    {
      year: '2025',
      category: 'MATURIDADE',
      title: 'Além do código',
      description:
        'Mais autonomia, documentação técnica, colaboração e participação na evolução de sistemas.',
      technologies: ['.NET', 'Angular', 'APIs REST']
    },
    {
      year: '2026',
      category: 'NOVOS HORIZONTES',
      title: 'Explorando possibilidades',
      description:
        'Aprofundamento em Inteligência Artificial e exploração de novas experiências digitais.',
      technologies: ['IA', 'GSAP', 'Three.js']
    }
  ];

  ngAfterViewInit() {
    this.createTimeline();
  }


  private createTimeline(): void {
    const section = this.section.nativeElement;
    const viewport = this.viewport.nativeElement;
    const track = this.track.nativeElement;

    this.ctx = gsap.context(() => {

      const getDistance = () =>
        Math.max(0, track.scrollWidth - viewport.clientWidth);

      gsap.to(track, {
        x: () => -getDistance(),

        ease: 'none',

        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${getDistance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1
        }
      });

    }, section);

    ScrollTrigger.refresh();
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}