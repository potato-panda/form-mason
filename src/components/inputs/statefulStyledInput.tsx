export default function StatefulStyledInput({
  value,
  setValue,
  style,
}: {
  value: string;
  setValue: (value: string) => void;
  style?: React.CSSProperties;
}) {
  return (
    <input
      type="text"
      name="name"
      id="name"
      style={style}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
