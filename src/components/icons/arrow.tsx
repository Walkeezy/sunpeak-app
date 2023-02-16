import { IconProps } from '../../types';

export default function ArrowIcon({ size = 16, color = '#666666' }: IconProps): JSX.Element {
  return (
    <svg width={size} height={size} viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M793.195 6.80463C786.328 -0.0625966 775.873 -1.94572 767.041 2.1317L13.5073 349.154C4.87499 353.115 -0.454264 361.946 0.0321651 371.435C0.486404 380.922 6.69731 389.154 15.7016 392.233L247.249 471.437C285.428 484.517 315.429 514.516 328.507 552.696L407.768 784.302C410.844 793.276 419.08 799.487 428.567 799.971C438.056 800.456 446.887 795.098 450.846 786.496L797.868 32.9573C801.942 24.1265 800.063 13.6701 793.195 6.80463Z"
        fill={color}
      />
    </svg>
  );
}
