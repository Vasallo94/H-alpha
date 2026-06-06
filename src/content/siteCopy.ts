import type { Locale } from "../i18n/routes";

type GlossaryEntry = {
  term: string;
  short: string;
  detail: string;
};

type SeasonalSafetyCallout = {
  enabled: boolean;
  date: "2026-08-12";
  title: string;
  body: string;
};

type SpectrumExplorerCopy = {
  ariaLabel: string;
  label: string;
  body: string;
  lineLabel: string;
  controlLabel: string;
  selectedLabel: string;
};

type FilterCardCopy = {
  title: string;
  tag: string;
  body: string;
};

type SectionCopy = {
  spectrum: {
    eyebrow: string;
    heading: string;
    leadStart: string;
    leadEnd: string;
    explorer: SpectrumExplorerCopy;
  };
  filters: {
    eyebrow: string;
    heading: string;
    lead: string;
    ariaLabel: string;
    cards: FilterCardCopy[];
  };
  opticalSystem: {
    eyebrow: string;
    heading: string;
    leadStart: string;
    leadMiddle: string;
    leadEnd: string;
  };
  safety: {
    eyebrow: string;
    heading: string;
  };
};

type SiteCopy = {
  meta: { title: string; description: string };
  nav: { physics: string; filters: string; safety: string; image: string };
  languageLabel: string;
  hero: { eyebrow: string; title: string; intro: string };
  sections: SectionCopy;
  glossary: Record<string, GlossaryEntry>;
  seasonalSafetyCallout: SeasonalSafetyCallout;
};

