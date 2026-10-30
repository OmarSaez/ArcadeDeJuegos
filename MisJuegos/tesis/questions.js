/**
 * Base de preguntas, tarjetas y datos comparativos de la tesis:
 * "Fundamento teórico y revisión de literatura: Filogenómica, Inferencia y Agrupamiento"
 * Organismos: 471 cepas de Saccharomyces eubayanus.
 */

const thesisQuestions = [
    // ==========================================
    // 1. CONCEPTOS FILOGENÉTICOS & REPRESENTACIÓN
    // ==========================================
    {
        id: 1,
        category: "conceptos",
        categoryLabel: "Conceptos Filogenéticos",
        question: "¿Por qué en este trabajo los árboles filogenéticos construidos para las 471 cepas de S. eubayanus son modelados como NO enraizados (unrooted)?",
        options: {
            a: "Porque los métodos de inferencia masiva estándar no asumen a priori un ancestro común directo ni un grupo externo (outgroup).",
            b: "Porque los árboles enraizados no admiten más de 100 taxones debido a limitaciones de memoria computacional.",
            c: "Porque en biología evolutiva los árboles no enraizados son los únicos que determinan la dirección temporal absoluta.",
            d: "Porque los árboles génicos nunca pueden tener raíz biológica bajo ninguna circunstancia."
        },
        answer: ["a"],
        priority: 1,
        isTrap: true,
        trapExplanation: "¡Cuidado con la trampa de la dirección temporal! Un árbol no enraizado justamente NO establece dirección temporal absoluta; solo caracteriza relaciones de parentesco relativo sin fijar un ancestro o grupo externo a priori.",
        academicReference: "Felsenstein (2004)",
        keyTakeaway: "Un árbol no enraizado T=(V,E) caracteriza parentesco relativo sin dirección temporal absoluta."
    },
    {
        id: 2,
        category: "conceptos",
        categoryLabel: "Conceptos Filogenéticos",
        question: "En la formalización matemática del árbol filogenético no enraizado T = (V, E), ¿cuál es la definición formal de las hojas (taxones)?",
        options: {
            a: "Vértices internos con grado mayor o igual a 3.",
            b: "Nodos terminales de grado 1 pertenecientes al conjunto V.",
            c: "Aristas acíclicas que conectan únicamente ancestros hipotéticos.",
            d: "Subgrafos desconexos con coeficientes de agrupamiento nulo."
        },
        answer: ["b"],
        priority: 1,
        isTrap: false,
        trapExplanation: "En teoría de grafos, las hojas de un árbol son exactamente los vértices terminales que tienen grado 1 (un solo enlace incidente).",
        academicReference: "Felsenstein (2004) / Semple & Steel (2003)",
        keyTakeaway: "Las hojas son nodos de grado 1 (las 471 cepas), mientras que los nodos internos representan divergencias evolutivas hipotéticas."
    },
    {
        id: 3,
        category: "conceptos",
        categoryLabel: "Conceptos Filogenéticos",
        question: "¿Cuál es la diferencia conceptual crucial entre un árbol génico (gene tree) y un árbol de especies (species tree)?",
        options: {
            a: "El árbol génico modela la historia demográfica global del taxón, mientras que el de especies modela un locus ortólogo.",
            b: "El árbol génico describe la trayectoria genealógica de un locus ortólogo individual, mientras que el árbol de especies modela la historia demográfica global del taxón.",
            c: "No existe diferencia biológica; ambos siempre deben presentar exactamente la misma topología de bifurcación.",
            d: "El árbol génico siempre es enraizado y el árbol de especies forzosamente carece de ramas internas."
        },
        answer: ["b"],
        priority: 1,
        isTrap: false,
        trapExplanation: "No confundas los roles: el gen describe la historia de un locus específico; la especie integra la historia demográfica poblacional del taxón.",
        academicReference: "Maddison (1997)",
        keyTakeaway: "Árbol génico = genealogía de un locus ortólogo individual; Árbol de especies = historia demográfica global."
    },
    {
        id: 4,
        category: "conceptos",
        categoryLabel: "Conceptos Filogenéticos",
        question: "PREGUNTA DE COMISIÓN: ¿Por qué la discordancia topológica entre árboles génicos NO debe eliminarse forzando un único árbol consenso?",
        options: {
            a: "Porque los algoritmos computacionales fallan si se calcula un árbol consenso para más de 10 genes.",
            b: "Porque la discordancia refleja fenómenos biológicos reales (ordenamiento incompleto de linajes, introgresión, presiones selectivas) y su agrupamiento permite identificar módulos funcionales con historias evolutivas compartidas.",
            c: "Porque forzar un consenso altera de forma irreversible las secuencias de ADN originales almacenadas en formato Newick.",
            d: "Porque el árbol consenso únicamente puede calcularse si los árboles no tienen ramas bifurcadas."
        },
        answer: ["b"],
        priority: 2,
        isTrap: true,
        trapExplanation: "¡Trampa de defensa de tesis! Un examinador novato diría: '¿Por qué no haces un único árbol consenso y te ahorras la minería de datos?'. Tu respuesta clave: 'Forzar un único árbol enmascara la variabilidad genómica real. Agrupar la discordancia permite descubrir módulos funcionales con historias evolutivas coincidentes'.",
        academicReference: "Maddison (1997) / Fundamento Teórico",
        keyTakeaway: "La discordancia no es ruido descartable: es la señal biológica para minería de datos y descubrimiento de módulos funcionales."
    },
    {
        id: 5,
        category: "conceptos",
        categoryLabel: "Conceptos Filogenéticos",
        question: "¿Qué fenómenos biológicos son los principales causantes de que distintos árboles génicos discrepen entre sí y de la filogenia consenso?",
        options: {
            a: "Ordenamiento incompleto de linajes (ILS), introgresión y presiones selectivas.",
            b: "Exclusivamente errores humanos en la secuenciación de nucleótidos.",
            c: "Uso exclusivo del formato Newick frente a formatos binarios.",
            d: "Falta de convergencia de las cadenas de Markov en la síntesis de proteínas."
        },
        answer: ["a"],
        priority: 1,
        isTrap: false,
        trapExplanation: "Los fenómenos biológicos canónicos citados en el texto son: ordenamiento incompleto de linajes (Incomplete Lineage Sorting), introgresión y presiones selectivas.",
        academicReference: "Maddison (1997)",
        keyTakeaway: "ILS (incomplete lineage sorting), introgresión y presiones selectivas originan árboles génicos incongruentes."
    },
    {
        id: 6,
        category: "conceptos",
        categoryLabel: "Conceptos Filogenéticos",
        question: "¿Por qué en un árbol NO enraizado es formalmente incorrecto hablar de un 'clado monofilético estricto' y se utiliza en su lugar una 'bipartición' (split)?",
        options: {
            a: "Porque un clado monofilético estricto requiere una RAÍZ para delimitar a todos los descendientes de un ancestro común; sin raíz, cada rama interna solo define una bipartición en dos subconjuntos disjuntos.",
            b: "Porque los clados solo se pueden definir en árboles de menos de cuatro hojas.",
            c: "Porque las biparticiones son conceptos geométricos euclidianos y los clados pertenecen a la teoría de probabilidades.",
            d: "Porque las librerías Biopython y ETE Toolkit no son capaces de procesar la palabra 'clado'."
        },
        answer: ["a"],
        priority: 2,
        isTrap: true,
        trapExplanation: "¡TRAMPA CLÁSICA DE EXAMEN! No digas 'clado' a la ligera si tu árbol no tiene raíz. En árboles no enraizados se habla formalmente de BIPARTICIÓN o SPLIT, pues no puedes saber quién desciende de quién sin un nodo raíz ancestral.",
        academicReference: "Semple & Steel (2003)",
        keyTakeaway: "Clado estricto = requiere raíz. Rama interna en árbol no enraizado = bipartición o split (A ∪ B = V_hojas, A ∩ B = ∅)."
    },
    {
        id: 7,
        category: "conceptos",
        categoryLabel: "Conceptos Filogenéticos",
        question: "Dado un conjunto de 4 taxones {a, b, c, d} en un árbol no enraizado, ¿cuántas topologías binarias bifurcadas posibles existen exactamente?",
        options: {
            a: "Únicamente 3 topologías: ab|cd, ac|bd y ad|bc (más la topología en estrella no resuelta).",
            b: "Exactamente 4 topologías, una por cada taxón terminal.",
            c: "15 topologías binarias según la fórmula de Felsenstein.",
            d: "Infinitas topologías dependiendo de la longitud de las ramas."
        },
        answer: ["a"],
        priority: 2,
        isTrap: true,
        trapExplanation: "¡Ojo con confundir cuartetos no enraizados con árboles enraizados! Para 4 hojas no enraizadas existen SOLO 3 topologías bifurcadas binarias: (ab|cd), (ac|bd) y (ad|bc). (Si fuera enraizado serían 15, ¡no caigas en la trampa!).",
        academicReference: "Sand et al. (2014) / tqdist",
        keyTakeaway: "Para 4 taxones no enraizados existen únicamente 3 topologías binarias (ab|cd, ac|bd, ad|bc) y 1 no resuelta (estrella)."
    },
    {
        id: 8,
        category: "conceptos",
        categoryLabel: "Conceptos Filogenéticos",
        question: "Para un árbol filogenético con n hojas, ¿cuál es el número total de combinaciones de cuartetos posibles?",
        options: {
            a: "El coeficiente binomial C(n, 4) = n! / (4!(n - 4)!).",
            b: "Directamente 4 * n.",
            c: "n^4 / 2.",
            d: "2^(n - 3) bifurcaciones."
        },
        answer: ["a"],
        priority: 1,
        isTrap: false,
        trapExplanation: "El número total de subconjuntos de 4 elementos tomados de un conjunto de n hojas es la combinación estándar C(n, 4).",
        academicReference: "Sand et al. (2014)",
        keyTakeaway: "Total de cuartetos evaluables = C(n, 4) combinaciones de subconjuntos de 4 taxones."
    },
    {
        id: 9,
        category: "conceptos",
        categoryLabel: "Conceptos Filogenéticos",
        question: "¿Cómo se representan y manipulan computacionalmente las topologías de los árboles en el flujo de trabajo de la tesis?",
        options: {
            a: "Se almacenan en texto plano bajo el estándar Newick y se transforman en estructuras de grafos en Python mediante Biopython y ETE Toolkit.",
            b: "Se compilan exclusivamente en código máquina binario C++ sin representación de texto plano.",
            c: "Se guardan en tablas SQL de adyacencia directa sin permitir anidación de paréntesis.",
            d: "Se codifican en formato FASTA como secuencias de aminoácidos concatenados."
        },
        answer: ["a"],
        priority: 1,
        isTrap: false,
        trapExplanation: "El texto formalmente indica: texto plano estándar Newick (con anidación de paréntesis) y librerías bioinformáticas en Python (Biopython y ETE Toolkit) para inspección de ramas y cálculo matricial.",
        academicReference: "Cock et al. (2009) / ETE Toolkit",
        keyTakeaway: "Almacenamiento: Newick (paréntesis anidados). Procesamiento en Python: Biopython y ETE Toolkit."
    },

    // ==========================================
    // 2. INFERENCIA FILOGENÉTICA
    // ==========================================
    {
        id: 10,
        category: "inferencia",
        categoryLabel: "Inferencia Filogenética",
        question: "¿Cuál es el principio operativo y la complejidad del método Neighbor Joining (NJ)?",
        options: {
            a: "Aglomeración jerárquica basada en matrices de distancia que minimiza iterativamente la longitud total de las ramas; complejidad polinomial Baja O(n^3).",
            b: "Optimización estocástica mediante cadenas MCMC; complejidad Muy Alta O(2^n).",
            c: "Minimización del número de cambios mutacionales por caracteres; complejidad NP-hard.",
            d: "Maximización de la probabilidad bajo modelos evolutivos densos; complejidad polinomial O(n log n)."
        },
        answer: ["a"],
        priority: 1,
        isTrap: false,
        trapExplanation: "Neighbor Joining opera sobre matrices de distancia buscando pares de nodos que minimicen la longitud total del árbol en cada paso. Complejidad baja: O(n^3).",
        academicReference: "Saitou & Nei (1987) / Felsenstein (2004)",
        keyTakeaway: "NJ: Principio = Aglomeración jerárquica por distancias. Complejidad = Baja O(n³). Solución = Árbol único aproximado."
    },
    {
        id: 11,
        category: "inferencia",
        categoryLabel: "Inferencia Filogenética",
        question: "TRAMPA DE ALGORITMOS: En Máxima Parsimonia, ¿por qué su complejidad global es Media-Alta (NP-hard) a pesar de que evaluar un árbol dado es muy rápido?",
        options: {
            a: "Porque calcular el costo para una topología fija es eficiente, pero la búsqueda del árbol óptimo en el espacio combinatorial con cientos de taxones es un problema NP-hard que exige heurísticas de branch swapping.",
            b: "Porque requiere invertir matrices densas de covarianza en cada generación estocástica.",
            c: "Porque no existe ningún algoritmo para calcular cambios evolutivos en secuencias cortas.",
            d: "Porque Máxima Parsimonia siempre calcula millones de árboles bajo la distribución posterior bayesiana."
        },
        answer: ["a"],
        priority: 2,
        isTrap: true,
        trapExplanation: "¡TRAMPA MUY COMÚN! Calcular el costo de parsimonia para UN árbol fijo es polinomial y rápido (algoritmo de Fitch). La dificultad NP-hard radica en buscar cuál de los trillones de árboles posibles es el óptimo, obligando al uso de branch swapping.",
        academicReference: "Felsenstein (2004)",
        keyTakeaway: "Parsimonia: Evaluar 1 árbol = eficiente. Búsqueda global del óptimo = NP-hard (requiere heurísticas de branch swapping)."
    },
    {
        id: 12,
        category: "inferencia",
        categoryLabel: "Inferencia Filogenética",
        question: "¿Cómo opera el método de Máxima Verosimilitud (Maximum Likelihood - ML) y qué tipo de solución entrega?",
        options: {
            a: "Explora iterativamente topologías calculando la probabilidad de los datos bajo modelos de sustitución evolutiva, optimizando numéricamente longitudes de rama; entrega una solución de optimización numérica.",
            b: "Minimiza la distancia euclidiana entre centroides estocásticos; entrega una muestra de árboles posterior.",
            c: "Corta componentes conexas en un grafo completo; entrega un árbol aproximado en tiempo O(n^2).",
            d: "Asume a priori probabilidades uniformes y genera una única topología determinista sin optimizar parámetros."
        },
        answer: ["a"],
        priority: 1,
        isTrap: false,
        trapExplanation: "Máxima Verosimilitud maximiza la probabilidad P(Datos|Árbol, Modelo). Es una optimización numérica iterativa y computacionalmente Alta.",
        academicReference: "Duchêne et al. (2021) / Felsenstein (2004)",
        keyTakeaway: "ML: Principio = Maximizar probabilidad de los datos bajo modelos evolutivos. Complejidad = Alta. Solución = Optimización numérica."
    },
    {
        id: 13,
        category: "inferencia",
        categoryLabel: "Inferencia Filogenética",
        question: "PREGUNTA DE COMISIÓN: ¿Qué tipo de solución produce la Inferencia Bayesiana y en qué se diferencia fundamentalmente de Máxima Verosimilitud?",
        options: {
            a: "La Inferencia Bayesiana busca un único árbol óptimo exacto, mientras que ML genera millones de árboles aproximados.",
            b: "La Inferencia Bayesiana NO busca un único árbol óptimo; genera una MUESTRA de la distribución de probabilidad posterior mediante algoritmos estocásticos MCMC, integrando datos con conocimientos previos (priors).",
            c: "La Inferencia Bayesiana es determinista de orden O(n^3) y ML es un problema NP-hard sin solución.",
            d: "Ambos métodos son idénticos matemáticamente y solo difieren en el nombre del software empleado."
        },
        answer: ["b"],
        priority: 2,
        isTrap: true,
        trapExplanation: "¡TRAMPA TÍPICA! Mucha gente cree que Bayesiano 'encuentra el mejor árbol'. ¡Falso! Estima la distribución posterior completa y entrega una muestra representativa de árboles generados por MCMC, integrando priors.",
        academicReference: "Nhan et al. (2017) / Felsenstein (2004)",
        keyTakeaway: "Inferencia Bayesiana: Principio = Teorema de Bayes + Priors + MCMC. Complejidad = Muy Alta. Solución = Muestra de la distribución posterior."
    },
    {
        id: 14,
        category: "inferencia",
        categoryLabel: "Inferencia Filogenética",
        question: "De acuerdo con la Tabla comparativa de inferencia de la tesis, ¿cuál es el orden correcto de complejidad computacional de MENOR a MAYOR?",
        options: {
            a: "Neighbor Joining (Baja) < Máxima Parsimonia (Media-Alta) < Máxima Verosimilitud (Alta) < Inferencia Bayesiana (Muy Alta).",
            b: "Máxima Parsimonia (Baja) < Neighbor Joining (Media) < Inferencia Bayesiana (Alta) < Máxima Verosimilitud (Muy Alta).",
            c: "Inferencia Bayesiana (Baja) < Máxima Verosimilitud (Media) < Neighbor Joining (Alta) < Máxima Parsimonia (Muy Alta).",
            d: "Todos los métodos tienen exactamente la misma complejidad asintótica O(n^2 log n)."
        },
        answer: ["a"],
        priority: 1,
        isTrap: false,
        trapExplanation: "Tabla 2.1 de la tesis: NJ (Baja) < Parsimonia (Media-Alta) < Verosimilitud (Alta) < Bayesiano (Muy Alta).",
        academicReference: "Tabla comparativa de inferencia filogenética / Felsenstein (2004)",
        keyTakeaway: "Escala de complejidad: NJ (Baja, O(n³)) -> Parsimonia (Media-Alta, NP-hard) -> ML (Alta, optimización numérica) -> Bayesiano (Muy Alta, MCMC)."
    },

    // ==========================================
    // 3. MÉTRICAS DE DISTANCIA
    // ==========================================
    {
        id: 15,
        category: "distancia",
        categoryLabel: "Métricas de Distancia",
        question: "¿Cuál es el principio operativo de la distancia de Robinson-Foulds (RF)?",
        options: {
            a: "Contabiliza cuántas biparticiones o cortes de ramas (splits) están presentes en un árbol pero ausentes en el otro.",
            b: "Mide el ángulo euclidiano entre los vectores de secuencia de los 471 taxones.",
            c: "Compara el peso total del Árbol de Expansión Mínima de ambos grafos.",
            d: "Cuenta el número de mutaciones puntuales entre dos loci homólogos."
        },
        answer: ["a"],
        priority: 1,
        isTrap: false,
        trapExplanation: "Robinson-Foulds compara la presencia/ausencia de biparticiones (splits): conteo de biparticiones simétricas que existen en uno pero no en el otro (A △ B).",
        academicReference: "Robinson & Foulds (1981)",
        keyTakeaway: "Robinson-Foulds (RF) = Conteo y comparación de biparticiones (splits) ausentes/presentes entre árboles."
    },
    {
        id: 16,
        category: "distancia",
        categoryLabel: "Métricas de Distancia",
        question: "PREGUNTA TRAMPA CLÁSICA: ¿Cuál es el principal defecto o limitación teórica de la métrica de Robinson-Foulds frente al fenómeno del 'rogue taxon'?",
        options: {
            a: "Penaliza drásticamente la disimilitud ante el desplazamiento de un único taxón o pequeña fluctuación de rama interna, pudiendo dar distancia casi máxima entre árboles prácticamente idénticos.",
            b: "No se puede calcular para árboles con más de 10 taxones debido a desbordamiento aritmético.",
            c: "Siempre da una distancia de cero si los árboles provienen de cepas de levadura.",
            d: "Obliga a convertir el árbol en una estructura euclidiana continua."
        },
        answer: ["a"],
        priority: 2,
        isTrap: true,
        trapExplanation: "¡CRUCIAL PARA LA TESIS! El 'rogue taxon' (taxón inestable o desplazado) arruina casi todas las biparticiones en RF, haciendo que dos árboles que comparten el 99% de su topología parezcan totalmente disímiles. Por eso tu tesis usa Distancia de Cuartetos.",
        academicReference: "Lin et al. (2012) / Robinson & Foulds (1981)",
        keyTakeaway: "Defecto de RF: Hipersensible al 'rogue taxon' (un solo taxón desplazado destruye la mayoría de los splits)."
    },
    {
        id: 17,
        category: "distancia",
        categoryLabel: "Métricas de Distancia",
        question: "¿Cuáles son los 3 estados en los que se clasifica cada cuarteto al contrastar dos árboles filogenéticos en la Distancia de Cuartetos (QD)?",
        options: {
            a: "Consensuados, No consensuados, y No resueltos (politomías o estrellas).",
            b: "Monofiléticos, Parafiléticos, y Polifiléticos.",
            c: "Euclidianos, Manhattan, y Relacionales.",
            d: "Positivos, Negativos, y Nulos."
        },
        answer: ["a"],
        priority: 1,
        isTrap: false,
        trapExplanation: "En QD, cada cuarteto en ambos árboles se clasifica en: 1) Consensuado (misma topología interna), 2) No consensuado (contradicción topológica), 3) No resuelto (estrella o politomía).",
        academicReference: "Sand et al. (2014) / tqdist",
        keyTakeaway: "Estados de cuartetos en QD: Consensuados (iguales), No consensuados (contradicción), No resueltos (estrella/politomía)."
    },
    {
        id: 18,
        category: "distancia",
        categoryLabel: "Métricas de Distancia",
        question: "¿Por qué en filogenómica masiva la Distancia de Cuartetos (QD) es superior a Robinson-Foulds para construir la matriz de disimilitud?",
        options: {
            a: "Porque actúa como una métrica de degradación gradual y alta resolución, resistente a fluctuaciones menores o taxones inestables, cuantificando similitud parcial.",
            b: "Porque QD convierte automáticamente los árboles en grafos con dirección temporal absoluta.",
            c: "Porque QD se calcula en tiempo constante O(1) independientemente del número de taxones.",
            d: "Porque QD solo evalúa árboles con raíz obligatoria."
        },
        answer: ["a"],
        priority: 2,
        isTrap: true,
        trapExplanation: "Frente a RF (que es 'todo o nada' por bipartición), QD evalúa subconjuntos locales de 4 taxones: si 1 taxón se mueve, solo altera los cuartetos donde participa, degradando la métrica suavemente y preservando la similitud estructural del resto.",
        academicReference: "Sand et al. (2014) / Lin et al. (2012)",
        keyTakeaway: "QD ofrece degradación gradual, alta resolución y resistencia a perturbaciones locales/rogue taxons."
    },

    // ==========================================
    // 4. MÉTODOS DE AGRUPAMIENTO
    // ==========================================
    {
        id: 19,
        category: "agrupamiento",
        categoryLabel: "Métodos de Agrupamiento",
        question: "TRAMPA CRUCIAL DE TESIS: ¿Por qué el algoritmo clásico K-Means NO es aplicable DIRECTAMENTE sobre la matriz de distancias filogenéticas?",
        options: {
            a: "Porque K-means asume un espacio vectorial euclidiano continuo donde es factible promediar coordenadas para calcular centroides geométricos, mientras que la disimilitud entre árboles conforma una matriz relacional no euclidiana.",
            b: "Porque K-means solo funciona con datos de una sola dimensión.",
            c: "Porque K-means prohíbe definir el valor de k a priori.",
            d: "Porque el tiempo de cálculo de K-means es siempre factorial O(n!)."
        },
        answer: ["a"],
        priority: 2,
        isTrap: true,
        trapExplanation: "¡LA PREGUNTA FAVORITA DE LOS EVALUADORES! Si dices que le aplicaste K-means directo a la matriz de distancias de árboles, te reprobarán: un árbol filogenético no tiene 'coordenadas espaciales' promediables. Se necesita K-medoids (PAM) o proyectar previamente con MDS (Escalamiento Multidimensional).",
        academicReference: "Jain (2010) / Lloyd (1982)",
        keyTakeaway: "K-Means requiere espacio euclidiano para promediar centroides. Distancias de árboles = matriz relacional no euclidiana (requiere K-medoids o MDS previo)."
    },
    {
        id: 20,
        category: "agrupamiento",
        categoryLabel: "Métodos de Agrupamiento",
        question: "¿Qué alternativas metodológicas permiten superar la limitación de K-Means frente a matrices relacionales no euclidianas?",
        options: {
            a: "Usar algoritmos basados en objetos representativos reales (como K-medoids o PAM) o proyectar el espacio mediante Escalamiento Multidimensional (MDS).",
            b: "Eliminar el 90% de los taxones para forzar una distancia euclidiana.",
            c: "Calcular la raíz cuadrada de las secuencias de ADN de cada levadura.",
            d: "Reemplazar los árboles por grafos dirigidos sin aristas."
        },
        answer: ["a"],
        priority: 1,
        isTrap: false,
        trapExplanation: "Las dos soluciones teóricas formales citadas en el texto: K-medoids / PAM (que usa puntos reales en vez de promedios ficticios) o proyección espacial previa mediante MDS.",
        academicReference: "Jain (2010) / Kaufman & Rousseeuw (1990)",
        keyTakeaway: "Para matrices relacionales: K-medoids (PAM) o proyección dimensional previa con MDS."
    },
    {
        id: 21,
        category: "agrupamiento",
        categoryLabel: "Métodos de Agrupamiento",
        question: "En el agrupamiento jerárquico aglomerativo (bottom-up), ¿cómo comienza el algoritmo y cómo se determina el número final de clústeres?",
        options: {
            a: "Comienza con cada árbol génico como un clúster individual y fusiona recursivamente los más próximos según un criterio de enlace (linkage); el número de clústeres se determina cortando el dendrograma.",
            b: "Comienza con todos los elementos en un único súper-nodo y los divide mediante MCMC; k debe definirse antes de iterar.",
            c: "Calcula los centroides euclidianos de cada grupo y exige k a priori obligatorio.",
            d: "Elimina las aristas de peso mayor a epsilon en un radio local."
        },
        answer: ["a"],
        priority: 1,
        isTrap: false,
        trapExplanation: "Enfoque aglomerativo (bottom-up): n observaciones = n clústeres iniciales. Se fusionan iterativamente según linkage (simple, completo, promedio) formando un dendrograma que se corta a la altura deseada.",
        academicReference: "Murtagh & Contreras (2012) / Han et al. (2011)",
        keyTakeaway: "Jerárquico aglomerativo = Bottom-up, dendrograma recursivo por linkage, k definido por la altura de corte."
    },
    {
        id: 22,
        category: "agrupamiento",
        categoryLabel: "Métodos de Agrupamiento",
        question: "¿Cuál es la característica distintiva del algoritmo difuso FANNY (Fuzzy Analysis) y por qué es tan valioso en filogenómica?",
        options: {
            a: "Opera directamente sobre matrices de disimilitud relacionales sin calcular centroides geométricos, y asigna grados de pertenencia difusa u_iv en [0, 1], modelando árboles con señales evolutivas mosaicas (introgresión/recombinación).",
            b: "Es un método particional duro que prohíbe que un gen comparta historias evolutivas entre dos linajes.",
            c: "Descubre automáticamente el número de clústeres sin necesidad de ingresar el parámetro k.",
            d: "Elimina el ruido de fondo fijando un radio de vecindad global epsilon."
        },
        answer: ["a"],
        priority: 2,
        isTrap: true,
        trapExplanation: "FANNY es agrupamiento difuso (soft): no obliga a membresía binaria 0 ó 1. Si un gen sufrió introgresión o recombinación, tiene grados de pertenencia compartidos (ej: 0.6 en clúster A y 0.4 en clúster B). Además, corre directo en matrices relacionales.",
        academicReference: "Kaufman & Rousseeuw (1990)",
        keyTakeaway: "FANNY: Agrupamiento difuso (u_iv ∈ [0, 1]), directo sobre matrices relacionales, modela historias evolutivas mosaicas."
    },
    {
        id: 23,
        category: "agrupamiento",
        categoryLabel: "Métodos de Agrupamiento",
        question: "¿Qué ventaja operativa ofrece DBSCAN frente a K-Means y FANNY respecto a la definición de grupos?",
        options: {
            a: "No exige definir a priori el número de clústeres k, descubre agrupaciones con formas geométricas arbitrarias y aisla el ruido de fondo mediante densidad local (epsilon y MinPts).",
            b: "Permite calcular promedios de centroides en espacios no métricos con complejidad O(1).",
            c: "Siempre agrupa el 100% de los elementos sin dejar jamás observaciones aisladas.",
            d: "Garantiza que todos los clústeres tengan exactamente la misma cantidad de genes."
        },
        answer: ["a"],
        priority: 1,
        isTrap: false,
        trapExplanation: "DBSCAN se basa en densidad espacial: usa radio epsilon y MinPts. No pide k por adelantado, encuentra formas caprichosas y etiqueta puntos dispersos como 'ruido'.",
        academicReference: "Ester et al. (1996)",
        keyTakeaway: "DBSCAN: Basado en densidad (ε, MinPts), k automático, formas arbitrarias, detección de ruido."
    },
    {
        id: 24,
        category: "agrupamiento",
        categoryLabel: "Métodos de Agrupamiento",
        question: "PREGUNTA DE COMISIÓN SOBRE MST-kNN: ¿Cuáles son las 3 fases operativas del algoritmo MST-kNN propuesto por Inostroza-Ponta et al. (2008)?",
        options: {
            a: "1) Construcción del grafo métrico completo con pesos QD; 2) Intersección estructural entre MST y regla k-NN; 3) Particionamiento por componentes conexas.",
            b: "1) Cálculo de centroides euclidianos; 2) Asignación difusa u_iv; 3) Dendrograma jerárquico aglomerativo.",
            c: "1) Inferencia por Máxima Verosimilitud; 2) Búsqueda estocástica MCMC; 3) Poda de biparticiones no consensuadas.",
            d: "1) Proyección MDS en 2D; 2) Expansión por densidad epsilon; 3) Fusión por enlace promedio."
        },
        answer: ["a"],
        priority: 2,
        isTrap: false,
        trapExplanation: "El texto formaliza exactamente las 3 fases de MST-kNN: 1) Grafo métrico G=(V,E,W); 2) Intersección de MST (continuidad sin ciclos) + k-NN (vecindad local); 3) Particionamiento por componentes conexas resultantes.",
        academicReference: "Inostroza-Ponta et al. (2008)",
        keyTakeaway: "MST-kNN: 1) Grafo completo métrico -> 2) Intersección (MST ∩ k-NN) -> 3) Poda y componentes conexas (clústeres)."
    },
    {
        id: 25,
        category: "agrupamiento",
        categoryLabel: "Métodos de Agrupamiento",
        question: "TRAMPA LETAL EN MST-kNN: ¿Qué representa la 'k' en el nombre del algoritmo MST-kNN y se debe ingresar el número de clústeres a priori?",
        options: {
            a: "La 'k' representa el número de VECINOS MÁS CERCANOS en la regla local k-NN; el número de clústeres finales NO se define a priori, sino que surge automáticamente de las componentes conexas.",
            b: "La 'k' representa el número final de clústeres obligatorios a priori, exactamente igual que en K-Means.",
            c: "La 'k' es la constante de Boltzmann usada para la temperatura estocástica del grafo.",
            d: "La 'k' indica el número máximo de hojas que puede tener un árbol filogenético."
        },
        answer: ["a"],
        priority: 2,
        isTrap: true,
        trapExplanation: "¡TRAMPA DONDE CAE EL 90% DE LOS ESTUDIANTES! Escuchan 'k' y dicen 'es el número de clústeres'. ¡FALSO! En MST-kNN, 'k' es el vecindario de k vecinos más cercanos (k-Nearest Neighbors). El número de clústeres resultante es COMPLETAMENTE AUTOMÁTICO (tantos como componentes conexas queden).",
        academicReference: "Inostroza-Ponta et al. (2008) / Tabla comparativa",
        keyTakeaway: "En MST-kNN: k = número de vecinos más cercanos (k-NN). El número de clústeres es AUTOMÁTICO (componentes conexas)."
    },
    {
        id: 26,
        category: "agrupamiento",
        categoryLabel: "Métodos de Agrupamiento",
        question: "¿Por qué en la fase 2 de MST-kNN se calcula primero el Árbol de Expansión Mínima (MST)?",
        options: {
            a: "Porque conecta todos los nodos del grafo con la suma mínima de pesos y sin formar ciclos, garantizando la continuidad global del sistema.",
            b: "Porque descarta automáticamente el 50% de los genes para acelerar el cálculo en Python.",
            c: "Porque convierte la métrica no euclidiana en una distribución normal multivariada.",
            d: "Porque calcula la longitud total de las ramas bajo el criterio de Máxima Verosimilitud."
        },
        answer: ["a"],
        priority: 1,
        isTrap: false,
        trapExplanation: "El MST (Minimum Spanning Tree) asegura que ningún nodo quede aislado prematuramente y mantiene la conectividad mínima global sin ciclos redundantes.",
        academicReference: "Inostroza-Ponta et al. (2008)",
        keyTakeaway: "MST en fase 2 garantiza la continuidad global del sistema conectando todos los nodos con peso mínimo sin ciclos."
    },

    // ==========================================
    // 5. COMPLEJIDADES COMPUTACIONALES & SÍNTESIS
    // ==========================================
    {
        id: 27,
        category: "complejidades",
        categoryLabel: "Complejidad & Algoritmos",
        question: "Según la Tabla comparativa de la tesis, ¿cuál es la complejidad computacional del algoritmo MST-kNN?",
        options: {
            a: "O(n^2 log n)",
            b: "O(n^3)",
            c: "O(n * k * d * i)",
            d: "O(2^n)"
        },
        answer: ["a"],
        priority: 1,
        isTrap: false,
        trapExplanation: "En la Tabla 2.2 de métodos de agrupamiento: MST-kNN tiene complejidad O(n^2 log n), asociada al ordenamiento de aristas y cálculo del MST sobre el grafo completo.",
        academicReference: "Inostroza-Ponta et al. (2008) / Tabla comparativa",
        keyTakeaway: "MST-kNN complejidad = O(n² log n)."
    },
    {
        id: 28,
        category: "complejidades",
        categoryLabel: "Complejidad & Algoritmos",
        question: "¿Cuál es la complejidad computacional del agrupamiento difuso FANNY indicada en la tesis?",
        options: {
            a: "O(n^2)",
            b: "O(n log n)",
            c: "O(n^4)",
            d: "O(n^3)"
        },
        answer: ["a"],
        priority: 1,
        isTrap: false,
        trapExplanation: "Tabla 2.2: FANNY tiene una cota de complejidad de O(n^2), operando sobre la matriz de disimilitud por pares.",
        academicReference: "Kaufman & Rousseeuw (1990) / Tabla comparativa",
        keyTakeaway: "FANNY complejidad = O(n²)."
    },
    {
        id: 29,
        category: "complejidades",
        categoryLabel: "Complejidad & Algoritmos",
        question: "¿Cuál es la complejidad del agrupamiento Jerárquico Aglomerativo según la literatura citada en la tesis?",
        options: {
            a: "O(n^2) a O(n^3)",
            b: "Estrictamente O(n log n)",
            c: "O(1) amortizado",
            d: "O(k^n)"
        },
        answer: ["a"],
        priority: 1,
        isTrap: false,
        trapExplanation: "Tabla 2.2: Jerárquico tiene una cota entre O(n^2) y O(n^3) dependiendo de las estructuras de datos y enlace (Murtagh & Contreras 2012).",
        academicReference: "Murtagh & Contreras (2012)",
        keyTakeaway: "Jerárquico complejidad = O(n²) ~ O(n³)."
    },
    {
        id: 30,
        category: "complejidades",
        categoryLabel: "Complejidad & Algoritmos",
        question: "¿Cuáles de los siguientes métodos de agrupamiento analizados requieren que el usuario defina 'k' (número de grupos) a priori de forma obligatoria?",
        options: {
            a: "K-Means y FANNY (Fuzzy Analysis).",
            b: "DBSCAN y MST-kNN.",
            c: "Exclusivamente el agrupamiento Jerárquico.",
            d: "Ninguno de los métodos requiere definir k."
        },
        answer: ["a"],
        priority: 2,
        isTrap: true,
        trapExplanation: "En la Tabla 2.2: K-Means y FANNY exigen k a priori. DBSCAN y MST-kNN son automáticos (no requieren k a priori). Jerárquico lo determina por la altura de corte del dendrograma.",
        academicReference: "Tabla comparativa de métodos de agrupamiento",
        keyTakeaway: "k a priori obligatorio: K-Means y FANNY. k automático: DBSCAN y MST-kNN. k por corte: Jerárquico."
    },
    {
        id: 31,
        category: "complejidades",
        categoryLabel: "Complejidad & Algoritmos",
        question: "¿Qué representa la variable 'n' en las cotas de complejidad de la Tabla de agrupamiento de la tesis?",
        options: {
            a: "El número de árboles génicos correspondientes a los genes ortólogos analizados.",
            b: "El número de nucleótidos de cada genoma completo.",
            c: "El número de cuartetos no consensuados.",
            d: "El número de generaciones de la cadena de Markov."
        },
        answer: ["a"],
        priority: 1,
        isTrap: false,
        trapExplanation: "Nota al pie de la Tabla 2.2: 'n corresponde al número de árboles génicos, k al número de clústeres o vecinos según el método, d a la dimensionalidad e i al número de iteraciones'.",
        academicReference: "Nota de la Tabla 2.2 de la tesis",
        keyTakeaway: "En la tabla de agrupamiento: n = número de árboles génicos bajo estudio."
    },
    {
        id: 32,
        category: "complejidades",
        categoryLabel: "Complejidad & Algoritmos",
        question: "¿Cuál es la cota de complejidad de DBSCAN según la tabla comparativa de la tesis?",
        options: {
            a: "O(n log n) a O(n^2)",
            b: "O(n^3)",
            c: "O(k^2 log n)",
            d: "O(n!)"
        },
        answer: ["a"],
        priority: 1,
        isTrap: false,
        trapExplanation: "Tabla 2.2: DBSCAN tiene complejidad O(n log n) a O(n^2) según el uso de estructuras de indexación espacial (Ester et al. 1996).",
        academicReference: "Ester et al. (1996)",
        keyTakeaway: "DBSCAN complejidad = O(n log n) ~ O(n²)."
    },

    // ==========================================
    // 6. PREGUNTAS TRAMPA DE LA COMISIÓN (DEFENSE SHIELD)
    // ==========================================
    {
        id: 33,
        category: "trampas",
        categoryLabel: "Trampas de Comisión",
        question: "SIMULACIÓN DE EXAMEN: Un profesor de la comisión te pregunta: '¿Por qué no calculaste la verosimilitud de la topología consenso usando Neighbor Joining?'. ¿Cuál es tu respuesta técnica correcta?",
        options: {
            a: "Neighbor Joining es un método basado en distancias aglomerativo que NO calcula ni optimiza verosimilitudes; la verosimilitud requiere modelos probabilísticos de sustitución y es propia de Máxima Verosimilitud (ML).",
            b: "Porque Neighbor Joining ya calcula el MCMC de la distribución posterior de forma automática.",
            c: "Porque la verosimilitud solo se puede calcular en árboles con menos de 10 taxones.",
            d: "Porque Neighbor Joining es un método basado en caracteres que minimiza cambios mutacionales."
        },
        answer: ["a"],
        priority: 2,
        isTrap: true,
        trapExplanation: "¡TRAMPA DE CONFUSIÓN DE CONCEPTOS! La comisión suele mezclar términos para ver si distingues: NJ es determinista basado en matrices de distancia, NO evalúa modelos de sustitución probabilísticos ni calcula verosimilitudes.",
        academicReference: "Saitou & Nei (1987) / Felsenstein (2004)",
        keyTakeaway: "NJ = distancias (no verosimilitud). ML = modelos de sustitución y verosimilitud. Parsimonia = caracteres mutacionales mínimos."
    },
    {
        id: 34,
        category: "trampas",
        categoryLabel: "Trampas de Comisión",
        question: "SIMULACIÓN DE EXAMEN: Si la comisión te dice: 'En tu árbol no enraizado de S. eubayanus, muéstrame el clado más antiguo que dio origen a todos los demás'. ¿Cómo respondes con fundamento?",
        options: {
            a: "'Al ser un árbol filogenético no enraizado, no se asume un ancestro común directo ni grupo externo a priori; por lo tanto, no existe una dirección temporal absoluta ni un clado ancestral identificable sin enraizamiento previo'.",
            b: "'El clado más antiguo es siempre la primera hoja que aparece en el archivo Newick'.",
            c: "'El nodo más antiguo es aquel con mayor número de biparticiones en Robinson-Foulds'.",
            d: "'El ancestro común se deduce automáticamente calculando el promedio de distancias de cuartetos'."
        },
        answer: ["a"],
        priority: 2,
        isTrap: true,
        trapExplanation: "¡TRAMPA MAYOR DE DEFENSA! En un árbol NO enraizado no hay 'primer clado' ni 'ancestro universal'. Solo hay relaciones de parentesco relativo. Si señalas un nodo como el más antiguo, te pillaron en la trampa.",
        academicReference: "Felsenstein (2004) / Fundamento Teórico",
        keyTakeaway: "Árbol no enraizado = SIN dirección temporal absoluta, SIN ancestro original definido sin grupo externo."
    },
    {
        id: 35,
        category: "trampas",
        categoryLabel: "Trampas de Comisión",
        question: "SIMULACIÓN DE EXAMEN: Si un profesor afirma: 'Para qué usar Quartet Distance si Robinson-Foulds es más simple y conocida'. ¿Qué argumento demoledor presentas?",
        options: {
            a: "'Robinson-Foulds sufre severamente del efecto rogue taxon: si un solo taxón fluctúa levemente, la distancia RF se satura al máximo penalizando drásticamente la topología, mientras que Quartet Distance degrada suavemente y preserva la resolución'.",
            b: "'Robinson-Foulds no se puede programar en Python ni tiene soporte en Biopython'.",
            c: "'Quartet Distance no requiere calcular árboles, solo lee alineamientos directos'.",
            d: "'Robinson-Foulds únicamente funciona para árboles con exactamente 4 taxones'."
        },
        answer: ["a"],
        priority: 2,
        isTrap: true,
        trapExplanation: "Esta es la defensa clave de tu metodología: RF es hipersensible a pequeñas discrepancias topológicas aisladas. QD es de alta resolución y degradación gradual.",
        academicReference: "Lin et al. (2012) / Sand et al. (2014)",
        keyTakeaway: "Defensa metodológica: QD resiste rogue taxons, proporciona degradación gradual y alta resolución; RF es binaria y frágil."
    },
    {
        id: 36,
        category: "trampas",
        categoryLabel: "Trampas de Comisión",
        question: "SIMULACIÓN DE EXAMEN: '¿Por qué elegiste un método difuso como FANNY en vez de forzar a cada gen a pertenecer a un solo grupo rígido?'. Tu defensa es:",
        options: {
            a: "'Porque fenómenos biológicos como la introgresión, recombinación y transferencia horizontal generan señales evolutivas mosaicas, donde un gen comparte historia con múltiples linajes, lo cual FANNY modela mediante pertenencia u_iv en [0,1]'.",
            b: "'Porque FANNY es el único algoritmo que no requiere memoria en computadores modernos'.",
            c: "'Porque K-means siempre genera clústeres vacíos con datos genéticos'.",
            d: "'Porque la pertenencia difusa es obligatoria bajo el estándar Newick'."
        },
        answer: ["a"],
        priority: 2,
        isTrap: false,
        trapExplanation: "En filogenómica de levaduras (*S. eubayanus*), los genomas tienen historias reticuladas e introgresión. Un método rígido oculta esta biología; FANNY la visibiliza con membresía continua.",
        academicReference: "Kaufman & Rousseeuw (1990) / Fundamento Teórico",
        keyTakeaway: "FANNY modela la realidad biológica de señales mosaicas e historias compartidas sin forzar particiones binarias artificiales."
    },
    {
        id: 37,
        category: "trampas",
        categoryLabel: "Trampas de Comisión",
        question: "VERDADERO O FALSO: 'En un árbol no enraizado de 471 hojas, cada rama interna define una bipartición que divide las hojas en dos conjuntos disjuntos y no vacíos A y B tales que A ∪ B = V_hojas'.",
        options: {
            a: "VERDADERO. Esta es la definición formal matemática de bipartición o split citada en la tesis.",
            b: "FALSO. Las ramas internas solo pueden dividir las hojas si el árbol tiene raíz ancestral.",
            c: "FALSO. El conjunto A y B debe solaparse siempre con al menos un taxón en común.",
            d: "FALSO. Solo las hojas de grado 3 generan biparticiones."
        },
        answer: ["a"],
        priority: 1,
        isTrap: true,
        trapExplanation: "Es exactamente la definición matemática formal de Semple & Steel (2003): cada rama interna e in E induce un corte (split) bipartito disjunto A y B tal que su unión cubre todas las hojas.",
        academicReference: "Semple & Steel (2003)",
        keyTakeaway: "Bipartición formal: A ∪ B = V_hojas, A ∩ B = ∅, con A, B ≠ ∅."
    },
    {
        id: 38,
        category: "trampas",
        categoryLabel: "Trampas de Comisión",
        question: "SIMULACIÓN DE EXAMEN: 'En la inferencia bayesiana, ¿por qué no se selecciona simplemente la topología con la probabilidad a priori (prior) más alta?'.",
        options: {
            a: "Porque la inferencia combina los priors con la verosimilitud de los datos observados para estimar la probabilidad POSTERIOR mediante MCMC, no basándose únicamente en el prior.",
            b: "Porque los priors siempre valen cero en árboles filogenéticos.",
            c: "Porque la probabilidad a priori solo aplica a algoritmos aglomerativos como Neighbor Joining.",
            d: "Porque el teorema de Bayes ignora por completo la evidencia de los datos de secuencia."
        },
        answer: ["a"],
        priority: 2,
        isTrap: true,
        trapExplanation: "Teorema de Bayes: Posterior = (Verosimilitud * Prior) / Evidencia. Tomar solo el prior ignoraría la evidencia de las secuencias observadas.",
        academicReference: "Nhan et al. (2017) / Felsenstein (2004)",
        keyTakeaway: "Bayes: Probabilidad Posterior = Priors + Verosimilitud de los datos (vía MCMC)."
    },

    // ==========================================
    // 7. PREGUNTAS DEL ENSAYO REAL DEL PROFESOR EVALUADOR
    // ==========================================
    {
        id: 39,
        category: "contexto",
        categoryLabel: "Contexto y Motivación",
        question: "¿Cuál es el verdadero propósito ('el para qué') de realizar un análisis filogenético a escala de genoma completo en Saccharomyces eubayanus?",
        options: {
            a: "Aislar cepas vivas en biorreactores para optimizar industrialmente el perfil aromático de la cerveza.",
            b: "Demostrar si la co-evolución y congruencia topológica entre árboles de genes permite descubrir módulos funcionales celulares sin sesgo a priori.",
            c: "Calcular la secuencia de ADN consenso para diseñar terapias genéticas mediante CRISPR.",
            d: "Clasificar las cepas según su origen geográfico patagónico para patentar linajes comerciales."
        },
        answer: ["b"],
        priority: 2,
        isTrap: true,
        isProfessorEnsayo: true,
        trapExplanation: "¡Trampa típica de ensayo! Los evaluadores advierten: la tesis es bioinformática y computacional; no aisló cepas ni optimizó procesos cerveceros en laboratorio. Su fin es demostrar si la congruencia topológica entre árboles génicos revela módulos funcionales sin sesgo a priori.",
        academicReference: "Observaciones del Profesor Evaluador / Ensayo de Defensa",
        keyTakeaway: "Propósito: Demostrar si la co-evolución y congruencia topológica entre árboles génicos descubre módulos funcionales celulares sin sesgo a priori."
    },
    {
        id: 40,
        category: "contexto",
        categoryLabel: "Contexto y Motivación",
        question: "¿Por qué es un error grave afirmar en la defensa que la tesis sirve 'para que en el laboratorio sepan qué genes optimizar o mejorar en la cerveza'?",
        options: {
            a: "Porque la levadura Saccharomyces eubayanus no se utiliza en ningún tipo de fermentación cervecera.",
            b: "Porque la tesis es de ingeniería informática/bioinformática, analizó genes computacionalmente y excluyó explícitamente el trabajo experimental con cepas y la optimización en laboratorio.",
            c: "Porque optimizar genes en levaduras requiere obligatoriamente algoritmos de deep learning y GPUs.",
            d: "Porque las matrices de distancia topológica solo pueden aplicarse a bacterias y virus, no a levaduras."
        },
        answer: ["b"],
        priority: 2,
        isTrap: true,
        isProfessorEnsayo: true,
        trapExplanation: "En los alcances de la memoria (Sección 1.4.3) y en las observaciones del profesor se enfatiza que la tesis agrupó genes computacionalmente y no evaluó fenotipos ni intervino cepas; sostener que 'optimiza la cerveza' carece de sustento experimental.",
        academicReference: "Sección 1.4.3 de la Memoria / Feedback Docente",
        keyTakeaway: "Alcance computacional estricto: la tesis agrupa genes in silico; no incluye optimización experimental cervecera ni manipulación en laboratorio."
    },
    {
        id: 41,
        category: "contexto",
        categoryLabel: "Contexto y Motivación",
        question: "¿Qué problema conceptual se genera al comenzar la presentación mostrando directamente el nombre técnico de la levadura sin contextualizar?",
        options: {
            a: "Provoca que el software de presentación no renderice las diapositivas con codificación UTF-8.",
            b: "Impide que la comisión entienda de entrada qué organismo se estudia (un hongo unicelular) y cuál es su relevancia biológica o industrial.",
            c: "Invalida automáticamente el cálculo de las matrices de disimilitud filogenética.",
            d: "Obliga a cambiar el marco metodológico KDD por CRISP-DM durante la misma defensa."
        },
        answer: ["b"],
        priority: 1,
        isTrap: false,
        isProfessorEnsayo: true,
        trapExplanation: "En el ensayo, el profesor y los compañeros señalaron que entrar de golpe con un nombre técnico desorienta al evaluador; es necesario partir explicando qué es la levadura (hongo unicelular, parental de la levadura lager S. pastorianus) para dar contexto antes de la técnica.",
        academicReference: "Recomendaciones de Oratoria y Contexto Docente",
        keyTakeaway: "Regla de inicio: Contextualizar siempre primero el organismo (hongo unicelular, ancestro salvaje de híbridos lager) antes de profundizar en la técnica."
    },
    {
        id: 42,
        category: "kdd",
        categoryLabel: "Metodología KDD",
        question: "¿Cuál es la principal debilidad metodológica del marco KDD tradicional que el profesor destacó en el audio?",
        options: {
            a: "Que no permite procesar más de 100 archivos en formato PHYLIP de manera simultánea.",
            b: "Que es una metodología esencialmente lineal, carece de una fase inicial explícita de comprensión del problema/negocio y no contempla el despliegue final.",
            c: "Que prohíbe el uso de algoritmos basados en teoría de grafos como MST-kNN.",
            d: "Que exige obligatoriamente entrenar redes neuronales convolucionales en la etapa de minería."
        },
        answer: ["b"],
        priority: 2,
        isTrap: true,
        isProfessorEnsayo: true,
        trapExplanation: "El profesor explica que KDD puro es de los años 90 y tiene una estructura rígida y lineal; a diferencia de metodologías más modernas como CRISP-DM, no incluye la comprensión del problema/negocio al inicio ni la fase de despliegue al final.",
        academicReference: "Fayyad et al. (1996) / Observaciones del Profesor",
        keyTakeaway: "Debilidad de KDD: Estructura lineal y rígida, sin fase explícita inicial de comprensión del negocio/problema ni fase final de despliegue."
    },
    {
        id: 43,
        category: "kdd",
        categoryLabel: "Metodología KDD",
        question: "¿Cómo se debe justificar técnicamente la elección de KDD en la tesis sin caer en respuestas vagas como 'porque era lo mejor'?",
        options: {
            a: "Afirmando que fue la única metodología permitida por el reglamento de titulación de la universidad.",
            b: "Argumentando que el pipeline experimental del proyecto sigue etapas analíticas bien acotadas y secuenciales (Selección, Transformación, Minería y Evaluación).",
            c: "Sosteniendo que KDD es la única metodología que admite bases de datos de interacción proteína-proteína como STRING.",
            d: "Indicando que KDD fue diseñada específicamente para la reconstrucción de árboles filogenéticos no enraizados."
        },
        answer: ["b"],
        priority: 1,
        isTrap: false,
        isProfessorEnsayo: true,
        trapExplanation: "La justificación correcta ante el comité es explicar que el experimento bioinformático posee un alcance cerrado con fases de flujo de datos muy bien delimitadas: preparación de secuencias, inferencia de árboles, cálculo de distancias y clustering, y evaluación biológica.",
        academicReference: "Metodología de la Investigación / KDD Process",
        keyTakeaway: "Justificación de KDD: Fases analíticas nítidas y secuenciales de flujo de datos (Selección -> Transformación -> Minería -> Evaluación)."
    },
    {
        id: 44,
        category: "preprocesamiento",
        categoryLabel: "Preprocesamiento y Filtrado",
        question: "¿Qué riesgo biológico se corre al eliminar los genes que presentan menos de 70 polimorfismos (SNPs)?",
        options: {
            a: "Se sobrecarga la memoria RAM al momento de calcular el Árbol Generador Mínimo (MST).",
            b: "Se pueden descartar genes altamente conservados que cumplen funciones metabólicas vitales y que forman parte central de módulos funcionales.",
            c: "Se altera el límite superior teórico de la métrica Robinson-Foulds transformándolo en 471.",
            d: "Se obliga a que el algoritmo Neighbor Joining genere árboles ultramétricos enraizados."
        },
        answer: ["b"],
        priority: 2,
        isTrap: true,
        isProfessorEnsayo: true,
        trapExplanation: "¡Ojo biológico! Los genes con muy pocos SNPs suelen estar ultraconservados porque mutaciones en ellos son letales para la célula. Al filtrarlos por baja variabilidad estadística para facilitar la inferencia filogenética, se corre el riesgo de eliminar componentes clave de complejos esenciales.",
        academicReference: "Discusión de Preprocesamiento / Observaciones del Profesor",
        keyTakeaway: "Riesgo de filtrar <70 SNPs: Se descartan genes altamente conservados y esenciales cuya preservación evolutiva es crítica para la célula."
    },
    {
        id: 45,
        category: "preprocesamiento",
        categoryLabel: "Preprocesamiento y Filtrado",
        question: "Cuando una secuencia corta o con datos faltantes genera un árbol multifurcado o anómalo en Máxima Verosimilitud, ¿cuál es la explicación matemática rigurosa?",
        options: {
            a: "El algoritmo generativo 'alucinó' debido a una sobreparametrización del modelo GTR.",
            b: "La escasez de sitios variables reduce la señal estadística, impidiendo resolver biparticiones con alto soporte y colapsando ramas en politomías.",
            c: "El procesador sufrió un desbordamiento de punto flotante en la biblioteca Biopython.",
            d: "El número de cepas aumentó temporalmente de 471 a 936 durante la fase de transformación."
        },
        answer: ["b"],
        priority: 1,
        isTrap: false,
        isProfessorEnsayo: true,
        trapExplanation: "Los métodos filogenéticos son probabilísticos y estadísticos; si la secuencia es muy corta o tiene gaps, no hay suficiente evidencia filogenética para bifurcar con soporte estadístico y las ramas de longitud cero colapsan en politomías (árbol multifurcado).",
        academicReference: "Felsenstein (2004) / Yang (2014)",
        keyTakeaway: "Politomías por falta de SNPs: Señal estadística insuficiente para resolver biparticiones con soporte -> colapso de ramas en nodos multifurcados."
    },
    {
        id: 46,
        category: "distancia",
        categoryLabel: "Métricas de Distancia",
        question: "¿Cómo se calcula la distancia máxima teórica de Robinson-Foulds (RF) para árboles no enraizados de n cepas?",
        options: {
            a: "Multiplicando el número total de genes por el logaritmo de las cepas: G · log(n).",
            b: "Calculando el número de combinaciones de cuartetos posibles: C(n, 4).",
            c: "Mediante la fórmula 2n - 6, que para 471 cepas resulta exactamente en 936.",
            d: "Elevando al cuadrado el valor del índice de silueta global: Silueta²."
        },
        answer: ["c"],
        priority: 2,
        isTrap: false,
        isProfessorEnsayo: true,
        trapExplanation: "Un árbol no enraizado de n hojas tiene como máximo n - 3 ramas internas (biparticiones). La métrica RF cuenta biparticiones no compartidas: 2 * (n - 3) = 2n - 6. Para 471 cepas: 2(471) - 6 = 942 - 6 = 936.",
        academicReference: "Robinson & Foulds (1981) / Semple & Steel (2003)",
        keyTakeaway: "Máximo teórico RF no enraizado: 2(n - 3) = 2n - 6. Con n=471 cepas: exactamente 936."
    },
    {
        id: 47,
        category: "distancia",
        categoryLabel: "Métricas de Distancia",
        question: "¿Qué significa empíricamente que la distancia Robinson-Foulds alcance el valor de 936 entre dos árboles génicos?",
        options: {
            a: "Que ambos árboles provienen de cepas geográficamente idénticas.",
            b: "Que la métrica se saturó completamente: los dos árboles no comparten ninguna bipartición interna.",
            c: "Que el clustering MST-kNN ha encontrado un módulo funcional perfecto de alta cohesión.",
            d: "Que la inferencia de Máxima Verosimilitud alcanzó un valor de soporte UFBoot del 100%."
        },
        answer: ["b"],
        priority: 2,
        isTrap: true,
        isProfessorEnsayo: true,
        trapExplanation: "El valor 936 indica saturación total de la métrica: disimilitud topológica del 100%, ni una sola bipartición interna compartida. Evidencia la limitación de RF, que satura muy rápidamente ante divergencias menores.",
        academicReference: "Robinson & Foulds (1981) / Observaciones del Profesor",
        keyTakeaway: "RF = 936 (máximo teórico): Saturación total de la métrica, cero biparticiones internas en común entre ambos árboles génicos."
    },
    {
        id: 48,
        category: "distancia",
        categoryLabel: "Métricas de Distancia",
        question: "¿Por qué la métrica Quartet Distance (QD) ofrece una mayor resolución analítica que Robinson-Foulds en este proyecto?",
        options: {
            a: "Porque Quartet Distance incorpora la velocidad de mutación y el tiempo geológico en sus aristas.",
            b: "Porque evalúa subconjuntos de 4 taxones, permitiendo capturar similitudes topológicas intermedias aunque el clado global se rompa.",
            c: "Porque reduce la complejidad computacional de O(n³) a O(1) en la biblioteca SciPy.",
            d: "Porque exige que los árboles estén obligatoriamente enraizados mediante un grupo externo (outgroup)."
        },
        answer: ["b"],
        priority: 2,
        isTrap: false,
        isProfessorEnsayo: true,
        trapExplanation: "RF es binaria y rígida: si un solo taxón se mueve (rogue taxon), destruye la bipartición completa. QD analiza las C(n,4) sub-topologías de 4 taxones; si la mayoría conserva su relación, la distancia es baja y gradual, ofreciendo alta resolución.",
        academicReference: "Sand et al. (2014) / Mailund et al. (2006)",
        keyTakeaway: "Ventaja de QD: Alta resolución y degradación gradual al evaluar C(n,4) cuartetos; robusto frente a taxones desplazados (rogue taxa)."
    },
    {
        id: 49,
        category: "distancia",
        categoryLabel: "Métricas de Distancia",
        question: "¿Cuáles son los métodos adicionales de distancia entre árboles filogenéticos que el profesor nombró explícitamente en el audio?",
        options: {
            a: "Distancia Euclidiana, Distancia Manhattan y Distancia Mahalanobis.",
            b: "Path Length Difference, Quadratic Path Difference (al cuadrado) y Kendall-Colijn.",
            c: "Distancia Hamming, Distancia Levenshtein y Divergencia Jukes-Cantor.",
            d: "Índice Jaccard, Coeficiente Dice y Similitud Coseno."
        },
        answer: ["b"],
        priority: 2,
        isTrap: true,
        isProfessorEnsayo: true,
        trapExplanation: "En el audio, el profesor enfatiza que en la literatura existen por lo menos seis métricas más y cita textualmente Path Length Difference, su variante de diferencia al cuadrado (Quadratic Path Difference) y Kendall-Colijn.",
        academicReference: "Grabación Ensayo Defensa / Steel & Penny (1993) / Kendall & Colijn (2016)",
        keyTakeaway: "Métricas adicionales citadas por el profesor: Path Length Difference, Quadratic Path Difference y Kendall-Colijn."
    },
    {
        id: 50,
        category: "distancia",
        categoryLabel: "Métricas de Distancia",
        question: "¿Cuál fue la justificación técnica clave del profesor para descartar las métricas de distancia basadas en ramas?",
        options: {
            a: "Porque demandan tarjetas gráficas de última generación que no estaban disponibles en el servidor.",
            b: "Porque esas métricas incorporan la longitud de las ramas (tasas de mutación), lo cual confunde la historia evolutiva cuando genes co-funcionales mutan a distinta velocidad.",
            c: "Porque el lenguaje de programación Python no posee bibliotecas que lean árboles en formato Newick.",
            d: "Porque la distancia de ramas solo funciona si el número de genes es inferior a 100."
        },
        answer: ["b"],
        priority: 2,
        isTrap: false,
        isProfessorEnsayo: true,
        trapExplanation: "Las longitudes de rama reflejan cantidad de sustituciones/mutaciones. Dos genes pueden ser miembros del mismo complejo funcional y compartir la misma topología de parentesco, pero tener tasas evolutivas muy distintas; una métrica de ramas los consideraría lejanos erróneamente.",
        academicReference: "Fundamento Teórico / Observaciones del Profesor",
        keyTakeaway: "Descarte de distancias de ramas: Confunden tasas de mutación con topología. Genes co-funcionales pueden tener topología idéntica pero longitudes de rama muy distintas."
    },
    {
        id: 51,
        category: "distancia",
        categoryLabel: "Métricas de Distancia",
        question: "¿Por qué no es aplicable la métrica de Kendall-Colijn a los árboles filogenéticos generados en este trabajo?",
        options: {
            a: "Porque la métrica de Kendall-Colijn está patentada y no se puede usar con licencias académicas.",
            b: "Porque requiere árboles estrictamente enraizados (rooted), midiendo distancias al ancestro común desde la raíz, mientras que los árboles del pipeline son sin raíz (unrooted).",
            c: "Porque fue diseñada exclusivamente para comparar secuencias de ARN ribosomal bacteriano.",
            d: "Porque no admite matrices de más de 10x10 elementos."
        },
        answer: ["b"],
        priority: 2,
        isTrap: true,
        isProfessorEnsayo: true,
        trapExplanation: "La métrica de Kendall-Colijn construye vectores de distancias topológicas y de ramas tomando como punto de partida y referencia la raíz (ancestro común). Al ser árboles unrooted sin outgroup temporal, no se puede calcular.",
        academicReference: "Kendall & Colijn (2016)",
        keyTakeaway: "Kendall-Colijn: Inaplicable porque exige árboles enraizados (rooted); el pipeline genera árboles no enraizados (unrooted)."
    },
    {
        id: 52,
        category: "agrupamiento",
        categoryLabel: "Métodos de Agrupamiento",
        question: "¿Por qué se descartaron los algoritmos particionales como K-Means y Fuzzy C-Means en la fase de agrupamiento?",
        options: {
            a: "Porque no funcionan en sistemas operativos basados en Linux (Ubuntu).",
            b: "Porque operan sobre espacios vectoriales calculando centroides promedio y exigen definir el número de clústeres 'k' de forma fija a priori.",
            c: "Porque tardan meses en ejecutarse sobre árboles filogenéticos no binarios.",
            d: "Porque impiden el posterior cálculo del enriquecimiento funcional en la base de datos STRING."
        },
        answer: ["b"],
        priority: 1,
        isTrap: false,
        isProfessorEnsayo: true,
        trapExplanation: "K-Means requiere puntos en un espacio vectorial continuo para calcular el promedio geométrico (centroide) de cada cluster, lo cual no existe en una matriz de distancias topológicas relacionales sin proyección. Además, forzar un k fijo contradice el descubrimiento autónomo.",
        academicReference: "Inostroza-Ponta (2008) / Kaufman & Rousseeuw (1990)",
        keyTakeaway: "K-Means descartado: Requiere espacio vectorial con centroides promedio euclidianos y fuerza un k fijo a priori."
    },
    {
        id: 53,
        category: "agrupamiento",
        categoryLabel: "Métodos de Agrupamiento",
        question: "¿Cuál es la salida matemática natural de un algoritmo de Clustering Jerárquico aglomerativo?",
        options: {
            a: "Una lista de etiquetas independientes sin relación estructural entre sí.",
            b: "Una única estructura conexa en forma de árbol (dendrograma) que agrupa todos los elementos del conjunto de datos.",
            c: "Una red bipartita con pesos probabilísticos en las aristas.",
            d: "Un hiperplano óptimo de separación con margen máximo."
        },
        answer: ["b"],
        priority: 1,
        isTrap: false,
        isProfessorEnsayo: true,
        trapExplanation: "El clustering jerárquico no entrega particiones separadas por defecto: genera un dendrograma completo que une el 100% de los elementos en una jerarquía continua anidada. Para obtener grupos se debe aplicar un corte arbitrario.",
        academicReference: "Murtagh & Contreras (2012) / Observaciones del Profesor",
        keyTakeaway: "Salida del Jerárquico: Un dendrograma conexo único que anida todos los elementos; no particiones directas sin corte."
    },
    {
        id: 54,
        category: "agrupamiento",
        categoryLabel: "Métodos de Agrupamiento",
        question: "¿Por qué el Clustering Jerárquico con Quartet Distance generó tres grupos de 1 solo gen y dos macrogrupos gigantes al pedirle 5 grupos?",
        options: {
            a: "Por un desbordamiento de memoria al generar la matriz en formato TSV.",
            b: "Porque un corte a una altura global única aísla primero los árboles atípicos (outliers) como grupos individuales y colapsa el resto en macrogrupos densos.",
            c: "Porque el método Neighbor Joining eliminó todas las ramas con UFBoot menor al 95%.",
            d: "Porque la métrica Quartet Distance genera valores enteros idénticos en todas las comparaciones."
        },
        answer: ["b"],
        priority: 2,
        isTrap: true,
        isProfessorEnsayo: true,
        trapExplanation: "Al cortar un dendrograma a un único umbral horizontal para forzar 5 grupos, si existen 3 genes muy divergentes en la periferia, estos absorben 3 cortes aislándose en clusters unitarios (G1=1, G2=1, G5=1), mientras que la masa central de datos queda dividida en solo dos bloques masivos.",
        academicReference: "Resultados Experimentales de la Tesis / Observaciones del Profesor",
        keyTakeaway: "Efecto corte jerárquico: Umbral global aísla outliers en clusters unitarios (1 gen) y colapsa la masa principal en macrogrupos."
    },
    {
        id: 55,
        category: "agrupamiento",
        categoryLabel: "Métodos de Agrupamiento",
        question: "¿Cómo funciona conceptualmente el algoritmo MST-kNN seleccionado como propuesta metodológica central?",
        options: {
            a: "Calcula las componentes principales de los genes y traza hiperplanos ortogonales de separación.",
            b: "Construye un Árbol Generador Mínimo sobre el grafo de los k vecinos más cercanos y poda las aristas que no cumplen el criterio de conectividad local mutua.",
            c: "Agrupa iterativamente los puntos calculando el centro geométrico de cada clúster hasta converger.",
            d: "Genera 1.000 árboles filogenéticos aleatorios y selecciona el que tenga menor parsimonia."
        },
        answer: ["b"],
        priority: 2,
        isTrap: false,
        isProfessorEnsayo: true,
        trapExplanation: "MST-kNN combina la conectividad global del Árbol Generador Mínimo (MST) con la proximidad local del grafo k-NN. Al intersectarlos, las aristas que unen regiones con densidades distintas o conexiones débiles se podan, dejando componentes conexas como clústeres automáticos.",
        academicReference: "Inostroza-Ponta (2008)",
        keyTakeaway: "MST-kNN: Intersección MST (estructura global) ∩ k-NN (vecindad local) -> Poda de aristas inconsistentes -> Componentes conexas automáticas."
    },
    {
        id: 56,
        category: "agrupamiento",
        categoryLabel: "Métodos de Agrupamiento",
        question: "¿Cuál es la principal ventaja de MST-kNN sobre el algoritmo basado en densidad DBSCAN en este proyecto?",
        options: {
            a: "MST-kNN se adapta a densidades locales heterogéneas, mientras que DBSCAN requiere un radio fijo (ε) que falla cuando conviven módulos densos y dispersos.",
            b: "MST-kNN solo puede utilizarse si las secuencias de ADN fueron alineadas con Clustal Omega.",
            c: "DBSCAN no admite matrices precalculadas de distancia entre objetos biológicos.",
            d: "MST-kNN garantiza matemáticamente un índice de silueta superior a 0,9 en todos los experimentos."
        },
        answer: ["a"],
        priority: 2,
        isTrap: true,
        isProfessorEnsayo: true,
        trapExplanation: "En el genoma conviven complejos compactos (pocos genes muy conservados) y rutas celulares dispersas. DBSCAN usa un radio épsilon global rígido: si es muy bajo envía casi todo a ruido, y si es muy alto colapsa todo en un supergrupo. MST-kNN evalúa vecindades relativas adaptándose a densidades locales.",
        academicReference: "Inostroza-Ponta (2008) / Ester et al. (1996)",
        keyTakeaway: "Ventaja de MST-kNN sobre DBSCAN: Capacidad de adaptarse a densidades heterogéneas sin imponer un radio métrico global (ε) rígido."
    },
    {
        id: 57,
        category: "validacion",
        categoryLabel: "Validación y Parámetros",
        question: "¿Por qué el profesor criticó duramente la forma en que se seleccionaron los valores de 'k' (ej. k=2 hasta k=5) en el ensayo?",
        options: {
            a: "Porque los valores impares de 'k' están prohibidos en la teoría de grafos bioinformáticos.",
            b: "Porque se eligieron 'al ojo' y de forma subjetiva cortando para que los grupos cupieran en el límite de la API de STRING, sin una métrica matemática de calidad.",
            c: "Porque no se demostró que 'k' fuera un número primo relativo con el número de cepas (471).",
            d: "Porque el valor de 'k' en MST-kNN debe ser obligatoriamente igual a la mitad del número de genomas."
        },
        answer: ["b"],
        priority: 2,
        isTrap: true,
        isProfessorEnsayo: true,
        trapExplanation: "El profesor señala que ir achicando grupos para que quepan en STRING es forzar y picar los datos con un criterio artificial. La forma rigurosa es evaluar sistemáticamente diferentes valores de k y justificar el óptimo mediante estabilidad de componentes conexas o métricas de calidad interna.",
        academicReference: "Grabación Ensayo Defensa / Observaciones del Profesor",
        keyTakeaway: "Selección de k: Nunca justificar 'para que cupiera en STRING'; debe justificarse con métricas de calidad de partición y estabilidad de componentes."
    },
    {
        id: 58,
        category: "validacion",
        categoryLabel: "Validación y Parámetros",
        question: "¿Qué métrica matemática interna debió reportarse para evaluar objetivamente la calidad de los agrupamientos obtenidos?",
        options: {
            a: "El valor de p de máxima verosimilitud (Log-Likelihood score).",
            b: "El Índice de Silueta, que evalúa de forma combinada la homogeneidad interna de los grupos y su separación externa.",
            c: "El porcentaje de guaninas y citosinas (%GC) en el genoma de la levadura.",
            d: "La tasa de falsos positivos en la alineación con IQ-TREE2."
        },
        answer: ["b"],
        priority: 2,
        isTrap: false,
        isProfessorEnsayo: true,
        trapExplanation: "Un agrupamiento se juzga internamente por dos fuerzas contrapuestas: cohesión/homogeneidad interna (qué tan cercanos están los genes del mismo clúster) y separación externa (qué tan alejados están de otros grupos). El Índice de Silueta (Rousseeuw 1987) sintetiza ambas en [-1, 1].",
        academicReference: "Rousseeuw (1987) / Métricas de Validación Interna",
        keyTakeaway: "Métrica interna clave: Índice de Silueta (cohesión intra-cluster vs separación inter-cluster en [-1, 1])."
    },
    {
        id: 59,
        category: "validacion",
        categoryLabel: "Validación y Parámetros",
        question: "¿Por qué el 'PPI enrichment p-value' obtenido de la plataforma STRING no constituye una validación estructural del clustering?",
        options: {
            a: "Porque la base de datos STRING contiene exclusivamente secuencias de mamíferos y plantas superiores.",
            b: "Porque evalúa si las proteínas comparten más interacciones biológicas conocidas de lo esperado por azar, lo cual depende de la literatura previa y no de la geometría del agrupamiento.",
            c: "Porque STRING redondea todos los valores de p a cero cuando hay más de 100 genes involucrados.",
            d: "Porque el p-value de STRING solo es válido si los árboles filogenéticos fueron construidos con parsimonia estricta."
        },
        answer: ["b"],
        priority: 2,
        isTrap: true,
        isProfessorEnsayo: true,
        trapExplanation: "STRING evalúa coherencia biológica externa frente a lo que se ha investigado en laboratorio previamente. Si un grupo no tiene enriquecimiento significativo, puede deberse a falta de literatura previa y no a que el clustering matemático haya fallado; por eso se debe separar validación estructural de biológica.",
        academicReference: "Szklarczyk et al. (2021) / Discusión Metodológica",
        keyTakeaway: "STRING es validación biológica externa (depende del sesgo de literatura previa), NO validación estructural geométrica del clustering."
    },
    {
        id: 60,
        category: "validacion",
        categoryLabel: "Validación y Parámetros",
        question: "¿Cuál es la función del modelo nulo por permutaciones implementado en la fase de validación de los módulos funcionales?",
        options: {
            a: "Sustituir los nucleótidos de las secuencias por caracteres aleatorios antes de inferir los árboles.",
            b: "Generar 1.000 agrupamientos aleatorios de igual tamaño para demostrar empíricamente que la conectividad observada en los módulos no es producto del azar.",
            c: "Permutar las filas y columnas de la matriz de distancias hasta alcanzar un valor máximo de 936.",
            d: "Eliminar el 5% de los genes más largos para normalizar el tiempo de cálculo."
        },
        answer: ["b"],
        priority: 1,
        isTrap: false,
        isProfessorEnsayo: true,
        trapExplanation: "Para validar estadísticamente que un módulo encontrado no es un agrupamiento casual, se contrasta su puntaje biológico contra la distribución empírica de 1.000 grupos de genes del mismo tamaño seleccionados al azar del mismo genoma.",
        academicReference: "Sección de Validación y Pruebas de Hipótesis",
        keyTakeaway: "Modelo nulo por permutaciones: 1.000 conjuntos aleatorios de igual tamaño para probar significancia estadística contra el azar."
    },
    {
        id: 61,
        category: "visualizacion",
        categoryLabel: "Visualización y Proyección",
        question: "¿Por qué es conceptualmente erróneo afirmar que una proyección MDS es mejor porque su nube de puntos se ve 'menos esférica y más natural'?",
        options: {
            a: "Porque la forma visual de la proyección depende de la distorsión al reducir dimensiones; la calidad debe medirse objetivamente con el Stress de Kruskal.",
            b: "Porque en biología todas las distribuciones de genes en el espacio euclidiano deben ser círculos exactos.",
            c: "Porque la función de proyección MDS en Scikit-learn normaliza obligatoriamente los datos a una esfera unitaria.",
            d: "Porque la esfericidad solo se puede calcular en matrices generadas con Neighbor Joining."
        },
        answer: ["a"],
        priority: 2,
        isTrap: true,
        isProfessorEnsayo: true,
        trapExplanation: "No se puede juzgar un método 'al ojo' por cómo se ve la gráfica 2D. Proyectar una matriz de miles de dimensiones en 2 dimensiones genera una inevitable pérdida de información que debe medirse formalmente con el valor de Stress de Kruskal o Diagrama de Shepard.",
        academicReference: "Kruskal (1964) / Observaciones del Profesor",
        keyTakeaway: "MDS no se evalúa al ojo: La distorsión dimensional se mide formalmente con el Stress de Kruskal o Diagrama de Shepard."
    },
    {
        id: 62,
        category: "defensa_actitud",
        categoryLabel: "Estrategia y Actitud en Defensa",
        question: "Si un miembro de la comisión te pregunta: '¿Por qué eligió este umbral o este método?', ¿qué respuesta debes EVITAR a toda costa?",
        options: {
            a: "Explicar el fundamento algorítmico y respaldarlo con citas de la literatura especializada.",
            b: "Reconocer las limitaciones del método y argumentar según las propiedades de los datos analizados.",
            c: "Responder: 'Porque el profesor guía me dijo que lo pusiera así' o 'porque era lo que necesitaba el trabajo'.",
            d: "Pausar unos segundos, beber agua para serenarse y responder con calma la justificación técnica."
        },
        answer: ["c"],
        priority: 2,
        isTrap: true,
        isProfessorEnsayo: true,
        trapExplanation: "Responder 'porque me dijeron' o dar evasivas circulares denota falta de dominio, inseguridad y desaprobación inmediata; ante la comisión se debe argumentar siempre con fundamentos matemáticos y referencias bibliográficas.",
        academicReference: "Recomendaciones Docentes para la Defensa de Tesis",
        keyTakeaway: "Regla capital de defensa: NUNCA digas 'porque mi profesor me dijo'. Argumenta siempre con fundamentos matemáticos y bibliográficos."
    },
    {
        id: 63,
        category: "defensa_actitud",
        categoryLabel: "Estrategia y Actitud en Defensa",
        question: "¿Qué recomendación dio el profesor para enfrentar momentos de tensión o preguntas complejas durante la defensa?",
        options: {
            a: "Interrumpir al profesor inmediatamente para defender la postura sin dejar que termine de hablar.",
            b: "Aceptar que el resultado dio error y pedir pasar a la siguiente diapositiva sin responder.",
            c: "Hacer una pausa estratégica, beber un sorbo de agua o pedir que reiteren la pregunta para ganar 30 segundos y ordenar la respuesta.",
            d: "Improvisar fórmulas matemáticas complejas en la pizarra aunque no tengan relación directa con el tema."
        },
        answer: ["c"],
        priority: 1,
        isTrap: false,
        isProfessorEnsayo: true,
        trapExplanation: "El profesor aconseja escuchar activamente, no ponerse a la defensiva, tomarse una pausa breve tomando agua para calmar el ritmo cardíaco y ordenar los conceptos antes de responder de forma pausada y fundamentada.",
        academicReference: "Consejos Prácticos del Profesor Evaluador",
        keyTakeaway: "Táctica de control emocional: Pausa estratégica con agua para calmar la adrenalina y estructurar mentalmente una respuesta sólida."
    }
];

