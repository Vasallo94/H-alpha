# H-alpha Educational Site — Reescritura Pedagógica Profunda (Design Spec)

> Evolución del sitio existente (no greenfield). Parte del scaffold Astro + islas React ya funcional en `main` y lo transforma de "folleto descriptivo" a material didáctico real.

## Objetivo

Que el sitio **enseñe el mecanismo físico**, no solo nombre conceptos. Un lector debe terminar entendiendo: por qué el hidrógeno emite a 656,28 nm, cómo un etalon aísla esa línea, por qué el tuning cambia lo que se ve, cómo funciona la cadena óptica completa y por qué cada filtro solar resuelve un problema distinto.

## Modelo de audiencia: pedagogía en capas

Cada sección tiene dos niveles:
- **Narrativa base**: accesible para público general sin física previa, con analogías sólidas y los conceptos reales introducidos sin ecuaciones.
- **"Profundiza más"**: desplegable nativo `<details>/<summary>` (accesible, sin JS) con la física y matemáticas para quien quiera (Bohr, Fabry-Pérot, Doppler, FSR/finesse, E=hc/λ, etc.).

Bilingüe ES/EN en todo momento, con el invariante de tests: las claves de contenido ES y EN permanecen sincronizadas.

## Decisión de diseño clave (cambio respecto al plan original)

El Hero **abre con la imagen H-alpha real del cliente** (`public/images/sun-h-alpha.png`) a tamaño protagonista, no con un degradado CSS. El lector ve desde el primer momento qué se va a explicar. La sección final "paga" ese gancho mostrando la misma imagen anotada con hotspots + comparador antes/después. Se elimina por completo `.hero-section__sun` (el círculo de gradiente).

---

## Arquitectura

### 1. Contrato de contenido (`src/content/siteCopy.ts`)
Se amplía el tipo `SiteCopy` para soportar contenido en capas, reglas de seguridad evergreen y anotaciones de imagen. Esquema objetivo (resumen de tipos):

```ts
type Paragraph = string;

type DeepDive = {
  title: string;
  paragraphs: Paragraph[];      // párrafos de profundización
  formula?: string;             // opcional, p.ej. "E = h·c / λ"
};

type Section = {
  eyebrow: string;
  heading: string;
  lead: string;
  body: Paragraph[];            // narrativa base (varios párrafos)
  deepDive?: DeepDive;
};

type SafetyRule = { title: string; body: string };

type ImageAnnotation = {
  id: string;
  x: number;                    // % posición sobre la imagen
  y: number;
  label: string;
  description: string;
};

type DiagramLabels = Record<string, string>; // etiquetas bilingües de cada diagrama SVG
```

`SiteCopy` pasa a tener: `meta`, `nav`, `languageLabel`, `hero`, `sections` (origin, spectrum, etalon, tuning, opticalSystem, filters), `safety` (eyebrow, heading, `rules: SafetyRule[]`, `seasonalCallout`), `finalImage` (con `annotations: ImageAnnotation[]` y `beforeAfter` labels), `glossary` y `diagrams` (etiquetas SVG por diagrama). Las reglas de seguridad quedan **desacopladas** del callout del eclipse (que sigue siendo conmutable por fecha).

### 2. Diagramas SVG (`src/components/diagrams/*.astro`)
Componentes Astro estáticos con SVG anotado a mano (ejes rotulados, números, flechas, etiquetas). Reciben sus textos desde `siteCopy.diagrams[...]` para ser bilingües. No usan JS salvo que sean interactivos (esos van en `interactive/`).

### 3. Interactivos (`src/components/interactive/*.tsx`)
Los 3 actuales se reescriben con física real; se añaden 2 nuevos. Ver sección "Interactivos".

### 4. Estilos (`src/styles/global.css`)
Se eliminan los gradientes decorativos que hacían de "diagrama" (`.hero-section__sun`, el arcoíris de `.spectrum-explorer__bar`, el plot de `.bandpass-sim__plot`). Se añaden estilos para `<details>` deep-dive, hotspots, comparador cortina, y contenedores de SVG responsive.

### 5. Tests
- **Unit (vitest)**: sincronía de claves ES/EN extendida a las nuevas estructuras; `safety.rules` con misma longitud en ambos idiomas; `finalImage.annotations` con mismas IDs; presencia de `deepDive` donde se espera; la lógica de física de los interactivos (cálculo de contraste, clasificación por offset/anchura) extraída a funciones puras testeables.
- **E2e (Playwright)**: despliegue de `<details>`, slider del comparador antes/después, simulador de tuning cambia la previsualización, hotspots visibles, render bilingüe.

---

## Diseño sección por sección

### 1. Hero
- **Propósito**: gancho. Mostrar la imagen real y plantear la pregunta motivadora.
- **Contenido base**: pregunta tipo "¿Por qué el Sol se ve completamente distinto en H-alpha que a simple vista?" + 1-2 frases que prometen el recorrido.
- **Visual**: `sun-h-alpha.png` protagonista (no SVG). Teaser opcional: pista de "esto es la cromosfera, no la superficie".
- **Cubre**: motivación.

