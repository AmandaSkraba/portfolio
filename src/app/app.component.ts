import { Component } from '@angular/core';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HeaderComponent } from './components/header/header.component';
import { HeroComponent } from './components/hero/hero.component';
import { ProjectsComponent } from './components/projects.component';
import { ContactComponent } from './components/contact.component';
import { FooterComponent } from './components/footer.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { AboutComponent } from './components/about/about.component';
import { TimelineHorizontalComponent } from './components/timeline-horizontal/timeline-horizontal.component';
import { InfiniteMarqueeComponent } from './components/infinite-marquee/infinite-marquee.component';
import { SkillsComponent } from './components/skills/skills.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent,
    HeroComponent,
    AboutComponent,
    SkillsComponent,
    ProjectsComponent,
    ContactComponent,
    FooterComponent,
    TimelineComponent,
    TimelineHorizontalComponent,
    InfiniteMarqueeComponent
],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent { constructor() { document.fonts.ready.then(() => ScrollTrigger.refresh()); } }
// templateUrl: `<a class="skip" href="#about">Pular para o conteúdo</a><app-header /><main><app-hero /><app-about /><app-skills /><app-projects /><app-contact /></main><app-footer />`