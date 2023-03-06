import { useEffect, useState } from 'react';

/**
 * @description Render a date SSR / CSR
 */
function IsomorphicDate(dateProp: Date) {
    const [date, setDate] = useState(dateProp.toDateString());
    useEffect(() => {
        setDate(new Date(dateProp).toLocaleDateString());
    }, [dateProp]);
    return date;
}

export default IsomorphicDate;
