import { FC, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Wrapper } from '@components/layout';
import styles from './Navbar.module.css';
import classNames from 'classnames';
import { AutocompleteSearch } from '@components/elements';

const Navbar: FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    ];

    function handleClickOutside(event: any) {
        if (
            !event.target.closest('.menu') &&
            !event.target.closest('.search')
        ) {
            setIsMenuOpen(false);
        }
    }

    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, [isMenuOpen]);

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
                        onClick={() => setIsMenuOpen(!isMenuOpen)}>
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
                    })}>
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
                </nav>

                <div
                    className={classNames('search', styles.searchField, {
                        [`${styles.showMenu}`]: isMenuOpen,
                    })}>
                    <AutocompleteSearch />
                </div>
            </Wrapper>
        </header>
    );
};

export default Navbar;
