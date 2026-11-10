// Substitua pelos seus dados reais.
export const PROFILE = {
  name: 'amanda skraba',
  email: 'seu@email.com',
  linkedin: 'https://linkedin.com/in/seu-usuario',
  github: 'https://github.com/seu-usuario'
};
export const SKILLS = ['Angular', 'TypeScript', 'JavaScript', 'HTML', 'CSS / SCSS', 'C#', '.NET', 'APIs RESTful', 'MySQL', 'Git / GitHub', 'Figma', 'GSAP', 'Three.js'];
export interface Project {
  name: string;
  type: string;
  desc: string;
  stack: string[];
  demo: string;
  repo?: string;
  color: string;
  ratio: string;
}
export const PROJECTS: Project[] = [
  { name: 'Ateliê API', type: 'Back-End', desc: 'API RESTful em .NET com autenticação, documentação Swagger e testes.', stack: ['C#', '.NET', 'MySQL'], demo: '#', repo: '#', color: '#936e67', ratio: '4/5' },
  { name: 'Folhas', type: 'Full Stack', desc: 'Plataforma de gestão com painel em Angular e API integrada.', stack: ['Angular', 'TypeScript', '.NET'], demo: '#', repo: '#', color: '#464c3f', ratio: '16/10' },
  { name: 'Ruído Branco', type: 'Front-End / Creative', desc: 'Experiência interativa com GSAP e Three.js.', stack: ['GSAP', 'Three.js', 'SCSS'], demo: '#', color: '#b6846b', ratio: '1/1' },
];