export const siteCopy: Record<Locale, SiteCopy> = {
  es: {
    meta: {
      title: "Cómo funciona un telescopio H-alpha",
      description: "Una guía visual sobre la física, seguridad y óptica de los telescopios solares H-alpha.",
    },
    nav: { physics: "Física", filters: "Filtros", safety: "Seguridad", image: "Imagen real" },
    languageLabel: "English",
    hero: {
      eyebrow: "Sol en una sola línea espectral",
      title: "Cómo un telescopio H-alpha revela la cromosfera",
      intro: "Una explicación visual, segura y bilingüe de la línea H-alpha, los etalones, el tuning y los filtros solares.",
    },
    sections: {
      spectrum: {
        eyebrow: "656,28 nm",
        heading: "H-alpha es una línea, no solo un color",
        leadStart: "El telescopio selecciona un ",
        leadEnd: " alrededor de hidrógeno-alfa, revelando estructuras en la cromosfera solar.",
        explorer: {
          ariaLabel: "Explorador del espectro visible y la línea H-alpha",
          label: "Panel espectral",
          body: "Mueve el selector para ver lo estrecha que es la ventana H-alpha dentro del espectro visible.",
          lineLabel: "Línea H-alpha: 656,28 nm",
          controlLabel: "Longitud de onda seleccionada",
          selectedLabel: "Selección",
        },
      },
      filters: {
        eyebrow: "Comparación segura",
        heading: "Cada filtro solar protege para un uso distinto",
        lead: "La seguridad depende de usar el filtro correcto en el lugar correcto: delante de los ojos, delante del telescopio o dentro de un sistema H-alpha completo.",
        ariaLabel: "Comparación de tipos de filtros solares",
        cards: [
          {
            title: "Gafas de eclipse",
            tag: "Sin aumento",
            body: "Sirven para mirar el Sol directamente sin óptica de aumento cuando cumplen ISO 12312-2.",
          },
          {
            title: "Filtro telescópico de luz blanca",
            tag: "Apertura frontal",
            body: "Reduce toda la luz solar antes de entrar al telescopio y muestra fotosfera, manchas y granulación.",
          },
          {
            title: "Telescopio H-alpha",
            tag: "Sistema dedicado",
            body: "Combina rechazo de energía, etalon y blocking filter para aislar la cromosfera con seguridad.",
          },
        ],
      },
      opticalSystem: {
        eyebrow: "Cadena óptica",
        heading: "Un telescopio H-alpha seguro es un sistema",
        leadStart: "El ",
        leadMiddle: " selecciona la línea espectral, mientras que el ",
        leadEnd: " mantiene la luz residual peligrosa fuera del recorrido final de la imagen.",
      },
      safety: {
        eyebrow: "Seguridad solar",
        heading: "Los filtros solares no son intercambiables",
      },
    },
    glossary: {
      angstrom: {
        term: "angstrom",
        short: "Unidad de longitud muy pequeña usada en espectroscopía.",
        detail: "Un angstrom equivale a 0,1 nanómetros. En H-alpha se usa para hablar de anchuras de banda extremadamente estrechas.",
      },
      bandpass: {
        term: "bandpass",
        short: "La anchura de longitudes de onda que deja pasar un filtro.",
        detail: "En H-alpha, un bandpass menor de 0,5 A ayuda a aislar la cromosfera y aumentar el contraste de filamentos y protuberancias.",
      },
      etalon: {
        term: "etalon",
        short: "Filtro interferencial que selecciona una ventana espectral muy estrecha.",
        detail: "Un etalon usa interferencia entre superficies ópticas para dejar pasar longitudes de onda concretas y rechazar muchas otras.",
      },
      blockingFilter: {
        term: "blocking filter",
        short: "Filtro de seguridad que bloquea luz residual peligrosa.",
        detail: "En un telescopio H-alpha visual o de imagen, el blocking filter forma parte del sistema seguro. No debe retirarse ni sustituirse por piezas improvisadas.",
      },
    },
    seasonalSafetyCallout: {
      enabled: true,
      date: "2026-08-12",
      title: "Contexto 2026: eclipse total del 12 de agosto",
      body: "Las gafas de eclipse sirven para mirar el Sol sin aumento cuando cumplen ISO 12312-2 y vienen de proveedores fiables. No sirven para mirar a través de telescopios, prismáticos o cámaras.",
    },
  },
  en: {
    meta: {
      title: "How an H-alpha Telescope Works",
      description: "A visual guide to the physics, safety, and optics of H-alpha solar telescopes.",
    },
    nav: { physics: "Physics", filters: "Filters", safety: "Safety", image: "Real image" },
    languageLabel: "Español",
    hero: {
      eyebrow: "The Sun in one spectral line",
      title: "How an H-alpha telescope reveals the chromosphere",
      intro: "A visual, safe, bilingual explanation of the H-alpha line, etalons, tuning, and solar filters.",
    },
    sections: {
      spectrum: {
        eyebrow: "656.28 nm",
        heading: "H-alpha is a line, not just a color",
        leadStart: "The telescope selects a narrow ",
        leadEnd: " around hydrogen-alpha, revealing structures in the solar chromosphere.",
        explorer: {
          ariaLabel: "Explorer for the visible spectrum and the H-alpha line",
          label: "Spectrum panel",
          body: "Move the selector to see how narrow the H-alpha window is within the visible spectrum.",
          lineLabel: "H-alpha line: 656.28 nm",
          controlLabel: "Selected wavelength",
          selectedLabel: "Selection",
        },
      },
      filters: {
        eyebrow: "Safe comparison",
        heading: "Each solar filter protects for a different use",
        lead: "Safety depends on using the right filter in the right place: in front of your eyes, in front of the telescope, or inside a complete H-alpha system.",
        ariaLabel: "Comparison of solar filter types",
        cards: [
          {
            title: "Eclipse glasses",
            tag: "No magnification",
            body: "They are for direct unmagnified solar viewing when they comply with ISO 12312-2.",
          },
          {
            title: "White-light telescope filter",
            tag: "Front aperture",
            body: "It reduces all sunlight before it enters the telescope and shows the photosphere, sunspots, and granulation.",
          },
          {
            title: "H-alpha telescope",
            tag: "Dedicated system",
            body: "It combines energy rejection, an etalon, and a blocking filter to isolate the chromosphere safely.",
          },
        ],
      },
      opticalSystem: {
        eyebrow: "Optical chain",
        heading: "A safe H-alpha telescope is a system",
        leadStart: "The ",
        leadMiddle: " selects the spectral line, while the ",
        leadEnd: " keeps dangerous residual light out of the final image path.",
      },
      safety: {
        eyebrow: "Solar safety",
        heading: "Solar filters are not interchangeable",
      },
    },
    glossary: {
      angstrom: {
        term: "angstrom",
        short: "A very small length unit used in spectroscopy.",
        detail: "One angstrom is 0.1 nanometers. In H-alpha observing, it describes extremely narrow filter bandwidths.",
      },
      bandpass: {
        term: "bandpass",
        short: "The range of wavelengths a filter allows through.",
        detail: "In H-alpha, a bandpass below 0.5 A helps isolate the chromosphere and increase contrast in filaments and prominences.",
      },
      etalon: {
        term: "etalon",
        short: "An interference filter that selects a very narrow spectral window.",
        detail: "An etalon uses interference between optical surfaces to transmit selected wavelengths and reject many others.",
      },
      blockingFilter: {
        term: "blocking filter",
        short: "A safety filter that blocks dangerous residual light.",
        detail: "In visual or imaging H-alpha telescopes, the blocking filter is part of the safe system. It must not be removed or replaced with improvised parts.",
      },
    },
    seasonalSafetyCallout: {
      enabled: true,
      date: "2026-08-12",
      title: "2026 Context: August 12 Total Solar Eclipse",
      body: "Eclipse glasses are for unmagnified solar viewing when they comply with ISO 12312-2 and come from reliable suppliers. They are not for use through telescopes, binoculars, or cameras.",
    },
  },
};
