export function LogoMark({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="46" r="42" fill="#7A2E35" />
      <clipPath id="circleClip">
        <circle cx="50" cy="46" r="42" />
      </clipPath>
      <g clipPath="url(#circleClip)" stroke="#FAF8F5" strokeWidth="3.2" strokeLinejoin="round" fill="none">
        <path d="M20 88 L36 68 L52 88" />
        <path d="M40 88 L40 62 L55 46 L70 62 L70 88" />
        <path d="M62 88 L62 52 L76 34 L76 88" />
      </g>
    </svg>
  );
}

export function LogoLockup({ size = 36, showWordmark = true, dark = false }) {
  return (
    <div className="flex items-center gap-3">
      <LogoMark size={size} />
      {showWordmark && (
        <div className={dark ? "text-offwhite" : "text-maroon"}>
          <p className="font-display font-semibold text-base leading-tight tracking-[0.12em]">NEOCUBE</p>
          <p className="font-display text-[10px] leading-tight tracking-[0.35em] opacity-90">REALTY</p>
        </div>
      )}
    </div>
  );
}
