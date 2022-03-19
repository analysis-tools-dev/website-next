import { FC } from 'react';
import styles from './Newsletter.module.css';
import { Button, Input } from '@components/elements';
import { Card } from '@components/layout';
import { Heading, Text } from '@components/typography';

const Newsletter: FC = () => {
    return (
        <Card className="m-b-30">
            <Heading level={3} className="inline font-bold m-b-16">
                Stay Informed
            </Heading>
            <Text>
                Sign up to our newsletter and always stay up to date with the
                latest tools and trends in development
            </Text>

            <form className={`${styles.form} m-t-16 m-b-16`}>
                <Input
                    name="email"
                    type="email"
                    placeholder="Email address"
                    className={styles.formInput}
                />
                <Button type="submit" className={styles.formSubmit}>
                    Sign Up
                </Button>
            </form>
        </Card>
    );
};

export default Newsletter;
