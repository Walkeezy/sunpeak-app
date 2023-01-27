import { Point } from "ol/geom";
import { fromLonLat } from "ol/proj.js";
import { RFeature, ROverlay } from "rlayers";
import { Webcam } from "../services/sheet";

type Props = {
  cam: Webcam;
  size: number;
};

export default function SunpeakCam({ cam, size }: Props): JSX.Element {
  return (
    <RFeature
      key={cam.name}
      geometry={new Point(fromLonLat([cam.longitude, cam.latitude]))}
    >
      <ROverlay>
        <a
          href={cam.link}
          target="_blank"
          rel="noopener noreferrer"
          className={`block border-[3px] border-white rounded-xl shadow-md ${
            cam.panorama ? "animate-move-background" : ""
          }`}
          style={{
            background: `url(${cam.url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            width: `${size}px`,
            height: `${size}px`,
            marginTop: "4px",
            marginLeft: `-${size / 2}px`,
          }}
        ></a>
      </ROverlay>
    </RFeature>
  );
}
