export const dateDifference = (date1: Date, date2: Date) => {
    const diff = Math.floor(date1.getTime() - date2.getTime());
    const day = 1000 * 60 * 60 * 24;

    const days = Math.floor(diff / day);
    const months = Math.floor(days / 31);
    const years = Math.floor(months / 12);

    if (years > 0) {
        return `${years} years ago`;
    }
    if (months > 0) {
        return `${months} months ago`;
    }
    if (days > 0) {
        return `${days} days ago`;
    }
    return 'Today';
};

export const dateDiffFromNow = (date: Date) => {
    return dateDifference(new Date(), date);
};
