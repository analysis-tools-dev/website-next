import { readFileSync } from 'fs';
import { isSponsorData } from 'utils/type-guards';
import { SponsorData } from 'utils/types';

const SPONSOR_DATA_FILE_PATH = `${process.cwd()}/data/sponsors.json`;

export const getSponsors = () => {
    // Get sponsor data from JSON file
    try {
        const data = readFileSync(SPONSOR_DATA_FILE_PATH).toString() || '';
        const sponsors = JSON.parse(data) || [];

        if (!isSponsorData(sponsors)) {
            return [];
        }

        return sponsors as SponsorData[];
    } catch (error) {
        console.error(error);
        return [];
    }
};
