import { Component } from '@angular/core';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HeaderComponent } from './components/header/header.component';
import { HeroComponent } from './components/hero/hero.component';
import { AboutComponent } from './components/about.component';
import { SkillsComponent } from './components/skills.component';
import { ProjectsComponent } from './components/projects.component';
import { ContactComponent } from './components/contact.component';
import { FooterComponent } from './components/footer.component';

@Component({
  selector: 'app-root', standalone: true,
  imports: [HeaderComponent, HeroComponent, AboutComponent, SkillsComponent, ProjectsComponent, ContactComponent, FooterComponent],
  template: `<a class="skip" href="#about">Pular para o conteúdo</a><app-header /><main><app-hero /><app-about /><app-skills /><app-projects /><app-contact /></main><app-footer />`
})
export class AppComponent { constructor() { document.fonts.ready.then(() => ScrollTrigger.refresh()); } }
