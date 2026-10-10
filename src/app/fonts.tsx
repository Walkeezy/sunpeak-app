import { Archivo } from 'next/font/google';

// One family in two widths: the condensed cut carries the signage, the normal cut the reading text
export const archivo = Archivo({
  variable: '--font-archivo',
  subsets: ['latin'],
  display: 'swap',
  axes: ['wdth'],
});
