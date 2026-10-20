import type { FC, ReactNode } from "react"

// ── Custom icons ─────────────────────────────────────────────────────────────

type IconProps = {
  className?: string
  children: ReactNode
  viewBox?: string
  size?: number | string
}

const Icon: FC<IconProps> = ({ viewBox = "0 0 24 24", size = 24, className = "", children }) => (
  <svg
    width={size}
    height={size}
    viewBox={viewBox}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className={["shrink-0", className].join(" ")}
  >
    {children}
  </svg>
)

type CustomIconProps = Omit<IconProps, "children">

export const XCircle: FC<CustomIconProps> = (props) => (
  <Icon {...props}>
    <path
      opacity="0.15"
      d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
      fill="currentColor"
    />
    <path
      d="M15.5303 9.53033C15.8232 9.23744 15.8232 8.76256 15.5303 8.46967C15.2374 8.17678 14.7625 8.17678 14.4696 8.46967L15.5303 9.53033ZM8.46961 14.4697C8.17672 14.7626 8.17672 15.2374 8.46961 15.5303C8.76251 15.8232 9.23738 15.8232 9.53027 15.5303L8.46961 14.4697ZM9.53039 8.46967C9.2375 8.17678 8.76263 8.17678 8.46973 8.46967C8.17684 8.76256 8.17684 9.23744 8.46973 9.53033L9.53039 8.46967ZM14.4697 15.5303C14.7626 15.8232 15.2375 15.8232 15.5304 15.5303C15.8233 15.2374 15.8233 14.7626 15.5304 14.4697L14.4697 15.5303ZM14.4696 8.46967L8.46961 14.4697L9.53027 15.5303L15.5303 9.53033L14.4696 8.46967ZM8.46973 9.53033L14.4697 15.5303L15.5304 14.4697L9.53039 8.46967L8.46973 9.53033ZM20.25 12C20.25 16.5563 16.5563 20.25 12 20.25V21.75C17.3848 21.75 21.75 17.3848 21.75 12H20.25ZM12 20.25C7.44365 20.25 3.75 16.5563 3.75 12H2.25C2.25 17.3848 6.61522 21.75 12 21.75V20.25ZM3.75 12C3.75 7.44365 7.44365 3.75 12 3.75V2.25C6.61522 2.25 2.25 6.61522 2.25 12H3.75ZM12 3.75C16.5563 3.75 20.25 7.44365 20.25 12H21.75C21.75 6.61522 17.3848 2.25 12 2.25V3.75Z"
      fill="currentColor"
    />
  </Icon>
)

export const Trophy: FC<CustomIconProps> = (props) => (
  <Icon {...props}>
    <path
      opacity="0.15"
      d="M7 4H17V12C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12V4Z"
      fill="currentColor"
    />
    <path
      d="M8 21H16M12 21V17M12 17C9.23858 17 7 14.7614 7 12V4H17V12C17 14.7614 14.7614 17 12 17ZM17 6H18.5C19.8807 6 21 7.11929 21 8.5C21 9.88071 19.8807 11 18.5 11H17M7 11H5.5C4.11929 11 3 9.88071 3 8.5C3 7.11929 4.11929 6 5.5 6L7 6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
)

export const Sun: FC<CustomIconProps> = (props) => (
  <Icon {...props}>
    <path
      opacity="0.15"
      d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"
      fill="currentColor"
    />
    <path
      d="M3 12H5M19 12H21M12 3V5M12 19V21M5.00002 5.00002L7.00002 7.00002M17 17L19 19M5.00006 19L7.00006 17M16.9999 6.99998L18.9999 4.99998M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
)

export const Moon: FC<CustomIconProps> = (props) => (
  <Icon {...props}>
    <path
      opacity="0.15"
      d="M3 17C10.952 18.6176 16.6829 8.75775 11 3C16.0007 3.13144 20 7.11149 20 12C20 16.9715 16.1188 21 11 21C7.77111 21 4.65938 19.4319 3 17Z"
      fill="currentColor"
    />
    <path
      d="M3 17C10.952 18.6176 16.6829 8.75775 11 3C16.0007 3.13144 20 7.11149 20 12C20 16.9715 16.1188 21 11 21C7.77111 21 4.65938 19.4319 3 17Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </Icon>
)

