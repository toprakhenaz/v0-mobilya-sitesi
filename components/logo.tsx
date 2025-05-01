type LogoProps = {
  size?: "small" | "medium" | "large"
  className?: string
}

export default function Logo({ size = "medium", className = "" }: LogoProps) {
  // Size mappings
  const sizes = {
    small: { width: 100, height: 32 },
    medium: { width: 140, height: 40 },
    large: { width: 180, height: 50 },
  }

  const { width, height } = sizes[size]

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <svg width={width} height={height} viewBox="0 0 180 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 10L35 20V40H5V20L20 10Z" fill="#0891b2" stroke="#0891b2" strokeWidth="2" />
        <rect x="15" y="30" width="10" height="10" fill="white" />
        <path d="M50 15H55V40H50V15ZM50 10H55V15H50V10Z" fill="#1e293b" />
        <path
          d="M60 15H65L65 35C65 36.6569 66.3431 38 68 38C69.6569 38 71 36.6569 71 35V15H76V35C76 39.4183 72.4183 43 68 43C63.5817 43 60 39.4183 60 35V15Z"
          fill="#1e293b"
        />
        <path d="M80 15H85L95 33V15H100V40H95L85 22V40H80V15Z" fill="#1e293b" />
        <path
          d="M105 27.5C105 20.5964 110.596 15 117.5 15C124.404 15 130 20.5964 130 27.5C130 34.4036 124.404 40 117.5 40C110.596 40 105 34.4036 105 27.5ZM117.5 20C113.358 20 110 23.3579 110 27.5C110 31.6421 113.358 35 117.5 35C121.642 35 125 31.6421 125 27.5C125 23.3579 121.642 20 117.5 20Z"
          fill="#1e293b"
        />
        <path d="M135 15H140L150 33V15H155V40H150L140 22V40H135V15Z" fill="#1e293b" />
        <path d="M160 15H175V20H165V25H175V30H165V35H175V40H160V15Z" fill="#1e293b" />
      </svg>
    </div>
  )
}
