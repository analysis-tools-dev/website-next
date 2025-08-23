import React from 'react';
import Image, { ImageProps } from 'next/image';

interface ImageWithFallbackProps extends ImageProps {
    fallbackSrc: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
    fallbackSrc,
    ...props
}) => {
    const { src, alt, ...rest } = props;

    const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.src = fallbackSrc;
    };

    // Filter out any key prop that might cause issues with Next.js Image
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { key, ...filteredRest } = rest;

    return (
        <Image {...filteredRest} src={src} alt={alt} onError={handleError} />
    );
};

export default ImageWithFallback;
