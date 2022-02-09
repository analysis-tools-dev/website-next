import React, { ComponentProps, FC } from 'react';

export interface TextProps extends ComponentProps<'p'> {
    className?: string;
    onClick?: () => void;
}

const Text: FC<TextProps> = ({ className, children, ...props }) => {
    return React.createElement(
        'p',
        { className: `font-light ${className || ''}`, ...props },
        children,
    );
};

export default Text;
