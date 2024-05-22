import { FC } from 'react';
import { IconProps } from '../../types';

export const RefreshIcon: FC<IconProps> = ({ size = 18, color = '#FFFFFF' }) => (
  <svg width={size} height={size} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M0.363061 256C0.343387 210.237 12.6086 165.308 35.8783 125.903C59.1479 86.4978 92.5688 54.0616 132.652 31.9805C172.735 9.89934 218.011 -1.01709 263.753 0.370789C309.495 1.75867 354.025 15.4 392.696 39.8706L425.487 7.10262C428.741 3.84925 432.888 1.63524 437.402 0.741146C441.916 -0.152943 446.594 0.313146 450.843 2.08035C455.091 3.84755 458.72 6.83631 461.268 10.6678C463.817 14.4994 465.17 19.0012 465.157 23.6028V116.562C465.157 122.725 462.709 128.636 458.351 132.995C453.992 137.353 448.081 139.801 441.918 139.801H348.959C344.363 139.8 339.871 138.437 336.05 135.883C332.229 133.33 329.251 129.7 327.493 125.454C325.734 121.209 325.274 116.537 326.17 112.029C327.067 107.522 329.279 103.381 332.528 100.131L358.743 73.9168C326.933 55.9296 290.963 46.5964 254.421 46.8482C217.878 47.0999 182.04 56.9277 150.481 75.3515C118.922 93.7752 92.7449 120.151 74.56 151.848C56.3751 183.546 46.8182 219.457 46.8425 256C46.8425 262.164 44.394 268.075 40.0357 272.433C35.6774 276.791 29.7663 279.24 23.6028 279.24C17.4392 279.24 11.5281 276.791 7.16981 272.433C2.81152 268.075 0.363061 262.164 0.363061 256ZM488.397 232.76C482.234 232.76 476.322 235.209 471.964 239.567C467.606 243.925 465.157 249.836 465.157 256C465.096 311.453 443.04 364.617 403.829 403.829C364.617 443.04 311.453 465.096 256 465.157C219.985 465.222 184.577 455.881 153.28 438.06L179.472 411.869C182.721 408.619 184.933 404.478 185.83 399.971C186.726 395.463 186.266 390.791 184.507 386.545C182.749 382.3 179.771 378.67 175.95 376.117C172.129 373.563 167.637 372.2 163.041 372.199H70.0822C63.9186 372.199 58.0075 374.647 53.6492 379.005C49.291 383.364 46.8425 389.275 46.8425 395.438V488.397C46.8413 492.993 48.203 497.486 50.7553 501.309C53.3075 505.131 56.9358 508.11 61.1814 509.871C64.0011 511.046 67.0273 511.647 70.0822 511.637C76.2453 511.636 82.1554 509.186 86.5127 504.828L119.304 472.129C160.154 498.099 207.594 511.81 256 511.637C323.775 511.557 388.75 484.598 436.674 436.674C484.598 388.75 511.557 323.775 511.637 256C511.637 249.836 509.188 243.925 504.83 239.567C500.472 235.209 494.561 232.76 488.397 232.76Z"
      fill={color}
    />
  </svg>
);
