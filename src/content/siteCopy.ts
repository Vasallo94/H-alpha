import type { Locale } from "../i18n/routes";

type Paragraph = string;

export type DeepDive = {
  title: string;
  paragraphs: Paragraph[];
  formula?: string;
};

export type Section = {
  eyebrow: string;
  heading: string;
  lead: string;
  body: Paragraph[];
  deepDive?: DeepDive;
};

export type SafetyRule = { title: string; body: string };

export type ImageAnnotation = {
  id: string;
  x: number; // percent 0-100
  y: number; // percent 0-100
  label: string;
  description: string;
};

type GlossaryEntry = { term: string; short: string; detail: string };

type SeasonalSafetyCallout = {
  enabled: boolean;
  date: "2026-08-12";
  title: string;
  body: string;
};

type SiteCopy = {
  meta: { title: string; description: string };
  nav: { origin: string; etalon: string; tuning: string; safety: string; image: string };
  languageLabel: string;
  hero: { eyebrow: string; title: string; intro: string; imageAlt: string };
  sections: {
    origin: Section;
    spectrum: Section;
    etalon: Section;
    tuning: Section;
    opticalSystem: Section;
    filters: Section;
  };
  safety: {
    eyebrow: string;
    heading: string;
    rules: SafetyRule[];
    seasonalCallout: SeasonalSafetyCallout;
  };
  finalImage: {
    eyebrow: string;
    heading: string;
    lead: string;
    caption: string;
    imageAlt: string;
    annotations: ImageAnnotation[];
  };
  glossary: Record<string, GlossaryEntry>;
  diagrams: {
    hydrogenLevels: Record<string, string>;
    sunLayers: Record<string, string>;
    etalon: Record<string, string>;
    opticalChain: Record<string, string>;
    threeMethods: Record<string, string>;
    dopplerTuning: Record<string, string>;
  };
  interactive: {
    spectrumExplorer: {
      aria: string;
      control: string;
      selected: string;
      hydrogenTransition: string;
      notHydrogen: string;
      continuum: string;
      elements: {
        H: string;
        Mg: string;
        Na: string;
        Ca: string;
      };
    };
    tuningSimulator: {
      aria: string;
      width: string;
      offset: string;
      contrast: string;
      views: { disk: string; prominence: string; washed: string };
    };
    filterComparison: {
      aria: string;
      fieldWhere: string;
      fieldPasses: string;
      fieldLayer: string;
      methods: { id: string; name: string; where: string; passes: string; layer: string }[];
    };
  };
};

