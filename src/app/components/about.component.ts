import { Component } from '@angular/core';
import { Revealing } from '../core/fx.service';

@Component({ selector: 'app-about', standalone: true, template: `
<section class="sec about" id="about">
  <h2 class="reveal big">Curiosa por natureza.<br><em>Desenvolvedora por escolha.</em></h2>
  <div class="about-grid">
    <p class="lead reveal">Atuo com desenvolvimento Full Stack, transitando entre Back-End e Front-End com o mesmo cuidado: código limpo, bem organizado e documentado, pensado para quem vai mantê-lo depois.</p>
    <ul class="facts reveal"><li><b>01</b> Qualidade de código e documentação técnica</li><li><b>02</b> Interesse em inteligência artificial e automação</li><li><b>03</b> Aprendizado contínuo e muita curiosidade</li></ul>
  </div>
  <button class="egg" data-speed=".4" (click)="egg($event)" aria-label="Estrela secreta: clique três vezes">✺</button>
  @if (msg) { <p class="egg-msg" role="status">{{ msg }}</p> }
</section>` })
export class AboutComponent extends Revealing {
  msg = ''; private n = 0; private t?: number;
  egg(e: Event) {
    clearTimeout(this.t); this.n++;
    this.t = window.setTimeout(() => this.n = 0, 700);
    if (this.n < 3) return;
    this.n = 0; const el = e.currentTarget as Element;
    [0, 150, 300].forEach(d => setTimeout(() => this.fx.burst(el, undefined, 70), d));
    this.msg = 'Você achou! Café por minha conta ☕';
    setTimeout(() => this.msg = '', 4000);
  }
}
