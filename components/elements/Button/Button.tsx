import { ComponentProps, FC } from 'react';
import cn from 'classnames';
import styles from './Button.module.css';
import React from 'react';

export interface ButtonProps extends ComponentProps<'button'> {
    theme?: 'primary' | 'secondary' | 'github';
    className?: string;
    onClick?: () => void;
}

const Button: FC<ButtonProps> = ({
    theme = 'primary',
    className,
    children,
    ...props
}) => {
    const elementClass = cn(styles.btn, styles[theme], className);
    return React.createElement(
        'button',
        { className: elementClass, ...props },
        children,
    );
};

export default Button;
