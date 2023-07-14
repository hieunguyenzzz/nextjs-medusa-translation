import axios from 'axios';
import { useEffect, useState, useRef} from 'react';

interface Translation {
    _id: string;
    text: string;
    translation: string;
}

const TranslationPage = () => {
    const [translations, setTranslations] = useState<Translation[]>([]);
    const [selectedLanguage, setSelectedLanguage] = useState('nl');
    const [editingTranslationId, setEditingTranslationId] = useState('');
    const [newTranslationText, setNewTranslationText] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const languageOptions = [
        { value: 'nl', label: 'Dutch' },
        { value: 'es', label: 'Spain' },
    ];
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedLanguage(event.target.value);
    };

    useEffect(() => {
        fetchData(newTranslationText);
    }, [selectedLanguage]); // Add selectedLanguage as a dependency

    const fetchData = async (text?: string) => {
        try {
            setIsLoading(true);
            const response = await axios.get(
                `/api/translation?locale=${selectedLanguage}&limit=20&search=${text || ''}`
            );
            setTranslations(response.data);
        } catch (error) {
            console.error('Error fetching translations:', error);
        }finally {
            setIsLoading(false);
        }
    };

    const handleTranslationClick = (translationId: string) => {
        setEditingTranslationId(translationId);
    };

    const handleOutsideClick = (event: MouseEvent) => {
        if (
            editingTranslationId &&
            textareaRef.current &&
            !textareaRef.current.contains(event.target as Node)
        ) {

            const editedTranslation = translations.find(
                (translation) => translation._id === editingTranslationId
            );
            if (editedTranslation) {
                updateTranslation({...editedTranslation, translation: textareaRef.current.value});
            }
            setEditingTranslationId('');
        }
    };

    const updateTranslation = async (editedTranslation: Translation) => {
        try {
            await axios.put('/api/updateTranslation', {
                id: editedTranslation._id,
                text: editedTranslation.text,
                translation: editedTranslation.translation,
            });
            console.log('Translation updated successfully');
        } catch (error) {
            console.error('Error updating translation:', error);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [editingTranslationId]);

    const handleTranslationChange = (
        event: React.ChangeEvent<HTMLTextAreaElement>,
        translationId: string
    ) => {
        const { value } = event.target;
        setTranslations((prevTranslations) =>
            prevTranslations.map((translation) =>
                translation._id === translationId
                    ? { ...translation, translation: value }
                    : translation
            )
        );
    };

    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setNewTranslationText(event.target.value);
    };

    const handleInputKeyPress = (
        event: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (event.key === 'Enter') {
            fetchData(newTranslationText);
        }
    };

    return (
        <div className="container mx-auto">
            <h1 className="text-2xl font-bold mb-4">Translations</h1>
            <div className="mb-4">
                <select
                    value={selectedLanguage}
                    onChange={handleLanguageChange}
                    className="border p-2"
                >
                    <option value="">Select a language</option>
                    {languageOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                <input
                    type="text"
                    value={newTranslationText}
                    onChange={handleInputChange}
                    onKeyPress={handleInputKeyPress}
                    placeholder="search..."
                    className="border p-2"
                />
            </div>
            {isLoading ? (
                <div className="text-center">Loading...</div>
            ) : (
            <div className="grid grid-cols-3 gap-4">
                {translations.map((translation) => (
                    <div key={translation._id} className="border p-4">
                        {editingTranslationId === translation._id ? (
                            <textarea
                                ref={textareaRef}
                                value={translation.translation}
                                onChange={(event) =>
                                    handleTranslationChange(event, translation._id)
                                }
                            />
                        ) : (
                            <span onClick={() => handleTranslationClick(translation._id)}>
                {translation.translation}
              </span>
                        )}
                        <p>
                            <span className="font-bold">Text:</span> {translation.text}
                        </p>
                    </div>
                ))}
            </div>
            )}
        </div>
    );
};

export default TranslationPage;
