import { useEffect } from 'react';

export const useDocumentEvent = (events: any[]) => {
    useEffect(() => {
        events.forEach((event) => {
            document.addEventListener(event.type, event.callback);
        });
        return () =>
            events.forEach((event) => {
                document.removeEventListener(event.type, event.callback);
            });
    }, [events]);
};
