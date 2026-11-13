
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild
} from '@angular/core';

import { gsap } from 'gsap';
import { Observer } from 'gsap/Observer';

interface HorizontalLoopConfig {
  repeat?: number;
  paused?: boolean;
  reversed?: boolean;
  speed?: number;
  paddingRight?: number;
  snap?: number | false;
}

interface HorizontalLoopTimeline extends gsap.core.Timeline {
  next: (vars?: gsap.TweenVars) => gsap.core.Tween;
  previous: (vars?: gsap.TweenVars) => gsap.core.Tween;
  current: () => number;
  toIndex: (index: number, vars?: gsap.TweenVars) => gsap.core.Tween;
  times: number[];
}

@Component({
  selector: 'app-infinite-marquee',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './infinite-marquee.component.html',
  styleUrl: './infinite-marquee.component.scss'
})
export class InfiniteMarqueeComponent implements AfterViewInit, OnDestroy {

  @ViewChild('marquee', { static: true })
  marquee!: ElementRef<HTMLElement>;

  private loop!: HorizontalLoopTimeline;
  private observer?: Observer;
  private resizeObserver?: ResizeObserver;

  marqueeItems = [
    { text: 'DESENVOLVEDORA FULLSTACK' },
    { text: 'MÃE' },
    // { text: 'CRIATIVA' },
    { text: 'CURIOSA' },
    { text: 'ORGANIZADA' }
  ];

  // Duplica a sequência automaticamente
  get marqueeLoop() {
    return [...this.marqueeItems, ...this.marqueeItems];
  }

  constructor() {
    gsap.registerPlugin(Observer);
  }

  ngAfterViewInit(): void {
    requestAnimationFrame(() => {
      this.initMarquee();
    });
  }

  private initMarquee(): void {
    const rail = this.marquee.nativeElement.querySelector('.rail');

    if (!rail) return;

    const items = gsap.utils.toArray<HTMLElement>(
      rail.children
    );

    if (!items.length) return;

    this.loop = this.horizontalLoop(items, {
      repeat: -1,
      paddingRight: 30,
      speed: 1
    });

    this.initObserver();

    // Recalcula as posições caso a largura mude
    this.resizeObserver = new ResizeObserver(() => {
      this.loop?.kill();

      this.loop = this.horizontalLoop(items, {
        repeat: -1,
        paddingRight: 30,
        speed: 1
      });
    });

    this.resizeObserver.observe(rail);
  }

  private initObserver(): void {
    this.observer = Observer.create({
      target: window,
      type: 'wheel,touch',
      onChangeY: (self: Observer) => {

        if (!this.loop) return;

        const factor = self.deltaY < 0 ? -2.5 : 2.5;

        gsap.timeline({
          defaults: {
            ease: 'none'
          }
        })
          .to(this.loop, {
            timeScale: factor * 2.5,
            duration: 0.2,
            overwrite: true
          })
          .to(this.loop, {
            timeScale: factor / 2.5,
            duration: 1
          }, '+=0.3');
      }
    });
  }

  private horizontalLoop(
    elements: HTMLElement[],
    config: HorizontalLoopConfig = {}
  ): HorizontalLoopTimeline {

    const items = gsap.utils.toArray<HTMLElement>(elements);

    const tl = gsap.timeline({
      repeat: config.repeat,
      paused: config.paused,
      defaults: { ease: 'none' },
      onReverseComplete: () => {
        tl.totalTime(tl.rawTime() + tl.duration() * 100);
      }
    }) as HorizontalLoopTimeline;

    const length = items.length;

    if (!length) return tl;

    const startX = items[0].offsetLeft;

    const times: number[] = [];
    const widths: number[] = [];
    const xPercents: number[] = [];

    let curIndex = 0;

    const pixelsPerSecond = (config.speed || 1) * 100;

    const snap = config.snap === false
      ? (value: number) => value
      : gsap.utils.snap(config.snap || 1);

    gsap.set(items, {
      xPercent: (i: number, el: HTMLElement) => {
        const width = widths[i] = parseFloat(
          gsap.getProperty(el, 'width', 'px') as string
        );

        xPercents[i] = snap(
          parseFloat(gsap.getProperty(el, 'x', 'px') as string) /
          width * 100 +
          (gsap.getProperty(el, 'xPercent') as number)
        );

        return xPercents[i];
      }
    });

    gsap.set(items, { x: 0 });

    const lastItem = items[length - 1];

    const totalWidth =
      lastItem.offsetLeft +
      xPercents[length - 1] / 100 * widths[length - 1] -
      startX +
      lastItem.offsetWidth *
      (gsap.getProperty(lastItem, 'scaleX') as number) +
      (config.paddingRight || 0);

    for (let i = 0; i < length; i++) {
      const item = items[i];

      const curX = xPercents[i] / 100 * widths[i];

      const distanceToStart = item.offsetLeft + curX - startX;

      const distanceToLoop =
        distanceToStart +
        widths[i] *
        (gsap.getProperty(item, 'scaleX') as number);

      tl.to(item, {
        xPercent: snap(
          (curX - distanceToLoop) / widths[i] * 100
        ),
        duration: distanceToLoop / pixelsPerSecond
      }, 0)

        .fromTo(item, {
          xPercent: snap(
            (curX - distanceToLoop + totalWidth) / widths[i] * 100
          )
        }, {
          xPercent: xPercents[i],
          duration:
            (curX - distanceToLoop + totalWidth - curX) /
            pixelsPerSecond,
          immediateRender: false
        }, distanceToLoop / pixelsPerSecond)

        .add(
          `label${i}`,
          distanceToStart / pixelsPerSecond
        );

      times[i] = distanceToStart / pixelsPerSecond;
    }

    function toIndex(
      index: number,
      vars: gsap.TweenVars = {}
    ): gsap.core.Tween {

      if (Math.abs(index - curIndex) > length / 2) {
        index += index > curIndex ? -length : length;
      }

      const newIndex = gsap.utils.wrap(0, length, index);

      let time = times[newIndex];

      if ((time > tl.time()) !== (index > curIndex)) {
        vars.modifiers = {
          time: gsap.utils.wrap(0, tl.duration())
        };

        time += tl.duration() * (index > curIndex ? 1 : -1);
      }

      curIndex = newIndex;
      vars.overwrite = true;

      return tl.tweenTo(time, vars);
    }

    tl.next = (vars) => toIndex(curIndex + 1, vars);
    tl.previous = (vars) => toIndex(curIndex - 1, vars);
    tl.current = () => curIndex;
    tl.toIndex = (index, vars) => toIndex(index, vars);
    tl.times = times;

    tl.progress(1, true).progress(0, true);

    if (config.reversed) {
      tl.vars.onReverseComplete?.();
      tl.reverse();
    }

    return tl;
  }

  ngOnDestroy(): void {
    this.observer?.kill();
    this.resizeObserver?.disconnect();

    this.loop?.kill();

    gsap.killTweensOf(this.loop);
  }
}