### 2. ¿Por qué el Sol brilla en H-alpha? (origen de la línea)
- **Base**: el Sol es casi todo hidrógeno; cada átomo emite/absorbe solo en colores concretos (huella dactilar); H-alpha (656,28 nm, rojo profundo) lo produce el hidrógeno cuando un electrón salta entre niveles; la cromosfera —capa fina sobre la superficie— brilla en ese color, así que un filtro que solo deje pasar H-alpha la "enciende".
- **Diagramas**: (a) **Niveles de energía del hidrógeno** con la transición n=3→n=2 resaltada y etiquetada "H-alpha · 656,28 nm"; (b) **Capas del Sol** (fotosfera→cromosfera→corona) indicando qué ve la luz blanca y qué ve el H-alpha.
- **Deep-dive**: modelo de Bohr, niveles cuantizados, serie de Balmer, transición n=3→n=2, E=hc/λ (conectar energía del salto con λ), absorción en disco (línea de Fraunhofer) vs. emisión en limbo/protuberancias.
- **Cubre**: Tema 1 (origen).

### 3. El espectro y la línea
- **Base**: el espectro solar no es un arcoíris liso; tiene líneas oscuras (Fraunhofer) donde elementos absorben. H-alpha es una de ellas.
- **Interactivo (rehecho)**: explorador del espectro con líneas de Fraunhofer marcadas; al acercar el cursor/slider a 656,28 nm muestra la transición atómica correspondiente y la energía. Feedback: "esta λ ≈ electrón cayendo de n=3 a n=2 en el hidrógeno".
- **Cubre**: Tema 1 (refuerzo), puente hacia Tema 2.

### 4. El etalon: cómo se aísla un solo color
- **Base**: dos superficies semiespejadas muy paralelas y juntas; la luz rebota muchas veces; solo los colores cuya onda "encaja" exactamente salen reforzados (interferencia constructiva), el resto se cancela → rendija de color estrechísima centrada en H-alpha.
- **Diagrama**: **Fabry-Pérot** con placas, rayos entrando, reflexiones múltiples, diferencia de camino (d, θ), interferencia constructiva saliendo / destructiva cancelándose, + **inset del perfil de Airy** (picos, FSR, FWHM).
- **Deep-dive**: condición 2nd·cosθ = mλ; perfil de transmisión = serie de picos (Airy), no una caja; FSR y por qué hace falta prefiltro/ERF; finesse = FSR/FWHM y reflectividad; bandpass/FWHM y por qué <0,5 Å es el umbral para que la cromosfera destaque.
- **Cubre**: Tema 2 (etalon).

### 5. Tuning: por qué cambia lo que ves
- **Base**: el punto exacto de color que pasa se puede afinar un poco; centrado en H-alpha se ve mejor el disco (filamentos, plages); desplazado a un ala se realza el material en movimiento (protuberancias, erupciones).
- **Diagrama**: **Doppler** de la línea desplazándose al azul/rojo según el material se acerque/aleje, con la ventana del etalon mostrando qué "se enciende".
- **Interactivo (rehecho — pieza estrella)**: perfil real de la línea H-alpha (absorción/emisión) + curva de transmisión (Airy/gaussiana) cuya **FWHM** controla el slider de anchura y cuyo **centro** controla el de offset. Calcula y muestra el **contraste resultante** (integral de la línea bajo la ventana) y, sobre todo, una **previsualización de imagen que cambia**: ventana ancha → imagen lavada; estrecha y centrada → filamentos en el disco; desplazada a las alas → protuberancias/flujos Doppler. Toggle disco/limbo (absorción vs. emisión).
- **Deep-dive**: pressure tuning (índice del gas entre placas) y tilt tuning (ángulo θ); efecto Doppler como mecanismo; trade-off contraste vs. luz.
- **Cubre**: Tema 3 (tuning).

### 6. El sistema óptico completo
- **Base**: la luz pasa por una cadena: **objetivo → ERF (rechaza casi toda la energía/calor) → etalon (selecciona el color) → blocking filter/diagonal (elimina luz residual peligrosa) → ojo/cámara**. Cada pieza es imprescindible.
- **Diagrama**: **cadena óptica etiquetada** (sección lateral), cada bloque con "qué hace / qué pasa si falta", resaltando dónde se descarta la energía.
- **Interactivo (nuevo)**: **animación del recorrido de la luz** — un haz atraviesa la cadena; en cada etapa muestra cuánta energía/qué colores se descartan, para *ver* por qué quitar una pieza es peligroso.
- **Deep-dive**: qué ocurre físicamente si falta el ERF (el etalon y el ojo se cuecen) o el blocking (luz fuera de banda dañina).
- **Cubre**: Tema 4 (sistema), corrige la omisión del ERF.

