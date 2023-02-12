import { FC } from 'react';
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
    url: string;
    className?: string;
}

const ShareBtns: FC<ShareBtnsProps> = ({ url, className }) => {
    return (
        <>
            <ul className={classNames(styles.btnList, className)}>
                {/* <li>Share:</li> */}
                <li>
                    <EmailShareButton url={url}>
                        <EmailIcon size={25} round />
                    </EmailShareButton>
                </li>
                <li>
                    <FacebookShareButton url={url}>
                        <FacebookIcon size={25} round />
                    </FacebookShareButton>
                </li>
                <li>
                    <LinkedinShareButton url={url}>
                        <LinkedinIcon size={25} round />
                    </LinkedinShareButton>
                </li>
                <li>
                    <TwitterShareButton url={url}>
                        <TwitterIcon size={25} round />
                    </TwitterShareButton>
                </li>
                <li>
                    <RedditShareButton url={url}>
                        <RedditIcon size={25} round />
                    </RedditShareButton>
                </li>
                <li>
                    <WhatsappShareButton url={url}>
                        <WhatsappIcon size={25} round />
                    </WhatsappShareButton>
                </li>
                <li>
                    <TelegramShareButton url={url}>
                        <TelegramIcon size={25} round />
                    </TelegramShareButton>
                </li>
                <li>
                    <VKShareButton url={url}>
                        <VKIcon size={25} round />
                    </VKShareButton>
                </li>
            </ul>
        </>
    );
};

export default ShareBtns;
