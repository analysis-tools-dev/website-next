import { FC } from 'react';
import styles from './MobileFilter.module.css';
import Select, { MultiValue } from 'react-select';
import { Button, PanelHeader } from '@components/elements';
import classNames from 'classnames';
import { SearchState, SearchFilter } from 'context/SearchProvider';

interface Option {
    value: string;
    label: string;
}

interface InputOption {
    value: string;
    name: string;
}

export interface MobileFilterProps {
    id: string;
    label: string;
    options: InputOption[];
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
    const selectOptions: Option[] = options.map((opt) => ({
        value: opt.value,
        label: opt.name,
    }));
    const onChange = (selectedOptions: MultiValue<Option>) => {
        const values = selectedOptions.map((option) => option.value);
        setState({ ...state, [id as SearchFilter]: values });
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
            <Select
                options={selectOptions}
                value={selectOptions.filter((option) =>
                    (state[id as SearchFilter] || []).includes(option.value),
                )}
                isMulti
                isSearchable
                onChange={onChange}
                placeholder={placeholder}
                styles={{
                    control: (base) => ({
                        ...base,
                        backgroundColor: '#0a1a29',
                        borderColor: '#486a8b',
                        color: '#ffffff',
                        fontSize: '16px',
                    }),
                    menu: (base) => ({
                        ...base,
                        backgroundColor: '#0a1a29',
                    }),
                    option: (base, state) => ({
                        ...base,
                        backgroundColor: state.isFocused
                            ? '#486a8b'
                            : '#0a1a29',
                        color: '#ffffff',
                    }),
                    multiValue: (base) => ({
                        ...base,
                        backgroundColor: '#486a8b',
                    }),
                    multiValueLabel: (base) => ({
                        ...base,
                        color: '#ffffff',
                    }),
                }}
            />
        </div>
    );
};

export default MobileFilter;
