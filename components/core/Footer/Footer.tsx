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
            label: 'Sponsor',
            href: '/sponsor',
            external: false,
        },
        {
            label: 'OpenCollective',
            href: 'https://github.com',
            external: true,
        },
        {
            label: 'How to Contribute',
            href: '/contributing',
            external: false,
        },
        {
            label: 'Privacy Policy',
            href: '/privacy',
            external: false,
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
                            src="/assets/images/logo.png"
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
                                        target={'_blank'}
                                        rel="noreferrer">
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

                <Link href="https://www.freepik.com/free-vector/software-testing-isometric-banner-functional-test_9292792.htm">
                    <a className={styles.logoLink}>
                        <span className={styles.logoText}>
                            Hero image by upklyak on Freepik
                        </span>
                    </a>
                </Link>
            </Wrapper>
        </footer>
    );
};

export default Footer;