export const RotateCcw: FC<CustomIconProps> = (props) => (
  <Icon {...props}>
    <path
      opacity="0.15"
      d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
      fill="currentColor"
    />
    <path
      d="M16.75 7C16.75 6.58579 16.4142 6.25 16 6.25C15.5858 6.25 15.25 6.58579 15.25 7H16.75ZM16 10V10.75C16.4142 10.75 16.75 10.4142 16.75 10H16ZM13 9.25C12.5858 9.25 12.25 9.58579 12.25 10C12.25 10.4142 12.5858 10.75 13 10.75V9.25ZM16.4807 13.5784C16.6183 13.1877 16.4132 12.7595 16.0225 12.6218C15.6318 12.4842 15.2035 12.6893 15.0659 13.0799L16.4807 13.5784ZM12.5576 8.03902L12.6621 7.29633L12.5576 8.03902ZM15.25 7V10H16.75V7H15.25ZM16 9.25H13V10.75H16V9.25ZM15.0659 13.0799C14.8317 13.7445 14.3879 14.315 13.8013 14.7054L14.6324 15.9541C15.4898 15.3835 16.1384 14.5497 16.4807 13.5784L15.0659 13.0799ZM13.8013 14.7054C13.2147 15.0959 12.5171 15.2851 11.8135 15.2446L11.7273 16.7422C12.7555 16.8013 13.7751 16.5248 14.6324 15.9541L13.8013 14.7054ZM11.8135 15.2446C11.11 15.2041 10.4387 14.9361 9.90075 14.481L8.93186 15.6261C9.71807 16.2913 10.6992 16.683 11.7273 16.7422L11.8135 15.2446ZM9.90075 14.481C9.36281 14.0258 8.98738 13.4082 8.83103 12.7211L7.36842 13.054C7.59695 14.0582 8.14566 14.9609 8.93186 15.6261L9.90075 14.481ZM8.83103 12.7211C8.67467 12.0341 8.74585 11.3148 9.03384 10.6718L7.66485 10.0587C7.24393 10.9986 7.13989 12.0498 7.36842 13.054L8.83103 12.7211ZM9.03384 10.6718C9.32183 10.0287 9.81104 9.4966 10.4278 9.1557L9.70209 7.84291C8.80076 8.34114 8.08576 9.11879 7.66485 10.0587L9.03384 10.6718ZM10.4278 9.1557C11.0445 8.81479 11.7553 8.68353 12.4531 8.7817L12.6621 7.29633C11.6423 7.15286 10.6034 7.34468 9.70209 7.84291L10.4278 9.1557ZM12.4531 8.7817C12.9784 8.8556 13.4595 9.08814 13.968 9.42775C14.223 9.598 14.4744 9.78784 14.7407 9.99221C15.0012 10.1921 15.281 10.4099 15.5666 10.6121L16.4334 9.38789C16.1776 9.2068 15.9271 9.01184 15.6539 8.8022C15.3865 8.59702 15.1008 8.38052 14.8011 8.18035C14.2003 7.7791 13.5015 7.41442 12.6621 7.29633L12.4531 8.7817ZM20.25 12C20.25 16.5563 16.5563 20.25 12 20.25V21.75C17.3848 21.75 21.75 17.3848 21.75 12H20.25ZM12 20.25C7.44365 20.25 3.75 16.5563 3.75 12H2.25C2.25 17.3848 6.61522 21.75 12 21.75V20.25ZM3.75 12C3.75 7.44365 7.44365 3.75 12 3.75V2.25C6.61522 2.25 2.25 6.61522 2.25 12H3.75ZM12 3.75C16.5563 3.75 20.25 7.44365 20.25 12H21.75C21.75 6.61522 17.3848 2.25 12 2.25V3.75Z"
      fill="currentColor"
    />
  </Icon>
)

export const CheckCircle: FC<CustomIconProps> = (props) => (
  <Icon {...props}>
    <path
      opacity="0.15"
      d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
      fill="currentColor"
    />
    <path
      d="M17.5303 9.53033C17.8232 9.23744 17.8232 8.76256 17.5303 8.46967C17.2374 8.17678 16.7626 8.17678 16.4697 8.46967L17.5303 9.53033ZM9.99998 16L9.46965 16.5304C9.76255 16.8232 10.2374 16.8232 10.5303 16.5304L9.99998 16ZM7.53027 12.4697C7.23737 12.1768 6.7625 12.1768 6.46961 12.4697C6.17671 12.7626 6.17672 13.2374 6.46961 13.5303L7.53027 12.4697ZM16.4697 8.46967L9.46965 15.4697L10.5303 16.5304L17.5303 9.53033L16.4697 8.46967ZM6.46961 13.5303L9.46965 16.5304L10.5303 15.4697L7.53027 12.4697L6.46961 13.5303ZM20.25 12C20.25 16.5563 16.5563 20.25 12 20.25V21.75C17.3848 21.75 21.75 17.3848 21.75 12H20.25ZM12 20.25C7.44365 20.25 3.75 16.5563 3.75 12H2.25C2.25 17.3848 6.61522 21.75 12 21.75V20.25ZM3.75 12C3.75 7.44365 7.44365 3.75 12 3.75V2.25C6.61522 2.25 2.25 6.61522 2.25 12H3.75ZM12 3.75C16.5563 3.75 20.25 7.44365 20.25 12H21.75C21.75 6.61522 17.3848 2.25 12 2.25V3.75Z"
      fill="currentColor"
    />
  </Icon>
)

