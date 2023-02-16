import { IconProps } from "../../types";

export default function InfoIcon({
  size = 20,
  color = "#FFFFFF",
}: IconProps): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 514 514"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M257 152.975V165.978M257 257V361.025M257 491.057C386.267 491.057 491.057 386.267 491.057 257C491.057 127.734 386.267 22.9429 257 22.9429C127.734 22.9429 22.9429 127.734 22.9429 257C22.9429 386.267 127.734 491.057 257 491.057Z"
        stroke={color}
        strokeWidth="45"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