### 7. Comparación de filtros (rehecha)
- **Base**: tres métodos resuelven problemas distintos.
- **Interactivo (rehecho)**: al elegir un método muestra (a) **dónde va el filtro** en la cadena (ojo / apertura frontal / sistema interno), (b) **qué espectro deja pasar** (todo atenuado neutro vs. una rendija estrecha), (c) **qué capa revela** (fotosfera vs. cromosfera) con previsualización. Enseña la *diferencia de mecanismo*, no solo el uso.
- **Diagrama**: 3 mini-esquemas en paralelo.
- **Deep-dive**: ND neutro (atenúa todo el espectro por igual) vs. rechazo de energía + selección espectral.
- **Cubre**: Tema 4 (diferencias reales).

### 8. Seguridad (evergreen + estacional)
- **Reglas evergreen explícitas** (array, siempre visibles, independientes del eclipse):
  - Las gafas de eclipse (ISO 12312-2) son solo para mirar a ojo desnudo; **nunca** con telescopio, prismáticos o cámara (la óptica concentra la luz → peligro mortal e irreversible).
  - Los dispositivos ópticos necesitan filtro solar frontal adecuado o sistema solar dedicado.
  - Un telescopio H-alpha **no** se usa sin su blocking filter/diagonal correspondiente.
  - No improvisar filtros.
  - Buscadores solares por proyección.
- **Callout estacional**: el del eclipse del 12 ago 2026 se mantiene como bloque aparte conmutable; al desactivarse, la sección **sigue completa** gracias a las reglas evergreen.
- **Cubre**: Tema 4 (seguridad) — corrige el riesgo de sección vacía.

### 9. La imagen real (paga el gancho)
- **Hotspots anotados**: sobre `sun-h-alpha.png`, marcadores interactivos para filamentos, protuberancias, plages y textura cromosférica, cada uno con su explicación.
- **Comparador antes/después**: slider de cortina — izquierda simulación de luz blanca (disco liso + manchas), derecha H-alpha real (filamentos, protuberancias). Enseña visualmente qué añade la línea.
- **Cierre**: "lo que viste al principio, ahora sabes leerlo" — conecta física → instrumento → imagen.
- **Cubre**: síntesis + aprovecha el activo del cliente.

---

## Diagramas SVG (resumen priorizado)

1. Niveles de energía del hidrógeno (n=3→n=2) — Tema 1. *(el más importante que falta)*
2. Perfil de la línea H-alpha (absorción/emisión + ventana del etalon) — base del interactivo de tuning.
3. Etalon Fabry-Pérot con rayos + inset Airy (FSR/FWHM) — Tema 2.
4. Cadena óptica completa etiquetada — Tema 4.
5. Comparador de los tres métodos — Tema 4.
6. Doppler del tuning — Tema 3.
7. Capas del Sol — Tema 1 / contexto.

## Interactivos (resumen)

| Módulo | Estado | Qué enseña al manipularlo |
|--------|--------|---------------------------|
| Explorador de espectro/línea | rehecho | λ ↔ energía ↔ transición atómica; H-alpha como línea sobre el espectro |
| Simulador de tuning/bandpass | rehecho (estrella) | cómo la ventana de transmisión sobre el perfil real cambia contraste y la imagen resultante (disco vs. protuberancias); Doppler |
| Comparador de filtros | rehecho | diferencia de mecanismo: dónde va, qué pasa, qué capa revela |
| Animación del recorrido de la luz | nuevo | por qué cada pieza de la cadena es imprescindible (qué se descarta en cada etapa) |
| Comparador antes/después | nuevo | qué añade H-alpha frente a la luz blanca sobre la imagen real |

La física de los interactivos (perfil de línea, transmisión, contraste, clasificación) se implementa en **funciones puras** en módulos separados, testeadas con vitest; los componentes React solo renderizan y manejan estado de UI.

---

## No-objetivos (YAGNI)
- Sin backend, CMS ni base de datos: sigue siendo estático.
- Sin simulaciones numéricas de alta fidelidad: las físicas son modelos pedagógicos correctos en lo cualitativo (perfiles gaussianos/Airy aproximados), no resolvemos transporte radiativo.
- Sin librerías de gráficos pesadas: SVG a mano + React mínimo.
- No se reescribe el sistema de routing/i18n ni el layout base (funcionan).

## Estrategia de verificación
Cada fase termina con `npm run build` + `npm test` verdes y commit. Verificación visual final en navegador (escritorio + móvil, ES + EN) replicando la checklist de la Task 11 original, ampliada a: desplegables, hotspots, comparador cortina, sims con previsualización.

## Mapa de cobertura de la rúbrica
- Pedagogía en capas → `<details>` deep-dive en todas las secciones.
- Tema 1 (origen) → secciones 2 y 3 + diagramas 1, 2, 7.
- Tema 2 (etalon) → sección 4 + diagrama 3.
- Tema 3 (tuning) → sección 5 + diagrama 6 + simulador estrella.
- Tema 4 (óptica/seguridad) → secciones 6, 7, 8 + diagramas 4, 5 + animación de la luz.
