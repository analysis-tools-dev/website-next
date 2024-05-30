import React from 'react';
import Image, { ImageProps } from 'next/image';

interface ImageWithFallbackProps extends ImageProps {
    fallbackSrc: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
    fallbackSrc,
    ...props
}) => {
    const { src, alt, key, ...rest } = props;

    const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.src = fallbackSrc;
    };

    return <Image {...rest} src={src} alt={alt} onError={handleError} />;
};

export default ImageWithFallback;
