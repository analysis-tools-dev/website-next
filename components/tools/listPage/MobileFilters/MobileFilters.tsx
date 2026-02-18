import { FC, useState } from 'react';
import classNames from 'classnames';
import { Button, PanelHeader } from '@components/elements';
import styles from './MobileFilters.module.css';
import { useTools, type SearchState } from 'context/ToolsProvider';
import MobileFilter from './MobileFilter/MobileFilter';

import {
    SORTING_OPTIONS,
    CATEGORY_OPTIONS,
    TYPE_OPTIONS,
    LICENSE_OPTIONS,
    PRICING_OPTIONS,
} from '@appdata/filters';
import { LanguageFilterOption } from '../ToolsSidebar/FilterCard/LanguageFilterCard';
import { FilterOption } from '../ToolsSidebar/FilterCard/FilterCard';

export interface MobileFiltersProps {
    languages?: LanguageFilterOption[];
    others?: FilterOption[];
}

const MobileFilters: FC<MobileFiltersProps> = ({
    languages = [],
    others = [],
}) => {
    const { search, setSearch } = useTools();

    const [modelOpen, setModelOpen] = useState(false);
    const [state, setState] = useState<SearchState>(search);

    const submit = () => {
        setSearch(state);
        closeModal();
    };

    const cancel = () => {
        setState(search);
        closeModal();
    };

    const openModal = () => {
        // Sync state with current search when opening
        setState(search);
        // Add modal-open class to body
        document.body.classList.add('modal-open');
        setModelOpen(true);
    };

    const closeModal = () => {
        document.body.classList.remove('modal-open');
        setModelOpen(false);
    };

    return (
        <>
            <div className={styles.mobileFilterForm}>
                <Button
                    className="filterBtn"
                    theme="secondary"
                    onClick={openModal}>
                    Filters
                </Button>
                <div
                    className={classNames(styles.modalWrapper, {
                        [`${styles.openModal}`]: modelOpen,
                    })}>
                    <div className={styles.modalForm}>
                        <Button
                            className={styles.closeBtn}
                            theme="secondary"
                            onClick={closeModal}>
                            x
                        </Button>
                        <PanelHeader
                            level={2}
                            text="Filter Tools"
                            className="m-b-40"
                        />

                        <MobileFilter
                            id="sorting"
                            label="Sort By"
                            options={SORTING_OPTIONS}
                            placeholder="Sort By"
                            state={state}
                            setState={setState}
                        />

                        <MobileFilter
                            id="languages"
                            label="Languages"
                            options={languages}
                            placeholder="Choose Language"
                            state={state}
                            setState={setState}
                        />

                        <MobileFilter
                            id="categories"
                            label="Categories"
                            options={CATEGORY_OPTIONS}
                            placeholder="Choose Category"
                            state={state}
                            setState={setState}
                        />

                        <MobileFilter
                            id="type"
                            label="Type"
                            options={TYPE_OPTIONS}
                            placeholder="Choose Type"
                            state={state}
                            setState={setState}
                        />

                        <MobileFilter
                            id="licenses"
                            label="Licenses"
                            options={LICENSE_OPTIONS}
                            placeholder="Choose License"
                            state={state}
                            setState={setState}
                        />

                        <MobileFilter
                            id="pricing"
                            label="Pricing"
                            options={PRICING_OPTIONS}
                            placeholder="Choose Pricing"
                            state={state}
                            setState={setState}
                        />

                        <MobileFilter
                            id="others"
                            label="Other Tags"
                            options={others}
                            placeholder="Other Tags"
                            state={state}
                            setState={setState}
                            topList={true}
                        />
                        <div className={styles.formButtons}>
                            <Button onClick={cancel} theme="secondary">
                                Cancel
                            </Button>
                            <Button onClick={submit}>Filter</Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MobileFilters;
