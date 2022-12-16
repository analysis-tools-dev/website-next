import { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AutocompleteSearch } from '@components/elements';
import { Wrapper } from '@components/layout';
import styles from './Navbar.module.css';

const Navbar: FC = () => {
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
            newTab: true,
        },
    ];

    return (
        <header className={styles.header}>
            <Wrapper className={styles.wrapper}>
                <Link href="/">
                    <a>
                        <Image
                            height="35px"
                            width="175px"
                            src="/assets/images/logo2.svg"
                            alt=""
                        />
                    </a>
                </Link>

                <nav className={styles.nav}>
                    <ul className={styles.linkList}>
                        {links.map((link, index) => (
                            <li key={index} className={styles.listItem}>
                                <Link href={link.href}>
                                    {link.newTab ? (
                                        <a
                                            className={`font-color-light ${styles.navLink}`}
                                            target="_blank"
                                            rel="noopener noreferrer">
                                            {link.label}
                                        </a>
                                    ) : (
                                        <a
                                            className={`font-color-light ${styles.navLink}`}>
                                            {link.label}
                                        </a>
                                    )}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className={styles.searchField}>
                    <AutocompleteSearch />
                </div>
            </Wrapper>
        </header>
    );
};

export default Navbar;
