import { readFileSync } from 'fs';
import { isFaqData } from 'utils/type-guards';
import { Faq } from 'utils/types';

const FAQ_DATA_FILE_PATH = `${process.cwd()}/data/faq.json`;

export const getFaq = () => {
    // Get faq data from JSON file
    try {
        const data = readFileSync(FAQ_DATA_FILE_PATH).toString() || '';
        const faqs = JSON.parse(data) || [];

        if (!isFaqData(faqs)) {
            return [];
        }

        return faqs as Faq[];
    } catch (error) {
        console.error(error);
        return [];
    }
};
