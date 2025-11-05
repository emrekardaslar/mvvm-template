import React, { useState } from 'react';
import { useViewModel } from '../../../hooks/useViewModel';
import { LanguageViewModel } from '../../../viewmodels/LanguageViewModel';

interface LanguageViewProps {
    initialData: ReturnType<LanguageViewModel['getData']>;
}

const LanguageView: React.FC<LanguageViewProps> = ({ initialData }) => {
    const [viewModel] = useState(() => new LanguageViewModel());
    const data = useViewModel(viewModel);

    const onLanguageClick = (lang: 'en' | 'tr' | 'ar') => {
        viewModel.runAttachedFunction('changeLanguage', { lang });
    };

    return (
        <div>
            <h3>Dil</h3>
            {data.availableLanguages.map(lang => (
                <button
                    key={lang}
                    onClick={() => onLanguageClick(lang as 'en' | 'tr' | 'ar')}
                    style={{ fontWeight: data.currentLanguage === lang ? 'bold' : 'normal' }}
                >
                    {lang.toUpperCase()}
                </button>
            ))}
        </div>
    );
};

export default LanguageView;