// ==========================================
// TARJETAS MNEMOTÉCNICAS (FLASHCARDS 3D)
// ==========================================
const thesisFlashcards = [
    {
        id: "fc-1",
        category: "Conceptos",
        front: "¿Qué caracteriza formalmente a un árbol filogenético no enraizado?",
        back: "Grafo acíclico conexo T = (V, E). Hojas = nodos terminales grado 1 (471 cepas). Nodos internos = divergencias hipotéticas. Caracteriza parentesco RELATIVO sin dirección temporal absoluta.",
        trick: "⚠️ No busques un 'ancestro común original' en un árbol no enraizado; no lo tiene sin outgroup."
    },
    {
        id: "fc-2",
        category: "Conceptos",
        front: "Árbol Génico vs Árbol de Especies: ¿Por qué discrepan?",
        back: "Árbol génico = genealogía de un locus ortólogo individual. Árbol de especies = historia demográfica global. Discrepan por: Ordenamiento incompleto de linajes (ILS), introgresión y presiones selectivas.",
        trick: "⚠️ La discordancia NO es un error: es la base para minar datos y descubrir módulos funcionales."
    },
    {
        id: "fc-3",
        category: "Conceptos",
        front: "¿Por qué NO hablar de 'clados' en árboles no enraizados?",
        back: "Porque un clado monofilético estricto requiere una RAÍZ para delimitar al ancestro común y descendientes. En árboles no enraizados cada rama interna induce una BIPARTICIÓN o SPLIT (A ∪ B = V_hojas).",
        trick: "⚠️ Pregunta trampa de comisión: usa 'bipartición / split' en vez de clado."
    },
    {
        id: "fc-4",
        category: "Conceptos",
        front: "¿Cuántas topologías binarias bifurcadas existen para 4 taxones {a,b,c,d}?",
        back: "Exactamente 3 topologías: ab|cd, ac|bd, y ad|bc (más 1 no resuelta en estrella). Total de cuartetos para n hojas = C(n, 4).",
        trick: "⚠️ Si fuera enraizado serían 15. En no enraizado son estrictamente 3."
    },
    {
        id: "fc-5",
        category: "Inferencia",
        front: "Neighbor Joining (NJ): Principio y Complejidad",
        back: "Aglomeración jerárquica a partir de matrices de distancia. Minimiza iterativamente la longitud de ramas. Complejidad BAJA: O(n^3). Entrega un único árbol aproximado.",
        trick: "⚠️ Es determinista polinomial; no explora el espacio exponencial de árboles."
    },
    {
        id: "fc-6",
        category: "Inferencia",
        front: "Máxima Parsimonia (MP): Principio y Complejidad",
        back: "Basado en caracteres. Minimiza el número de cambios mutacionales. Complejidad MEDIA-ALTA: optimización heurística (branch swapping) porque buscar el óptimo es NP-hard.",
        trick: "⚠️ Evaluar 1 árbol es rápido; la búsqueda en el espacio combinatorial de n taxones es NP-hard."
    },
    {
        id: "fc-7",
        category: "Inferencia",
        front: "Máxima Verosimilitud (ML): Principio y Complejidad",
        back: "Maximiza la probabilidad de los datos bajo modelos de sustitución evolutiva. Optimización numérica iterativa de longitudes de rama y parámetros. Complejidad ALTA.",
        trick: "⚠️ Muy costoso porque optimiza parámetros continuos sobre matrices densas."
    },
    {
        id: "fc-8",
        category: "Inferencia",
        front: "Inferencia Bayesiana: Principio y Solución",
        back: "Estima la distribución de probabilidad POSTERIOR usando teorema de Bayes, priors y muestreo MCMC. Complejidad MUY ALTA. Solución = muestra de la distribución (no un árbol único).",
        trick: "⚠️ No busca un único árbol óptimo; genera una muestra de la distribución posterior."
    },
    {
        id: "fc-9",
        category: "Distancia",
        front: "Robinson-Foulds (RF): Principio y su Talón de Aquiles",
        back: "Cuenta biparticiones presentes en un árbol pero ausentes en el otro. Talón de Aquiles: Hipersensible al 'rogue taxon' (un taxón desplazado satura la distancia al máximo).",
        trick: "⚠️ Dos árboles casi idénticos pueden dar RF máxima si 1 taxón cambió de lugar."
    },
    {
        id: "fc-10",
        category: "Distancia",
        front: "Quartet Distance (QD): Principio y Ventaja Clave",
        back: "Descompone árboles en subconjuntos de 4 taxones: Consensuados, No consensuados y No resueltos. Ventaja: Degradación gradual, alta resolución y resistencia a rogue taxons.",
        trick: "⚠️ Base matemática: evalúa C(n, 4) cuartetos de forma exhaustiva."
    },
    {
        id: "fc-11",
        category: "Agrupamiento",
        front: "K-Means: ¿Por qué NO aplica directo a distancias de árboles?",
        back: "Porque asume espacio vectorial euclidiano continuo para promediar centroides. La disimilitud entre árboles es una matriz relacional NO euclidiana.",
        trick: "⚠️ Para usarlo necesitas K-medoids (PAM) o proyectar antes con MDS."
    },
    {
        id: "fc-12",
        category: "Agrupamiento",
        front: "Fuzzy FANNY: ¿Por qué es ideal para historias mosaicas?",
        back: "Agrupamiento difuso: u_iv en [0,1]. Opera DIRECTO sobre matrices relacionales sin centroides. Permite que un gen pertenezca parcialmente a múltiples clústeres si hubo introgresión/recombinación.",
        trick: "⚠️ Complejidad O(n^2). Requiere k a priori."
    },
    {
        id: "fc-13",
        category: "Agrupamiento",
        front: "DBSCAN: Ventajas e hiperparámetros",
        back: "Basado en densidad espacial (radio epsilon y MinPts). NO requiere k a priori. Encuentra formas geométricas arbitrarias y aisla ruido de fondo. Complejidad O(n log n) a O(n^2).",
        trick: "⚠️ No fuerza a todos los puntos a pertenecer a un grupo: los dispersos son 'ruido'."
    },
    {
        id: "fc-14",
        category: "Agrupamiento",
        front: "MST-kNN: Las 3 Fases de Inostroza-Ponta (2008)",
        back: "1) Grafo métrico completo con pesos QD. 2) Intersección estructural: MST (Árbol de Expansión Mínima) ∩ regla k-NN (vecinos más cercanos). 3) Poda y particionamiento por componentes conexas.",
        trick: "⚠️ La 'k' es de k-NN (vecinos más cercanos), NO el número de clústeres."
    },
    {
        id: "fc-15",
        category: "Agrupamiento",
        front: "MST-kNN: Complejidad y definición de clústeres",
        back: "Complejidad: O(n^2 log n). El número de clústeres NO se define a priori: surge de forma 100% automática a partir de las componentes conexas del grafo podado.",
        trick: "⚠️ Respóndelo seguro en la comisión: 'k no son los clústeres, k son los vecinos locales'."
    },
    {
        id: "fc-16",
        category: "Formatos",
        front: "Newick y librerías Python en la tesis",
        back: "Newick = texto plano con anidación de paréntesis para jerarquías y bifurcaciones. En Python = Biopython y ETE Toolkit para estructuras de grafos de árboles y cálculo masivo de matrices.",
        trick: "⚠️ Herramientas computacionales clave citadas en el texto: Biopython y ETE Toolkit."
    },
    {
        id: "fc-17",
        category: "Contexto",
        front: "Propósito Real de la Tesis: El 'Para Qué'",
        back: "Demostrar computacionalmente si la congruencia topológica entre árboles génicos revela módulos funcionales celulares sin sesgo a priori.",
        trick: "⚠️ NUNCA digas 'para mejorar o intervenir la cerveza en laboratorio'. La tesis es 100% bioinformática/computacional in silico."
    },
    {
        id: "fc-18",
        category: "Distancia",
        front: "Límite Máximo Teórico de Robinson-Foulds (RF)",
        back: "Fórmula: 2(n - 3) = 2n - 6. Para 471 cepas: 2(471) - 6 = 936. Significa saturación total (cero biparticiones internas compartidas).",
        trick: "⚠️ 936 es el valor de saturación total en tu tesis. Evidencia la extrema rigidez de RF frente a QD."
    },
    {
        id: "fc-19",
        category: "Distancia",
        front: "¿Por qué se descartaron Kendall-Colijn y distancias de ramas?",
        back: "Kendall-Colijn exige árboles ENRAIZADOS (rooted desde la raíz). Las distancias de ramas incorporan tasas de mutación, confundiendo la historia evolutiva compartida.",
        trick: "⚠️ Genes del mismo complejo celular pueden mutar a velocidades distintas teniendo la misma topología de parentesco."
    },
    {
        id: "fc-20",
        category: "Agrupamiento",
        front: "Jerárquico: ¿Por qué generó 3 grupos de 1 gen y 2 macrogrupos?",
        back: "Porque cortar un dendrograma con un umbral horizontal global aísla primero los outliers divergentes en clusters unitarios y colapsa la masa central en macrobloques.",
        trick: "⚠️ Demuestra la limitación del corte global estático frente al particionamiento adaptativo de MST-kNN."
    },
    {
        id: "fc-21",
        category: "Agrupamiento",
        front: "MST-kNN vs DBSCAN: ¿Por qué DBSCAN falla en este genoma?",
        back: "DBSCAN exige un radio global fijo (ε) que colapsa ante la densidad heterogénea del genoma (módulos compactos vs rutas dispersas). MST-kNN se adapta localmente.",
        trick: "⚠️ Si el profesor pregunta por DBSCAN: 'DBSCAN impone un épsilon global que destruye la heterogeneidad de densidades de módulos biológicos'."
    },
    {
        id: "fc-22",
        category: "Validación",
        front: "Validación Estructural (Silueta) vs Biológica (STRING)",
        back: "Estructural: Mide homogeneidad interna y separación externa (Índice de Silueta en [-1, 1]). Biológica: Evalúa anotaciones conocidas (STRING PPI p-value, sesgado por literatura previa).",
        trick: "⚠️ No confundas calidad matemática del agrupamiento con cobertura de bases de datos biomédicas."
    },
    {
        id: "fc-23",
        category: "Visualización",
        front: "Evaluación de Proyecciones MDS: ¿Cómo se mide?",
        back: "NUNCA al ojo (ej. 'se ve menos esférica'). Se evalúa objetivamente con el Stress de Kruskal o Diagrama de Shepard para medir la distorsión al proyectar a 2D.",
        trick: "⚠️ Cualquier afirmación visual sin reportar el Stress de Kruskal será refutada de inmediato por la comisión."
    },
    {
        id: "fc-24",
        category: "Defensa",
        front: "Regla de Oro ante Preguntas Difíciles de la Comisión",
        back: "1) NUNCA responder 'porque mi profesor me dijo'. 2) Pausa táctica con un sorbo de agua para calmar el pulso y ordenar ideas. 3) Responder con fundamentos algorítmicos y referencias.",
        trick: "⚠️ El agua te da 15-30 segundos para estructurar tu argumento: 'La literatura (Inostroza-Ponta 2008) establece que...'."
    }
];

