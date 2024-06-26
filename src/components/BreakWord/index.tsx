
type BreakWordProps = {
  text: string;
  className?: string | undefined;
};

export default function BreakWord(BreakWordProps: BreakWordProps) {
  const { text, className = '' } = BreakWordProps;
  const textArr = text.split(' ');

  return (
    <>
      {textArr.map((w, idx) => (
        <p key={idx} className={className}>
           &nbsp;{w}
        </p>
      ))}
    </>
  );
}
