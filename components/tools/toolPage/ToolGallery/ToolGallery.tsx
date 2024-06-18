import { FC } from 'react';
import Image from 'next/image';
import { Video } from '@splidejs/splide-extension-video';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import '@splidejs/splide-extension-video/dist/css/splide-extension-video.min.css';
import styles from './ToolGallery.module.css';

import { type Screenshot } from 'utils/types';
import { type Tool } from '@components/tools';
import { PanelHeader } from '@components/elements';

export interface ToolGalleryProps {
    tool: Tool;
    screenshots: Screenshot[];
}

const ToolGallery: FC<ToolGalleryProps> = ({ tool, screenshots }) => {
    return (
        <>
            <PanelHeader level={3} text="Tutorials / Guides"></PanelHeader>
            <div className={styles.galleryWrapper}>
                <Splide
                    extensions={{ Video }}
                    options={{
                        type: 'fade',
                        rewind: true,
                        omitEnd: true,
                        arrows: screenshots.length > 1,
                        pagination: screenshots.length > 1,
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
                                    data-splide-youtube={screenshot.url}>
                                    <div className={styles.splideSlide}>
                                        <Image
                                            className={styles.screenshot}
                                            src={screenshot.path}
                                            alt={`${tool.name} screenshot`}
                                            fill={true}
                                        />
                                    </div>
                                </SplideSlide>
                            ) : (
                                <SplideSlide
                                    key={`${screenshot.path}-${index}`}>
                                    <div className={styles.splideSlide}>
                                        <Image
                                            className={styles.screenshot}
                                            src={screenshot.path}
                                            alt={`${tool.name} screenshot`}
                                            fill={true}
                                        />
                                    </div>
                                </SplideSlide>
                            ),
                        )}
                </Splide>
            </div>
        </>
    );
};

export default ToolGallery;
