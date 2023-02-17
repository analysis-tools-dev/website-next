import { FC } from 'react';
import styles from './FAQ.module.css';
import { Wrapper } from '@components/layout';
import { Faq } from 'utils/types';

export interface FaqProps {
    faq: Faq[];
}

const FAQ: FC<FaqProps> = ({ faq }) => {
    // Show a couple of questions and answers
    // Each question should be a detail element with a summary element as the question

    return (
        <section className={styles.faq}>
            <Wrapper className={styles.wrapper}>
                <h2 className={styles.heading}>Frequently Asked Questions</h2>

                {faq.map((f, index) => (
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
            </Wrapper>
        </section>
    );
};

export default FAQ;
