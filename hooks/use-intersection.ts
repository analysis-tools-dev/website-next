import { useState, useLayoutEffect } from 'react';

export const useIntersection = (element: any, rootMargin = '0px') => {
    const [isVisible, setState] = useState(false);

    useLayoutEffect(() => {
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
