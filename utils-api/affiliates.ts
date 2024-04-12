import { readFileSync } from 'fs';
import { isAffiliateData } from 'utils/type-guards';
import { AffiliatesData } from 'utils/types';

const AFFILIATE_DATA_FILE_PATH = `${process.cwd()}/data/affiliates.json`;

// Get random affiliate partner from JSON file based on tags
export const getRandomAffiliate = (tags: string[]) => {
    try {
        const data = readFileSync(AFFILIATE_DATA_FILE_PATH).toString() || '';
        const affiliatesJson = JSON.parse(data) || [];

        if (!isAffiliateData(affiliatesJson)) {
            return null;
        }

        const affiliates = affiliatesJson as AffiliatesData[];

        const filteredAffiliates = affiliates.filter((affiliate) => {
            return tags.some((tag) => affiliate.tags.includes(tag));
        });

        if (filteredAffiliates.length === 0) {
            return null;
        }

        const randomAffiliate =
            filteredAffiliates[
                Math.floor(Math.random() * filteredAffiliates.length)
            ];

        return randomAffiliate;
    } catch (error) {
        console.error(error);
        return [];
    }
};
