import { Component } from '@angular/core';
import { MagneticDirective, Revealing } from '../core/fx.service';
import { PROFILE } from '../core/data';

@Component({ selector: 'app-contact', standalone: true, imports: [MagneticDirective], template: `
<section class="sec contact" id="contact">
  <h2 class="reveal huge">Vamos construir algo <em>interessante?</em></h2>
  <div class="reveal links">
    <a [href]="'mailto:' + p.email">{{ p.email }}</a>
    <button class="btn primary" appMagnetic (click)="copy($event)" aria-live="polite">{{ copied ? 'Copiado ✓' : 'Copiar e-mail' }}</button>
    <a [href]="p.linkedin" target="_blank" rel="noopener">LinkedIn</a><a [href]="p.github" target="_blank" rel="noopener">GitHub</a>
  </div>
</section>` })
export class ContactComponent extends Revealing {
  p = PROFILE; copied = false;
  async copy(e: Event) {
    try { await navigator.clipboard.writeText(this.p.email); } catch { return; }
    this.copied = true; this.fx.burst(e.currentTarget as Element, undefined, 30); setTimeout(() => this.copied = false, 2000);
  }
}
