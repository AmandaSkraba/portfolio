import { Component } from '@angular/core';
import { PROFILE } from '../core/data';
import { SecretTerminalComponent } from './secret-terminal.component';
@Component({ selector: 'app-footer', standalone: true, imports: [SecretTerminalComponent], template: `
<footer class="ftr"><span>© {{ y }} {{ name }} — feito à mão, com Angular, GSAP & Three.js</span>
<button class="term-btn" (click)="open = !open" aria-label="Abrir terminal secreto">&gt;_</button>
@if (open) { <app-terminal (closed)="open = false" /> }</footer>` })
export class FooterComponent { y = new Date().getFullYear(); name = PROFILE.name; open = false; }
