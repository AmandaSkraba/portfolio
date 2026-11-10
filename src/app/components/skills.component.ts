import { Component } from '@angular/core';
import { gsap } from 'gsap';
import { Revealing } from '../core/fx.service';
import { SKILLS } from '../core/data';

@Component({ selector: 'app-skills', standalone: true, template: `
<section class="sec skills" id="skills">
  <h2 class="reveal big">Ferramentas do <em>ofício</em></h2>
  <ul class="cloud">@for (s of skills; track s; let i = $index) {
    <li class="reveal"><button [class]="'chip c' + (i % 5)" [style.--r]="(i % 3 - 1) * 4" (click)="spin($event)">{{ s }}</button></li> }</ul>
</section>` })
export class SkillsComponent extends Revealing {
  skills = SKILLS;
  spin(e: Event) {
    const el = e.currentTarget as HTMLElement; this.fx.burst(el, undefined, 20);
    if (!this.fx.reduced) gsap.fromTo(el, { rotation: 0 }, { rotation: 360, duration: .8, ease: 'back.out(1.6)', clearProps: 'rotation' });
  }
}
