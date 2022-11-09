import { useState, useLayoutEffect, useEffect } from 'react';

const canUseDOM = typeof window !== 'undefined';
const useIsomorphicLayoutEffect = canUseDOM ? useLayoutEffect : useEffect;

export const useIntersection = (element: any, rootMargin = '0px') => {
    const [isVisible, setState] = useState(false);

    useIsomorphicLayoutEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setState(entry.isIntersecting);
                    observer.unobserve(element.current);
                }
            },
            { rootMargin },
        );

        element.current && observer.observe(element.current);

        return () => observer && observer.unobserve(element.current);
    }, []);

    return isVisible;
};
