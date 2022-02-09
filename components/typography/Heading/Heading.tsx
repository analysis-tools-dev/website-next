import React, { ComponentProps, FC } from 'react';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface HeadingProps extends ComponentProps<'h1'> {
    level: HeadingLevel;
    className?: string;
    onClick?: () => void;
}

const Heading: FC<HeadingProps> = ({
    level,
    className,
    children,
    ...props
}) => {
    const Tag = `h${level}`;
    return React.createElement(
        Tag,
        { className: className || '', ...props },
        children,
    );
};

export default Heading;
