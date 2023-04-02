import { FC, useState } from 'react';
import styles from './FAQ.module.css';
import { Wrapper } from '@components/layout';
import { Faq } from 'utils/types';
import { Button, PanelHeader } from '@components/elements';
import Link from 'next/link';

// Number of FAQ items to show by default
const DEFAULT_NUM_FAQ = 3;

export interface FaqProps {
    faq: Faq[];
}

const FAQ: FC<FaqProps> = ({ faq }) => {
    const [itemsToRender, setItemsToRender] = useState(DEFAULT_NUM_FAQ);
    const items = faq.slice(0, itemsToRender);

    const showMore = () => {
        setItemsToRender(itemsToRender + 3);
    };

    return (
        <section className={styles.faq}>
            <Wrapper className={styles.wrapper}>
                <PanelHeader level={2} text="Frequently Asked Questions" />

                {items.map((f, index) => (
                    <details key={index} className={styles.question}>
                        <summary className={styles.questionSummary}>
                            {f.question}
                        </summary>

                        {f.answer.split('\n').map(function (answer, index) {
                            return (
                                <p className={styles.answer} key={index}>
                                    {answer}
                                </p>
                            );
                        })}
                    </details>
                ))}

                {/* Show link to full FAQ only if there are more than 3 questions */}
                {faq.length > 3 && (
                    <div className={styles.faqMoreButton}>
                        {itemsToRender < faq.length ? (
                            <Button onClick={showMore}>Show more</Button>
                        ) : (
                            <Link href="/faq" className={styles.faqLink}>
                                View full FAQ
                            </Link>
                        )}
                    </div>
                )}
            </Wrapper>
        </section>
    );
};

export default FAQ;
