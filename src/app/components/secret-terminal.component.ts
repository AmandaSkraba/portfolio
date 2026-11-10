import { AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { gsap } from 'gsap';
import { SKILLS } from '../core/data';

@Component({ selector: 'app-terminal', standalone: true, template: `
<div class="term" role="dialog" aria-label="Terminal secreto" (keydown.escape)="closed.emit()">
  <div class="bar"><span>~/portfolio</span><button (click)="closed.emit()" aria-label="Fechar terminal">×</button></div>
  <div class="out" #out aria-live="polite">@for (l of lines; track $index) { <p [class.cmd]="l.c">{{ l.t }}</p> }</div>
  <label class="in">$ <input #inp autocomplete="off" aria-label="Comando" (keydown.enter)="run(inp)"></label>
</div>` })
export class SecretTerminalComponent implements AfterViewInit {
  @Output() closed = new EventEmitter<void>();
  @ViewChild('inp', { static: true }) inp!: ElementRef<HTMLInputElement>;
  @ViewChild('out', { static: true }) out!: ElementRef<HTMLElement>;
  lines = [{ t: "Bem-vinda(o). Digite 'help'.", c: false }];
  private cmds: Record<string, () => string> = {
    help: () => 'comandos: help, about, skills, coffee, clear',
    about: () => 'Dev Full Stack. Curiosa por natureza, desenvolvedora por escolha.',
    skills: () => SKILLS.join(' · '),
    coffee: () => '☕ Preparando... pronto! Compile com moderação.',
  };
  ngAfterViewInit() { this.inp.nativeElement.focus(); gsap.from('.term', { y: 30, opacity: 0, duration: .5, ease: 'power3.out' }); }
  run(i: HTMLInputElement) {
    const c = i.value.trim().toLowerCase(); i.value = ''; if (!c) return;
    if (c === 'clear') { this.lines = []; return; }
    this.lines.push({ t: '$ ' + c, c: true }, { t: this.cmds[c]?.() ?? `comando não encontrado: ${c}`, c: false });
    setTimeout(() => this.out.nativeElement.scrollTop = 1e6);
  }
}
