import { FC, useState } from 'react';
import classNames from 'classnames';
import { Button, PanelHeader } from '@components/elements';
import styles from './MobileFilters.module.css';
import 'react-select-search/style.css';
import { useLanguagesQuery } from '@components/tools/queries';
import { useSearchState } from 'context/SearchProvider';
import MobileFilter from './MobileFilter/MobileFilter';

import {
    CATEGORY_OPTIONS,
    TYPE_OPTIONS,
    LICENSE_OPTIONS,
    PRICING_OPTIONS,
} from '@appdata/filters';
import { useOthersQuery } from '@components/tools/queries/others';

const MobileFilters: FC = () => {
    const { search, setSearch } = useSearchState();

    const [modelOpen, setModelOpen] = useState(false);
    const [state, setState] = useState(search);

    const otherResult = useOthersQuery();
    const languageResult = useLanguagesQuery();

    const others = otherResult.data || [];
    // Fitler duplicates on tag
    const languages = languageResult.data || [];

    const submit = () => {
        setSearch(state);
        closeModal();
    };

    const cancel = () => {
        setState(search);
        closeModal();
    };

    const openModal = () => {
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
                            id="languages"
                            label="Languages"
                            options={languages || []}
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
                            options={others || []}
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
