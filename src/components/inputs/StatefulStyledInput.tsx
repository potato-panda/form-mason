export default function StatefulStyledInput({
  name,
  id,
  placeholder,
  value,
  setValue,
  style,
}: {
  name: string;
  id: string;
  value?: string;
  setValue: (value: string) => void;
  style?: React.CSSProperties;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      name={name}
      value={value}
      id={id}
      style={style}
      placeholder={placeholder}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
