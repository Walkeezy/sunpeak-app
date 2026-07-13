// Apple splash screen definitions: [image name in public/splash_screens, device width, device height, pixel ratio]
const devices: [name: string, width: number, height: number, ratio: number][] = [
  ['iPhone_16_Pro_Max', 440, 956, 3],
  ['iPhone_16_Pro', 402, 874, 3],
  ['iPhone_16_Plus__iPhone_15_Pro_Max__iPhone_15_Plus__iPhone_14_Pro_Max', 430, 932, 3],
  ['iPhone_16__iPhone_15_Pro__iPhone_15__iPhone_14_Pro', 393, 852, 3],
  ['iPhone_14_Plus__iPhone_13_Pro_Max__iPhone_12_Pro_Max', 428, 926, 3],
  ['iPhone_14__iPhone_13_Pro__iPhone_13__iPhone_12_Pro__iPhone_12', 390, 844, 3],
  ['iPhone_13_mini__iPhone_12_mini__iPhone_11_Pro__iPhone_XS__iPhone_X', 375, 812, 3],
  ['iPhone_11_Pro_Max__iPhone_XS_Max', 414, 896, 3],
  ['iPhone_11__iPhone_XR', 414, 896, 2],
  ['iPhone_8_Plus__iPhone_7_Plus__iPhone_6s_Plus__iPhone_6_Plus', 414, 736, 3],
  ['iPhone_8__iPhone_7__iPhone_6s__iPhone_6__4.7__iPhone_SE', 375, 667, 2],
  ['4__iPhone_SE__iPod_touch_5th_generation_and_later', 320, 568, 2],
  ['13__iPad_Pro_M4', 1032, 1376, 2],
  ['12.9__iPad_Pro', 1024, 1366, 2],
  ['11__iPad_Pro_M4', 834, 1210, 2],
  ['11__iPad_Pro__10.5__iPad_Pro', 834, 1194, 2],
  ['10.9__iPad_Air', 820, 1180, 2],
  ['10.5__iPad_Air', 834, 1112, 2],
  ['10.2__iPad', 810, 1080, 2],
  ['9.7__iPad_Pro__7.9__iPad_mini__9.7__iPad_Air__9.7__iPad', 768, 1024, 2],
  ['8.3__iPad_Mini', 744, 1133, 2],
];

export const splashScreens = (['landscape', 'portrait'] as const).flatMap((orientation) =>
  devices.map(([name, width, height, ratio]) => ({
    url: `splash_screens/${name}_${orientation}.png`,
    media: `screen and (device-width: ${width}px) and (device-height: ${height}px) and (-webkit-device-pixel-ratio: ${ratio}) and (orientation: ${orientation})`,
  })),
);
