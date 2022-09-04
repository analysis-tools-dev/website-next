import { FC } from 'react';
import Image from 'next/image';
import classNames from 'classnames';

import styles from './ShareBtns.module.css';

import {
    EmailIcon,
    EmailShareButton,
    FacebookIcon,
    FacebookShareButton,
    LinkedinIcon,
    LinkedinShareButton,
    RedditIcon,
    RedditShareButton,
    TelegramIcon,
    TelegramShareButton,
    TwitterIcon,
    TwitterShareButton,
    VKIcon,
    VKShareButton,
    WhatsappIcon,
    WhatsappShareButton,
} from 'react-share';

export interface ShareBtnsProps {
    className?: string;
}

const ShareBtns: FC<ShareBtnsProps> = ({ className }) => {
    return (
        <>
            <ul className={classNames(styles.btnList, className)}>
                <li>Share:</li>
                <li>
                    <EmailShareButton url="https://example.com">
                        <EmailIcon size={32} round />
                    </EmailShareButton>
                </li>
                <li>
                    <FacebookShareButton url="https://example.com">
                        <FacebookIcon size={32} round />
                    </FacebookShareButton>
                </li>
                <li>
                    <LinkedinShareButton url="https://example.com">
                        <LinkedinIcon size={32} round />
                    </LinkedinShareButton>
                </li>
                <li>
                    <TwitterShareButton url="https://example.com">
                        <TwitterIcon size={32} round />
                    </TwitterShareButton>
                </li>
                <li>
                    <RedditShareButton url="https://example.com">
                        <RedditIcon size={32} round />
                    </RedditShareButton>
                </li>
                <li>
                    <WhatsappShareButton url="https://example.com">
                        <WhatsappIcon size={32} round />
                    </WhatsappShareButton>
                </li>
                <li>
                    <TelegramShareButton url="https://example.com">
                        <TelegramIcon size={32} round />
                    </TelegramShareButton>
                </li>
                <li>
                    <VKShareButton url="https://example.com">
                        <VKIcon size={32} round />
                    </VKShareButton>
                </li>
            </ul>
        </>
    );
};

export default ShareBtns;
