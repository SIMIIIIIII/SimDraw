import EmojiPicker, { Emoji } from 'emoji-picker-react';
import { useState } from 'react';
import './Emoji.css';

interface IPickerProps {
    save: (param: string) => void;
    currentEmoji: string
}

const Picker = ({ save, currentEmoji =  '1f601'} : IPickerProps) => {
    const [emoji, setEmoji] = useState<string>(currentEmoji);
    const [pickerKey, setPickerKey] = useState<number>(0);

    const onEmojiClick = (choice : string) => {
        setEmoji(choice);
        save(choice);
        setPickerKey((prev) => prev + 1);
    };

    const getEmoji = (unified: string) => {
        return String.fromCodePoint(...unified.split('-').map(u => parseInt(u, 16)));
    }

    return (
        <div className="emoji">
            <h6>
                {' '}
                Emoji choisi : {getEmoji(emoji || '1f60a')}
            </h6>
            <EmojiPicker
                key={pickerKey}
                onEmojiClick={(emojiData) => onEmojiClick(emojiData.unified)}
                width="min(450px, 95vw)"
                reactionsDefaultOpen={true}
                height={500}
                theme="auto"
                lazyLoadEmojis={true}
                searchPlaceholder="Chercher un emoji..."
                skinTonesDisabled={false}
                autoFocusSearch={false}
                skinTonePickerLocation="PREVIEW"
            />
        </div>
    );
};

export default Picker;
