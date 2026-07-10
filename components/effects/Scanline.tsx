/** Wraps children in a relative container with a CRT scanline overlay. */
export function Scanline({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`scanlines relative overflow-hidden ${className ?? ""}`}>
      {children}
    </div>
  );
}