// ==========================================
// TABLAS COMPARATIVAS DE LA TESIS (CHEAT SHEET)
// ==========================================
const thesisCheatSheets = {
    inferencia: [
        {
            metodo: "Neighbor Joining (NJ)",
            principio: "Aglomeración jerárquica a partir de matrices de distancia. Minimiza longitud total de ramas iterativamente.",
            complejidad: "Baja (O(n³))",
            solucion: "Árbol único aproximado",
            evaluacionComision: "Determinista, muy rápido, no optimiza modelos probabilísticos ni verosimilitudes."
        },
        {
            metodo: "Máxima Parsimonia (MP)",
            principio: "Basado en caracteres. Minimiza el número total de cambios mutacionales observados.",
            complejidad: "Media-Alta (NP-hard)",
            solucion: "Optimización heurística (branch swapping)",
            evaluacionComision: "Evaluar 1 árbol es rápido, pero encontrar el óptimo global con cientos de taxones es NP-hard."
        },
        {
            metodo: "Máxima Verosimilitud (ML)",
            principio: "Maximización de la probabilidad de los datos observados bajo modelos evolutivos de sustitución.",
            complejidad: "Alta",
            solucion: "Optimización numérica iterativa",
            evaluacionComision: "Optimiza numéricamente longitudes de rama y parámetros de sustitución sobre matrices densas."
        },
        {
            metodo: "Inferencia Bayesiana (BI)",
            principio: "Estimación de la distribución de probabilidad posterior integrando priors mediante MCMC.",
            complejidad: "Muy Alta",
            solucion: "Muestra de la distribución posterior",
            evaluacionComision: "No busca un árbol único; requiere millones de generaciones MCMC para converger."
        }
    ],
    agrupamiento: [
        {
            metodo: "K-Means",
            principio: "Minimización iterativa de la varianza intra-grupo respecto a centroides euclidianos.",
            complejidad: "O(n · k · d · i)",
            kDefinicion: "Requerido a priori",
            filogeniaNotas: "NO aplica directamente a matrices de distancia de árboles porque no son euclidianas. Exige PAM o MDS previo."
        },
        {
            metodo: "Jerárquico Aglomerativo",
            principio: "Fusión recursiva de pares por menor disimilitud (bottom-up) según criterio de enlace (linkage).",
            complejidad: "O(n²) ~ O(n³)",
            kDefinicion: "Determinado por corte del dendrograma",
            filogeniaNotas: "Construye un árbol anidado sobre genes. El usuario decide a qué altura cortar."
        },
        {
            metodo: "Fuzzy Analysis (FANNY)",
            principio: "Minimización de distancias ponderadas por grados de pertenencia difusa u_iv ∈ [0, 1].",
            complejidad: "O(n²)",
            kDefinicion: "Requerido a priori",
            filogeniaNotas: "Opera directamente sobre matrices relacionales. Ideal para historias evolutivas mosaicas (introgresión)."
        },
        {
            metodo: "DBSCAN",
            principio: "Expansión de núcleos basada en densidad local dentro de un radio global (ε) con MinPts.",
            complejidad: "O(n log n) ~ O(n²)",
            kDefinicion: "No requerido (automático)",
            filogeniaNotas: "Descubre clústeres de forma geométrica arbitraria y etiqueta genes dispersos como ruido de fondo."
        },
        {
            metodo: "MST-kNN (Inostroza-Ponta)",
            principio: "Intersección estructural de grafo métrico: Minimum Spanning Tree ∩ vecindario local k-NN.",
            complejidad: "O(n² log n)",
            kDefinicion: "No requerido (automático)",
            filogeniaNotas: "La poda genera componentes conexas (cada una es un clúster). 'k' es el parámetro de vecinos, no el número de clústeres."
        }
    ]
};
