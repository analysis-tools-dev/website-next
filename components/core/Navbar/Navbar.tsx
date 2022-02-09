import Link from 'next/link';
import Image from 'next/image';
import { FC } from 'react';

import styles from './Navbar.module.css';
import { AutocompleteSearch } from '@components/elements';

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
            label: 'Sponsor',
            href: '/sponsor',
        },
        {
            label: 'Contributing',
            href: '/contributing',
        },
    ];

    return (
        <header className={styles.header}>
            <Link href="/">
                <a className={styles.logoLink}>
                    <Image
                        height="30px"
                        width="30px"
                        src="/assets/images/logo.png"
                        alt=""
                    />
                    <span className={styles.logoText}>Analysis Tools</span>
                </a>
            </Link>

            <nav className={styles.nav}>
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

            <div className={styles.searchField}>
                <AutocompleteSearch />
            </div>
        </header>
    );
};

export default Navbar;
