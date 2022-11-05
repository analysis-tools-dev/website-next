import { useState, useLayoutEffect } from 'react';

export const useIntersection = (
    element: any,
    triggerOnce = true,
    rootMargin = '0px',
) => {
    const [isVisible, setState] = useState(false);

    useLayoutEffect(() => {
        const el = element.current;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setState(entry.isIntersecting);
                    if (triggerOnce) {
                        observer.unobserve(el);
                    }
                }
            },
            { rootMargin },
        );

        element.current && observer.observe(el);

        return () => observer && observer.unobserve(el);
    }, [element, rootMargin, triggerOnce]);

    return isVisible;
};
