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

export type SpectralLine = {
  nm: number;
  element: "H" | "Mg" | "Na" | "Ca";
  label: string; // e.g. "Hα", "Hβ", "Mg b", "Na D"
  transition?: { from: number; to: number }; // hydrogen only
};

export const SPECTRAL_LINES: SpectralLine[] = [
  { nm: 410.2, element: "H", label: "Hδ", transition: { from: 6, to: 2 } },
  { nm: 434.0, element: "H", label: "Hγ", transition: { from: 5, to: 2 } },
  { nm: 486.1, element: "H", label: "Hβ", transition: { from: 4, to: 2 } },
  { nm: 517.3, element: "Mg", label: "Mg b" },
  { nm: 589.0, element: "Na", label: "Na D" },
  { nm: 656.3, element: "H", label: "Hα", transition: { from: 3, to: 2 } },
];

/** Returns the known spectral line closest to `nm` within `tol` nm, or null. */
export function nearestLine(nm: number, tol = 5): SpectralLine | null {
  let closest: SpectralLine | null = null;
  let minDist = Infinity;
  for (const line of SPECTRAL_LINES) {
    const dist = Math.abs(line.nm - nm);
    if (dist < minDist) {
      minDist = dist;
      closest = line;
    }
  }
  return closest !== null && minDist <= tol ? closest : null;
}