export const siteCopy: Record<Locale, SiteCopy> = {
  es: {
    meta: {
      title: "Cómo funciona un telescopio H‑alpha",
      description:
        "Material didáctico bilingüe sobre la física de la línea H‑alpha, los etalones Fabry-Pérot, el tuning, la cadena óptica solar y la seguridad.",
    },
    nav: {
      origin: "El origen",
      etalon: "El etalon",
      tuning: "Tuning",
      safety: "Seguridad",
      image: "Imagen real",
    },
    languageLabel: "English",
    hero: {
      eyebrow: "El Sol en una sola línea de color",
      title: "¿Por qué el Sol se ve tan distinto en H‑alpha?",
      intro:
        "A simple vista el Sol es un disco liso y amarillento. En la luz de la línea H‑alpha, en cambio, se cubre de filamentos oscuros, plages brillantes y enormes protuberancias en el borde. No es otro Sol: es la misma estrella vista en un único color. Aquí explicamos, paso a paso, qué hace ese color especial, cómo un instrumento lo aísla y por qué se hace de forma segura.",
      imageAlt:
        "Disco solar completo fotografiado en la línea H‑alpha, mostrando filamentos oscuros, regiones brillantes y protuberancias en el limbo.",
    },
    sections: {
      origin: {
        eyebrow: "El origen de la línea · 656,28 nm",
        heading: "¿Por qué el Sol brilla en H‑alpha?",
        lead: "Todo empieza por el átomo más simple del universo: el hidrógeno, del que está hecho casi todo el Sol.",
        body: [
          "El Sol es, en su inmensa mayoría, hidrógeno. Y cada elemento químico tiene una especie de huella dactilar: solo absorbe y emite luz en colores muy concretos, no en cualquiera. El hidrógeno tiene varios de esos colores característicos, y uno de ellos cae en el rojo profundo, en una longitud de onda de 656,28 nanómetros. A esa línea la llamamos hidrógeno-alfa, o H‑alpha.",
          "Ese color lo produce el hidrógeno cuando uno de sus electrones salta a un orbital de menor energía y libera exactamente esa cantidad de energía en forma de luz roja. Como todos los átomos de hidrógeno son idénticos, todos emiten y absorben justo en esa misma longitud de onda: por eso la línea es tan nítida y tan fiable como referencia.",
          "Sobre la superficie visible del Sol hay una capa fina y tenue llamada cromosfera, hecha sobre todo de hidrógeno. Esa capa brilla precisamente en H‑alpha. El problema es que su luz queda completamente ahogada por el resplandor blanco y deslumbrante de la superficie. Un filtro que solo deje pasar el color H‑alpha apaga ese resplandor y deja ver, por fin, la cromosfera encendida: filamentos, plages y protuberancias.",
        ],
        deepDive: {
          title: "La física: el modelo de Bohr y la serie de Balmer",
          paragraphs: [
            "En el modelo de Bohr, el electrón del hidrógeno solo puede ocupar orbitales con energías concretas, etiquetados por un número entero n = 1, 2, 3... Cuanto mayor es n, más arriba y más débilmente ligado está el electrón. La energía no es continua: está cuantizada, lo que significa que el átomo solo puede ganar o perder energía en saltos discretos entre esos niveles de energía.",
            "Cuando un electrón cae de un nivel alto a uno más bajo, el átomo emite un fotón cuya energía es exactamente la diferencia entre ambos niveles. La línea H‑alpha corresponde a la transición n=3 → n=2. Las transiciones que terminan en n=2 forman la llamada serie de Balmer, que cae en el visible; H‑alpha es la primera y más intensa de esa serie.",
            "La energía del salto fija el color de la luz mediante la relación de Planck-Einstein: a mayor energía, menor longitud de onda. Para la transición n=3 → n=2 esa energía corresponde a λ = 656,28 nm, el rojo profundo de H‑alpha.",
            "El mismo nivel de energía explica dos cosas opuestas que vemos en el Sol. Sobre el disco, el hidrógeno frío de la cromosfera absorbe la luz blanca que viene de abajo y crea una línea oscura: es una de las líneas de Fraunhofer, una raya negra sobre el espectro continuo. En el limbo y en las protuberancias, en cambio, no hay fondo brillante detrás, y ese mismo hidrógeno emite su luz H‑alpha contra el cielo negro: lo vemos en emisión, brillante.",
          ],
          formula: "E = h·c / λ",
        },
      },
      spectrum: {
        eyebrow: "El espectro solar",
        heading: "El espectro no es un arcoíris liso",
        lead: "Si descomponemos la luz del Sol con cuidado, el arcoíris aparece cruzado por finas rayas oscuras. H‑alpha es una de ellas.",
        body: [
          "Cuando separamos la luz solar en sus colores esperamos un arcoíris continuo, pero al mirarlo de cerca aparece interrumpido por cientos de líneas oscuras muy estrechas. Son las líneas de Fraunhofer, y cada una marca un color que ha sido absorbido por un elemento concreto presente en el Sol antes de que su luz llegara hasta nosotros.",
          "Cada línea oscura es la firma de un átomo: el sodio, el calcio, el magnesio, el hierro y, por supuesto, el hidrógeno tienen las suyas. Las líneas del hidrógeno visible forman la serie de Balmer: todas son transiciones electrónicas que terminan en el nivel n=2. H‑alpha (n=3→2, 656,28 nm) es la primera y más intensa; le siguen H‑beta (n=4→2, 486,1 nm), H‑gamma (n=5→2, 434,0 nm) y H‑delta (n=6→2, 410,2 nm). Otras líneas oscuras del mismo espectro —como las de sodio (Na D, 589 nm) o magnesio (Mg b, 517 nm)— pertenecen a elementos distintos y no son transiciones del hidrógeno.",
          "Un telescopio solar de H‑alpha está diseñado para hacer exactamente lo contrario que el resto del espectro: en lugar de descartar la rendija de H‑alpha, se queda solo con ella y rechaza todo lo demás.",
        ],
        deepDive: {
          title: "Línea oscura en el disco, línea brillante en el limbo",
          paragraphs: [
            "Sobre el disco solar, la luz blanca brillante de la fotosfera atraviesa la cromosfera por encima. El hidrógeno de esa capa absorbe selectivamente los fotones de 656,28 nm, restándolos del fondo continuo. Por eso, en el espectro del disco, H‑alpha aparece como una línea de absorción: una muesca oscura sobre un fondo intenso.",
            "En el limbo del Sol y en las protuberancias que se elevan sobre él no hay fotosfera brillante detrás, sino el cielo oscuro. Ese mismo hidrógeno, en lugar de absorber, emite sus propios fotones H‑alpha. El resultado es una línea de emisión brillante. Es el motivo de que las protuberancias se vean encendidas en el borde mientras los filamentos (el mismo gas, pero proyectado sobre el disco) se vean oscuros: son el anverso y el reverso del mismo fenómeno.",
            "La serie de Balmer completa las transiciones al nivel n=2 del hidrógeno. Solo H‑alpha, H‑beta, H‑gamma y H‑delta caen en el visible; las de n más alto caen en el ultravioleta. Las demás líneas oscuras del espectro solar (sodio, magnesio, calcio, hierro…) corresponden a transiciones electrónicas de esos otros elementos y no tienen relación con la serie de Balmer.",
          ],
        },
      },
      etalon: {
        eyebrow: "El corazón del instrumento",
        heading: "El etalon: cómo se aísla un solo color",
        lead: "Quedarse solo con una rendija de 0,5 ångström en pleno rojo es un reto óptico extremo. La solución es la interferencia de la luz.",
        body: [
          "El componente clave de un telescopio H‑alpha es el etalon, también llamado interferómetro de Fabry-Pérot. En esencia son dos superficies de vidrio planísimas, casi como espejos, muy paralelas entre sí y separadas por una distancia diminuta y controlada con enorme precisión. Cada superficie refleja parte de la luz y deja pasar otra parte.",
          "Cuando la luz entra en ese hueco, rebota muchas veces de un lado a otro antes de salir. En cada viaje, las ondas que salen se superponen con las que ya habían salido. Para la mayoría de los colores esas ondas quedan desfasadas y se cancelan unas a otras (interferencia destructiva). Pero para unos pocos colores muy concretos, las ondas salen perfectamente sincronizadas y se refuerzan (interferencia constructiva).",
          "El resultado es que el etalon solo deja pasar una rendija de color extremadamente estrecha. Ajustando la separación entre las placas, esa rendija se sitúa justo sobre H‑alpha. Es como un coro de miles de reflexiones que solo cantan al unísono en una única nota: la del rojo a 656,28 nm.",
        ],
        deepDive: {
          title: "Fabry-Pérot: picos de Airy, FSR, finesse y FWHM",
          paragraphs: [
            "La condición de interferencia constructiva es 2·n·d·cosθ = m·λ, donde d es la separación entre placas, n el índice del medio entre ellas, θ el ángulo del rayo respecto a la normal y m un número entero (el orden). Para cada orden m hay una longitud de onda que cumple la condición y sale reforzada.",
            "Por eso la curva de transmisión del etalon no es una sola caja limpia, sino una serie de picos muy finos y regulares: los picos de Airy. La distancia espectral entre dos picos consecutivos se llama rango espectral libre (FSR). Como hay muchos picos, el etalon por sí solo no basta: hace falta un prefiltro (el ERF y a veces un filtro de banda más ancha) que deje pasar la zona alrededor de H‑alpha y elimine los demás órdenes.",
            "La anchura de cada pico se mide por su FWHM (anchura a media altura). La finesse del etalon es la relación entre el FSR y la FWHM, y depende sobre todo de la reflectividad de las superficies: cuanta más reflectividad, más reflexiones efectivas y más estrechos los picos.",
            "Para que la cromosfera destaque sobre el disco, el bandpass (la FWHM) debe ser muy estrecho, típicamente por debajo de 0,5 ångström. Si la ventana es más ancha, deja entrar demasiada luz del continuo fotosférico y el contraste de los filamentos se pierde: el disco vuelve a verse liso.",
          ],
          formula: "2·n·d·cosθ = m·λ",
        },
      },
      tuning: {
        eyebrow: "Afinar la ventana",
        heading: "Tuning: por qué cambia lo que ves",
        lead: "La rendija de color del etalon se puede desplazar un poco. Ese pequeño ajuste decide si ves mejor el disco o el material en movimiento.",
        body: [
          "El centro exacto de la rendija de color que deja pasar el etalon no es completamente fijo: se puede afinar ligeramente. A eso lo llamamos tuning. Desplazar la ventana solo unas centésimas de ångström cambia de forma sorprendente lo que aparece en la imagen.",
          "Con la ventana centrada justo en H‑alpha se ve mejor el disco: los filamentos oscuros, las plages brillantes y la textura fina de la cromosfera. Si en cambio desplazamos la ventana hacia un ala de la línea —hacia el azul o hacia el rojo— se realza el material que se mueve a gran velocidad, como las protuberancias y las erupciones, porque su luz aparece corrida de color por efecto Doppler.",
          "Por eso un mismo telescopio puede mostrar dos Soles distintos según cómo se afine: uno centrado en el detalle quieto del disco y otro desplazado para cazar los chorros y arcos de gas en movimiento. Afinar es, en el fondo, elegir qué historia del Sol quieres contar en ese momento.",
        ],
        deepDive: {
          title: "Pressure tuning, tilt tuning y el efecto Doppler",
          paragraphs: [
            "Hay dos formas habituales de afinar un etalon. El pressure tuning cambia la presión —y por tanto el índice de refracción n— del gas encerrado entre las placas, lo que desplaza la condición 2·n·d·cosθ = m·λ y mueve el pico de transmisión. El tilt tuning inclina el etalon un pequeño ángulo θ: como en la ecuación aparece cosθ, inclinarlo desplaza el pico hacia el azul.",
            "El material en movimiento entra en juego por el efecto Doppler: el gas que se acerca a nosotros emite H‑alpha corrido hacia el azul, y el que se aleja, hacia el rojo. Al desplazar la ventana del etalon hacia un ala, la sintonizamos con ese gas Doppler-corrido y lo hacemos visible, mientras el gas en reposo se atenúa.",
            "Todo esto implica un compromiso permanente entre contraste y luz. Una ventana más estrecha y bien centrada da más contraste cromosférico, pero deja pasar menos luz y exige exposiciones más largas o una imagen más oscura. Afinar bien es encontrar el equilibrio para el detalle concreto que se quiere observar.",
          ],
        },
      },
      opticalSystem: {
        eyebrow: "La cadena completa",
        heading: "El sistema óptico, pieza a pieza",
        lead: "El etalon no trabaja solo. Forma parte de una cadena en la que cada eslabón es imprescindible, y algunos lo son por seguridad.",
        body: [
          "Un telescopio solar H‑alpha es una cadena ordenada de componentes, y la luz los atraviesa en este orden: objetivo → filtro de rechazo de energía (ERF) → etalon → blocking filter → ojo o cámara. Si falta cualquiera de ellos, el sistema deja de funcionar o deja de ser seguro.",
          "El objetivo recoge la luz del Sol. A continuación, el ERF (Energy Rejection Filter), situado al frente, rechaza la inmensa mayoría de la energía: casi todo el infrarrojo, el ultravioleta y buena parte del calor, dejando pasar principalmente la zona del rojo alrededor de H‑alpha. Sin él, ese calor concentrado destruiría el etalon y sería peligrosísimo.",
          "Después actúa el etalon, que selecciona la rendija de color de H‑alpha. Pero a su salida todavía quedan los demás órdenes de transmisión y luz residual fuera de banda. De eso se encarga el blocking filter, justo antes del ojo o la cámara: bloquea esa luz sobrante, deja una imagen limpia en H‑alpha y protege al observador. Solo entonces la luz llega con seguridad al ojo o al sensor.",
        ],
        deepDive: {
          title: "Qué pasa si falta el ERF o el blocking filter",
          paragraphs: [
            "Sin el ERF, toda la energía solar recogida por el objetivo —incluido el infrarrojo invisible y el calor— llegaría concentrada hasta el etalon. El etalon, una pieza óptica delicada y muy fina, se calentaría, se deformaría y se arruinaría; y la energía acumulada en el camino representa un riesgo grave de quemadura e incendio. El ERF es la primera línea de defensa que descarta el grueso de la energía antes de que entre en el instrumento.",
            "Sin el blocking filter, aunque el etalon haya seleccionado H‑alpha, seguirían pasando los demás órdenes del etalon y luz fuera de banda potencialmente dañina, además de un brillo residual que arruinaría el contraste. Para el ojo eso es peligroso, porque parte de esa luz es intensa e invisible. Por eso un telescopio H‑alpha nunca se usa sin su blocking filter o diagonal correspondiente: no es un accesorio opcional, es parte del sistema de seguridad.",
          ],
        },
      },
      filters: {
        eyebrow: "Tres métodos, tres problemas",
        heading: "Comparación de filtros solares",
        lead: "No todos los filtros solares hacen lo mismo. Cada método resuelve un problema distinto y se coloca en un lugar distinto.",
        body: [
          "Existen tres grandes formas de mirar el Sol con seguridad, y conviene no confundirlas porque funcionan de maneras muy diferentes. Las gafas de eclipse certificadas (ISO 12312-2) se ponen delante de los ojos y solo sirven para mirar a simple vista, sin ningún instrumento que concentre la luz.",
          "El filtro solar de luz blanca se coloca delante de la apertura del telescopio o de los prismáticos, antes de que la luz entre en la óptica. Atenúa de forma pareja todo el espectro hasta un nivel seguro y muestra la fotosfera: el disco, las manchas solares y la granulación. Es como ponerse unas gafas de sol muy oscuras para todo el espectro a la vez.",
          "El telescopio H‑alpha es un sistema dedicado completo, no un simple filtro: combina el rechazo de energía, el etalon y el blocking filter para quedarse con una única rendija de color y revelar la cromosfera. El primero atenúa todo por igual; el segundo selecciona un color. Son herramientas para fines distintos, no intercambiables.",
        ],
        deepDive: {
          title: "Atenuación neutra frente a rechazo de energía más selección espectral",
          paragraphs: [
            "Un filtro de luz blanca actúa, en esencia, como un filtro de densidad neutra (ND): atenúa todas las longitudes de onda visibles más o menos por igual hasta un nivel seguro, conservando la forma del espectro pero reduciendo enormemente su intensidad. Lo que llega es una versión muy oscurecida del Sol completo, en la que se ve la fotosfera.",
            "Un sistema H‑alpha hace algo cualitativamente distinto en dos pasos: primero rechaza la energía (el ERF descarta el grueso del flujo, sobre todo infrarrojo y ultravioleta) y después selecciona el espectro (el etalon y el blocking filter dejan pasar solo la rendija de H‑alpha). No es una atenuación uniforme: es una selección quirúrgica de un color, que es justo lo que permite ver la cromosfera y no la fotosfera.",
          ],
        },
      },
    },
    safety: {
      eyebrow: "Seguridad solar",
      heading: "Reglas que no cambian nunca",
      rules: [
        {
          title: "Las gafas de eclipse no se usan con óptica",
          body: "Las gafas de eclipse certificadas (ISO 12312-2) son solo para mirar el Sol a ojo desnudo. Nunca se usan con telescopio, prismáticos ni cámara: la óptica concentra la luz y la atravesaría al instante, con peligro de ceguera permanente.",
        },
        {
          title: "Todo instrumento óptico necesita su propio filtro",
          body: "Cualquier telescopio, prismático o cámara que apunte al Sol necesita un filtro solar frontal adecuado o formar parte de un sistema solar dedicado. La luz debe filtrarse antes de entrar en la óptica, no después.",
        },
        {
          title: "Un telescopio H‑alpha no se usa sin su blocking filter",
          body: "El blocking filter (o la diagonal de bloqueo) forma parte del sistema de seguridad de un telescopio H‑alpha. Nunca se retira ni se observa sin él: deja pasar luz residual peligrosa para la vista.",
        },
        {
          title: "No se improvisan filtros solares",
          body: "Radiografías, CD, vidrios ahumados, gafas de sol o filtros caseros no protegen frente al Sol. Solo se usan filtros solares fabricados y certificados para ese fin.",
        },
        {
          title: "Los buscadores se usan por proyección",
          body: "Nunca se mira por el buscador de un telescopio apuntando al Sol. Se localiza el Sol por la sombra del tubo o por proyección, o se usa un buscador solar dedicado.",
        },
      ],
      seasonalCallout: {
        enabled: true,
        date: "2026-08-12",
        title: "Contexto 2026: eclipse total del 12 de agosto",
        body: "El 12 de agosto de 2026 habrá un eclipse solar total. Las gafas de eclipse sirven para mirar el Sol sin aumento cuando cumplen ISO 12312-2 y proceden de proveedores fiables; durante la totalidad, y solo durante esos segundos, puede mirarse a simple vista. En cualquier otro momento, y siempre con telescopios, prismáticos o cámaras, hace falta un filtro solar adecuado.",
      },
    },
    finalImage: {
      eyebrow: "Pagar el gancho",
      heading: "Ahora sabes leer la imagen del principio",
      lead: "Esta es la misma imagen H‑alpha con la que abrimos. Con todo lo anterior, cada estructura tiene ya un nombre y una explicación.",
      caption: "Disco solar completo en H‑alpha. Pasa el cursor o toca los puntos para identificar cada estructura.",
      imageAlt:
        "Disco solar en H‑alpha con filamentos oscuros, protuberancias en el limbo, plages brillantes y textura cromosférica.",
      annotations: [
        {
          id: "filaments",
          x: 42,
          y: 51,
          label: "Filamentos",
          description:
            "Hebras oscuras sobre el disco: gas más frío suspendido por campos magnéticos. Es el mismo material que, en el borde, vemos como protuberancia brillante.",
        },
        {
          id: "plages",
          x: 40,
          y: 37,
          label: "Plages",
          description:
            "Regiones brillantes alrededor de zonas activas, asociadas a campos magnéticos intensos en la cromosfera.",
        },
        {
          id: "sunspot",
          x: 48,
          y: 38,
          label: "Mancha solar",
          description:
            "Zona más fría y oscura de una región activa, donde el campo magnético es intenso. En H‑alpha aparece como un punto oscuro rodeado de plages brillantes.",
        },
        {
          id: "prominences",
          x: 69,
          y: 31,
          label: "Protuberancias",
          description:
            "Arcos y chorros de gas que se elevan sobre el limbo. Brillan en emisión porque no tienen detrás el fondo deslumbrante de la fotosfera.",
        },
        {
          id: "texture",
          x: 57,
          y: 60,
          label: "Textura cromosférica",
          description:
            "El moteado fino del disco son las espículas y la red cromosférica: pequeños chorros de gas que dan a la superficie su aspecto granulado.",
        },
      ],
    },
    glossary: {
      angstrom: {
        term: "ångström",
        short: "Unidad de longitud muy pequeña usada en espectroscopía.",
        detail: "Un ångström equivale a 0,1 nanómetros. En H‑alpha se usa para hablar de anchuras de banda extremadamente estrechas, por debajo de 0,5 Å.",
      },
      bandpass: {
        term: "bandpass",
        short: "La anchura de longitudes de onda que deja pasar un filtro.",
        detail: "En H‑alpha, un bandpass menor de 0,5 Å ayuda a aislar la cromosfera y aumentar el contraste de filamentos y protuberancias.",
      },
      etalon: {
        term: "etalon",
        short: "Filtro interferencial que selecciona una ventana espectral muy estrecha.",
        detail: "Un etalon (interferómetro de Fabry-Pérot) usa interferencia entre dos superficies casi espejadas para dejar pasar longitudes de onda concretas y rechazar muchas otras.",
      },
      blockingFilter: {
        term: "blocking filter",
        short: "Filtro de seguridad que bloquea la luz residual peligrosa.",
        detail: "En un telescopio H‑alpha visual o de imagen, el blocking filter forma parte del sistema seguro. No debe retirarse ni sustituirse por piezas improvisadas.",
      },
      chromosphere: {
        term: "cromosfera",
        short: "Capa fina del Sol, por encima de la superficie visible.",
        detail: "La cromosfera es una capa tenue de hidrógeno sobre la fotosfera. Brilla en H‑alpha y es donde se ven filamentos, plages y protuberancias.",
      },
      fraunhofer: {
        term: "líneas de Fraunhofer",
        short: "Líneas oscuras de absorción en el espectro solar.",
        detail: "Son las rayas oscuras que cruzan el arcoíris solar, cada una producida por la absorción de un elemento. H‑alpha es la línea de absorción del hidrógeno en 656,28 nm.",
      },
    },
    diagrams: {
      hydrogenLevels: {
        caption: "Niveles de energía del hidrógeno y la transición que produce H‑alpha.",
        aria: "Diagrama de los niveles de energía del átomo de hidrógeno con la transición n=3 a n=2 resaltada.",
        axisEnergy: "Energía",
        level1: "n=1",
        level2: "n=2",
        level3: "n=3",
        level4: "n=4",
        level5: "n=5",
        level6: "n=6",
        transitionLabel: "H‑alpha · 656,28 nm",
        transitionNote: "El electrón cae de n=3 a n=2 y emite luz roja.",
        balmerLabel: "Serie de Balmer (al nivel n=2)",
      },
      sunLayers: {
        caption: "Capas del Sol: qué ve la luz blanca y qué ve el H‑alpha.",
        aria: "Diagrama en sección de las capas del Sol, de la fotosfera a la corona.",
        photosphere: "Fotosfera",
        chromosphere: "Cromosfera",
        corona: "Corona",
        whiteLightLabel: "Luz blanca: ve la fotosfera",
        hAlphaLabel: "H‑alpha: ve la cromosfera",
        photosphereNote: "Superficie visible y brillante.",
        chromosphereNote: "Capa fina que brilla en H‑alpha.",
        coronaNote: "Atmósfera exterior tenue.",
      },
      etalon: {
        caption: "Interferómetro de Fabry-Pérot: reflexiones múltiples e interferencia.",
        aria: "Diagrama de un etalon con dos placas, rayos entrando, reflexiones múltiples y los perfiles de transmisión de Airy.",
        plateLabel: "Placas semiespejadas",
        gapLabel: "Separación d",
        incidentRay: "Luz entrante",
        constructive: "Interferencia constructiva (sale)",
        destructive: "Interferencia destructiva (se cancela)",
        angleLabel: "Ángulo θ",
        airyTitle: "Perfil de Airy",
        fsrLabel: "FSR",
        fwhmLabel: "FWHM",
        peakLabel: "Pico de transmisión",
      },
      opticalChain: {
        caption: "La cadena óptica completa de un telescopio H‑alpha.",
        aria: "Diagrama de la cadena óptica: objetivo, ERF, etalon, blocking filter y cámara u ojo.",
        sunlight: "Luz solar",
        objective: "Objetivo",
        erf: "ERF",
        etalon: "Etalon",
        blocking: "Blocking filter",
        camera: "Ojo / cámara",
        erfNote: "Rechaza la energía y el calor.",
        etalonNote: "Selecciona el color H‑alpha.",
        blockingNote: "Elimina la luz residual peligrosa.",
        energyDiscarded: "Energía descartada",
        erfMissing: "Sin él: se quema el etalon",
        blockingMissing: "Sin él: luz peligrosa al ojo",
      },
      threeMethods: {
        caption: "Tres métodos para mirar el Sol con seguridad.",
        aria: "Comparación de tres métodos: gafas de eclipse, filtro de luz blanca y telescopio H‑alpha.",
        eclipseGlasses: "Gafas de eclipse",
        whiteLight: "Filtro de luz blanca",
        hAlpha: "Telescopio H‑alpha",
        eclipsePlacement: "Delante de los ojos",
        whiteLightPlacement: "Delante de la apertura",
        hAlphaPlacement: "Sistema interno completo",
        eclipseReveals: "Solo a simple vista",
        whiteLightReveals: "Fotosfera y manchas",
        hAlphaReveals: "Cromosfera",
      },
      dopplerTuning: {
        caption: "Tuning y efecto Doppler: la ventana del etalon sobre la línea.",
        aria: "Diagrama de la línea H‑alpha desplazándose por efecto Doppler con la ventana de transmisión del etalon.",
        lineLabel: "Línea H‑alpha",
        windowLabel: "Ventana del etalon",
        blueshift: "Corrimiento al azul (se acerca)",
        redshift: "Corrimiento al rojo (se aleja)",
        centerLabel: "Centrado: disco",
        wingLabel: "En el ala: protuberancias",
        wavelengthAxis: "Longitud de onda",
      },
    },
    interactive: {
      spectrumExplorer: {
        aria: "Explorador del espectro visible: mueve el control para elegir una longitud de onda y ver qué línea de Fraunhofer corresponde.",
        control: "Longitud de onda",
        selected: "Seleccionado",
        hydrogenTransition: "Transición del hidrógeno",
        notHydrogen: "Otro elemento — no es hidrógeno",
        continuum: "Continuo (sin línea de Fraunhofer)",
        elements: {
          H: "Hidrógeno",
          Mg: "Magnesio",
          Na: "Sodio",
          Ca: "Calcio",
        },
      },
      tuningSimulator: {
        aria: "Simulador de tuning: ajusta la anchura y el desplazamiento de la ventana del etalon sobre la línea H‑alpha y observa cómo cambia la vista.",
        width: "Anchura de banda (FWHM)",
        offset: "Desplazamiento del centro",
        contrast: "Contraste del disco",
        views: {
          disk: "Disco: filamentos y plages",
          prominence: "Protuberancias en el limbo",
          washed: "Lavado: poco contraste",
        },
      },
      filterComparison: {
        aria: "Comparador de métodos de filtrado solar: selecciona un método para ver dónde actúa y qué revela.",
        fieldWhere: "Posición del filtro",
        fieldPasses: "Espectro que deja pasar",
        fieldLayer: "Capa solar que revela",
        methods: [
          {
            id: "eclipse",
            name: "Gafas de eclipse",
            where: "Delante de los ojos, sin ningún instrumento óptico.",
            passes: "Todo el espectro visible muy atenuado de forma neutra (filtro de densidad).",
            layer: "Solo sirven a simple vista. No revelan ninguna capa solar en detalle.",
          },
          {
            id: "whiteLight",
            name: "Filtro de luz blanca",
            where: "En la apertura frontal del telescopio o prismáticos, antes de que la luz entre en la óptica.",
            passes: "Todo el espectro visible atenuado de forma pareja. Muestra la fotosfera con manchas y granulación.",
            layer: "Fotosfera: la superficie brillante y visible del Sol.",
          },
          {
            id: "halpha",
            name: "Telescopio H‑alpha",
            where: "Sistema interno completo: ERF frontal + etalon + blocking filter antes del ojo o cámara.",
            passes: "Solo una rendija de 0,5 Å centrada en 656,28 nm. Todo lo demás queda bloqueado.",
            layer: "Cromosfera: filamentos, plages, protuberancias y textura cromosférica.",
          },
        ],
      },
    },
  },
  en: {
    meta: {
      title: "How an H‑alpha Telescope Works",
      description:
        "Bilingual teaching material on the physics of the H‑alpha line, Fabry-Pérot etalons, tuning, the solar optical chain, and safety.",
    },
    nav: {
      origin: "The origin",
      etalon: "The etalon",
      tuning: "Tuning",
      safety: "Safety",
      image: "Real image",
    },
    languageLabel: "Español",
    hero: {
      eyebrow: "The Sun in a single color of light",
      title: "Why does the Sun look so different in H‑alpha?",
      intro:
        "To the naked eye the Sun is a smooth, yellowish disk. In the light of the H‑alpha line, however, it becomes covered with dark filaments, bright plages, and huge prominences at its edge. It is not a different Sun: it is the same star seen in a single color. Here we explain, step by step, what makes that color special, how an instrument isolates it, and why it is done safely.",
      imageAlt:
        "Full solar disk photographed in the H‑alpha line, showing dark filaments, bright regions, and prominences at the limb.",
    },
    sections: {
      origin: {
        eyebrow: "The origin of the line · 656.28 nm",
        heading: "Why does the Sun glow in H‑alpha?",
        lead: "It all starts with the simplest atom in the universe: hydrogen, which makes up almost all of the Sun.",
        body: [
          "The Sun is overwhelmingly made of hydrogen. And every chemical element has a kind of fingerprint: it only absorbs and emits light at very specific colors, not just any. Hydrogen has several of those characteristic colors, and one of them lies in the deep red, at a wavelength of 656.28 nanometers. We call that line hydrogen-alpha, or H‑alpha.",
          "That color is produced by hydrogen when one of its electrons drops to a lower-energy orbital and releases exactly that amount of energy as red light. Because all hydrogen atoms are identical, they all emit and absorb at that very same wavelength: that is why the line is so sharp and so reliable as a reference.",
          "Above the visible surface of the Sun there is a thin, faint layer called the chromosphere, made mostly of hydrogen. That layer glows precisely in H‑alpha. The trouble is that its light is completely drowned out by the dazzling white glare of the surface. A filter that lets through only the H‑alpha color switches off that glare and finally reveals the glowing chromosphere: filaments, plages, and prominences.",
        ],
        deepDive: {
          title: "The physics: the Bohr model and the Balmer series",
          paragraphs: [
            "In the Bohr model, the electron of hydrogen can only occupy orbitals with specific energies, labeled by an integer n = 1, 2, 3... The larger n is, the higher and more loosely bound the electron. Energy is not continuous: it is quantized, which means the atom can only gain or lose energy in discrete jumps between those energy levels.",
            "When an electron falls from a high level to a lower one, the atom emits a photon whose energy is exactly the difference between the two levels. The H‑alpha line corresponds to the transition n=3 → n=2. Transitions ending at n=2 form the so-called Balmer series, which falls in the visible; H‑alpha is the first and most intense of that series.",
            "The energy of the jump sets the color of the light through the Planck-Einstein relation: the higher the energy, the shorter the wavelength. For the n=3 → n=2 transition that energy corresponds to λ = 656.28 nm, the deep red of H‑alpha.",
            "The same energy level explains two opposite things we see on the Sun. Over the disk, the cooler hydrogen of the chromosphere absorbs the white light coming from below and creates a dark line: it is one of the Fraunhofer lines, a black stripe across the continuous spectrum. At the limb and in prominences, by contrast, there is no bright background behind, and that same hydrogen emits its H‑alpha light against the black sky: we see it in emission, bright.",
          ],
          formula: "E = h·c / λ",
        },
      },
      spectrum: {
        eyebrow: "The solar spectrum",
        heading: "The spectrum is not a smooth rainbow",
        lead: "If we carefully break up the Sun's light, the rainbow appears crossed by thin dark lines. H‑alpha is one of them.",
        body: [
          "When we split sunlight into its colors we expect a continuous rainbow, but on closer inspection it is interrupted by hundreds of very narrow dark lines. These are the Fraunhofer lines, and each one marks a color that was absorbed by a specific element present in the Sun before its light reached us.",
          "Each dark line is the signature of an atom: sodium, calcium, magnesium, iron, and, of course, hydrogen each have their own. The hydrogen lines in the visible range form the Balmer series: all are electron transitions ending at level n=2. H‑alpha (n=3→2, 656.28 nm) is the first and most intense; it is followed by H‑beta (n=4→2, 486.1 nm), H‑gamma (n=5→2, 434.0 nm), and H‑delta (n=6→2, 410.2 nm). Other dark lines in the same spectrum — such as sodium (Na D, 589 nm) or magnesium (Mg b, 517 nm) — belong to different elements and are not hydrogen transitions.",
          "An H‑alpha solar telescope is designed to do exactly the opposite of the rest of the spectrum: instead of discarding the H‑alpha slit, it keeps only that one and rejects everything else.",
        ],
        deepDive: {
          title: "Dark line on the disk, bright line at the limb",
          paragraphs: [
            "Over the solar disk, the bright white light of the photosphere travels through the chromosphere above it. The hydrogen in that layer selectively absorbs the 656.28 nm photons, subtracting them from the continuous background. That is why, in the disk spectrum, H‑alpha appears as an absorption line: a dark notch on an intense background.",
            "At the Sun's limb and in the prominences that rise above it there is no bright photosphere behind, only the dark sky. That same hydrogen, instead of absorbing, emits its own H‑alpha photons. The result is a bright emission line. This is why prominences appear lit up at the edge while filaments (the same gas, but projected onto the disk) appear dark: they are two sides of the same phenomenon.",
            "The full Balmer series covers all transitions to n=2 in hydrogen. Only H‑alpha, H‑beta, H‑gamma, and H‑delta fall in the visible range; those for higher n fall in the ultraviolet. The other dark lines in the solar spectrum (sodium, magnesium, calcium, iron…) correspond to electron transitions in those other elements and have no connection to the Balmer series.",
          ],
        },
      },
      etalon: {
        eyebrow: "The heart of the instrument",
        heading: "The etalon: how a single color is isolated",
        lead: "Keeping only a 0.5-ångström slit in the deep red is an extreme optical challenge. The solution is the interference of light.",
        body: [
          "The key component of an H‑alpha telescope is the etalon, also called a Fabry-Pérot interferometer. In essence it is two ultra-flat glass surfaces, almost like mirrors, very parallel to each other and separated by a tiny, exquisitely controlled distance. Each surface reflects part of the light and lets another part through.",
          "When light enters that gap, it bounces back and forth many times before leaving. On each pass, the waves coming out overlap with those that left earlier. For most colors those waves end up out of phase and cancel each other (destructive interference). But for a few very specific colors, the waves come out perfectly in step and reinforce one another (constructive interference).",
          "The result is that the etalon lets through only an extremely narrow slit of color. By adjusting the spacing between the plates, that slit is placed right on top of H‑alpha. It is like a choir of thousands of reflections that only sing in unison on a single note: the red at 656.28 nm.",
        ],
        deepDive: {
          title: "Fabry-Pérot: Airy peaks, FSR, finesse, and FWHM",
          paragraphs: [
            "The condition for constructive interference is 2·n·d·cosθ = m·λ, where d is the spacing between plates, n the index of the medium between them, θ the ray angle relative to the normal, and m an integer (the order). For each order m there is a wavelength that satisfies the condition and emerges reinforced.",
            "That is why the etalon's transmission curve is not a single clean box, but a series of very thin, regular peaks: the Airy peaks. The spectral distance between two consecutive peaks is called the free spectral range (FSR). Because there are many peaks, the etalon alone is not enough: a prefilter is needed (the ERF and sometimes a broader-band filter) to pass the region around H‑alpha and remove the other orders.",
            "The width of each peak is measured by its FWHM (full width at half maximum). The finesse of the etalon is the ratio of the FSR to the FWHM, and it depends above all on the reflectivity of the surfaces: the higher the reflectivity, the more effective reflections and the narrower the peaks.",
            "For the chromosphere to stand out over the disk, the bandpass (the FWHM) must be very narrow, typically below 0.5 ångström. If the window is wider, it lets in too much light from the photospheric continuum and the contrast of the filaments is lost: the disk looks smooth again.",
          ],
          formula: "2·n·d·cosθ = m·λ",
        },
      },
      tuning: {
        eyebrow: "Fine-tuning the window",
        heading: "Tuning: why what you see changes",
        lead: "The etalon's slit of color can be shifted a little. That small adjustment decides whether you see the disk or the moving material better.",
        body: [
          "The exact center of the color slit that the etalon lets through is not completely fixed: it can be fine-tuned slightly. We call that tuning. Shifting the window by only a few hundredths of an ångström surprisingly changes what appears in the image.",
          "With the window centered right on H‑alpha you see the disk better: the dark filaments, the bright plages, and the fine texture of the chromosphere. If instead we shift the window toward a wing of the line —toward the blue or the red— it enhances material moving at high speed, such as prominences and flares, because their light appears color-shifted by the Doppler effect.",
          "That is why the same telescope can show two different Suns depending on how it is tuned: one centered on the still detail of the disk and another shifted to catch the jets and arcs of moving gas. Tuning is, in the end, choosing which story of the Sun you want to tell at that moment.",
        ],
        deepDive: {
          title: "Pressure tuning, tilt tuning, and the Doppler effect",
          paragraphs: [
            "There are two common ways to tune an etalon. Pressure tuning changes the pressure —and therefore the refractive index n— of the gas sealed between the plates, which shifts the condition 2·n·d·cosθ = m·λ and moves the transmission peak. Tilt tuning tips the etalon by a small angle θ: since cosθ appears in the equation, tilting it shifts the peak toward the blue.",
            "Moving material comes into play through the Doppler effect: gas approaching us emits H‑alpha shifted toward the blue, and gas moving away, toward the red. By shifting the etalon's window toward a wing, we tune it to that Doppler-shifted gas and make it visible, while gas at rest is dimmed.",
            "All of this implies a constant trade-off between contrast and light. A narrower, well-centered window gives more chromospheric contrast, but lets through less light and requires longer exposures or a darker image. Tuning well means finding the balance for the specific detail you want to observe.",
          ],
        },
      },
      opticalSystem: {
        eyebrow: "The full chain",
        heading: "The optical system, piece by piece",
        lead: "The etalon does not work alone. It is part of a chain in which every link is essential, and some of them are essential for safety.",
        body: [
          "An H‑alpha solar telescope is an ordered chain of components, and light passes through them in this order: objective → energy rejection filter (ERF) → etalon → blocking filter → eye or camera. If any of them is missing, the system stops working or stops being safe.",
          "The objective gathers the Sun's light. Next, the ERF (Energy Rejection Filter), placed at the front, rejects the vast majority of the energy: nearly all the infrared, the ultraviolet, and much of the heat, letting through mainly the red region around H‑alpha. Without it, that concentrated heat would destroy the etalon and be extremely dangerous.",
          "The etalon then acts, selecting the H‑alpha slit of color. But at its output there is still residual out-of-band light and the etalon's other orders. The blocking filter takes care of that, right before the eye or camera: it blocks the leftover light, leaves a clean H‑alpha image, and protects the observer. Only then does the light reach the eye or sensor safely.",
        ],
        deepDive: {
          title: "What happens if the ERF or the blocking filter is missing",
          paragraphs: [
            "Without the ERF, all the solar energy gathered by the objective —including the invisible infrared and heat— would reach the etalon concentrated. The etalon, a delicate and very thin optical part, would heat up, warp, and be ruined; and the energy built up along the path is a serious risk of burns and fire. The ERF is the first line of defense that discards the bulk of the energy before it enters the instrument.",
            "Without the blocking filter, even though the etalon has selected H‑alpha, the etalon's other orders and potentially harmful out-of-band light would still pass through, along with a residual glow that would ruin the contrast. For the eye that is dangerous, because some of that light is intense and invisible. That is why an H‑alpha telescope is never used without its corresponding blocking filter or diagonal: it is not an optional accessory, it is part of the safety system.",
          ],
        },
      },
      filters: {
        eyebrow: "Three methods, three problems",
        heading: "Comparing solar filters",
        lead: "Not all solar filters do the same thing. Each method solves a different problem and goes in a different place.",
        body: [
          "There are three main ways to look at the Sun safely, and it is important not to confuse them because they work in very different ways. Certified eclipse glasses (ISO 12312-2) are placed in front of the eyes and are only for naked-eye viewing, without any instrument that concentrates the light.",
          "The white-light solar filter is placed in front of the aperture of the telescope or binoculars, before the light enters the optics. It attenuates the whole spectrum evenly down to a safe level and shows the photosphere: the disk, sunspots, and granulation. It is like wearing very dark sunglasses for the whole spectrum at once.",
          "The H‑alpha telescope is a complete dedicated system, not a mere filter: it combines energy rejection, the etalon, and the blocking filter to keep a single slit of color and reveal the chromosphere. The first attenuates everything equally; the second selects one color. They are tools for different purposes, not interchangeable.",
        ],
        deepDive: {
          title: "Neutral attenuation versus energy rejection plus spectral selection",
          paragraphs: [
            "A white-light filter acts, in essence, like a neutral density (ND) filter: it attenuates all visible wavelengths more or less equally down to a safe level, preserving the shape of the spectrum but greatly reducing its intensity. What reaches you is a heavily darkened version of the whole Sun, in which you see the photosphere.",
            "An H‑alpha system does something qualitatively different in two steps: first it rejects energy (the ERF discards the bulk of the flux, especially infrared and ultraviolet) and then it selects the spectrum (the etalon and blocking filter pass only the H‑alpha slit). It is not a uniform attenuation: it is a surgical selection of one color, which is exactly what lets you see the chromosphere rather than the photosphere.",
          ],
        },
      },
    },
    safety: {
      eyebrow: "Solar safety",
      heading: "Rules that never change",
      rules: [
        {
          title: "Eclipse glasses are never used with optics",
          body: "Certified eclipse glasses (ISO 12312-2) are only for naked-eye viewing of the Sun. They are never used with a telescope, binoculars, or camera: the optics concentrate the light and would burn through them instantly, with the risk of permanent blindness.",
        },
        {
          title: "Every optical instrument needs its own filter",
          body: "Any telescope, binoculars, or camera pointed at the Sun needs a proper front solar filter or must be part of a dedicated solar system. The light must be filtered before it enters the optics, not after.",
        },
        {
          title: "An H‑alpha telescope is not used without its blocking filter",
          body: "The blocking filter (or blocking diagonal) is part of the safety system of an H‑alpha telescope. It is never removed, and you never observe without it: it lets through residual light that is dangerous to the eye.",
        },
        {
          title: "Solar filters are never improvised",
          body: "X-ray film, CDs, smoked glass, sunglasses, or homemade filters do not protect against the Sun. Only solar filters manufactured and certified for that purpose may be used.",
        },
        {
          title: "Finders are used by projection",
          body: "Never look through a telescope's finder when pointing at the Sun. Locate the Sun by the tube's shadow or by projection, or use a dedicated solar finder.",
        },
      ],
      seasonalCallout: {
        enabled: true,
        date: "2026-08-12",
        title: "2026 Context: August 12 Total Solar Eclipse",
        body: "On August 12, 2026 there will be a total solar eclipse. Eclipse glasses are for unmagnified solar viewing when they comply with ISO 12312-2 and come from reliable suppliers; during totality, and only during those seconds, the Sun may be viewed with the naked eye. At any other time, and always with telescopes, binoculars, or cameras, a proper solar filter is required.",
      },
    },
    finalImage: {
      eyebrow: "Paying off the hook",
      heading: "Now you can read the image from the start",
      lead: "This is the same H‑alpha image we opened with. With everything above, each structure now has a name and an explanation.",
      caption: "Full solar disk in H‑alpha. Hover or tap the points to identify each structure.",
      imageAlt:
        "Solar disk in H‑alpha with dark filaments, prominences at the limb, bright plages, and chromospheric texture.",
      annotations: [
        {
          id: "filaments",
          x: 42,
          y: 51,
          label: "Filaments",
          description:
            "Dark threads over the disk: cooler gas suspended by magnetic fields. It is the same material that, at the edge, we see as a bright prominence.",
        },
        {
          id: "plages",
          x: 40,
          y: 37,
          label: "Plages",
          description:
            "Bright regions around active areas, associated with intense magnetic fields in the chromosphere.",
        },
        {
          id: "sunspot",
          x: 48,
          y: 38,
          label: "Sunspot",
          description:
            "A cooler, darker patch of an active region where the magnetic field is intense. In H‑alpha it shows up as a dark point surrounded by bright plages.",
        },
        {
          id: "prominences",
          x: 69,
          y: 31,
          label: "Prominences",
          description:
            "Arcs and jets of gas rising above the limb. They glow in emission because they have no dazzling photospheric background behind them.",
        },
        {
          id: "texture",
          x: 57,
          y: 60,
          label: "Chromospheric texture",
          description:
            "The fine mottling of the disk is the spicules and the chromospheric network: small jets of gas that give the surface its grainy look.",
        },
      ],
    },
    glossary: {
      angstrom: {
        term: "ångström",
        short: "A very small length unit used in spectroscopy.",
        detail: "One ångström is 0.1 nanometers. In H‑alpha observing it describes extremely narrow filter bandwidths, below 0.5 Å.",
      },
      bandpass: {
        term: "bandpass",
        short: "The range of wavelengths a filter allows through.",
        detail: "In H‑alpha, a bandpass below 0.5 Å helps isolate the chromosphere and increase contrast in filaments and prominences.",
      },
      etalon: {
        term: "etalon",
        short: "An interference filter that selects a very narrow spectral window.",
        detail: "An etalon (Fabry-Pérot interferometer) uses interference between two nearly mirrored surfaces to transmit selected wavelengths and reject many others.",
      },
      blockingFilter: {
        term: "blocking filter",
        short: "A safety filter that blocks dangerous residual light.",
        detail: "In visual or imaging H‑alpha telescopes, the blocking filter is part of the safe system. It must not be removed or replaced with improvised parts.",
      },
      chromosphere: {
        term: "chromosphere",
        short: "A thin layer of the Sun, above the visible surface.",
        detail: "The chromosphere is a faint layer of hydrogen above the photosphere. It glows in H‑alpha and is where filaments, plages, and prominences are seen.",
      },
      fraunhofer: {
        term: "Fraunhofer lines",
        short: "Dark absorption lines in the solar spectrum.",
        detail: "These are the dark stripes crossing the solar rainbow, each produced by the absorption of an element. H‑alpha is hydrogen's absorption line at 656.28 nm.",
      },
    },
    diagrams: {
      hydrogenLevels: {
        caption: "Energy levels of hydrogen and the transition that produces H‑alpha.",
        aria: "Diagram of the energy levels of the hydrogen atom with the n=3 to n=2 transition highlighted.",
        axisEnergy: "Energy",
        level1: "n=1",
        level2: "n=2",
        level3: "n=3",
        level4: "n=4",
        level5: "n=5",
        level6: "n=6",
        transitionLabel: "H‑alpha · 656.28 nm",
        transitionNote: "The electron falls from n=3 to n=2 and emits red light.",
        balmerLabel: "Balmer series (to level n=2)",
      },
      sunLayers: {
        caption: "Layers of the Sun: what white light sees and what H‑alpha sees.",
        aria: "Cross-section diagram of the Sun's layers, from the photosphere to the corona.",
        photosphere: "Photosphere",
        chromosphere: "Chromosphere",
        corona: "Corona",
        whiteLightLabel: "White light: sees the photosphere",
        hAlphaLabel: "H‑alpha: sees the chromosphere",
        photosphereNote: "Bright, visible surface.",
        chromosphereNote: "Thin layer that glows in H‑alpha.",
        coronaNote: "Faint outer atmosphere.",
      },
      etalon: {
        caption: "Fabry-Pérot interferometer: multiple reflections and interference.",
        aria: "Diagram of an etalon with two plates, incoming rays, multiple reflections, and the Airy transmission profiles.",
        plateLabel: "Semi-mirrored plates",
        gapLabel: "Spacing d",
        incidentRay: "Incoming light",
        constructive: "Constructive interference (passes)",
        destructive: "Destructive interference (cancels)",
        angleLabel: "Angle θ",
        airyTitle: "Airy profile",
        fsrLabel: "FSR",
        fwhmLabel: "FWHM",
        peakLabel: "Transmission peak",
      },
      opticalChain: {
        caption: "The full optical chain of an H‑alpha telescope.",
        aria: "Diagram of the optical chain: objective, ERF, etalon, blocking filter, and camera or eye.",
        sunlight: "Sunlight",
        objective: "Objective",
        erf: "ERF",
        etalon: "Etalon",
        blocking: "Blocking filter",
        camera: "Eye / camera",
        erfNote: "Rejects energy and heat.",
        etalonNote: "Selects the H‑alpha color.",
        blockingNote: "Removes dangerous residual light.",
        energyDiscarded: "Energy discarded",
        erfMissing: "Missing: the etalon burns",
        blockingMissing: "Missing: unsafe light to the eye",
      },
      threeMethods: {
        caption: "Three methods for viewing the Sun safely.",
        aria: "Comparison of three methods: eclipse glasses, white-light filter, and H‑alpha telescope.",
        eclipseGlasses: "Eclipse glasses",
        whiteLight: "White-light filter",
        hAlpha: "H‑alpha telescope",
        eclipsePlacement: "In front of the eyes",
        whiteLightPlacement: "In front of the aperture",
        hAlphaPlacement: "Complete internal system",
        eclipseReveals: "Naked eye only",
        whiteLightReveals: "Photosphere and sunspots",
        hAlphaReveals: "Chromosphere",
      },
      dopplerTuning: {
        caption: "Tuning and the Doppler effect: the etalon window over the line.",
        aria: "Diagram of the H‑alpha line shifting by the Doppler effect with the etalon's transmission window.",
        lineLabel: "H‑alpha line",
        windowLabel: "Etalon window",
        blueshift: "Blueshift (approaching)",
        redshift: "Redshift (receding)",
        centerLabel: "Centered: disk",
        wingLabel: "On the wing: prominences",
        wavelengthAxis: "Wavelength",
      },
    },
    interactive: {
      spectrumExplorer: {
        aria: "Visible-spectrum explorer: move the control to pick a wavelength and see which Fraunhofer line it corresponds to.",
        control: "Wavelength",
        selected: "Selected",
        hydrogenTransition: "Hydrogen transition",
        notHydrogen: "Different element — not hydrogen",
        continuum: "Continuum (no Fraunhofer line)",
        elements: {
          H: "Hydrogen",
          Mg: "Magnesium",
          Na: "Sodium",
          Ca: "Calcium",
        },
      },
      tuningSimulator: {
        aria: "Tuning simulator: adjust the width and offset of the etalon window over the H‑alpha line and watch how the view changes.",
        width: "Bandpass width (FWHM)",
        offset: "Center offset",
        contrast: "Disk contrast",
        views: {
          disk: "Disk: filaments and plages",
          prominence: "Prominences at the limb",
          washed: "Washed out: low contrast",
        },
      },
      filterComparison: {
        aria: "Solar filter method comparator: select a method to see where it acts and what it reveals.",
        fieldWhere: "Filter position",
        fieldPasses: "Spectrum it passes",
        fieldLayer: "Solar layer it reveals",
        methods: [
          {
            id: "eclipse",
            name: "Eclipse glasses",
            where: "In front of the eyes, without any optical instrument.",
            passes: "The entire visible spectrum, heavily and neutrally attenuated (density filter).",
            layer: "For naked-eye use only. They reveal no solar layer in detail.",
          },
          {
            id: "whiteLight",
            name: "White-light filter",
            where: "At the front aperture of the telescope or binoculars, before light enters the optics.",
            passes: "The whole visible spectrum evenly attenuated. Shows the photosphere with sunspots and granulation.",
            layer: "Photosphere: the bright, visible surface of the Sun.",
          },
          {
            id: "halpha",
            name: "H‑alpha telescope",
            where: "Complete internal system: front ERF + etalon + blocking filter before the eye or camera.",
            passes: "Only a 0.5 Å slit centered at 656.28 nm. Everything else is blocked.",
            layer: "Chromosphere: filaments, plages, prominences, and chromospheric texture.",
          },
        ],
      },
    },
  },
};
