import { joinClassNames } from "../utils/joinClassNames";
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
      className={joinClassNames([isRefreshing && "animate-spin"])}
      onClick={reloadData}
      title="Refresh webcam data"
    >
      <RefreshIcon />
    </button>
  );
}
