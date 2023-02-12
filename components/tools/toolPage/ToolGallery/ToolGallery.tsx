import { FC } from 'react';
import Image from 'next/image';
import { Video } from '@splidejs/splide-extension-video';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import '@splidejs/splide-extension-video/dist/css/splide-extension-video.min.css';
import styles from './ToolGallery.module.css';

import { type Screenshot } from 'utils/types';
import { type Tool } from '@components/tools';

export interface ToolGalleryProps {
    tool: Tool;
    screenshots: Screenshot[];
}

const ToolGallery: FC<ToolGalleryProps> = ({ tool, screenshots }) => {
    return (
        <div className={styles.galleryWrapper}>
            <Splide
                extensions={{ Video }}
                options={{
                    type: 'loop',
                    rewind: true,
                    rewindByDrag: true,
                    video: {
                        mute: true,
                        playerOptions: {
                            youtube: {
                                width: 200,
                            },
                            vimeo: {},
                            htmlVideo: {
                                width: 200,
                            },
                        },
                    },
                }}
                aria-label={`${tool.name} screenshot gallery`}>
                {screenshots &&
                    screenshots.map((screenshot, index) =>
                        screenshot.url.includes('youtube.com') ? (
                            <SplideSlide
                                key={`${screenshot.path}-${index}`}
                                // add youtube link if youtube video
                                data-splide-youtube={screenshot.url}>
                                <Image
                                    className={styles.screenshot}
                                    width={1280}
                                    height={720}
                                    src={screenshot.path}
                                    alt={`${tool.name} screenshot`}
                                />
                            </SplideSlide>
                        ) : (
                            <SplideSlide key={`${screenshot.path}-${index}`}>
                                <Image
                                    className={styles.screenshot}
                                    width={1280}
                                    height={720}
                                    src={screenshot.path}
                                    alt={`${tool.name} screenshot`}
                                />
                            </SplideSlide>
                        ),
                    )}
            </Splide>
        </div>
    );
};

export default ToolGallery;
