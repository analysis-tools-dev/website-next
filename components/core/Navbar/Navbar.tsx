import { FC, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Wrapper } from '@components/layout';
import styles from './Navbar.module.css';
import classNames from 'classnames';
import { AutocompleteSearch } from '@components/elements';

const Navbar: FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const dropdown = useRef<HTMLInputElement>(null);

    // Handle click outside of dropdown
    useEffect(() => {
        // only add the event listener when the dropdown is opened
        if (!isMenuOpen) return;
        function handleClick(event: any) {
            if (dropdown.current && !dropdown.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        }
        window.addEventListener('click', handleClick);
        // clean up
        return () => window.removeEventListener('click', handleClick);
    }, [isMenuOpen]);

    const links = [
        {
            label: 'Tools',
            href: '/tools',
        },
        {
            label: 'Blog',
            href: '/blog',
        },
        {
            label: 'Sponsors',
            href: '/sponsors',
        },
        {
            label: 'Contributing',
            href: '/contributing',
        },
        {
            label: 'FAQ',
            href: '/faq',
        },
    ];

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className={styles.header}>
            <Wrapper className={styles.wrapper}>
                <div className={styles.logoWrapper}>
                    <Link href="/">
                        <a className={styles.logo}>
                            <Image
                                height="35px"
                                width="175px"
                                src="/assets/images/logo2.svg"
                                alt=""
                            />
                        </a>
                    </Link>
                    <button
                        className={classNames(styles.hamburger, {
                            [`${styles.showMenu}`]: isMenuOpen,
                        })}
                        onClick={toggleMenu}>
                        <span className={styles.hamburgerBox}>
                            <span className={styles.hamburgerInner}></span>
                            <span className={styles.hamburgerInner}></span>
                            <span className={styles.hamburgerInner}></span>
                        </span>
                    </button>
                </div>

                <nav
                    className={classNames('menu', styles.nav, {
                        [`${styles.showMenu}`]: isMenuOpen,
                    })}
                    ref={dropdown}>
                    <ul className={styles.linkList}>
                        {links.map((link, index) => (
                            <li key={index} className={styles.listItem}>
                                <Link href={link.href}>
                                    <a
                                        className={`font-color-light ${styles.navLink}`}>
                                        {link.label}
                                    </a>
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <div
                        className={classNames('search', styles.searchField, {
                            [`${styles.showMenu}`]: isMenuOpen,
                        })}>
                        <AutocompleteSearch />
                    </div>
                </nav>
            </Wrapper>
        </header>
    );
};

export default Navbar;
