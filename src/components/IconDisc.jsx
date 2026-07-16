export function IconDisc({ color, glyph, size }) {
  const iconSize = Math.round(size * 0.5) 
  return (
    <div
      className="rounded-[11px] flex items-center justify-center flex-shrink-0"
      style={{ 
        width: size,
        height: size,
        background: `${color}1F` 
      }}
    >
      <svg
        width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none"
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        dangerouslySetInnerHTML={{ __html: glyph }}
      />
    </div>
  );
}