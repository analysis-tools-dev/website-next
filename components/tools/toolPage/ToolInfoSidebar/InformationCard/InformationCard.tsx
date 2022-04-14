import { FC } from 'react';
import { Card } from '@components/layout';
import { Heading } from '@components/typography';
import InfoEntry from '../InfoEntry/InfoEntry';
import { type Tool } from '@components/tools';
import { deCamelString } from 'utils/strings';

export interface InformationCardProps {
    tool: Tool;
}

const InformationCard: FC<InformationCardProps> = ({ tool }) => {
    const iconAssetsPath = '/assets/icons';
    const linkIcon = `${iconAssetsPath}/general/link.svg`;

    const isMultiLanguage = tool.languages.length > 1;

    const languageIcon = isMultiLanguage
        ? `${iconAssetsPath}/languages/multi-language.svg`
        : `${iconAssetsPath}/languages/${tool.languages[0]}.svg`;
    const languageTag = isMultiLanguage
        ? 'Multi-Language'
        : deCamelString(tool.languages[0]);

    return (
        <Card className="m-b-30">
            <Heading level={3} className="m-b-16 font-bold">
                Information
            </Heading>

            {tool.installation && (
                <InfoEntry
                    label={'Installation'}
                    id="installation"
                    value={tool.installation}
                />
            )}
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
            <InfoEntry
                label={'Language(s)'}
                id="language"
                value={languageTag}
                icon={languageIcon}
            />
            <InfoEntry
                label={'Integration(s)'}
                id="types"
                value={tool.types.join(', ')}
            />
        </Card>
    );
};

export default InformationCard;
