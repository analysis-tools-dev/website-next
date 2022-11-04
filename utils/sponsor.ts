import sponsorJSON from 'data/sponsors.json';

// Check if tool is a sponsor by checking if the tool name is in any of the
// tools fields of the sponsor object
export const isSponsor = (toolSlug: string) => {
    if (!sponsorJSON) {
        return false;
    }
    return sponsorJSON.some((sponsor) => sponsor.tool === toolSlug);
};
