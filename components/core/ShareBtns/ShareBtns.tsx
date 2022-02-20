import { FC } from 'react';
import Image from 'next/image';
import classNames from 'classnames';

import styles from './ShareBtns.module.css';

export interface ShareBtnsProps {
    className?: string;
}

const ShareBtns: FC<ShareBtnsProps> = ({ className }) => {
    return (
        <>
            <ul className={classNames(styles.btnList, className)}>
                <li>Share:</li>
                <li>
                    <a
                        href=""
                        itemProp="url"
                        target="_blank"
                        rel="noopener noreferrer">
                        <Image
                            height="25px"
                            width="25px"
                            src="/assets/icons/general/slack.svg"
                            alt="Slack Share"
                        />
                    </a>
                </li>
                <li>
                    <a
                        href=""
                        itemProp="url"
                        target="_blank"
                        rel="noopener noreferrer">
                        <Image
                            height="25px"
                            width="25px"
                            src="/assets/icons/general/linkedin.svg"
                            alt="LinkedIn Share"
                        />
                    </a>
                </li>
                <li>
                    <a
                        href=""
                        itemProp="url"
                        target="_blank"
                        rel="noopener noreferrer">
                        <Image
                            height="25px"
                            width="25px"
                            src="/assets/icons/general/twitter.svg"
                            alt="Twitter Share"
                        />
                    </a>
                </li>
                <li>
                    <a
                        href=""
                        itemProp="url"
                        target="_blank"
                        rel="noopener noreferrer">
                        <Image
                            height="25px"
                            width="25px"
                            src="/assets/icons/general/pinterest.svg"
                            alt="Pinterest Share"
                        />
                    </a>
                </li>
                <li>
                    <a
                        href=""
                        itemProp="url"
                        target="_blank"
                        rel="noopener noreferrer">
                        <Image
                            height="25px"
                            width="25px"
                            src="/assets/icons/general/facebook.svg"
                            alt="Facebook Share"
                        />
                    </a>
                </li>
                <li>
                    <a
                        href=""
                        itemProp="url"
                        target="_blank"
                        rel="noopener noreferrer">
                        <Image
                            height="25px"
                            width="25px"
                            src="/assets/icons/general/copy.svg"
                            alt="Copy URL"
                        />
                    </a>
                </li>
            </ul>
        </>
    );
};

export default ShareBtns;
