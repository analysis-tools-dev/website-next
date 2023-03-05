import { FC } from 'react';
import styles from './MobileFilter.module.css';
import 'react-select-search/style.css';
import SelectSearch, { SelectedOptionValue } from 'react-select-search';
import { Button, PanelHeader } from '@components/elements';
import classNames from 'classnames';

export interface MobileFilterProps {
    id: string;
    label: string;
    options: any;
    placeholder: string;
    state: any;
    setState: any;
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
        setState({ ...state, [id]: newValue });
    };

    const clear = () => {
        setState({ ...state, [id]: [] });
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
                value={state[id] || ''}
                id={id}
                search={true}
                onChange={onChange}
                placeholder={placeholder}
            />
        </div>
    );
};

export default MobileFilter;
