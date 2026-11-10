import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { FxService } from '../core/fx.service';

@Component({ selector: 'app-three', standalone: true, template: '<canvas #c></canvas>',
  styles: [':host{display:block}canvas{width:100%;height:100%;display:block}'] })
export class ThreeSceneComponent implements AfterViewInit, OnDestroy {
  @ViewChild('c', { static: true }) c!: ElementRef<HTMLCanvasElement>;
  private clean = () => {};
  constructor(private zone: NgZone, private fx: FxService) {}

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      const cv = this.c.nativeElement, r = new THREE.WebGLRenderer({ canvas: cv, alpha: true, antialias: true });
      r.setPixelRatio(Math.min(devicePixelRatio, 1.75));
      const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(40, 1, .1, 100); cam.position.z = 7;
      const geo = new THREE.TorusKnotGeometry(1.5, .38, 160, 24);
      const mat = new THREE.MeshStandardMaterial({ color: 0xb6846b, roughness: .55, metalness: .1, flatShading: true });
      const wmat = new THREE.MeshBasicMaterial({ color: 0x464c3f, wireframe: true, transparent: true, opacity: .18 });
      const mesh = new THREE.Mesh(geo, mat), wire = new THREE.Mesh(geo, wmat); wire.scale.setScalar(1.12); mesh.add(wire); scene.add(mesh);
      scene.add(new THREE.AmbientLight(0xcfbeac, 1.4));
      const dl = new THREE.DirectionalLight(0xffffff, 2.2); dl.position.set(3, 4, 5); scene.add(dl);
      const size = () => { const w = cv.clientWidth, h = cv.clientHeight; r.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); r.render(scene, cam); };
      size(); const ro = new ResizeObserver(size); ro.observe(cv);
      let mx = 0, my = 0, vis = true, raf = 0;
      const mv = (e: PointerEvent) => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; };
      const loop = () => {
        if (!vis) { raf = 0; return; }
        const bx = innerWidth > 800 ? 2.4 : 0;
        mesh.rotation.y += .004; mesh.rotation.x += (my * .6 + .3 - mesh.rotation.x) * .03;
        mesh.position.x += (bx + mx * 1.2 - mesh.position.x) * .05; mesh.position.y += (-my * .8 - mesh.position.y) * .05;
        r.render(scene, cam); raf = requestAnimationFrame(loop);
      };
      const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; if (vis && !raf && !this.fx.reduced) loop(); }); io.observe(cv);
      if (!this.fx.reduced) { addEventListener('pointermove', mv, { passive: true }); loop(); }
      this.clean = () => { cancelAnimationFrame(raf); vis = false; removeEventListener('pointermove', mv); ro.disconnect(); io.disconnect(); geo.dispose(); mat.dispose(); wmat.dispose(); r.dispose(); };
    });
  }
  ngOnDestroy() { this.clean(); }
}
