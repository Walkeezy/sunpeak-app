import { joinClassNames } from "../utils/joinClassnames";
import RefreshIcon from "./icons/refresh";

type Props = {
  reloadData: () => void;
  isRefreshing: boolean;
};

export default function Refresh({
  reloadData,
  isRefreshing,
}: Props): JSX.Element {
  return (
    <button
      className={joinClassNames([
        "absolute right-4",
        isRefreshing && "animate-spin",
      ])}
      onClick={reloadData}
    >
      <RefreshIcon />
    </button>
  );
}
