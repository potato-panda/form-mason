import { useRef } from 'react';

export default function RichTextInput({
  showToolbar = false,
}: {
  value: string;
  setValue: (value: string) => void;
  showToolbar: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const toolbar = null; // TODO
  return (
    <div>
      {showToolbar && toolbar}
      <div
        className="rich-text-input"
        ref={inputRef}
        contentEditable={true}
      ></div>
    </div>
  );
}
