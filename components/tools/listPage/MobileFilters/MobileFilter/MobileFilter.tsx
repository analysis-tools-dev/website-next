import { FC } from 'react';
import styles from './MobileFilter.module.css';
import 'react-select-search/style.css';
import SelectSearch, {
    SelectedOptionValue,
    SelectSearchOption,
} from 'react-select-search';
import { Button, PanelHeader } from '@components/elements';
import classNames from 'classnames';
import { SearchState, SearchFilter } from 'context/SearchProvider';

export interface MobileFilterProps {
    id: string;
    label: string;
    options: SelectSearchOption[];
    placeholder: string;
    state: SearchState;
    setState: (state: SearchState) => void;
    topList?: boolean;
}

const MobileFilter: FC<MobileFilterProps> = ({
    id,
    label,
    options,
    placeholder,
    state,
    setState,
    topList,
}) => {
    const onChange = (value: SelectedOptionValue | SelectedOptionValue[]) => {
        const newValue = Array.isArray(value) ? value : [value];
        setState({ ...state, [id as SearchFilter]: newValue });
    };

    const clear = () => {
        setState({ ...state, [id as SearchFilter]: [] });
    };

    return (
        <div
            className={classNames(styles.formEntry, {
                'select-top-options': topList,
            })}>
            <PanelHeader level={4} text={label} className={styles.label}>
                <Button theme="link" onClick={clear} type="button">
                    Clear
                </Button>
            </PanelHeader>
            <SelectSearch
                options={options}
                value={state[id as SearchFilter] || ''}
                id={id}
                search={true}
                onChange={onChange}
                placeholder={placeholder}
            />
        </div>
    );
};

export default MobileFilter;
