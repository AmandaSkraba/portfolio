import { Component, signal } from '@angular/core';
import { PALETTE, Revealing } from '../../core/fx.service';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { MemojiComponent } from '../memoji/memoji.component';
import { InteractiveShapeComponent } from '../interactive-shape.component';


@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, MemojiComponent, InteractiveShapeComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent extends Revealing {
  faDownload = faDownload;
  pal = PALETTE;
  shapes = [
    { x: 25, y: 30, size: 30, kind: 'star' as const, clickKind: 'ring' as const, c: 2, m: false, d: 1 },
    { x: 70, y: 15, size: 55, kind: 'ring' as const, clickKind: 'morph' as const, c: 1, m: false, d: 2 }    
  ];
  images = [
    { src: 'memoji-01', x: 80, y: 35, size: 150, rotation: 25 },
    { src: 'memoji-02', x: 20, y: 20, size: 150, rotation: -15 }
  ]
  badges = [
    { lbl1: '6', lbl2: 'anos de experiência.' },
    { lbl1: '3', lbl2: 'equipes apoiadas.' },
    { lbl1: '+7', lbl2: 'projetos atuados.' },
  ]
}
