import { ElementRef } from '@angular/core';

import { gsap } from 'gsap';
import { Observer } from 'gsap/Observer';

gsap.registerPlugin(Observer);

export function createInfinitePanels(
    element: ElementRef<HTMLElement>
) {
    const container = element.nativeElement;

    const panels = gsap.utils.toArray<HTMLElement>(
        '.panel',
        container
    );

    if (!panels.length) {
        return () => { };
    }

    let currentIndex = 0;
    let isAnimating = false;

    const totalPanels = panels.length;

    // Posiciona os painéis inicialmente
    gsap.set(panels, {
        yPercent: 100,
        autoAlpha: 1,
        zIndex: 0
    });

    gsap.set(panels[0], {
        yPercent: 0,
        zIndex: 1
    });

    function navigate(direction: number) {

        if (isAnimating || totalPanels < 2) return;

        isAnimating = true;

        const nextIndex =
            (currentIndex + direction + totalPanels) % totalPanels;

        const currentPanel = panels[currentIndex];
        const nextPanel = panels[nextIndex];

        const timeline = gsap.timeline({
            defaults: {
                duration: 1,
                ease: 'power3.inOut'
            },
            onComplete: () => {
                currentIndex = nextIndex;
                isAnimating = false;

                gsap.set(currentPanel, {
                    zIndex: 0
                });

                gsap.set(nextPanel, {
                    zIndex: 1,
                    yPercent: 0
                });
            }
        });

        gsap.set(nextPanel, {
            yPercent: direction > 0 ? 100 : -100,
            zIndex: 2,
            autoAlpha: 1
        });

        timeline.to(currentPanel, {
            yPercent: direction > 0 ? -100 : 100
        }, 0);

        timeline.to(nextPanel, {
            yPercent: 0
        }, 0);

    }

    const observer = Observer.create({
        target: container,
        type: 'wheel,touch,pointer',
        tolerance: 40,
        preventDefault: true,

        onDown: () => navigate(1),
        onUp: () => navigate(-1)
    });

    return () => {
        observer.kill();
        gsap.killTweensOf(panels);
        gsap.set(panels, {
            clearProps: 'all'
        });
    };
}