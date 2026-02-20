import { FC } from 'react';
import { Card } from '@components/layout';
import { Heading } from '@components/typography';
import InfoEntry from '../InfoEntry/InfoEntry';
import { type Tool } from '@components/tools';
import { deCamelString } from 'utils/strings';
import { getToolTagIcon } from 'utils/icons';

export interface InformationCardProps {
    tool: Tool;
}

const InformationCard: FC<InformationCardProps> = ({ tool }) => {
    const iconAssetsPath = '/assets/icons';
    const linkIcon = `${iconAssetsPath}/general/link.svg`;

    const isMultiLanguage = tool.languages?.length > 1;
    const languageIcon = getToolTagIcon(tool);

    const languageTag = isMultiLanguage
        ? 'Multi-Language'
        : deCamelString(tool.languages[0] || tool.other[0] || '');

    let tagUrl = undefined;
    if (tool.languages.length === 1) {
        tagUrl = `/tag/${tool.languages[0]}`;
    } else if (tool.other.length === 1) {
        tagUrl = `/tag/${tool.other[0]}`;
    }

    return (
        <Card>
            <Heading level={3} className="m-b-16 font-bold">
                Information
            </Heading>

            <InfoEntry
                label={'Votes'}
                id="votes"
                value={`${tool.votes} (${tool.upvotePercentage}% upvotes)`}
            />

            {tool.installation && (
                <InfoEntry
                    label={'Installation'}
                    id="installation"
                    value={tool.installation}
                />
            )}
            <InfoEntry
                label={'Category'}
                id="category"
                value={tool.categories.join(', ')}
            />
            <InfoEntry
                label={'Language(s)'}
                id="language"
                value={languageTag}
                url={tagUrl}
                icon={languageIcon}
            />
            <InfoEntry
                label={'Integration(s)'}
                id="integrations"
                value={tool.types.join(', ')}
            />
            <InfoEntry
                label={'Homepage'}
                id="homepage"
                value={tool.homepage}
                icon={linkIcon}
            />
            {tool.documentation && (
                <InfoEntry
                    label={'Documentation'}
                    id="documentation"
                    value={tool.documentation}
                    icon={linkIcon}
                />
            )}
        </Card>
    );
};

export default InformationCard;
