export function LovableLogo({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      aria-label="vibe.ibl.ai"
      viewBox="0 0 23 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <mask
        id="lovable-logo-mask"
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="23"
        height="24"
        style={{ maskType: 'alpha' }}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M6.89785 0C10.7074 0 13.7957 3.17898 13.7957 7.10046V9.79908H16.0913C19.9009 9.79908 22.9892 12.9781 22.9892 16.8995C22.9892 20.821 19.9009 24 16.0913 24H0V7.10046C0 3.17898 3.08827 0 6.89785 0Z"
          fill="url(#lovable-logo-gradient)"
        />
      </mask>
      <g mask="url(#lovable-logo-mask)">
        <ellipse cx="10.0844" cy="12.8114" rx="15.5619" ry="15.9769" fill="#4B73FF" />
        <ellipse cx="11.7941" cy="4.04332" rx="19.9306" ry="15.9769" fill="#FF66F4" />
        <ellipse cx="15.0451" cy="1.037" rx="15.5619" ry="14.0311" fill="#FF0105" />
        <ellipse cx="12.071" cy="4.03913" rx="9.35889" ry="9.60846" fill="#FE7B02" />
      </g>
      <defs>
        <linearGradient
          id="lovable-logo-gradient"
          x1="7.73627"
          y1="4.21757"
          x2="15.0724"
          y2="23.8669"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.025" stopColor="#FF8E63" />
          <stop offset="0.56" stopColor="#FF7EB0" />
          <stop offset="0.95" stopColor="#4B73FF" />
        </linearGradient>
      </defs>
    </svg>
  )
}
