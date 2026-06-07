export const H_ALPHA_NM = 656.28;

export type Window = { centerOffset: number; fwhm: number }; // ångströms

export function gaussian(x: number, mu: number, sigma: number): number {
  return Math.exp(-((x - mu) ** 2) / (2 * sigma ** 2));
}

const fwhmToSigma = (fwhm: number) => fwhm / 2.3548;

// Transmission of the etalon window at a given offset (Å) from line center.
export function transmissionWindow(deltaA: number, w: Window): number {
  return gaussian(deltaA, w.centerOffset, fwhmToSigma(w.fwhm));
}

// Qualitative disk contrast: line is an absorption dip modeled as a gaussian
// of width ~0.5 Å at center; narrower windows sample the core -> more contrast.
export function contrastUnderWindow(w: Window, lineFwhm = 0.5): number {
  const sigmaLine = fwhmToSigma(lineFwhm);
  const sigmaWin = fwhmToSigma(w.fwhm);
  // overlap of two gaussians (window vs line core), penalized by window width
  const overlap = gaussian(w.centerOffset, 0, Math.hypot(sigmaLine, sigmaWin));
  return overlap / (1 + sigmaWin);
}

export type View = "disk" | "prominence" | "washed";

export function classifyView(w: Window): View {
  if (Math.abs(w.centerOffset) > 0.25) return "prominence";
  if (w.fwhm > 0.7) return "washed";
  return "disk";
}

// Rydberg for hydrogen Balmer-ish mapping (pedagogical).
export function wavelengthToTransition(nm: number): { from: number; to: number } {
  // H-alpha 656 (3->2), H-beta 486 (4->2), H-gamma 434 (5->2)
  if (nm >= 600) return { from: 3, to: 2 };
  if (nm >= 460) return { from: 4, to: 2 };
  return { from: 5, to: 2 };
}
