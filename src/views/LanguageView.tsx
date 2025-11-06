import React, { useState } from 'react';
import { useViewModel } from '../hooks/useViewModel';
import { LanguageViewModel } from '../viewmodels/LanguageViewModel';

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
            <LangTitle lang={data.currentLanguage}/>
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

const LangTitle = ({lang}: any) => {
    let title: string;

    switch (lang) {
        case "en":
            title = "Language";
            break;
        case "tr":
            title = "Dil"; // Turkish for "Language"
            break;
        case "ar":
            title = "لغة"; // Arabic for "Language"
            break;
        default:
            title = "Language"; // Fallback
    }

    return <h3>{title}</h3>;
}

export default LanguageView;
