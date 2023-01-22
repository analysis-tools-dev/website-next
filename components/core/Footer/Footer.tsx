import Link from 'next/link';
import Image from 'next/image';
import { FC } from 'react';

import styles from './Footer.module.css';
import { Wrapper } from '@components/layout';

const Footer: FC = () => {
    const links = [
        {
            label: 'Tools',
            href: '/tools',
            external: false,
        },
        {
            label: 'Blog',
            href: '/blog',
            external: false,
        },
        {
            label: 'Sponsors',
            href: '/sponsors',
            external: false,
        },
        {
            label: 'OpenCollective',
            href: 'https://opencollective.com/analysis-tools',
            external: true,
        },
        {
            label: 'How to Contribute',
            href: '/contributing',
            external: true,
        },
    ];

    return (
        <footer className={styles.footer}>
            <Wrapper className={styles.wrapper}>
                <Link href="/">
                    <a className={styles.logoLink}>
                        <Image
                            height="30px"
                            width="30px"
                            src="/assets/images/logo-icon.png"
                            alt=""
                        />
                        <span className={styles.logoText}>
                            &copy; analysis-tools.dev
                        </span>
                    </a>
                </Link>

                <nav>
                    <ul className={styles.linkList}>
                        {links.map((link, index) => (
                            <li key={index} className={styles.listItem}>
                                {link.external ? (
                                    <a
                                        className={`font-color-light ${styles.navLink}`}
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer">
                                        {link.label}
                                    </a>
                                ) : (
                                    <Link href={link.href}>
                                        <a
                                            className={`font-color-light ${styles.navLink}`}>
                                            {link.label}
                                        </a>
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>
            </Wrapper>
        </footer>
    );
};

export default Footer;
