import { FC } from 'react';
import { SponsorData } from 'utils/types';
import { SponsorCard } from '../SponsorCard';

interface SponsorsListProps {
    sponsors: SponsorData[];
}

const SponsorsList: FC<SponsorsListProps> = ({ sponsors }) => {
    return (
        <>
            <div>
                {sponsors.map((sponsor, index) => (
                    <SponsorCard key={index} sponsor={sponsor} />
                ))}
            </div>
        </>
    );
};

export default SponsorsList;