export const Command: FC<CustomIconProps> = (props) => (
  <Icon {...props}>
    <path
      opacity="0.15"
      d="M3 6C3 7.65685 4.34315 9 6 9H9V6C9 4.34315 7.65685 3 6 3C4.34315 3 3 4.34315 3 6Z"
      fill="currentColor"
    />
    <path
      opacity="0.15"
      d="M18 3C16.3431 3 15 4.34315 15 6V9H18C19.6569 9 21 7.65685 21 6C21 4.34315 19.6569 3 18 3Z"
      fill="currentColor"
    />
    <path
      opacity="0.15"
      d="M21 18C21 16.3431 19.6569 15 18 15H15V18C15 19.6569 16.3431 21 18 21C19.6569 21 21 19.6569 21 18Z"
      fill="currentColor"
    />
    <path
      opacity="0.15"
      d="M6 21C7.65685 21 9 19.6569 9 18L9 15L6 15C4.34315 15 3 16.3431 3 18C3 19.6569 4.34315 21 6 21Z"
      fill="currentColor"
    />
    <path
      d="M9 9H15M9 9V15M9 9V6C9 4.34315 7.65685 3 6 3C4.34315 3 3 4.34315 3 6C3 7.65685 4.34315 9 6 9H9ZM15 9V15M15 9H18C19.6569 9 21 7.65685 21 6C21 4.34315 19.6569 3 18 3C16.3431 3 15 4.34315 15 6V9ZM15 15H9M15 15V18C15 19.6569 16.3431 21 18 21C19.6569 21 21 19.6569 21 18C21 16.3431 19.6569 15 18 15H15ZM9 15L6 15C4.34315 15 3 16.3431 3 18C3 19.6569 4.34315 21 6 21C7.65685 21 9 19.6569 9 18L9 15Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </Icon>
)

export const BookOpen: FC<CustomIconProps> = (props) => (
  <Icon {...props}>
    <path
      opacity="0.15"
      d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"
      fill="currentColor"
    />
    <path
      d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </Icon>
)

export const BrainCircuit: FC<CustomIconProps> = (props) => (
  <Icon {...props}>
    <path
      opacity="0.15"
      d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"
      fill="currentColor"
    />
    <path
      d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 13a4.5 4.5 0 0 0 3-4M6.003 5.125A3 3 0 0 0 6.401 6.5M3.477 10.896a4 4 0 0 1 .585-.396M6 18a4 4 0 0 1-1.967-.516M12 13h4M12 18h6a2 2 0 0 1 2 2v1M12 8h8M16 8V5a2 2 0 0 1 2-2"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="16" cy="5" r="1" fill="currentColor" />
    <circle cx="18" cy="20" r="1" fill="currentColor" />
    <circle cx="20" cy="8" r="1" fill="currentColor" />
  </Icon>
)

export const Sparkles: FC<CustomIconProps> = (props) => (
  <Icon {...props}>
    <path
      opacity="0.15"
      d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"
      fill="currentColor"
    />
    <path
      d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5 3v4M19 17v4M3 5h4M17 19h4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </Icon>
)

const BARS = [
  { x: 3, top: 11, bottom: 13, delay: "0.6s" },
  { x: 6, top: 8, bottom: 16, delay: "0.45s" },
  { x: 9, top: 10, bottom: 14, delay: "0.3s" },
  { x: 12, top: 7, bottom: 17, delay: "0.15s" },
  { x: 15, top: 4, bottom: 20, delay: "0s" },
  { x: 18, top: 9, bottom: 15, delay: "0.15s" },
  { x: 21, top: 11, bottom: 13, delay: "0.3s" },
] as const

const ANIM = {
  calcMode: "spline" as const,
  keyTimes: "0;0.5;1",
  keySplines: "0.4 0 0.2 1;0.4 0 0.2 1",
  dur: "1.8s",
  repeatCount: "indefinite" as const,
}

export const AnimatedBars: FC<{ size?: number | string; className?: string }> = ({
  size = 24,
  className = "",
}) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    aria-hidden="true"
    className={["shrink-0", className].join(" ")}
  >
    {BARS.map(({ x, top, bottom, delay }) => (
      <line
        key={x}
        x1={x}
        x2={x}
        y1="11"
        y2="13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      >
        <animate attributeName="y1" values={`11;${top};11`} begin={delay} {...ANIM} />
        <animate attributeName="y2" values={`13;${bottom};13`} begin={delay} {...ANIM} />
      </line>
    ))}
  </svg>
)
