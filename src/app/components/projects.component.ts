import { Component } from '@angular/core';
import { Revealing } from '../core/fx.service';
import { PROJECTS } from '../core/data';

@Component({ selector: 'app-projects', standalone: true, template: `
<section class="sec projects" id="projects">
  <h2 class="reveal big">Trabalhos <em>selecionados</em></h2>
  @for (p of projects; track p.name; let i = $index) {
  <article class="proj reveal" [class.alt]="i % 2" (pointermove)="spot($event)">
    <div class="art" [style.--c]="p.color" [style.aspect-ratio]="p.ratio" data-speed=".15">
      <span class="num">0{{ i + 1 }}</span>
      <svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="70" cy="30" r="22"/><path d="M10 90 Q40 40 90 80"/></svg>
    </div>
    <div class="info"><small>{{ p.type }}</small><h3>{{ p.name }}</h3><p>{{ p.desc }}</p>
      <ul class="tags">@for (t of p.stack; track t) {<li>{{ t }}</li>}</ul>
      <a class="btn" [href]="p.demo">Demo</a> @if (p.repo) { <a class="btn" [href]="p.repo">GitHub</a> }</div>
  </article> }
</section>` })
export class ProjectsComponent extends Revealing {
  projects = PROJECTS;
  spot(e: PointerEvent) { const a = (e.currentTarget as HTMLElement).querySelector<HTMLElement>('.art')!, r = a.getBoundingClientRect();
    a.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`); a.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`); }
}
