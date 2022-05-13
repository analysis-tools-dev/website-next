import { useRouter } from 'next/router';
import type { NextRouter } from 'next/router';
import { useRef, useState } from 'react';

export const useRouterPush = (): NextRouter['push'] => {
    const router = useRouter();
    const routerRef = useRef(router);

    routerRef.current = router;

    const [{ push }] = useState<Pick<NextRouter, 'push'>>({
        push: (path) => routerRef.current.push(path),
    });
    return push;
};

export const useRouterReplace = (): NextRouter['replace'] => {
    const router = useRouter();
    const routerRef = useRef(router);

    routerRef.current = router;

    const [{ replace }] = useState<Pick<NextRouter, 'replace'>>({
        replace: (path) => routerRef.current.replace(path),
    });
    return replace;
};
