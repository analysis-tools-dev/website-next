import { FC } from 'react';
import Link from 'next/link';
import { Heading } from '@components/typography';
import styles from './TagWidget.module.css';
import cn from 'classnames';
import { ImageWithFallback } from '@components/elements/ImageWithFallback';

export interface TagWidgetProps {
    tag: string;
}

const TagWidget: FC<TagWidgetProps> = ({ tag }) => {
    const tagCapitalized = tag.charAt(0).toUpperCase() + tag.slice(1);
    return (
        <div key={tag} className={styles.tagsListEntry}>
            <Link
                href={`/tag/${tag}`}
                className={cn(styles.tagLinkCard, 'no-underline')}>
                <div className={styles.tagIcon}>
                    <ImageWithFallback
                        height="33"
                        width="33"
                        src={`/assets/icons/languages/${tag}.svg`}
                        fallbackSrc="/assets/icons/languages/multi-language.svg"
                        alt={tag}
                    />
                </div>
                <div className={styles.tagCardInfo}>
                    <Heading level={2}>{tagCapitalized}</Heading>
                </div>
            </Link>
        </div>
    );
};

export default TagWidget;
