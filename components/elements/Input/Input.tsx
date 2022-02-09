import { ComponentProps, FC } from 'react';
import cn from 'classnames';
import styles from './Input.module.css';
import React from 'react';

export interface InputProps extends ComponentProps<'input'> {
    className?: string;
    onClick?: () => void;
}

const Input: FC<InputProps> = ({ className, children, ...props }) => {
    const elementClass = cn(styles.input, className);
    return React.createElement(
        'input',
        { className: elementClass, ...props },
        children,
    );
};

export default Input;
