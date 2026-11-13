/**
 * Base de preguntas, tarjetas y datos comparativos de la tesis:
 * "Fundamento teórico y revisión de literatura: Filogenómica, Inferencia y Agrupamiento"
 * Organismos: 471 cepas de Saccharomyces eubayanus.
 * 
 * NOTA DE EQUILIBRIO: Todas las alternativas poseen extensión balanceada y rigurosa
 * para evitar el sesgo cognitivo de la "alternativa más larga".
 */

const thesisQuestions = [
    {
        "id": 1,
        "category": "conceptos",
        "categoryLabel": "Conceptos Filogenéticos",
        "question": "¿Por qué en este trabajo los árboles filogenéticos construidos para las 471 cepas de S. eubayanus son modelados como NO enraizados (unrooted)?",
        "options": {
            "a": "Porque los métodos de inferencia filogenómica estándar caracterizan parentesco relativo sin asumir a priori un ancestro común ni outgroup.",
            "b": "Porque los modelos evolutivos no deterministas pierden consistencia estadística al incorporar grupos externos con divergencia superior al 5%.",
            "c": "Porque la topología no enraizada es la única matemáticamente capaz de establecer la dirección temporal absoluta de las mutaciones observadas.",
            "d": "Porque las matrices de distancia génica relacionales colapsan en politomías si se introduce una raíz temporal previa al clustering."
        },
        "answer": [
            "a"
        ],
        "priority": 1,
        "isTrap": true,
        "trapExplanation": "¡Cuidado con la trampa de la dirección temporal! Un árbol no enraizado justamente NO establece dirección temporal absoluta; solo caracteriza relaciones de parentesco relativo sin fijar un ancestro o grupo externo a priori.",
        "academicReference": "Felsenstein (2004)",
        "keyTakeaway": "Un árbol no enraizado T=(V,E) caracteriza parentesco relativo sin dirección temporal absoluta."
    },
    {
        "id": 2,
        "category": "conceptos",
        "categoryLabel": "Conceptos Filogenéticos",
        "question": "En la formalización matemática del árbol filogenético no enraizado T = (V, E), ¿cuál es la definición formal de las hojas (taxones)?",
        "options": {
            "a": "Vértices internos no terminales que poseen grado de conectividad mayor o igual a 3.",
            "b": "Vértices terminales pertenecientes a V caracterizados por tener exactamente grado 1.",
            "c": "Aristas acíclicas que interconectan exclusivamente bifurcaciones ancestrales en el grafo.",
            "d": "Subgrafos inducidos conexos cuyo coeficiente de agrupamiento local converge a cero."
        },
        "answer": [
            "b"
        ],
        "priority": 1,
        "isTrap": false,
        "trapExplanation": "En teoría de grafos, las hojas de un árbol son exactamente los vértices terminales que tienen grado 1 (un solo enlace incidente).",
        "academicReference": "Felsenstein (2004) / Semple & Steel (2003)",
        "keyTakeaway": "Las hojas son nodos de grado 1 (las 471 cepas), mientras que los nodos internos representan divergencias evolutivas hipotéticas."
    },
    {
        "id": 3,
        "category": "conceptos",
        "categoryLabel": "Conceptos Filogenéticos",
        "question": "¿Cuál es la diferencia conceptual crucial entre un árbol génico (gene tree) y un árbol de especies (species tree)?",
        "options": {
            "a": "El árbol génico modela la historia demográfica poblacional del taxón completo, mientras que el de especies reconstruye la trayectoria de un locus ortólogo individual.",
            "b": "El árbol génico describe la trayectoria genealógica de un locus ortólogo individual, mientras que el árbol de especies modela la historia demográfica global del taxón.",
            "c": "El árbol génico refleja divergencias temporales absolutas con reloj molecular, mientras que el de especies representa topologías sin longitudes de rama proporcionales.",
            "d": "El árbol génico integra la coalescencia de todos los cromosomas del organismo, mientras que el de especies aísla exclusivamente variaciones no codificantes del genoma."
        },
        "answer": [
            "b"
        ],
        "priority": 1,
        "isTrap": false,
        "trapExplanation": "No confundas los roles: el gen describe la historia de un locus específico; la especie integra la historia demográfica poblacional del taxón.",
        "academicReference": "Maddison (1997)",
        "keyTakeaway": "Árbol génico = genealogía de un locus ortólogo individual; Árbol de especies = historia demográfica global."
    },
    {
        "id": 4,
        "category": "conceptos",
        "categoryLabel": "Conceptos Filogenéticos",
        "question": "PREGUNTA DE COMISIÓN: ¿Por qué la discordancia topológica entre árboles génicos NO debe eliminarse forzando un único árbol consenso?",
        "options": {
            "a": "Porque los algoritmos computacionales de inferencia masiva colapsan asintóticamente al calcular árboles consenso estrictos cuando el alineamiento supera diez loci.",
            "b": "Porque la discordancia refleja fenómenos biológicos reales (ordenamiento incompleto de linajes, introgresión y selección), permitiendo descubrir módulos funcionales.",
            "c": "Porque la construcción de un árbol consenso introduce artefactos sistemáticos irreversibles sobre las secuencias de nucleótidos almacenadas en los archivos Newick.",
            "d": "Porque un árbol consenso estricto requiere que todas las ramas posean longitud ultramétrica idéntica, anulándose ante tasas de mutación heterogéneas entre linajes."
        },
        "answer": [
            "b"
        ],
        "priority": 2,
        "isTrap": true,
        "trapExplanation": "¡Trampa de defensa de tesis! Un examinador novato diría: '¿Por qué no haces un único árbol consenso y te ahorras la minería de datos?'. Tu respuesta clave: 'Forzar un único árbol enmascara la variabilidad genómica real. Agrupar la discordancia permite descubrir módulos funcionales con historias evolutivas coincidentes'.",
        "academicReference": "Maddison (1997) / Fundamento Teórico",
        "keyTakeaway": "La discordancia no es ruido descartable: es la señal biológica para minería de datos y descubrimiento de módulos funcionales."
    },
    {
        "id": 5,
        "category": "conceptos",
        "categoryLabel": "Conceptos Filogenéticos",
        "question": "¿Qué fenómenos biológicos son los principales causantes de que distintos árboles génicos discrepen entre sí y de la filogenia consenso?",
        "options": {
            "a": "Ordenamiento incompleto de linajes (ILS), introgresión evolutiva y presiones selectivas divergentes.",
            "b": "Acumulación estocástica de errores de secuenciación y ruido térmico en las polimerasas de laboratorio.",
            "c": "Incompatibilidad de codificación en el formato Newick al transcribir secuencias nucleotídicas a grafos.",
            "d": "Fluctuaciones numéricas en la convergencia de las cadenas de Markov durante la traducción proteica."
        },
        "answer": [
            "a"
        ],
        "priority": 1,
        "isTrap": false,
        "trapExplanation": "Los fenómenos biológicos canónicos citados en el texto son: ordenamiento incompleto de linajes (Incomplete Lineage Sorting), introgresión y presiones selectivas.",
        "academicReference": "Maddison (1997)",
        "keyTakeaway": "ILS (incomplete lineage sorting), introgresión y presiones selectivas originan árboles génicos incongruentes."
    },
    {
        "id": 6,
        "category": "conceptos",
        "categoryLabel": "Conceptos Filogenéticos",
        "question": "¿Por qué en un árbol NO enraizado es formalmente incorrecto hablar de un 'clado monofilético estricto' y se utiliza en su lugar una 'bipartición' (split)?",
        "options": {
            "a": "Porque un clado estricto requiere una raíz para delimitar descendientes de un ancestro común; sin raíz, cada rama interna solo define una partición en dos subconjuntos disjuntos.",
            "b": "Porque en ausencia de raíz los grafos filogenéticos generan ciclos implícitos, lo cual invalida la definición matemática de transitividad requerida por los clados de Hennig.",
            "c": "Porque la teoría formal de grafos exige que los clados posean longitudes de rama métricas euclidianas, mientras que las biparticiones operan exclusivamente sobre distancias topológicas.",
            "d": "Porque los algoritmos de corte no supervisados colapsan los nodos terminales en politomías artificiales cuando se calculan clados monofiléticos sobre matrices sin orientación temporal."
        },
        "answer": [
            "a"
        ],
        "priority": 2,
        "isTrap": true,
        "trapExplanation": "¡TRAMPA CLÁSICA DE EXAMEN! No digas 'clado' a la ligera si tu árbol no tiene raíz. En árboles no enraizados se habla formalmente de BIPARTICIÓN o SPLIT, pues no puedes saber quién desciende de quién sin un nodo raíz ancestral.",
        "academicReference": "Semple & Steel (2003)",
        "keyTakeaway": "Clado estricto = requiere raíz. Rama interna en árbol no enraizado = bipartición o split (A ∪ B = V_hojas, A ∩ B = ∅)."
    },
    {
        "id": 7,
        "category": "conceptos",
        "categoryLabel": "Conceptos Filogenéticos",
        "question": "Dado un conjunto de 4 taxones {a, b, c, d} en un árbol no enraizado, ¿cuántas topologías binarias bifurcadas posibles existen exactamente?",
        "options": {
            "a": "Únicamente 3 topologías: ab|cd, ac|bd y ad|bc (más la topología no resuelta en estrella).",
            "b": "Exactamente 4 topologías distintas, condicionadas por el orden lineal de los taxones en V.",
            "c": "15 topologías binarias diferenciadas según el cálculo combinatorial de Felsenstein.",
            "d": "Un número indefinido de topologías determinado por la variabilidad en longitud de ramas."
        },
        "answer": [
            "a"
        ],
        "priority": 2,
        "isTrap": true,
        "trapExplanation": "¡Ojo con confundir cuartetos no enraizados con árboles enraizados! Para 4 hojas no enraizadas existen SOLO 3 topologías bifurcadas binarias: (ab|cd), (ac|bd) y (ad|bc). (Si fuera enraizado serían 15, ¡no caigas en la trampa!).",
        "academicReference": "Sand et al. (2014) / tqdist",
        "keyTakeaway": "Para 4 taxones no enraizados existen únicamente 3 topologías binarias (ab|cd, ac|bd, ad|bc) y 1 no resuelta (estrella)."
    },
    {
        "id": 8,
        "category": "conceptos",
        "categoryLabel": "Conceptos Filogenéticos",
        "question": "Para un árbol filogenético con n hojas, ¿cuál es el número total de combinaciones de cuartetos posibles?",
        "options": {
            "a": "El coeficiente binomial C(n, 4) = n! / (4!(n - 4)!).",
            "b": "La permutación lineal completa P(n, 4) = n! / (n - 4)!.",
            "c": "El producto exponencial de topologías cuadráticas 4 * n^4.",
            "d": "La potencia de ramificación bifurcada fija 2^(n - 3) cuartetos."
        },
        "answer": [
            "a"
        ],
        "priority": 1,
        "isTrap": false,
        "trapExplanation": "El número total de subconjuntos de 4 elementos tomados de un conjunto de n hojas es la combinación estándar C(n, 4).",
        "academicReference": "Sand et al. (2014)",
        "keyTakeaway": "Total de cuartetos evaluables = C(n, 4) combinaciones de subconjuntos de 4 taxones."
    },
    {
        "id": 9,
        "category": "conceptos",
        "categoryLabel": "Conceptos Filogenéticos",
        "question": "¿Cómo se representan y manipulan computacionalmente las topologías de los árboles en el flujo de trabajo de la tesis?",
        "options": {
            "a": "Se almacenan en texto plano estándar Newick y se procesan como grafos en Python usando Biopython y ETE Toolkit para el cálculo de matrices.",
            "b": "Se compilan directamente en binarios C++ optimizados para GPU, descartando representaciones intermedias en texto plano jerárquico.",
            "c": "Se indexan en bases de datos relacionales SQL con tablas de adyacencia de pares fijos, prescindiendo de paréntesis anidados.",
            "d": "Se codifican en matrices densas de alineamiento múltiple FASTA sin transformar las ramas en objetos de teoría de grafos."
        },
        "answer": [
            "a"
        ],
        "priority": 1,
        "isTrap": false,
        "trapExplanation": "El texto formalmente indica: texto plano estándar Newick (con anidación de paréntesis) y librerías bioinformáticas en Python (Biopython y ETE Toolkit) para inspección de ramas y cálculo matricial.",
        "academicReference": "Cock et al. (2009) / ETE Toolkit",
        "keyTakeaway": "Almacenamiento: Newick (paréntesis anidados). Procesamiento en Python: Biopython y ETE Toolkit."
    },
    {
        "id": 10,
        "category": "inferencia",
        "categoryLabel": "Inferencia Filogenética",
        "question": "¿Cuál es el principio operativo y la complejidad del método Neighbor Joining (NJ)?",
        "options": {
            "a": "Aglomeración jerárquica basada en matrices de distancia que minimiza iterativamente la longitud total de las ramas; complejidad polinomial Baja O(n^3).",
            "b": "Optimización estocástica mediante cadenas de Markov que maximiza la probabilidad posterior de topologías; complejidad asintótica Muy Alta O(2^n).",
            "c": "Búsqueda combinatorial exhaustiva basada en caracteres discretos que minimiza los cambios mutacionales observados; complejidad teórica NP-hard.",
            "d": "Optimización continua multivariada que ajusta parámetros de modelos evolutivos sobre alineamientos densos; complejidad polinomial O(n log n)."
        },
        "answer": [
            "a"
        ],
        "priority": 1,
        "isTrap": false,
        "trapExplanation": "Neighbor Joining opera sobre matrices de distancia buscando pares de nodos que minimicen la longitud total del árbol en cada paso. Complejidad baja: O(n^3).",
        "academicReference": "Saitou & Nei (1987) / Felsenstein (2004)",
        "keyTakeaway": "NJ: Principio = Aglomeración jerárquica por distancias. Complejidad = Baja O(n³). Solución = Árbol único aproximado."
    },
    {
        "id": 11,
        "category": "inferencia",
        "categoryLabel": "Inferencia Filogenética",
        "question": "TRAMPA DE ALGORITMOS: En Máxima Parsimonia, ¿por qué su complejidad global es Media-Alta (NP-hard) a pesar de que evaluar un árbol dado es muy rápido?",
        "options": {
            "a": "Porque evaluar el costo de una topología fija es muy eficiente, pero hallar el árbol óptimo en el espacio combinatorial con cientos de taxones es NP-hard y requiere branch swapping.",
            "b": "Porque cada paso heurístico exige calcular determinantes e invertir matrices de covarianza densas para cada uno de los sitios polimórficos presentes en el alineamiento múltiple.",
            "c": "Porque el cálculo de parsimonia requiere simular millones de generaciones estocásticas de coalescencia para verificar que no existan historias evolutivas discordantes entre genes.",
            "d": "Porque el algoritmo debe integrar funciones de densidad continua bajo modelos GTR con distribución gamma, optimizando simultáneamente longitudes de rama en todo el grafo."
        },
        "answer": [
            "a"
        ],
        "priority": 2,
        "isTrap": true,
        "trapExplanation": "¡TRAMPA TÍPICA! Evaluar 1 árbol por parsimonia es computacionalmente fácil (lineal O(N)). La dificultad NP-hard radica en buscar el árbol óptimo dentro del espacio astronómico de topologías posibles ((2n-5)!!), exigiendo búsquedas heurísticas (branch swapping: NNI, SPR, TBR).",
        "academicReference": "Felsenstein (2004)",
        "keyTakeaway": "Evaluar 1 topología = rápido/lineal. Búsqueda en el espacio de árboles de n taxones = NP-hard (heurísticas de branch swapping)."
    },
    {
        "id": 12,
        "category": "inferencia",
        "categoryLabel": "Inferencia Filogenética",
        "question": "¿Cómo opera el método de Máxima Verosimilitud (Maximum Likelihood - ML) y qué tipo de solución produce según la tesis?",
        "options": {
            "a": "Explora iterativamente topologías evaluando la probabilidad de los datos bajo modelos de sustitución y optimizando longitudes de rama; produce una solución de optimización numérica.",
            "b": "Aglomera secuencialmente pares de taxones minimizando la varianza residual en matrices de disimilitud relacionales; produce un único árbol determinista sin optimizar parámetros continuos.",
            "c": "Muestrea trayectorias evolutivas mediante cadenas de Markov Monte Carlo integrando distribuciones a priori sobre los parámetros; produce una colección representativa de árboles posteriores.",
            "d": "Minimiza el número total de eventos de sustitución nucleotídica requeridos para explicar las secuencias; produce múltiples árboles igualmente parsimoniosos mediante búsqueda heurística."
        },
        "answer": [
            "a"
        ],
        "priority": 1,
        "isTrap": false,
        "trapExplanation": "ML evalúa la verosimilitud de la topología dadas las secuencias usando modelos de sustitución (e.g., GTR) y optimiza numéricamente los parámetros y longitudes de ramas. Complejidad alta.",
        "academicReference": "Felsenstein (1981, 2004)",
        "keyTakeaway": "ML: Principio = Maximización de verosimilitud estadística. Complejidad = Alta. Solución = Optimización numérica iterativa."
    },
    {
        "id": 13,
        "category": "inferencia",
        "categoryLabel": "Inferencia Filogenética",
        "question": "PREGUNTA DE COMISIÓN: ¿Qué tipo de solución produce la Inferencia Bayesiana y en qué se diferencia fundamentalmente de Máxima Verosimilitud (ML)?",
        "options": {
            "a": "La Inferencia Bayesiana busca un único árbol filogenético estrictamente óptimo mediante optimización numérica directa, mientras que ML genera una distribución empírica de árboles.",
            "b": "La Inferencia Bayesiana NO busca un único árbol óptimo; genera una muestra de la distribución posterior mediante MCMC, combinando los datos observados con conocimientos previos (priors).",
            "c": "La Inferencia Bayesiana calcula determinísticamente la distancia mínima en tiempo O(n^3) sobre matrices de pares, mientras que ML explora el espacio de árboles sin modelos de sustitución.",
            "d": "La Inferencia Bayesiana minimiza heurísticamente el número de pasos mutacionales en caracteres discretos, mientras que ML optimiza únicamente la topología sin estimar longitudes de rama."
        },
        "answer": [
            "b"
        ],
        "priority": 2,
        "isTrap": true,
        "trapExplanation": "¡TRAMPA DE COMISIÓN! Si te preguntan '¿cuál es el árbol óptimo de Bayes?', tu respuesta debe ser: 'Bayes no busca UN árbol óptimo único, sino una MUESTRA de la distribución de probabilidad posterior mediante cadenas MCMC'.",
        "academicReference": "Yang & Rannala (1997) / Felsenstein (2004)",
        "keyTakeaway": "Inferencia Bayesiana: Solución = Muestra de la distribución posterior (vía MCMC con priors). Complejidad = Muy Alta."
    },
    {
        "id": 14,
        "category": "inferencia",
        "categoryLabel": "Inferencia Filogenética",
        "question": "De acuerdo con la Tabla comparativa de inferencia de la tesis, ¿cuál es el orden correcto de menor a mayor complejidad computacional de los métodos filogenéticos?",
        "options": {
            "a": "Neighbor Joining (Baja) < Máxima Parsimonia (Media-Alta) < Máxima Verosimilitud (Alta) < Inferencia Bayesiana (Muy Alta).",
            "b": "Máxima Parsimonia (Baja) < Neighbor Joining (Media-Alta) < Inferencia Bayesiana (Alta) < Máxima Verosimilitud (Muy Alta).",
            "c": "Inferencia Bayesiana (Baja) < Máxima Verosimilitud (Media-Alta) < Neighbor Joining (Alta) < Máxima Parsimonia (Muy Alta).",
            "d": "Neighbor Joining (Baja) < Inferencia Bayesiana (Media-Alta) < Máxima Parsimonia (Alta) < Máxima Verosimilitud (Muy Alta)."
        },
        "answer": [
            "a"
        ],
        "priority": 1,
        "isTrap": false,
        "trapExplanation": "El orden riguroso establecido en la Tabla 2.1 del texto es: NJ (Baja, O(n³)) < MP (Media-Alta, NP-hard) < ML (Alta) < Bayes (Muy Alta).",
        "academicReference": "Tabla 2.1 de la Tesis / Felsenstein (2004)",
        "keyTakeaway": "Complejidad: NJ < MP < ML < Bayes."
    },
    {
        "id": 15,
        "category": "distancia",
        "categoryLabel": "Métricas de Distancia",
        "question": "¿Cuál es el principio operativo de la distancia de Robinson-Foulds (RF)?",
        "options": {
            "a": "Contabiliza cuántas biparticiones o cortes de ramas (splits) están presentes en un árbol pero ausentes en el otro.",
            "b": "Calcula el ángulo coseno vectorial entre las distribuciones de frecuencias nucleotídicas de ambos alineamientos.",
            "c": "Mide la diferencia cuadrática promedio entre las longitudes de ramas de todos los caminos entre pares de hojas.",
            "d": "Evalúa el número total de cuartetos de cuatro taxones que difieren en su topología binaria interna resuelta."
        },
        "answer": [
            "a"
        ],
        "priority": 1,
        "isTrap": false,
        "trapExplanation": "RF es una distancia puramente topológica basada en la diferencia simétrica de biparticiones (splits).",
        "academicReference": "Robinson & Foulds (1981)",
        "keyTakeaway": "Distancia RF = conteo de biparticiones presentes en un árbol y ausentes en el otro (diferencia simétrica de splits)."
    },
    {
        "id": 16,
        "category": "distancia",
        "categoryLabel": "Métricas de Distancia",
        "question": "PREGUNTA TRAMPA CLÁSICA: ¿Cuál es el principal defecto o limitación teórica de la distancia de Robinson-Foulds (RF)?",
        "options": {
            "a": "Penaliza drásticamente la disimilitud ante el desplazamiento de un único taxón (rogue taxon), pudiendo arrojar la distancia máxima teórica entre dos árboles casi idénticos.",
            "b": "Genera desbordamientos numéricos de punto flotante cuando el número de hojas supera las cien cepas, provocando errores de redondeo sistemáticos en matrices relacionales.",
            "c": "Asume una raíz obligatoria en el ancestro común más reciente, lo que impide comparar árboles no enraizados generados por algoritmos estándar de inferencia filogenómica.",
            "d": "Requiere obligatoriamente que las longitudes de rama reflejen tiempos geológicos absolutos, anulando su validez cuando existen tasas de mutación heterogéneas entre linajes."
        },
        "answer": [
            "a"
        ],
        "priority": 2,
        "isTrap": true,
        "trapExplanation": "¡El defecto crítico de RF es su hipersensibilidad al efecto 'rogue taxon'! Un solo taxón mal ubicado o inestable rompe todas las biparticiones que atraviesa, haciendo que dos árboles casi idénticos arrojen una distancia RF saturada (cercana al máximo).",
        "academicReference": "Robinson & Foulds (1981) / Sand et al. (2014)",
        "keyTakeaway": "Debilidad de RF: Saturación rápida y falta de gradualidad; un solo taxón inestable ('rogue taxon') destruye todas las biparticiones."
    },
    {
        "id": 17,
        "category": "distancia",
        "categoryLabel": "Métricas de Distancia",
        "question": "¿Cuáles son los 3 estados en los que se clasifica cada cuarteto al contrastar dos árboles génicos en Quartet Distance?",
        "options": {
            "a": "Consensuados (acordes), No consensuados (discordes) y No resueltos (politomías).",
            "b": "Monofiléticos (clados), Parafiléticos (mixtos) y Polifiléticos (convergentes).",
            "c": "Euclidianos (convexos), Relacionales (métricos) y Asintóticos (inconsistentes).",
            "d": "Convergentes (homoplasia), Coincidentes (simples) y Divergentes (mutacionales)."
        },
        "answer": [
            "a"
        ],
        "priority": 1,
        "isTrap": false,
        "trapExplanation": "Al comparar los árboles sobre 4 taxones: Consensuados (misma topología en ambos), No consensuados (topologías binarias distintas) y No resueltos (uno o ambos tienen topología en estrella/politomía).",
        "academicReference": "Sand et al. (2014) / tqdist",
        "keyTakeaway": "Estados de cuarteto: Consensuados (acordes), No consensuados (discordes) y No resueltos (estrellas)."
    },
    {
        "id": 18,
        "category": "distancia",
        "categoryLabel": "Métricas de Distancia",
        "question": "¿Por qué en filogenómica masiva la Distancia de Cuartetos (QD) es superior a Robinson-Foulds (RF)?",
        "options": {
            "a": "Porque actúa como una métrica de degradación gradual y alta resolución, resistente a fluctuaciones menores o taxones inestables, cuantificando similitud parcial.",
            "b": "Porque incorpora longitudes de rama métricas para ponderar los tiempos de divergencia absoluta, evitando sesgos provocados por genes con tasas lentas de sustitución.",
            "c": "Porque reduce la complejidad computacional asintótica a tiempo constante O(1), permitiendo procesar decenas de miles de genomas sin requerir algoritmos de paralelización en CPU.",
            "d": "Porque exige que los árboles posean enraizamiento estricto por grupo externo, garantizando congruencia topológica absoluta con la historia demográfica del organismo."
        },
        "answer": [
            "a"
        ],
        "priority": 2,
        "isTrap": false,
        "trapExplanation": "Al evaluar subconjuntos de 4 taxones, si un taxón fluctúa, solo afecta a los cuartetos donde participa; los demás cuartetos siguen concordando. Esto genera una degradación suave y métrica fina.",
        "academicReference": "Sand et al. (2014)",
        "keyTakeaway": "Ventaja de QD: Degradación suave, alta resolución y robustez ante taxones inestables (supera el colapso abrupto de RF)."
    },
    {
        "id": 19,
        "category": "agrupamiento",
        "categoryLabel": "Métodos de Agrupamiento",
        "question": "TRAMPA CRUCIAL DE TESIS: ¿Por qué el algoritmo clásico K-Means NO es aplicable DIRECTAMENTE sobre matrices de disimilitud de árboles filogenéticos?",
        "options": {
            "a": "Porque K-means asume un espacio vectorial euclidiano continuo para calcular centroides geométricos promedio, mientras que la disimilitud entre árboles conforma una matriz relacional no euclidiana.",
            "b": "Porque K-means está limitado formalmente a conjuntos de datos de dimensionalidad unitaria (1D), colapsando ante matrices cuadradas con más de diez observaciones bioinformáticas independientes.",
            "c": "Porque K-means exige que el parámetro k surja de forma 100% estocástica durante la ejecución, impidiendo al usuario definir o fijar el número de grupos deseados previo a la partición.",
            "d": "Porque el tiempo computacional de K-means crece de forma factorial exponencial O(n!), volviendo inviable su cálculo numérico sobre alineamientos masivos de levaduras en servidores estándar."
        },
        "answer": [
            "a"
        ],
        "priority": 2,
        "isTrap": true,
        "trapExplanation": "¡TRAMPA MAYOR DE DEFENSA! En una matriz de distancia entre árboles (como RF o QD), los datos son disimilitudes relacionales entre grafos, NO puntos en R^d. K-means necesita promediar coordenadas continuas para mover el centroide, lo cual es matemáticamente imposible en un espacio de grafos no euclidiano sin embebido previo.",
        "academicReference": "Inostroza-Ponta (2008) / Kaufman & Rousseeuw (1990)",
        "keyTakeaway": "K-Means NO opera directo sobre distancias de árboles: requiere espacio vectorial euclidiano continuo para promediar centroides (la matriz de árboles es relacional)."
    },
    {
        "id": 20,
        "category": "agrupamiento",
        "categoryLabel": "Métodos de Agrupamiento",
        "question": "¿Qué alternativas metodológicas permiten superar la limitación de K-Means frente a matrices de distancia filogenética no euclidianas?",
        "options": {
            "a": "Usar algoritmos basados en objetos reales (como K-medoids o PAM) o proyectar el espacio relacional mediante Escalamiento Multidimensional (MDS).",
            "b": "Filtrar estocásticamente el noventa por ciento de los taxones para forzar propiedades euclidianas directas en la matriz de disimilitud residual.",
            "c": "Aplicar transformaciones cuadráticas directas sobre las secuencias de nucleótidos previo a calcular las biparticiones topológicas en Newick.",
            "d": "Reemplazar los árboles filogenéticos por grafos de conectividad plana no ponderados sin estimar distancias relacionales entre loci ortólogos."
        },
        "answer": [
            "a"
        ],
        "priority": 1,
        "isTrap": false,
        "trapExplanation": "PAM / K-medoids utiliza observaciones reales (medoides) en vez de centroides ficticios; alternativamente, MDS proyecta los árboles en un espacio euclidiano aproximado.",
        "academicReference": "Kaufman & Rousseeuw (1990) / Inostroza-Ponta (2008)",
        "keyTakeaway": "Soluciones para distancias de árboles: K-medoids (PAM usa objetos reales) o Escalamiento Multidimensional (MDS previa)."
    },
    {
        "id": 21,
        "category": "agrupamiento",
        "categoryLabel": "Métodos de Agrupamiento",
        "question": "En el agrupamiento jerárquico aglomerativo (bottom-up), ¿cómo comienza el algoritmo y cómo se determina el número final de clústeres?",
        "options": {
            "a": "Comienza con cada árbol como un clúster unitario y fusiona recursivamente los más próximos según un criterio de enlace; el número de clústeres se determina cortando el dendrograma.",
            "b": "Comienza con todos los elementos agrupados en un súper-nodo global que se divide iterativamente mediante MCMC; el parámetro k debe especificarse de forma rígida previo a la ejecución.",
            "c": "Calcula los centroides geométricos de k particiones predefinidas en un espacio euclidiano continuo; el número de grupos se optimiza evaluando la varianza intra-clúster iterativamente.",
            "d": "Expande vecindarios locales de densidad mediante un radio fijo epsilon; los grupos se definen identificando componentes conexas que superen un umbral mínimo de puntos nodales vecinos."
        },
        "answer": [
            "a"
        ],
        "priority": 1,
        "isTrap": false,
        "trapExplanation": "Bottom-up: n clústeres de 1 elemento, se fusionan pares más cercanos según linkage (single, complete, average) hasta 1 dendrograma. El usuario 'corta' el árbol a la altura deseada.",
        "academicReference": "Murtagh & Contreras (2012) / Tabla 2.2 de la Tesis",
        "keyTakeaway": "Jerárquico: Bottom-up (n -> 1). k se define a posteriori cortando el dendrograma a una altura seleccionada."
    },
    {
        "id": 22,
        "category": "agrupamiento",
        "categoryLabel": "Métodos de Agrupamiento",
        "question": "¿Cuál es la característica distintiva del algoritmo difuso FANNY (Fuzzy Analysis) y por qué resulta relevante para árboles génicos?",
        "options": {
            "a": "Opera sobre matrices relacionales sin centroides y asigna grados de pertenencia difusa u_iv en [0, 1], permitiendo modelar genes con señales evolutivas mosaicas por introgresión o recombinación.",
            "b": "Es un método particional duro que prohíbe solapamientos entre grupos, garantizando que cada gen pertenezca única y exclusivamente a un módulo funcional biológico con topología 100% idéntica.",
            "c": "Determina automáticamente el número óptimo de clústeres sin requerir k a priori, aislando secuencias divergentes como ruido de fondo mediante densidades espaciales locales heterogéneas.",
            "d": "Transforma matrices relacionales en espacios métricos de Hilbert de dimensión infinita, optimizando hiperplanos lineales de separación mediante algoritmos de descenso de gradiente estocástico."
        },
        "answer": [
            "a"
        ],
        "priority": 2,
        "isTrap": false,
        "trapExplanation": "FANNY permite pertenencia compartida (fuzzy/difusa) entre 0 y 1, lo cual es biológicamente valioso cuando un gen ha sufrido introgresión, recombinación o presiones selectivas mixtas.",
        "academicReference": "Kaufman & Rousseeuw (1990) / Tabla 2.2",
        "keyTakeaway": "FANNY (Fuzzy): Opera directo en matrices relacionales. Grados difusos u_iv ∈ [0, 1]. Modela introgresión y evolución reticulada/mosaica."
    },
    {
        "id": 23,
        "category": "agrupamiento",
        "categoryLabel": "Métodos de Agrupamiento",
        "question": "¿Qué ventaja operativa ofrece DBSCAN frente a K-Means y FANNY respecto a la definición del número de grupos?",
        "options": {
            "a": "No exige definir a priori el número de clústeres k, descubre agrupaciones de forma geométrica arbitraria y aísla el ruido de fondo mediante densidad local (épsilon y MinPts).",
            "b": "Permite calcular centroides euclidianos promedio sobre matrices no métricas en tiempo O(1), asegurando convergencia determinista independientemente de la dimensionalidad.",
            "c": "Garantiza que el cien por ciento de los genes analizados queden asignados a clústeres conexos, impidiendo la existencia de elementos atípicos o ruido evolutivo sin clasificar.",
            "d": "Ajusta automáticamente el tamaño de los módulos para que todos los grupos resultantes contengan exactamente la misma proporción de árboles génicos ortólogos analizados."
        },
        "answer": [
            "a"
        ],
        "priority": 1,
        "isTrap": false,
        "trapExplanation": "DBSCAN es basado en densidad. Parámetros: epsilon (radio) y MinPts. Ventajas: k es automático, detecta formas no esféricas y etiqueta puntos aislados como ruido.",
        "academicReference": "Ester et al. (1996) / Tabla 2.2",
        "keyTakeaway": "DBSCAN: k automático (no a priori), formas arbitrarias y detección de ruido/outliers (épsilon, MinPts)."
    },
    {
        "id": 24,
        "category": "agrupamiento",
        "categoryLabel": "Métodos de Agrupamiento",
        "question": "PREGUNTA DE COMISIÓN SOBRE MST-kNN: ¿Cuáles son las 3 fases operativas del algoritmo propuesto por Inostroza-Ponta (2008)?",
        "options": {
            "a": "1) Construcción del grafo métrico completo con pesos QD; 2) Intersección estructural entre MST y regla k-NN; 3) Particionamiento por componentes conexas.",
            "b": "1) Proyección relacional mediante MDS euclidiano; 2) Cálculo iterativo de centroides geométricos k-Means; 3) Poda de aristas con enlace promedio simple.",
            "c": "1) Inferencia filogenética por Máxima Verosimilitud; 2) Muestreo de topologías mediante cadenas MCMC; 3) Fusión jerárquica de biparticiones consensuadas.",
            "d": "1) Estimación de densidades locales con radio épsilon; 2) Detección de núcleos de alta conectividad; 3) Asignación difusa de grados de pertenencia u_iv."
        },
        "answer": [
            "a"
        ],
        "priority": 2,
        "isTrap": false,
        "trapExplanation": "La tesis describe explícitamente las 3 fases de Inostroza-Ponta (2008): 1. Grafo completo ponderado por distancia de árboles; 2. Intersección MST ∩ k-NN; 3. Desconexión del grafo en componentes conexas independientes (los clústeres).",
        "academicReference": "Inostroza-Ponta (2008) / Fundamento Teórico",
        "keyTakeaway": "MST-kNN (3 fases): 1. Grafo métrico (pesos QD) -> 2. Intersección MST ∩ k-NN -> 3. Poda y componentes conexas (clústeres automáticos)."
    },
    {
        "id": 25,
        "category": "agrupamiento",
        "categoryLabel": "Métodos de Agrupamiento",
        "question": "TRAMPA LETAL EN MST-kNN: ¿Qué representa la 'k' en el nombre del algoritmo MST-kNN y cómo se determinan los clústeres finales?",
        "options": {
            "a": "La 'k' indica el número de vecinos más cercanos en la regla local k-NN; los clústeres finales no se fijan a priori, sino que surgen de las componentes conexas tras podar el grafo.",
            "b": "La 'k' representa el número de clústeres obligatorios a priori fijado por el usuario, exactamente igual que ocurre en los algoritmos particionales clásicos como K-Means o PAM.",
            "c": "La 'k' define el radio de corte métrico épsilon aplicado sobre el grafo de dispersión para separar los genes conservados respecto al ruido de fondo no agrupado del genoma.",
            "d": "La 'k' indica el número máximo de taxones o cepas permitidas por árbol filogenético para evitar desbordamientos de memoria durante la construcción del Árbol Generador Mínimo."
        },
        "answer": [
            "a"
        ],
        "priority": 2,
        "isTrap": true,
        "trapExplanation": "¡TRAMPA DE COMISIÓN POR EXCELENCIA! En K-means, 'k' es el número de clústeres. En MST-kNN, 'k' es el número de VECINOS MÁS CERCANOS (k-Nearest Neighbors). El número de clústeres finales NO se define a priori: resulta automáticamente del número de componentes conexas que quedan tras la poda.",
        "academicReference": "Inostroza-Ponta (2008)",
        "keyTakeaway": "En MST-kNN: 'k' = número de vecinos locales (k-NN). Los clústeres son las componentes conexas resultantes (número de grupos automático)."
    },
    {
        "id": 26,
        "category": "agrupamiento",
        "categoryLabel": "Métodos de Agrupamiento",
        "question": "¿Por qué en la fase 2 de MST-kNN se calcula primero el Árbol de Expansión Mínima (MST) antes de aplicar la regla k-NN?",
        "options": {
            "a": "Porque conecta todos los nodos del grafo con la suma mínima de pesos y sin formar ciclos, garantizando la continuidad estructural del sistema.",
            "b": "Porque filtra estocásticamente el cincuenta por ciento de los genes ortólogos para acelerar el cálculo matricial en bibliotecas de Python.",
            "c": "Porque proyecta la matriz relacional no euclidiana en una distribución normal multivariada para poder estimar centroides geométricos.",
            "d": "Porque calcula numéricamente las longitudes de rama óptimas bajo el criterio probabilístico de Máxima Verosimilitud filogenómica."
        },
        "answer": [
            "a"
        ],
        "priority": 1,
        "isTrap": false,
        "trapExplanation": "El MST asegura que el grafo sea conexo (todos los genes comunicados con costo global mínimo) y acíclico. Luego, la regla k-NN poda las aristas que no respeten la vecindad local estrecha.",
        "academicReference": "Inostroza-Ponta (2008)",
        "keyTakeaway": "Rol del MST: Garantiza conectividad global mínima y acíclica de todos los árboles antes del filtrado local de vecindad."
    },
    {
        "id": 27,
        "category": "complejidades",
        "categoryLabel": "Complejidad & Algoritmos",
        "question": "Según la Tabla comparativa de la tesis, ¿cuál es la complejidad computacional del algoritmo MST-kNN de Inostroza-Ponta?",
        "options": {
            "a": "O(n² log n)",
            "b": "O(n³)",
            "c": "O(n · k · d · i)",
            "d": "O(n²)"
        },
        "answer": [
            "a"
        ],
        "priority": 1,
        "isTrap": false,
        "trapExplanation": "En la Tabla 2.2 de la tesis se consigna explícitamente: MST-kNN (Inostroza-Ponta 2008) tiene complejidad O(n^2 log n).",
        "academicReference": "Tabla 2.2 de la Tesis / Inostroza-Ponta (2008)",
        "keyTakeaway": "Complejidad MST-kNN = O(n² log n)."
    },
    {
        "id": 28,
        "category": "complejidades",
        "categoryLabel": "Complejidad & Algoritmos",
        "question": "¿Cuál es la complejidad computacional del agrupamiento difuso FANNY indicada en la tesis?",
        "options": {
            "a": "O(n²)",
            "b": "O(n log n)",
            "c": "O(n³)",
            "d": "O(n · k · d)"
        },
        "answer": [
            "a"
        ],
        "priority": 1,
        "isTrap": false,
        "trapExplanation": "FANNY opera directamente sobre la matriz relacional de n x n con complejidad cuadrática O(n^2).",
        "academicReference": "Tabla 2.2 de la Tesis",
        "keyTakeaway": "Complejidad FANNY = O(n²)."
    },
    {
        "id": 29,
        "category": "complejidades",
        "categoryLabel": "Complejidad & Algoritmos",
        "question": "¿Cuál es la complejidad del agrupamiento Jerárquico Aglomerativo según la literatura citada en la tesis?",
        "options": {
            "a": "O(n²) a O(n³)",
            "b": "O(n log n) a O(n²)",
            "c": "O(n · k · d · i)",
            "d": "O(n² log n)"
        },
        "answer": [
            "a"
        ],
        "priority": 1,
        "isTrap": false,
        "trapExplanation": "Dependiendo del criterio de enlace (linkage) y la estructura de datos, el agrupamiento jerárquico aglomerativo estándar oscila entre O(n^2) y O(n^3).",
        "academicReference": "Tabla 2.2 de la Tesis / Murtagh & Contreras (2012)",
        "keyTakeaway": "Complejidad Jerárquico Aglomerativo = O(n²) ~ O(n³)."
    },
    {
        "id": 30,
        "category": "complejidades",
        "categoryLabel": "Complejidad & Algoritmos",
        "question": "¿Cuáles de los siguientes métodos de agrupamiento analizados requieren que el usuario especifique obligatoriamente el número de grupos k a priori?",
        "options": {
            "a": "K-Means y FANNY (Fuzzy Analysis relacional).",
            "b": "DBSCAN y MST-kNN (componentes conexas).",
            "c": "Exclusivamente el Jerárquico Aglomerativo.",
            "d": "Todos los métodos evaluados en la tesis."
        },
        "answer": [
            "a"
        ],
        "priority": 1,
        "isTrap": false,
        "trapExplanation": "K-Means y FANNY requieren fijar k antes de correr. DBSCAN calcula grupos según densidad (epsilon, MinPts), MST-kNN los descubre por componentes conexas, y el Jerárquico genera un dendrograma completo cortado a posteriori.",
        "academicReference": "Tabla 2.2 de la Tesis",
        "keyTakeaway": "Requieren k a priori: K-Means y FANNY. NO requieren k a priori: DBSCAN (densidad) y MST-kNN (componentes conexas)."
    },
    {
        "id": 31,
        "category": "complejidades",
        "categoryLabel": "Complejidad & Algoritmos",
        "question": "¿Qué representa la variable 'n' en las cotas de complejidad de la Tabla de agrupamiento de la tesis?",
        "options": {
            "a": "El número de árboles génicos correspondientes a los genes ortólogos analizados.",
            "b": "El número total de nucleótidos secuenciados en el genoma completo de la levadura.",
            "c": "La cantidad de combinaciones de cuartetos no consensuados evaluados por tqdist.",
            "d": "El número de iteraciones estocásticas hasta la convergencia en cadenas de Markov."
        },
        "answer": [
            "a"
        ],
        "priority": 1,
        "isTrap": false,
        "trapExplanation": "¡Cuidado con la trampa! En la sección de agrupamiento de árboles, cada objeto a agrupar es un ÁRBOL GÉNICO. Por tanto, n = número de árboles ortólogos (los 3.806 genes filtrados), mientras que las 471 cepas son las hojas dentro de cada árbol.",
        "academicReference": "Nota de la Tabla 2.2 de la Tesis",
        "keyTakeaway": "En el agrupamiento: n = número de árboles génicos a agrupar (genes ortólogos). En la inferencia: n = número de taxones/cepas (471 hojas)."
    },
    {
        "id": 32,
        "category": "complejidades",
        "categoryLabel": "Complejidad & Algoritmos",
        "question": "¿Cuál es la cota de complejidad de DBSCAN según la tabla comparativa de la tesis?",
        "options": {
            "a": "O(n log n) a O(n²)",
            "b": "O(n² log n) a O(n³)",
            "c": "O(n · k · d · i)",
            "d": "O(k² log n) a O(2^n)"
        },
        "answer": [
            "a"
        ],
        "priority": 1,
        "isTrap": false,
        "trapExplanation": "Con indexación espacial eficiente (e.g. k-d trees o R*-trees) DBSCAN corre en O(n log n); en el peor caso sin indexación o con matrices densas es O(n^2).",
        "academicReference": "Tabla 2.2 de la Tesis / Ester et al. (1996)",
        "keyTakeaway": "Complejidad DBSCAN = O(n log n) ~ O(n²)."
    },
    {
        "id": 33,
        "category": "trampas",
        "categoryLabel": "Trampas de Comisión",
        "question": "SIMULACIÓN DE EXAMEN: Un profesor de la comisión te pregunta: '¿Por qué no calculaste el valor de verosimilitud (likelihood) en tus árboles de Neighbor Joining para validar el soporte de las ramas?'.",
        "options": {
            "a": "Neighbor Joining es un método basado en distancias que NO optimiza verosimilitudes; la verosimilitud requiere modelos probabilísticos de sustitución y es exclusiva de Máxima Verosimilitud.",
            "b": "Neighbor Joining descarta la verosimilitud porque asume un espacio vectorial continuo en donde los centroides geométricos se optimizan directamente mediante descenso de gradiente analítico.",
            "c": "Neighbor Joining no puede computar verosimilitudes porque está restringido algorítmicamente a conjuntos con menos de diez taxones, colapsando ante las 471 cepas analizadas en el trabajo.",
            "d": "Neighbor Joining integra verosimilitud únicamente cuando los árboles poseen enraizamiento temporal por outgroup, condición que se omitió intencionalmente en el pipeline de la memoria."
        },
        "answer": [
            "a"
        ],
        "priority": 2,
        "isTrap": true,
        "trapExplanation": "¡Trampa de ignorancia deliberada del evaluador! Neighbor Joining minimiza longitudes de rama a partir de una matriz de distancias determinista; NO es un método basado en modelos probabilísticos y carece de función de verosimilitud.",
        "academicReference": "Felsenstein (2004) / Saitou & Nei (1987)",
        "keyTakeaway": "NJ NO calcula verosimilitud (es un algoritmo aglomerativo determinista de distancias, no un optimizador probabilístico)."
    },
    {
        "id": 34,
        "category": "trampas",
        "categoryLabel": "Trampas de Comisión",
        "question": "SIMULACIÓN DE EXAMEN: Si la comisión te dice: 'En tu árbol no enraizado de S. eubayanus, señálame cuál es el clado más antiguo y el ancestro original de las cepas', ¿cuál es la respuesta conceptualmente correcta?",
        "options": {
            "a": "Al ser un árbol no enraizado, no se asume un ancestro común directo ni grupo externo a priori; por ende, no existe una dirección temporal absoluta ni un clado ancestral identificable sin enraizamiento.",
            "b": "El ancestro común se deduce identificando la primera hoja terminal registrada en el archivo Newick original, la cual actúa automáticamente como grupo externo por convención bioinformática.",
            "c": "El clado más antiguo corresponde estrictamente al nodo interno que registra el mayor número acumulado de biparticiones no compartidas en la matriz de distancia de Robinson-Foulds calculada.",
            "d": "El origen evolutivo ancestral se determina calculando el centroide geométrico de menor distancia cuadrática promedio respecto a la totalidad de las 471 cepas representadas en el grafo métrico."
        },
        "answer": [
            "a"
        ],
        "priority": 2,
        "isTrap": true,
        "trapExplanation": "¡La trampa más peligrosa de la defensa! Si señalas una rama cualquiera como 'la más antigua', estás reprobado en sistemática. Un árbol NO enraizado no posee dirección temporal ni raíz; solo muestra relaciones de parentesco relativo.",
        "academicReference": "Felsenstein (2004) / Semple & Steel (2003)",
        "keyTakeaway": "En árbol no enraizado: ¡NO hay ancestro original ni clado más antiguo! Solo hay parentesco relativo sin tiempo absoluto."
    },
    {
        "id": 35,
        "category": "trampas",
        "categoryLabel": "Trampas de Comisión",
        "question": "SIMULACIÓN DE EXAMEN: Si un profesor afirma: 'Para qué usar Quartet Distance si Robinson-Foulds es la métrica estándar y clásica en filogenia', ¿cómo debes defender técnicamente tu elección?",
        "options": {
            "a": "Robinson-Foulds sufre severamente del efecto rogue taxon: un taxón desplazado satura la distancia al máximo; Quartet Distance descompone en cuartetos, ofreciendo degradación gradual y alta resolución.",
            "b": "Robinson-Foulds no admite implementación computacional en lenguajes modernos como Python, mientras que Quartet Distance cuenta con bibliotecas optimizadas como Biopython y ETE Toolkit para matrices.",
            "c": "Robinson-Foulds requiere obligatoriamente que las secuencias de ADN hayan sido alineadas con Clustal Omega, mientras que Quartet Distance calcula topologías directamente sin necesidad de alineamiento.",
            "d": "Robinson-Foulds solo puede aplicarse a árboles filogenéticos que posean exactamente cuatro taxones terminales, invalidando su uso empírico sobre las 471 cepas de Saccharomyces eubayanus evaluadas."
        },
        "answer": [
            "a"
        ],
        "priority": 2,
        "isTrap": true,
        "trapExplanation": "Esta es la justificación metodológica central de tu tesis: RF es hipersensible a pequeñas discrepancias (satural al máximo), mientras que QD cuantifica similitud parcial evaluando todas las combinaciones de 4 taxones C(n,4).",
        "academicReference": "Sand et al. (2014) / Robinson & Foulds (1981)",
        "keyTakeaway": "Defensa técnica: RF satura ante 1 rogue taxon; QD evalúa C(n,4) sub-topologías dando resolución fina y degradación gradual."
    },
    {
        "id": 36,
        "category": "trampas",
        "categoryLabel": "Trampas de Comisión",
        "question": "SIMULACIÓN DE EXAMEN: Si te preguntan: '¿Por qué no ejecutaste K-Means directamente sobre la matriz de distancias topológicas?', ¿cuál es la justificación matemática rigurosa?",
        "options": {
            "a": "K-Means requiere un espacio euclidiano para calcular centroides promediando coordenadas; las distancias entre árboles son relacionales no euclidianas, requiriendo K-medoids o proyección MDS previa.",
            "b": "K-Means impone una restricción algorítmica estricta que prohíbe procesar matrices cuadradas con más de cincuenta observaciones, provocando desbordamiento de memoria en servidores convencionales.",
            "c": "K-Means calcula exclusivamente componentes conexas basadas en árboles de expansión mínima, lo que causaría redundancia metodológica directa con la fase dos del algoritmo MST-kNN implementado.",
            "d": "K-Means exige conocer a priori la distribución paramétrica de las mutaciones nucleotídicas, propiedad que se pierde al convertir las secuencias biológicas en estructuras de grafos en Newick."
        },
        "answer": [
            "a"
        ],
        "priority": 2,
        "isTrap": true,
        "trapExplanation": "K-Means calcula centroides promediando vectores numéricos en R^d. Las métricas de árboles filogenéticos (RF, QD) generan matrices de disimilitud relacionales NO euclidianas. No existe el 'promedio aritmético' de dos árboles.",
        "academicReference": "Inostroza-Ponta (2008) / Kaufman & Rousseeuw (1990)",
        "keyTakeaway": "Justificación matemática: K-means requiere espacio euclidiano continuo para promediar centroides; las distancias de árboles son relacionales no euclidianas."
    },
    {
        "id": 37,
        "category": "trampas",
        "categoryLabel": "Trampas de Comisión",
        "question": "VERDADERO O FALSO: 'En un árbol no enraizado de 471 hojas, cada rama interna define una bipartición que divide las hojas en dos conjuntos disjuntos y no vacíos A y B tales que A ∪ B = V_hojas'.",
        "options": {
            "a": "VERDADERO. Es la definición matemática formal de bipartición (split) citada en la memoria.",
            "b": "FALSO. Las ramas internas solo pueden dividir hojas si el árbol posee una raíz ancestral fija.",
            "c": "FALSO. Los subconjuntos A y B deben compartir obligatoriamente un taxón frontera no vacío.",
            "d": "FALSO. La partición bipartita exige que los vértices internos posean grado impar mayor a 3."
        },
        "answer": [
            "a"
        ],
        "priority": 1,
        "isTrap": true,
        "trapExplanation": "Es exactamente la definición matemática formal de Semple & Steel (2003): cada rama interna e in E induce un corte (split) bipartito disjunto A y B tal que su unión cubre todas las hojas.",
        "academicReference": "Semple & Steel (2003)",
        "keyTakeaway": "Bipartición formal: A ∪ B = V_hojas, A ∩ B = ∅, con A, B ≠ ∅."
    },
    {
        "id": 38,
        "category": "trampas",
        "categoryLabel": "Trampas de Comisión",
        "question": "SIMULACIÓN DE EXAMEN: 'En la inferencia bayesiana, ¿por qué no se selecciona simplemente la topología con la probabilidad a priori (prior) más alta?'.",
        "options": {
            "a": "Porque la inferencia combina los priors con la verosimilitud de los datos para estimar la probabilidad POSTERIOR mediante MCMC, no basándose únicamente en el prior.",
            "b": "Porque los priors asignan probabilidades uniformes idénticas a todas las topologías, obligando a seleccionar el árbol resultante mediante minimización de parsimonia.",
            "c": "Porque la formulación bayesiana descarta los priors en filogenómica masiva debido a que las secuencias de ADN introducen sesgos analíticos en el muestreo estocástico.",
            "d": "Porque el teorema de Bayes exige maximizar exclusivamente la verosimilitud numérica de los datos observados, anulando la influencia de distribuciones probabilísticas previas."
        },
        "answer": [
            "a"
        ],
        "priority": 2,
        "isTrap": true,
        "trapExplanation": "Teorema de Bayes: Posterior = (Verosimilitud * Prior) / Evidencia. Tomar solo el prior ignoraría la evidencia de las secuencias observadas.",
        "academicReference": "Nhan et al. (2017) / Felsenstein (2004)",
        "keyTakeaway": "Bayes: Probabilidad Posterior = Priors + Verosimilitud de los datos (vía MCMC)."
    },
    {
        "id": 39,
        "category": "contexto",
        "categoryLabel": "Contexto y Motivación",
        "question": "¿Cuál es el verdadero propósito ('el para qué') de realizar un análisis filogenético a escala de genoma completo en Saccharomyces eubayanus?",
        "options": {
            "a": "Aislar y domesticar cepas vivas en biorreactores piloto para optimizar industrialmente el perfil de ésteres aromáticos en fermentaciones cerveceras lager.",
            "b": "Demostrar si la co-evolución y congruencia topológica entre árboles de genes permite descubrir módulos funcionales celulares sin sesgo analítico a priori.",
            "c": "Ensamblar secuencias consenso de genoma completo para diseñar vectores de recombinación homóloga y edición genética dirigida mediante sistemas CRISPR-Cas9.",
            "d": "Establecer la denominación de origen patagónica de linajes comerciales mediante correlaciones estrictas entre microclimas andinos y marcadores microsatélites."
        },
        "answer": [
            "b"
        ],
        "priority": 2,
        "isTrap": true,
        "isProfessorEnsayo": true,
        "trapExplanation": "¡Trampa típica de ensayo! Los evaluadores advierten: la tesis es bioinformática y computacional; no aisló cepas ni optimizó procesos cerveceros en laboratorio. Su fin es demostrar si la congruencia topológica entre árboles génicos revela módulos funcionales sin sesgo a priori.",
        "academicReference": "Observaciones del Profesor Evaluador / Ensayo de Defensa",
        "keyTakeaway": "Propósito: Demostrar si la co-evolución y congruencia topológica entre árboles génicos descubre módulos funcionales celulares sin sesgo a priori."
    },
    {
        "id": 40,
        "category": "contexto",
        "categoryLabel": "Contexto y Motivación",
        "question": "¿Por qué es un error grave afirmar en la defensa que la tesis sirve 'para que en el laboratorio sepan qué genes optimizar o mejorar en la cerveza'?",
        "options": {
            "a": "Porque Saccharomyces eubayanus es una levadura estrictamente salvaje incapaz de asimilar maltosa o metabolizar azúcares en procesos fermentativos industriales cerveceros.",
            "b": "Porque la tesis es de bioinformática e ingeniería, analizó secuencias computacionalmente in silico y excluyó explícitamente el trabajo experimental y la intervención de cepas.",
            "c": "Porque la optimización genética de rutas metabólicas requiere obligatoriamente algoritmos generativos de deep learning con modelos de difusión no contemplados en la memoria.",
            "d": "Porque las matrices de distancia topológica de cuartetos carecen de validez biológica cuando se aplican a hongos unicelulares con reproducción predominantemente asexual."
        },
        "answer": [
            "b"
        ],
        "priority": 2,
        "isTrap": true,
        "isProfessorEnsayo": true,
        "trapExplanation": "En los alcances de la memoria (Sección 1.4.3) y en las observaciones del profesor se enfatiza que la tesis agrupó genes computacionalmente y no evaluó fenotipos ni intervino cepas; sostener que 'optimiza la cerveza' carece de sustento experimental.",
        "academicReference": "Sección 1.4.3 de la Memoria / Feedback Docente",
        "keyTakeaway": "Alcance computacional estricto: la tesis agrupa genes in silico; no incluye optimización experimental cervecera ni manipulación en laboratorio."
    },
    {
        "id": 41,
        "category": "contexto",
        "categoryLabel": "Contexto y Motivación",
        "question": "¿Qué problema conceptual se genera al comenzar la presentación mostrando directamente el nombre técnico de la levadura sin contextualizar?",
        "options": {
            "a": "Provoca que los visualizadores de diapositivas no interpreten correctamente la tipografía en cursiva reglamentaria del código de nomenclatura taxonómica.",
            "b": "Impide que la comisión entienda de entrada qué organismo se estudia (un hongo unicelular) y cuál es su relevancia biológica, evolutiva o biotecnológica.",
            "c": "Invalida matemáticamente los supuestos biológicos requeridos para el posterior cálculo de matrices de disimilitud filogenética entre árboles génicos.",
            "d": "Obliga reglamentariamente a sustituir el marco metodológico KDD por estándares de ingeniería de software como CRISP-DM durante la misma exposición."
        },
        "answer": [
            "b"
        ],
        "priority": 1,
        "isTrap": false,
        "isProfessorEnsayo": true,
        "trapExplanation": "En el ensayo, el profesor y los compañeros señalaron que entrar de golpe con un nombre técnico desorienta al evaluador; es necesario partir explicando qué es la levadura (hongo unicelular, parental de la levadura lager S. pastorianus) para dar contexto antes de la técnica.",
        "academicReference": "Recomendaciones de Oratoria y Contexto Docente",
        "keyTakeaway": "Regla de inicio: Contextualizar siempre primero el organismo (hongo unicelular, ancestro salvaje de híbridos lager) antes de profundizar en la técnica."
    },
    {
        "id": 42,
        "category": "kdd",
        "categoryLabel": "Metodología KDD",
        "question": "¿Cuál es la principal debilidad metodológica del marco KDD tradicional que el profesor destacó en el audio?",
        "options": {
            "a": "Que impone restricciones arquitectónicas estrictas que impiden procesar simultáneamente más de cien matrices relacionales de árboles génicos ortólogos.",
            "b": "Que es una metodología esencialmente lineal, carece de una fase inicial explícita de comprensión del problema/negocio y no contempla el despliegue final.",
            "c": "Que prohíbe el uso de algoritmos no supervisados basados en teoría de grafos como la combinación estructural de Árboles de Expansión Mínima con k-NN.",
            "d": "Que exige obligatoriamente entrenar modelos supervisados de redes neuronales convolucionales para poder evaluar la significancia de los agrupamientos."
        },
        "answer": [
            "b"
        ],
        "priority": 2,
        "isTrap": true,
        "isProfessorEnsayo": true,
        "trapExplanation": "El profesor explica que KDD puro es de los años 90 y tiene una estructura rígida y lineal; a diferencia de metodologías más modernas como CRISP-DM, no incluye la comprensión del problema/negocio al inicio ni la fase de despliegue al final.",
        "academicReference": "Fayyad et al. (1996) / Observaciones del Profesor",
        "keyTakeaway": "Debilidad de KDD: Estructura lineal y rígida, sin fase explícita inicial de comprensión del negocio/problema ni fase final de despliegue."
    },
    {
        "id": 43,
        "category": "kdd",
        "categoryLabel": "Metodología KDD",
        "question": "¿Cómo se debe justificar técnicamente la elección de KDD en la tesis sin caer en respuestas vagas como 'porque era lo mejor'?",
        "options": {
            "a": "Argumentando que KDD es la única metodología avalada formalmente por el reglamento institucional de titulación para memorias de ingeniería bioinformática.",
            "b": "Explicando que el pipeline bioinformático sigue fases analíticas nítidas y secuenciales de flujo de datos: Selección, Transformación, Minería y Evaluación.",
            "c": "Sosteniendo que KDD es el único estándar metodológico que permite validar biológicamente agrupamientos mediante consultas automatizadas a la red STRING.",
            "d": "Afirmando que KDD fue concebida específicamente para el procesamiento de archivos Newick y el cálculo masivo de distancias topológicas no enraizadas."
        },
        "answer": [
            "b"
        ],
        "priority": 1,
        "isTrap": false,
        "isProfessorEnsayo": true,
        "trapExplanation": "La justificación correcta ante el comité es explicar que el experimento bioinformático posee un alcance cerrado con fases de flujo de datos muy bien delimitadas: preparación de secuencias, inferencia de árboles, cálculo de distancias y clustering, y evaluación biológica.",
        "academicReference": "Metodología de la Investigación / KDD Process",
        "keyTakeaway": "Justificación de KDD: Fases analíticas nítidas y secuenciales de flujo de datos (Selección -> Transformación -> Minería -> Evaluación)."
    },
    {
        "id": 44,
        "category": "preprocesamiento",
        "categoryLabel": "Preprocesamiento y Filtrado",
        "question": "¿Qué riesgo biológico se corre al eliminar los genes que presentan menos de 70 polimorfismos (SNPs)?",
        "options": {
            "a": "Se sobrecarga el consumo de memoria volátil y la latencia computacional al construir el grafo completo de cuartetos en la fase analítica.",
            "b": "Se pueden descartar genes altamente conservados que cumplen funciones metabólicas vitales y que forman parte central de módulos funcionales celulares.",
            "c": "Se altera el límite superior teórico de la distancia de Robinson-Foulds, reduciendo la cota máxima para 471 cepas a un valor inferior a 936.",
            "d": "Se obliga a los algoritmos de inferencia filogenética masiva a computar árboles ultramétricos con velocidades de mutación forzosamente homogéneas."
        },
        "answer": [
            "b"
        ],
        "priority": 2,
        "isTrap": true,
        "isProfessorEnsayo": true,
        "trapExplanation": "¡Ojo biológico! Los genes con muy pocos SNPs suelen estar ultraconservados porque mutaciones en ellos son letales para la célula. Al filtrarlos por baja variabilidad estadística para facilitar la inferencia filogenética, se corre el riesgo de eliminar componentes clave de complejos esenciales.",
        "academicReference": "Discusión de Preprocesamiento / Observaciones del Profesor",
        "keyTakeaway": "Riesgo de filtrar <70 SNPs: Se descartan genes altamente conservados y esenciales cuya preservación evolutiva es crítica para la célula."
    },
    {
        "id": 45,
        "category": "preprocesamiento",
        "categoryLabel": "Preprocesamiento y Filtrado",
        "question": "Cuando una secuencia corta o con datos faltantes genera un árbol multifurcado o anómalo en Máxima Verosimilitud, ¿cuál es la explicación matemática rigurosa?",
        "options": {
            "a": "El optimizador numérico incurre en sobreajuste paramétrico debido a un número excesivo de grados de libertad en la matriz de sustitución GTR.",
            "b": "La escasez de sitios variables reduce la señal estadística, impidiendo resolver biparticiones con soporte y colapsando ramas en politomías.",
            "c": "El software bioinformático sufre una excepción de punto flotante al dividir por cero durante la estimación iterativa de frecuencias nucleotídicas.",
            "d": "El número efectivo de taxones analizados se multiplica temporalmente durante la normalización de secuencias con presencia de caracteres ambiguos."
        },
        "answer": [
            "b"
        ],
        "priority": 1,
        "isTrap": false,
        "isProfessorEnsayo": true,
        "trapExplanation": "Los métodos filogenéticos son probabilísticos y estadísticos; si la secuencia es muy corta o tiene gaps, no hay suficiente evidencia filogenética para bifurcar con soporte estadístico y las ramas de longitud cero colapsan en politomías (árbol multifurcado).",
        "academicReference": "Felsenstein (2004) / Yang (2014)",
        "keyTakeaway": "Politomías por falta de SNPs: Señal estadística insuficiente para resolver biparticiones con soporte -> colapso de ramas en nodos multifurcados."
    },
    {
        "id": 46,
        "category": "distancia",
        "categoryLabel": "Métricas de Distancia",
        "question": "¿Cómo se calcula la distancia máxima teórica de Robinson-Foulds (RF) para árboles no enraizados de n cepas?",
        "options": {
            "a": "Multiplicando los genes ortólogos por el logaritmo de taxones: G · log(n).",
            "b": "Calculando la combinación total de cuartetos de hojas no resueltas: C(n, 4).",
            "c": "Mediante la fórmula formal 2n - 6, que para 471 cepas resulta exactamente en 936.",
            "d": "Elevando al cuadrado el índice de silueta medio de la partición: Silueta²."
        },
        "answer": [
            "c"
        ],
        "priority": 2,
        "isTrap": false,
        "isProfessorEnsayo": true,
        "trapExplanation": "Un árbol no enraizado de n hojas tiene como máximo n - 3 ramas internas (biparticiones). La métrica RF cuenta biparticiones no compartidas: 2 * (n - 3) = 2n - 6. Para 471 cepas: 2(471) - 6 = 942 - 6 = 936.",
        "academicReference": "Robinson & Foulds (1981) / Semple & Steel (2003)",
        "keyTakeaway": "Máximo teórico RF no enraizado: 2(n - 3) = 2n - 6. Con n=471 cepas: exactamente 936."
    },
    {
        "id": 47,
        "category": "distancia",
        "categoryLabel": "Métricas de Distancia",
        "question": "¿Qué significa empíricamente que la distancia Robinson-Foulds alcance el valor de 936 entre dos árboles génicos?",
        "options": {
            "a": "Que ambos árboles provienen de cepas aisladas en regiones geográficas con historias ecológicas idénticas.",
            "b": "Que la métrica se saturó completamente: los dos árboles no comparten ninguna bipartición interna en común.",
            "c": "Que el algoritmo MST-kNN ha identificado un módulo funcional óptimo caracterizado por máxima cohesión local.",
            "d": "Que la optimización numérica de Máxima Verosimilitud alcanzó convergencia estocástica con soporte bootstrap del 100%."
        },
        "answer": [
            "b"
        ],
        "priority": 2,
        "isTrap": true,
        "isProfessorEnsayo": true,
        "trapExplanation": "El valor 936 indica saturación total de la métrica: disimilitud topológica del 100%, ni una sola bipartición interna compartida. Evidencia la limitación de RF, que satura muy rápidamente ante divergencias menores.",
        "academicReference": "Robinson & Foulds (1981) / Observaciones del Profesor",
        "keyTakeaway": "RF = 936 (máximo teórico): Saturación total de la métrica, cero biparticiones internas en común entre ambos árboles génicos."
    },
    {
        "id": 48,
        "category": "distancia",
        "categoryLabel": "Métricas de Distancia",
        "question": "¿Por qué la métrica Quartet Distance (QD) ofrece una mayor resolución analítica que Robinson-Foulds en este proyecto?",
        "options": {
            "a": "Porque incorpora explícitamente las longitudes de rama y el tiempo evolutivo calibrado con reloj molecular en cada cuarteto evaluado.",
            "b": "Porque evalúa subconjuntos de 4 taxones, capturando similitudes topológicas intermedias aunque clados globales se hayan fragmentado.",
            "c": "Porque reduce la complejidad computacional asintótica a tiempo constante O(1) mediante algoritmos optimizados de álgebra lineal.",
            "d": "Porque exige que los árboles estén obligatoriamente enraizados mediante un outgroup externo para validar las biparticiones internas."
        },
        "answer": [
            "b"
        ],
        "priority": 2,
        "isTrap": false,
        "isProfessorEnsayo": true,
        "trapExplanation": "RF es binaria y rígida: si un solo taxón se mueve (rogue taxon), destruye la bipartición completa. QD analiza las C(n,4) sub-topologías de 4 taxones; si la mayoría conserva su relación, la distancia es baja y gradual, ofreciendo alta resolución.",
        "academicReference": "Sand et al. (2014) / Mailund et al. (2006)",
        "keyTakeaway": "Ventaja de QD: Alta resolución y degradación gradual al evaluar C(n,4) cuartetos; robusto frente a taxones desplazados (rogue taxa)."
    },
    {
        "id": 49,
        "category": "distancia",
        "categoryLabel": "Métricas de Distancia",
        "question": "¿Cuáles son los métodos adicionales de distancia entre árboles filogenéticos que el profesor nombró explícitamente en el audio?",
        "options": {
            "a": "Distancia Euclidiana clásica, Métrica Manhattan y Distancia estadística de Mahalanobis.",
            "b": "Path Length Difference, Quadratic Path Difference (al cuadrado) y distancia Kendall-Colijn.",
            "c": "Distancia de Hamming para caracteres, Distancia Levenshtein y Divergencia Jukes-Cantor.",
            "d": "Índice de similitud Jaccard, Coeficiente Dice y Distancia angular de Coseno vectorial."
        },
        "answer": [
            "b"
        ],
        "priority": 2,
        "isTrap": true,
        "isProfessorEnsayo": true,
        "trapExplanation": "En el audio, el profesor enfatiza que en la literatura existen por lo menos seis métricas más y cita textualmente Path Length Difference, su variante de diferencia al cuadrado (Quadratic Path Difference) y Kendall-Colijn.",
        "academicReference": "Grabación Ensayo Defensa / Steel & Penny (1993) / Kendall & Colijn (2016)",
        "keyTakeaway": "Métricas adicionales citadas por el profesor: Path Length Difference, Quadratic Path Difference y Kendall-Colijn."
    },
    {
        "id": 50,
        "category": "distancia",
        "categoryLabel": "Métricas de Distancia",
        "question": "¿Cuál fue la justificación técnica clave del profesor para descartar las métricas de distancia basadas en ramas?",
        "options": {
            "a": "Porque requieren clústeres de cómputo paralelo en GPUs de alto rendimiento que no resultaban viables para procesar las 3.806 matrices de secuencias en el servidor.",
            "b": "Porque incorporan la longitud de las ramas (tasas de mutación), lo cual confunde la historia evolutiva cuando genes co-funcionales mutan a distinta velocidad biológica.",
            "c": "Porque los formatos estándar de intercambio como Newick eliminan sistemáticamente la información de longitud de rama durante el parsing con Biopython y ETE Toolkit.",
            "d": "Porque las métricas de ramas son formalmente inaplicables cuando los alineamientos contienen inserciones, deleciones o taxones con bajo polimorfismo nucleotídico."
        },
        "answer": [
            "b"
        ],
        "priority": 2,
        "isTrap": false,
        "isProfessorEnsayo": true,
        "trapExplanation": "Las longitudes de rama reflejan cantidad de sustituciones/mutaciones. Dos genes pueden ser miembros del mismo complejo funcional y compartir la misma topología de parentesco, pero tener tasas evolutivas muy distintas; una métrica de ramas los consideraría lejanos erróneamente.",
        "academicReference": "Fundamento Teórico / Observaciones del Profesor",
        "keyTakeaway": "Descarte de distancias de ramas: Confunden tasas de mutación con topología. Genes co-funcionales pueden tener topología idéntica pero longitudes de rama muy distintas."
    },
    {
        "id": 51,
        "category": "distancia",
        "categoryLabel": "Métricas de Distancia",
        "question": "¿Por qué no es aplicable la métrica de Kendall-Colijn a los árboles filogenéticos generados en este trabajo?",
        "options": {
            "a": "Porque la formulación matemática de Kendall-Colijn está patentada comercialmente y no permite su integración en pipelines de investigación bioinformática abierta.",
            "b": "Porque requiere árboles estrictamente enraizados (rooted), midiendo distancias al ancestro común desde la raíz, mientras que los árboles del pipeline son sin raíz (unrooted).",
            "c": "Porque fue diseñada y calibrada con modelos matemáticos exclusivos para secuencias bacterianas cortas, careciendo de validez teórica para genomas eucariontes de levaduras.",
            "d": "Porque su algoritmo de cálculo colapsa ante matrices de adyacencia de más de diez taxones terminales, tornando intratable el procesamiento masivo de las 471 cepas."
        },
        "answer": [
            "b"
        ],
        "priority": 2,
        "isTrap": true,
        "isProfessorEnsayo": true,
        "trapExplanation": "La métrica de Kendall-Colijn construye vectores de distancias topológicas y de ramas tomando como punto de partida y referencia la raíz (ancestro común). Al ser árboles unrooted sin outgroup temporal, no se puede calcular.",
        "academicReference": "Kendall & Colijn (2016)",
        "keyTakeaway": "Kendall-Colijn: Inaplicable porque exige árboles enraizados (rooted); el pipeline genera árboles no enraizados (unrooted)."
    },
    {
        "id": 52,
        "category": "agrupamiento",
        "categoryLabel": "Métodos de Agrupamiento",
        "question": "¿Por qué se descartaron los algoritmos particionales como K-Means y Fuzzy C-Means en la fase de agrupamiento?",
        "options": {
            "a": "Porque sus implementaciones computacionales estándar en Scikit-learn carecen de soporte nativo para ejecutarse sobre sistemas operativos GNU/Linux.",
            "b": "Porque operan sobre espacios vectoriales calculando centroides promedio y exigen definir el número de clústeres 'k' de forma fija a priori.",
            "c": "Porque requieren calcular permutaciones factoriales de árboles topológicos no binarios, volviendo el tiempo de cómputo inabordable empíricamente.",
            "d": "Porque anulan la transitividad en grafos de distancia relacionales, impidiendo el posterior cálculo del enriquecimiento biológico en la red STRING."
        },
        "answer": [
            "b"
        ],
        "priority": 1,
        "isTrap": false,
        "isProfessorEnsayo": true,
        "trapExplanation": "K-Means requiere puntos en un espacio vectorial continuo para calcular el promedio geométrico (centroide) de cada cluster, lo cual no existe en una matriz de distancias topológicas relacionales sin proyección. Además, forzar un k fijo contradice el descubrimiento autónomo.",
        "academicReference": "Inostroza-Ponta (2008) / Kaufman & Rousseeuw (1990)",
        "keyTakeaway": "K-Means descartado: Requiere espacio vectorial con centroides promedio euclidianos y fuerza un k fijo a priori."
    },
    {
        "id": 53,
        "category": "agrupamiento",
        "categoryLabel": "Métodos de Agrupamiento",
        "question": "¿Cuál es la salida matemática natural de un algoritmo de Clustering Jerárquico aglomerativo?",
        "options": {
            "a": "Un conjunto particionado de etiquetas discretas independientes sin relaciones de orden jerárquico anidado entre sí.",
            "b": "Una única estructura conexa en forma de árbol (dendrograma) que agrupa todos los elementos del conjunto de datos.",
            "c": "Una red compleja bipartita con probabilidades difusas asignadas a las aristas según grados de membresía u_iv.",
            "d": "Un hiperplano óptimo de margen máximo que separa linealmente las observaciones en subespacios ortogonales."
        },
        "answer": [
            "b"
        ],
        "priority": 1,
        "isTrap": false,
        "isProfessorEnsayo": true,
        "trapExplanation": "El clustering jerárquico no entrega particiones separadas por defecto: genera un dendrograma completo que une el 100% de los elementos en una jerarquía continua anidada. Para obtener grupos se debe aplicar un corte arbitrario.",
        "academicReference": "Murtagh & Contreras (2012) / Observaciones del Profesor",
        "keyTakeaway": "Salida del Jerárquico: Un dendrograma conexo único que anida todos los elementos; no particiones directas sin corte."
    },
    {
        "id": 54,
        "category": "agrupamiento",
        "categoryLabel": "Métodos de Agrupamiento",
        "question": "¿Por qué el Clustering Jerárquico con Quartet Distance generó tres grupos de 1 solo gen y dos macrogrupos gigantes al pedirle 5 grupos?",
        "options": {
            "a": "Por un desbordamiento de memoria volátil provocado por la alta dimensionalidad de la matriz cuadrada de distancias topológicas exportada en TSV.",
            "b": "Porque un corte a una altura global única aísla primero los árboles atípicos (outliers) como grupos individuales y colapsa el resto en macrogrupos densos.",
            "c": "Porque el método aglomerativo eliminó sistemáticamente las bifurcaciones que presentaban valores de soporte estadístico UFBoot inferiores al 95%.",
            "d": "Porque la métrica Quartet Distance genera valores enteros idénticos en todas las comparaciones de árboles, produciendo empates arbitrarios en los cortes."
        },
        "answer": [
            "b"
        ],
        "priority": 2,
        "isTrap": true,
        "isProfessorEnsayo": true,
        "trapExplanation": "Al cortar un dendrograma a un único umbral horizontal para forzar 5 grupos, si existen 3 genes muy divergentes en la periferia, estos absorben 3 cortes aislándose en clusters unitarios (G1=1, G2=1, G5=1), mientras que la masa central de datos queda dividida en solo dos bloques masivos.",
        "academicReference": "Resultados Experimentales de la Tesis / Observaciones del Profesor",
        "keyTakeaway": "Efecto corte jerárquico: Umbral global aísla outliers en clusters unitarios (1 gen) y colapsa la masa principal en macrogrupos."
    },
    {
        "id": 55,
        "category": "agrupamiento",
        "categoryLabel": "Métodos de Agrupamiento",
        "question": "¿Cómo funciona conceptualmente el algoritmo MST-kNN seleccionado como propuesta metodológica central?",
        "options": {
            "a": "Proyecta las dimensiones de los árboles mediante PCA y traza hiperplanos ortogonales de separación para maximizar la varianza inter-clúster explicada.",
            "b": "Construye un Árbol Generador Mínimo sobre el grafo de los k vecinos más cercanos y poda las aristas que no cumplen el criterio de conectividad local mutua.",
            "c": "Optimiza iterativamente la ubicación de centroides geométricos calculando distancias relacionales hasta alcanzar la convergencia del índice de silueta.",
            "d": "Genera permutaciones aleatorias de árboles de expansión y selecciona la topología que minimice simultáneamente el número total de cambios mutacionales."
        },
        "answer": [
            "b"
        ],
        "priority": 2,
        "isTrap": false,
        "isProfessorEnsayo": true,
        "trapExplanation": "MST-kNN combina la conectividad global del Árbol Generador Mínimo (MST) con la proximidad local del grafo k-NN. Al intersectarlos, las aristas que unen regiones con densidades distintas o conexiones débiles se podan, dejando componentes conexas como clústeres automáticos.",
        "academicReference": "Inostroza-Ponta (2008)",
        "keyTakeaway": "MST-kNN: Intersección MST (estructura global) ∩ k-NN (vecindad local) -> Poda de aristas inconsistentes -> Componentes conexas automáticas."
    },
    {
        "id": 56,
        "category": "agrupamiento",
        "categoryLabel": "Métodos de Agrupamiento",
        "question": "¿Cuál es la principal ventaja de MST-kNN sobre el algoritmo basado en densidad DBSCAN en este proyecto?",
        "options": {
            "a": "MST-kNN se adapta a densidades locales heterogéneas, mientras que DBSCAN requiere un radio fijo (ε) que falla cuando conviven módulos densos y dispersos.",
            "b": "MST-kNN es el único método que admite matrices de alineamientos nucleotídicos previamente normalizadas con algoritmos de alineamiento progresivo global.",
            "c": "DBSCAN es formalmente incompatible con matrices relacionales de distancias de árboles y requiere obligatoriamente coordenadas cartesianas euclidianas.",
            "d": "MST-kNN garantiza matemáticamente un índice de silueta medio superior a 0,9 en cualquier conjunto de datos biológicos independientemente del ruido."
        },
        "answer": [
            "a"
        ],
        "priority": 2,
        "isTrap": true,
        "isProfessorEnsayo": true,
        "trapExplanation": "En el genoma conviven complejos compactos (pocos genes muy conservados) y rutas celulares dispersas. DBSCAN usa un radio épsilon global rígido: si es muy bajo envía casi todo a ruido, y si es muy alto colapsa todo en un supergrupo. MST-kNN evalúa vecindades relativas adaptándose a densidades locales.",
        "academicReference": "Inostroza-Ponta (2008) / Ester et al. (1996)",
        "keyTakeaway": "Ventaja de MST-kNN sobre DBSCAN: Capacidad de adaptarse a densidades heterogéneas sin imponer un radio métrico global (ε) rígido."
    },
    {
        "id": 57,
        "category": "validacion",
        "categoryLabel": "Validación y Parámetros",
        "question": "¿Por qué el profesor criticó duramente la forma en que se seleccionaron los valores de 'k' (ej. k=2 hasta k=5) en el ensayo?",
        "options": {
            "a": "Porque los valores impares del parámetro 'k' violan propiedades de conectividad en grafos métricos bipartitos según la teoría de Inostroza-Ponta.",
            "b": "Porque se eligieron 'al ojo' y de forma subjetiva cortando para que los grupos cupieran en el límite de la API de STRING, sin una métrica matemática de calidad.",
            "c": "Porque no se demostró matemáticamente que el parámetro 'k' fuera un número primo relativo con respecto al total de las 471 cepas de levadura evaluadas.",
            "d": "Porque el valor del parámetro 'k' en MST-kNN debe coincidir reglamentariamente con la mitad del número total de árboles génicos ortólogos inferidos."
        },
        "answer": [
            "b"
        ],
        "priority": 2,
        "isTrap": true,
        "isProfessorEnsayo": true,
        "trapExplanation": "El profesor señala que ir achicando grupos para que quepan en STRING es forzar y picar los datos con un criterio artificial. La forma rigurosa es evaluar sistemáticamente diferentes valores de k y justificar el óptimo mediante estabilidad de componentes conexas o métricas de calidad interna.",
        "academicReference": "Grabación Ensayo Defensa / Observaciones del Profesor",
        "keyTakeaway": "Selección de k: Nunca justificar 'para que cupiera en STRING'; debe justificarse con métricas de calidad de partición y estabilidad de componentes."
    },
    {
        "id": 58,
        "category": "validacion",
        "categoryLabel": "Validación y Parámetros",
        "question": "¿Qué métrica matemática interna debió reportarse para evaluar objetivamente la calidad de los agrupamientos obtenidos?",
        "options": {
            "a": "El valor de log-verosimilitud global calculado bajo modelos de sustitución evolutiva en alineamientos.",
            "b": "El Índice de Silueta, que evalúa de forma combinada la homogeneidad interna de los grupos y su separación externa.",
            "c": "El porcentaje global de guaninas y citosinas (%GC) en las regiones codificantes de las cepas de levadura.",
            "d": "La tasa de falsos positivos estimada mediante pruebas de soporte de ramas con remuestreo UFBoot en IQ-TREE."
        },
        "answer": [
            "b"
        ],
        "priority": 2,
        "isTrap": false,
        "isProfessorEnsayo": true,
        "trapExplanation": "Un agrupamiento se juzga internamente por dos fuerzas contrapuestas: cohesión/homogeneidad interna (qué tan cercanos están los genes del mismo clúster) y separación externa (qué tan alejados están de otros grupos). El Índice de Silueta (Rousseeuw 1987) sintetiza ambas en [-1, 1].",
        "academicReference": "Rousseeuw (1987) / Métricas de Validación Interna",
        "keyTakeaway": "Métrica interna clave: Índice de Silueta (cohesión intra-cluster vs separación inter-cluster en [-1, 1])."
    },
    {
        "id": 59,
        "category": "validacion",
        "categoryLabel": "Validación y Parámetros",
        "question": "¿Por qué el 'PPI enrichment p-value' obtenido de la plataforma STRING no constituye una validación estructural del clustering?",
        "options": {
            "a": "Porque la plataforma STRING indexa exclusivamente interacciones de organismos modelo superiores como mamíferos, careciendo de información sobre hongos como levaduras.",
            "b": "Porque evalúa si las proteínas comparten más interacciones conocidas de lo esperado por azar, lo cual depende de la literatura previa y no de la geometría del agrupamiento.",
            "c": "Porque STRING trunca automáticamente los cálculos a cero cuando el conjunto de genes ortólogos consultados supera el umbral computacional de cien proteínas en la API.",
            "d": "Porque el cálculo de enriquecimiento en STRING exige obligatoriamente que las topologías filogenéticas hayan sido construidas bajo el criterio de Máxima Parsimonia."
        },
        "answer": [
            "b"
        ],
        "priority": 2,
        "isTrap": true,
        "isProfessorEnsayo": true,
        "trapExplanation": "STRING evalúa coherencia biológica externa frente a lo que se ha investigado en laboratorio previamente. Si un grupo no tiene enriquecimiento significativo, puede deberse a falta de literatura previa y no a que el clustering matemático haya fallado; por eso se debe separar validación estructural de biológica.",
        "academicReference": "Szklarczyk et al. (2021) / Discusión Metodológica",
        "keyTakeaway": "STRING es validación biológica externa (depende del sesgo de literatura previa), NO validación estructural geométrica del clustering."
    },
    {
        "id": 60,
        "category": "validacion",
        "categoryLabel": "Validación y Parámetros",
        "question": "¿Cuál es la función del modelo nulo por permutaciones implementado en la fase de validación de los módulos funcionales?",
        "options": {
            "a": "Sustituir estocásticamente las bases nucleotídicas por caracteres aleatorios en los alineamientos antes de inferir los árboles filogenéticos génicos.",
            "b": "Generar 1.000 agrupamientos aleatorios de igual tamaño para demostrar empíricamente que la conectividad observada en los módulos no es producto del azar.",
            "c": "Permutar aleatoriamente las filas y columnas de la matriz de distancias topológicas hasta forzar un valor de disimilitud máximo equivalente a 936.",
            "d": "Eliminar el diez por ciento de los genes más divergentes para normalizar la varianza y acelerar el tiempo de convergencia de las componentes conexas."
        },
        "answer": [
            "b"
        ],
        "priority": 1,
        "isTrap": false,
        "isProfessorEnsayo": true,
        "trapExplanation": "Para validar estadísticamente que un módulo encontrado no es un agrupamiento casual, se contrasta su puntaje biológico contra la distribución empírica de 1.000 grupos de genes del mismo tamaño seleccionados al azar del mismo genoma.",
        "academicReference": "Sección de Validación y Pruebas de Hipótesis",
        "keyTakeaway": "Modelo nulo por permutaciones: 1.000 conjuntos aleatorios de igual tamaño para probar significancia estadística contra el azar."
    },
    {
        "id": 61,
        "category": "visualizacion",
        "categoryLabel": "Visualización y Proyección",
        "question": "¿Por qué es conceptualmente erróneo afirmar que una proyección MDS es mejor porque su nube de puntos se ve 'menos esférica y más natural'?",
        "options": {
            "a": "Porque la forma visual de la proyección depende de la distorsión al reducir dimensiones; la calidad debe medirse objetivamente con el Stress de Kruskal.",
            "b": "Porque en biología computacional las distribuciones de genes ortólogos en espacios euclidianos proyectados deben conformar esferas perfectas por definición.",
            "c": "Porque los algoritmos de reducción dimensional como MDS normalizan automáticamente las coordenadas para forzar simetría radial en todas las visualizaciones.",
            "d": "Porque la esfericidad geométrica de una nube 2D solo tiene significado matemático si las distancias originales provienen del método Neighbor Joining."
        },
        "answer": [
            "a"
        ],
        "priority": 2,
        "isTrap": true,
        "isProfessorEnsayo": true,
        "trapExplanation": "No se puede juzgar un método 'al ojo' por cómo se ve la gráfica 2D. Proyectar una matriz de miles de dimensiones en 2 dimensiones genera una inevitable pérdida de información que debe medirse formalmente con el valor de Stress de Kruskal o Diagrama de Shepard.",
        "academicReference": "Kruskal (1964) / Observaciones del Profesor",
        "keyTakeaway": "MDS no se evalúa al ojo: La distorsión dimensional se mide formalmente con el Stress de Kruskal o Diagrama de Shepard."
    },
    {
        "id": 62,
        "category": "defensa_actitud",
        "categoryLabel": "Estrategia y Actitud en Defensa",
        "question": "Si un miembro de la comisión te pregunta: '¿Por qué eligió este umbral o este método?', ¿qué respuesta debes EVITAR a toda costa?",
        "options": {
            "a": "Explicar el fundamento algorítmico y respaldarlo con citas formales de la literatura bioinformática.",
            "b": "Reconocer las limitaciones técnicas del método y fundamentar según las propiedades de los datos analizados.",
            "c": "Responder: 'Porque el profesor guía me dijo que lo pusiera así' o 'porque era lo que necesitaba el trabajo'.",
            "d": "Pausar unos segundos, beber agua para serenarse y responder con calma la justificación matemática precisa."
        },
        "answer": [
            "c"
        ],
        "priority": 2,
        "isTrap": true,
        "isProfessorEnsayo": true,
        "trapExplanation": "Responder 'porque me dijeron' o dar evasivas circulares denota falta de dominio, inseguridad y desaprobación inmediata; ante la comisión se debe argumentar siempre con fundamentos matemáticos y referencias bibliográficas.",
        "academicReference": "Recomendaciones Docentes para la Defensa de Tesis",
        "keyTakeaway": "Regla capital de defensa: NUNCA digas 'porque mi profesor me dijo'. Argumenta siempre con fundamentos matemáticos y bibliográficos."
    },
    {
        "id": 63,
        "category": "defensa_actitud",
        "categoryLabel": "Estrategia y Actitud en Defensa",
        "question": "¿Qué recomendación dio el profesor para enfrentar momentos de tensión o preguntas complejas durante la defensa?",
        "options": {
            "a": "Interrumpir al evaluador antes de que concluya para evitar que formule cuestionamientos metodológicos más rigurosos.",
            "b": "Aceptar inmediatamente que el resultado contiene un error insalvable y solicitar continuar con la siguiente lámina.",
            "c": "Hacer una pausa estratégica, beber un sorbo de agua o pedir que reiteren la pregunta para ganar 30 segundos y ordenar ideas.",
            "d": "Improvisar fórmulas matemáticas complejas en la pizarra aunque no tengan relación directa con el problema expuesto."
        },
        "answer": [
            "c"
        ],
        "priority": 1,
        "isTrap": false,
        "isProfessorEnsayo": true,
        "trapExplanation": "El profesor aconseja escuchar activamente, no ponerse a la defensiva, tomarse una pausa breve tomando agua para calmar el ritmo cardíaco y ordenar los conceptos antes de responder de forma pausada y fundamentada.",
        "academicReference": "Consejos Prácticos del Profesor Evaluador",
        "keyTakeaway": "Táctica de control emocional: Pausa estratégica con agua para calmar la adrenalina y estructurar mentalmente una respuesta sólida."
    },
    {
        "id": 64,
        "category": "kdd",
        "categoryLabel": "Metodología KDD & Fases",
        "question": "De acuerdo con el mapa conceptual de la tesis, ¿por qué se descartó la metodología CRISP-DM frente a KDD?",
        "options": {
            "a": "Porque CRISP-DM prioriza el entendimiento del negocio y un despliegue comercial que no aplican al descubrimiento directo sobre árboles génicos.",
            "b": "Porque CRISP-DM prohíbe ejecutar etapas de limpieza previa sobre matrices simétricas de distancias topológicas calculadas en formato numérico.",
            "c": "Porque CRISP-DM exige formular un experimento controlado en laboratorio húmedo antes de procesar cualquier archivo de secuencias en Python.",
            "d": "Porque CRISP-DM solo soporta algoritmos supervisados de clasificación con etiquetas previas, impidiendo aplicar clustering no supervisado en grafos."
        },
        "answer": [
            "a"
        ],
        "priority": 2,
        "isTrap": false,
        "isInformaticaFocus": true,
        "trapExplanation": "CRISP-DM centra su fase inicial en el 'Business Understanding' (entendimiento del negocio y retorno comercial). Aquí no se modela un negocio sino patrones evolutivos en datos genómicos, por lo que KDD va directo a la minería de datos.",
        "academicReference": "Mapa Conceptual Actualizado / Memoria (Sección 1.5.1)",
        "keyTakeaway": "CRISP-DM exige entendimiento del negocio; KDD va directo al descubrimiento de patrones mediante minería de datos."
    },
    {
        "id": 65,
        "category": "kdd",
        "categoryLabel": "Metodología KDD & Fases",
        "question": "¿Cuál es la razón metodológica para descartar el enfoque Hipotético-Deductivo frente a KDD en esta investigación?",
        "options": {
            "a": "No existe un algoritmo determinista capaz de verificar hipótesis evolutivas sobre archivos en formato PHYLIP sin paralelismo.",
            "b": "No hay un experimento empírico controlado para formular hipótesis previas, pues se buscan patrones ocultos directo en los datos.",
            "c": "No permite comparar matrices de disimilitud generadas por tqDist cuando el número de taxones supera el umbral de cien cepas.",
            "d": "No admite el uso de pruebas estadísticas no paramétricas como Mann-Whitney o Kruskal-Wallis en la etapa final de evaluación."
        },
        "answer": [
            "b"
        ],
        "priority": 1,
        "isTrap": false,
        "isInformaticaFocus": true,
        "trapExplanation": "El método hipotético-deductivo parte de un diseño experimental para contrastar hipótesis causales formuladas a priori. Esta tesis es exploratoria y computacional sobre datos ya secuenciados, encajando naturalmente en KDD.",
        "academicReference": "Mapa Conceptual Actualizado / Memoria (Sección 1.4.3 y 1.5.1)",
        "keyTakeaway": "Sin experimento físico para plantear hipótesis a priori, KDD permite descubrir conocimiento inductivo directo desde los datos."
    },
    {
        "id": 66,
        "category": "kdd",
        "categoryLabel": "Metodología KDD & Fases",
        "question": "Al comparar Máxima Verosimilitud (3.806 genes) frente a Neighbor Joining (5.565 genes), ¿cómo se evitó el sesgo de tamaño muestral?",
        "options": {
            "a": "Se duplicaron aleatoriamente las filas de la matriz de ML mediante sobremuestreo sintético hasta igualar la dimensión de 5.565 genes.",
            "b": "Se compararon directamente las matrices de distinta dimensión normalizando cada distancia topológica por el logaritmo de su cantidad.",
            "c": "Se podó la matriz de Neighbor Joining para conservar exactamente los mismos 3.806 genes validados que superaron los filtros de ML.",
            "d": "Se aplicó un análisis de componentes principales sobre ambas matrices para proyectarlas a un espacio común de trescientas variables."
        },
        "answer": [
            "c"
        ],
        "priority": 2,
        "isTrap": true,
        "isInformaticaFocus": true,
        "trapExplanation": "¡Cuidado con comparar universos dispares! Con 3.806 vs 5.565 genes habría un sesgo de confusión por secuencias cortas o con gaps en NJ. Fijando QD y MST-kNN (k=2), se podó NJ al universo exacto de 3.806 genes para evaluar Silueta limpiamente.",
        "academicReference": "Mapa Conceptual / Memoria (Sección 3.4.3, Tabla 3.20)",
        "keyTakeaway": "Comparación justa: tras fijar QD y MST-kNN, se poda NJ al universo exacto de 3.806 genes de ML antes de medir Silueta."
    },
    {
        "id": 67,
        "category": "preprocesamiento",
        "categoryLabel": "Preprocesamiento & Filtro SNPs",
        "question": "¿Cuál fue la estructura exacta de los datos de entrada recibidos desde el LGM y qué validación programática se aplicó en Python?",
        "options": {
            "a": "Fueron 5.574 archivos FASTQ crudos sometidos a ensamblaje de novo y llamado de variantes (variant calling) contra un genoma de referencia.",
            "b": "Fueron 5.574 archivos VCF individuales validados mediante tablas hash para descartar mutaciones sinónimas antes de alinear las cepas.",
            "c": "Fueron 5.574 grafos en formato GEXF exportados desde STRING para verificar que cada gen ortólogo conservara sus interacciones previas.",
            "d": "Fueron 5.574 alineamientos PHYLIP de SNPs concatenados cuya extensión, peso > 0 KB, cabecera de 471 cepas y longitud real se verificaron."
        },
        "answer": [
            "d"
        ],
        "priority": 1,
        "isTrap": false,
        "isInformaticaFocus": true,
        "trapExplanation": "La tesis NO realiza variant calling sobre FASTQ/VCF crudos. Recibe 5.574 alineamientos .phylip de SNPs concatenados por gen y ejecuta un script de validación de 3 pasos (archivo/peso, cabecera y coincidencia exacta de longitud), logrando 0 errores.",
        "academicReference": "Memoria (Sección 1.3 y Sección 3.2, Tablas 3.1-3.3)",
        "keyTakeaway": "Entrada: 5.574 .phylip de SNPs concatenados (sin variant calling), validados en extensión, cabecera y longitud exacta (0 fallos)."
    },
    {
        "id": 68,
        "category": "preprocesamiento",
        "categoryLabel": "Preprocesamiento & Filtro SNPs",
        "question": "¿Qué fundamento combinatorio respalda fijar el umbral mínimo de longitud en ≥ 70 pb para un árbol no enraizado de n = 471 cepas?",
        "options": {
            "a": "Un árbol bifurcado de 471 hojas posee n − 3 = 468 ramas internas; con < 70 pb más del 85% de la topología carece de soporte directo.",
            "b": "El algoritmo de IQ-TREE 2 requiere por especificación de memoria al menos 70 bytes contiguos para inicializar cada hebra de CPU.",
            "c": "La métrica Robinson-Foulds arroja división por cero cuando el largo de la secuencia es inferior a la raíz cuadrada de las 471 cepas.",
            "d": "El modelo evolutivo GTR+G necesita exactamente 70 pares de bases por cada parámetro libre de la matriz de tasas de sustitución."
        },
        "answer": [
            "a"
        ],
        "priority": 2,
        "isTrap": false,
        "isInformaticaFocus": true,
        "trapExplanation": "Un árbol no enraizado bifurcado de n=471 hojas tiene n-3 = 468 ramas internas. Secuencias < 70 pb dejan >85% de biparticiones sin soporte directo de SNPs, degradando ML frente a homoplasias estocásticas; ≥ 70 pb elimina el pico ruidoso (moda 8 pb) reteniendo 76,8% del genoma.",
        "academicReference": "Memoria (Sección 3.2, Figura 3.2)",
        "keyTakeaway": "471 hojas implican n-3 = 468 ramas internas; < 70 pb deja >85% sin soporte directo, y ≥ 200 pb mutilaría >50% del genoma."
    },
    {
        "id": 69,
        "category": "preprocesamiento",
        "categoryLabel": "Preprocesamiento & Filtro SNPs",
        "question": "Según el embudo de filtrado actualizado (Tabla 3.7 y Mapa Conceptual), ¿cómo se pasa de 5.574 genes iniciales a 3.806 árboles en ML?",
        "options": {
            "a": "Se descartan 469 genes por longitud menor a 70 pb, 1.292 por falta de variación genética y 7 por superar el límite de 2.000 hojas.",
            "b": "Se descartan 1.292 por longitud < 70 pb, 469 por cepas solo con gaps (-) y 7 por fallos de convergencia en IQ-TREE 2 (3.806 válidos).",
            "c": "Se descartan 1.292 por secuencias vacías en NJ, 469 por errores de cabecera PHYLIP y 7 por generar ramas negativas en Biopython.",
            "d": "Se descartan 9 genes por longitud menor a 70 pb, 1.292 por homoplasias en GTR+G y 467 por saturar la distancia de Robinson-Foulds."
        },
        "answer": [
            "b"
        ],
        "priority": 2,
        "isTrap": false,
        "isInformaticaFocus": true,
        "trapExplanation": "Embudo exacto de ML: 5.574 iniciales − 1.292 (< 70 pb) = 4.282 − 469 (cepas compuestas enteramente de gaps '-') = 3.813 − 7 fallos de convergencia en IQ-TREE 2 (RVB1, YCK1, RFT1, FKS3, SPS22, DHR2, MUP1) = 3.806 árboles. NJ solo descarta 9 sin variación = 5.565.",
        "academicReference": "Mapa Conceptual Actualizado / Memoria (Sección 3.2, Tablas 3.4-3.7)",
        "keyTakeaway": "5.574 − 1.292 (<70 pb) − 469 (cepas con solo gaps) − 7 (fallos IQ-TREE) = 3.806 árboles ML; NJ conserva 5.565 (−9 sin variación)."
    },
    {
        "id": 70,
        "category": "preprocesamiento",
        "categoryLabel": "Preprocesamiento & Filtro SNPs",
        "question": "¿Qué falla matemática empírica demostró el conjunto 'ML de Control' (sin filtro de longitud ni gaps) al calcular la matriz Robinson-Foulds?",
        "options": {
            "a": "Colapsó la memoria RAM de 16 GB durante la lectura en Python porque los archivos .treefile duplicaron sus paréntesis de cierre Newick.",
            "b": "Produjo una matriz completamente nula llena de ceros debido a que IQ-TREE 2 reemplazó las cepas con gaps por el árbol estrella sin ramas.",
            "c": "Generó 785 árboles con menos de 471 hojas al eliminar secuencias vacías, rompiendo la normalización y disparando el máximo RF a 1.876.",
            "d": "Redujo artificialmente la distancia máxima de Robinson-Foulds desde 936 hasta 120 al podar las biparticiones con soporte menor al 95%."
        },
        "answer": [
            "c"
        ],
        "priority": 2,
        "isTrap": true,
        "isInformaticaFocus": true,
        "trapExplanation": "Sin el filtro de gaps, IQ-TREE descartó cepas vacías generando 785 árboles incompletos (< 471 hojas, hasta de 120 cepas). Al comparar árboles de distinto número de hojas, RF perdió su cota combinatoria 2n-6=936 y alcanzó un valor inválido de 1.876.",
        "academicReference": "Memoria (Sección 3.3 y 3.4.1, Tablas 3.10 y 3.13)",
        "keyTakeaway": "Validación empírica del preprocesamiento: sin filtrar gaps surgieron 785 árboles < 471 hojas y un RF espurio de 1.876 (> 936)."
    },
    {
        "id": 71,
        "category": "ingenieria",
        "categoryLabel": "Ingeniería, Pipeline & Cómputo",
        "question": "En la orquestación Bash del pipeline, ¿por qué IQ-TREE 2 y RF permitieron checkpoints (jornadas de 8 h) mientras tqDist exigió ejecución continua?",
        "options": {
            "a": "Porque IQ-TREE 2 opera en lenguaje Python interpretado con persistencia nativa, mientras tqDist depende de hilos efímeros de Scikit-learn.",
            "b": "Porque tqDist cifra su archivo binario temporal en GPU y destruye el estado del cálculo si el proceso recibe una señal SIGTERM del kernel.",
            "c": "Porque el formato .nwk utilizado en Quartet Distance no admite escritura incremental de filas hasta finalizar las cuatro etapas del KDD.",
            "d": "Porque IQ-TREE 2 escribe cada árbol y fila de forma independiente en disco, mientras all_pairs_quartet_dist carga todo el bosque en RAM."
        },
        "answer": [
            "d"
        ],
        "priority": 2,
        "isTrap": false,
        "isInformaticaFocus": true,
        "trapExplanation": "La inferencia ML y las filas RF son embarazosamente paralelas e independientes por archivo/árbol, permitiendo checkpoints en Bash. En cambio, all_pairs_quartet_dist (tqDist) carga todo el archivo combinado en RAM para el cruce C++ todos-contra-todos sin checkpoints.",
        "academicReference": "Memoria (Sección 3.3 y Sección 3.4.1)",
        "keyTakeaway": "IQ-TREE y RF permiten checkpoints por procesar ítems independientes; tqDist carga todo el bosque en RAM en una sola corrida."
    },
    {
        "id": 72,
        "category": "ingenieria",
        "categoryLabel": "Ingeniería, Pipeline & Cómputo",
        "question": "Desde la ingeniería de rendimiento, ¿por qué el script Bash invocó `iqtree2` con el flag `-quiet` y `-nt AUTO` en la estación de 6 núcleos?",
        "options": {
            "a": "Para suprimir registros en consola evitando cuellos de botella de entrada/salida (I/O overhead) y aprovechar los 6 núcleos disponibles.",
            "b": "Para comprimir automáticamente los archivos .treefile en formato binario y asignar memoria virtual swap cuando los 16 GB se agotan.",
            "c": "Para desactivar la validación de cabeceras PHYLIP dentro de IQ-TREE y forzar el cálculo determinista de distancias p sin optimización.",
            "d": "Para reducir de 1.000 a 100 las réplicas de Ultrafast Bootstrap cuando la longitud del gen supera el máximo empírico de 1.486 pb."
        },
        "answer": [
            "a"
        ],
        "priority": 1,
        "isTrap": false,
        "isInformaticaFocus": true,
        "trapExplanation": "Al ejecutar miles de corridas consecutivas, imprimir logs continuos en stdout genera overhead de I/O; `-quiet` silencia IQ-TREE y delega el progreso al script Bash, mientras `-nt AUTO` asigna automáticamente los 6 hilos de la CPU.",
        "academicReference": "Memoria (Sección 3.3 y 3.4.1)",
        "keyTakeaway": "`-quiet` evita cuellos de botella por I/O en miles de ejecuciones; `-nt AUTO` satura paralelamente los 6 núcleos."
    },
    {
        "id": 73,
        "category": "ingenieria",
        "categoryLabel": "Ingeniería, Pipeline & Cómputo",
        "question": "¿Qué optimización matemática aprovecha `tqDist` al computar Quartet Distance y qué transformación posterior exige Scikit-learn/SciPy?",
        "options": {
            "a": "Almacena únicamente la diagonal principal y los 5 vecinos más cercanos en formato disperso CSR para reducir un 90% el uso de memoria.",
            "b": "Calcula solo una matriz triangular superior aprovechando la simetría d(A,B)=d(B,A), la cual Bash desdobla en matriz cuadrada ortogonal.",
            "c": "Proyecta los árboles directamente a coordenadas euclidianas 2D en C++ para evitar la construcción de matrices de disimilitud completas.",
            "d": "Agrupa los cuartetos idénticos mediante tablas hash distribuidas en disco y exporta grafos pre-podados compatibles con STRING."
        },
        "answer": [
            "b"
        ],
        "priority": 2,
        "isTrap": false,
        "isInformaticaFocus": true,
        "trapExplanation": "Aprovechando la simetría métrica d(A,B) = d(B,A), tqDist (en C++) calcula y exporta una matriz triangular ahorrando 50% de cómputo. Luego, el orquestador Bash ejecuta una subrutina de desdoblamiento a matriz cuadrada N×N simétrica para Scikit-learn y SciPy.",
        "academicReference": "Memoria (Sección 3.4.1)",
        "keyTakeaway": "tqDist exporta solo matriz triangular (50% ahorro); Bash la desdobla a matriz cuadrada N×N para Scikit-learn/SciPy."
    },
    {
        "id": 74,
        "category": "ingenieria",
        "categoryLabel": "Ingeniería, Pipeline & Cómputo",
        "question": "De las ~185 horas (11.101 min) totales de cómputo en el Intel i5-9400F (6 núcleos, 16 GB RAM), ¿qué revela el desglose de tiempos sobre la escalabilidad?",
        "options": {
            "a": "El clustering MST-kNN y las proyecciones MDS consumieron el 75% del tiempo total, evidenciando que O(n² log n) es el cuello de botella.",
            "b": "La validación en STRING y el modelo nulo de 1.000 permutaciones concentraron 140 horas debido a la latencia de red en las consultas API.",
            "c": "La inferencia, UFBoot y matrices de distancia tomaron 99,6% del tiempo (11.057 min), mientras clustering y MDS tomaron apenas 44 min.",
            "d": "El cálculo de matrices Robinson-Foulds triplicó en tiempo al de Quartet Distance debido a la falta de optimización multihilo en IQ-TREE 2."
        },
        "answer": [
            "c"
        ],
        "priority": 2,
        "isTrap": false,
        "isInformaticaFocus": true,
        "trapExplanation": "Desglose exacto (Sección 4.2): Inferencia 4.592 min (76,5h) + UFBoot 2.522 min (42h) + Matrices RF/QD 3.943 min (65,7h) = 11.057 min (99,6%), mientras Clustering + MDS fueron solo 44 min (0,4%). Escalar a HPC/GPU apunta directamente a inferencia y matrices.",
        "academicReference": "Memoria (Sección 4.2 y Sección 4.3)",
        "keyTakeaway": "Cuello de botella real: inferencia (4.592 m), matrices (3.943 m) y UFBoot (2.522 m) = 99,6% de 185 h; clustering+MDS solo 44 min."
    },
    {
        "id": 75,
        "category": "ingenieria",
        "categoryLabel": "Ingeniería, Pipeline & Cómputo",
        "question": "En la arquitectura de software del proyecto, ¿qué responsabilidad específica cumple SciPy que la diferencia de Scikit-learn y Biopython?",
        "options": {
            "a": "Leer los alineamientos PHYLIP y construir los árboles heurísticos Neighbor Joining mediante el módulo TreeConstruction basado en p-distance.",
            "b": "Ejecutar la inferencia probabilística de Máxima Verosimilitud bajo el modelo GTR+G con soporte de remuestreo Ultrafast Bootstrap.",
            "c": "Calcular en C++ nativo los cuartetos consensuados y no consensuados mediante la función optimizada all_pairs_quartet_dist en RAM.",
            "d": "Implementar las pruebas de Spearman, Kruskal-Wallis y Mann-Whitney U, además de clustering jerárquico robusto ante matrices degeneradas."
        },
        "answer": [
            "d"
        ],
        "priority": 1,
        "isTrap": false,
        "isInformaticaFocus": true,
        "trapExplanation": "Cada librería tiene un rol claro (Sección 1.5.3): IQ-TREE 2 (ML/UFBoot/RF), tqDist (QD en C++), Biopython (NJ y lectura/validación Newick), Scikit-learn (DBSCAN y consistencia k-NN), Pandas (gestión de matrices) y SciPy (dendrogramas/matrices degeneradas y pruebas estadísticas).",
        "academicReference": "Memoria (Sección 1.5.3, 3.4.1 y 3.5.4)",
        "keyTakeaway": "SciPy aporta pruebas estadísticas no paramétricas (Spearman, Kruskal-Wallis, Mann-Whitney) y manejo de matrices degeneradas."
    },
    {
        "id": 76,
        "category": "inferencia",
        "categoryLabel": "Inferencia Filogenética",
        "question": "Según el mapa conceptual, ¿qué dos criterios dejaron fuera a Máxima Parsimonia e Inferencia Bayesiana antes de la etapa experimental?",
        "options": {
            "a": "Se exigía un método que genere un único árbol sin información previa: Parsimonia ignora modelos y sufre LBA; Bayes genera >1 árbol con priors.",
            "b": "Se exigía compatibilidad nativa con Biopython para exportar .nwk; ambos formatos propietarios impedían su lectura en el pipeline tqDist.",
            "c": "Se exigía una complejidad asintótica menor a O(n²); ambos métodos superaban el límite de memoria RAM de 16 GB al procesar 3.806 genes.",
            "d": "Se exigía optimizar verosimilitudes bajo GTR+G con p-distances aditivas; ninguno de los dos enfoques admite secuencias nucleotídicas SNP."
        },
        "answer": [
            "a"
        ],
        "priority": 2,
        "isTrap": false,
        "isInformaticaFocus": true,
        "trapExplanation": "Criterio del Mapa Conceptual: 'se necesita un método que no requiera información previa de la población y que genere un solo árbol'. Parsimonia ignora modelos de sustitución y sufre Atracción de Ramas Largas (LBA); Bayes necesita priors y genera una muestra (>1 árbol) vía MCMC.",
        "academicReference": "Mapa Conceptual Actualizado / Memoria (Sección 2.1.3 y 3.1)",
        "keyTakeaway": "Filtro de inferencia: sin priors y 1 solo árbol. MP ignora modelos y sufre LBA; Bayes usa priors y genera >1 árbol."
    },
    {
        "id": 77,
        "category": "inferencia",
        "categoryLabel": "Inferencia Filogenética",
        "question": "¿Qué aporta el modelo `GTR+G` en IQ-TREE 2 y qué limitación empírica evidenció la auditoría con Ultrafast Bootstrap (`-B 1000`)?",
        "options": {
            "a": "GTR+G fija tasas de mutación idénticas en todo el gen; UFBoot arrojó 95% de ramas altamente confiables gracias a la baja divergencia.",
            "b": "GTR+G modela sustituciones reversibles y heterogeneidad Gamma de tasas; solo 32,78% de ramas superó UFBoot ≥ 95% por baja densidad de SNPs.",
            "c": "GTR+G aplica un reloj molecular estricto enraizado; UFBoot descartó el 67,22% de los árboles ML por tener longitudes de rama negativas.",
            "d": "GTR+G reemplaza las secuencias con gaps mediante imputación bayesiana; UFBoot demostró que el conjunto de control superó al conjunto filtrado."
        },
        "answer": [
            "b"
        ],
        "priority": 2,
        "isTrap": true,
        "isInformaticaFocus": true,
        "trapExplanation": "GTR (General Time Reversible) permite tasas variables entre pares de bases y +G (Gamma) modela distintas velocidades de mutación por sitio. Con UFBoot (-B 1000), solo 32,78% de las 631.541 ramas alcanzó ≥95% (vs 18,30% en Control): honestamente, la señal de SNPs por gen individual es moderada.",
        "academicReference": "Memoria (Sección 3.3, Tabla 3.9)",
        "keyTakeaway": "GTR+G da realismo evolutivo, pero solo 32,78% de ramas superó UFBoot ≥ 95%, justificando analizar el bosque vía QD y no un árbol aislado."
    },
    {
        "id": 78,
        "category": "inferencia",
        "categoryLabel": "Inferencia Filogenética",
        "question": "Al validar los 5.565 árboles de Neighbor Joining en Python, 79 presentaron ramas negativas infinitesimales (ej. `-0,00477`). ¿Cuál es su causa y efecto?",
        "options": {
            "a": "Es un desbordamiento numérico de Biopython al leer cabeceras PHYLIP, obligando a descartar los 79 árboles antes de calcular la matriz RF.",
            "b": "Es un error de convergencia del modelo GTR+G en genes conservados, lo que invierte el orden topológico de las hojas en el archivo Newick.",
            "c": "Es un artefacto matemático esperado cuando p-distances cercanas no ajustan una matriz aditiva; al ser casi nulas no alteran la topología.",
            "d": "Es una restricción de tqDist que codifica las politomías no resueltas como ramas negativas para diferenciarlas de las ramas terminales."
        },
        "answer": [
            "c"
        ],
        "priority": 1,
        "isTrap": false,
        "isInformaticaFocus": true,
        "trapExplanation": "En NJ, cuando distancias genéticas reales entre cepas muy próximas no cumplen exactamente la condición de aditividad de árbol, la resta algebraica produce ramas negativas mínimas (−0,00477 a −6×10⁻⁵). Como RF y QD son puramente topológicas (sin largo de rama), la topología sigue siendo válida.",
        "academicReference": "Memoria (Sección 3.3, Tabla 3.11)",
        "keyTakeaway": "Ramas negativas infinitesimales en 79 árboles NJ surgen por no-aditividad de p-distances cercanas y no alteran la topología."
    },
    {
        "id": 79,
        "category": "inferencia",
        "categoryLabel": "Inferencia Filogenética",
        "question": "Tras fijar QD y MST-kNN (`k = 2`) sobre los mismos 3.806 genes, ¿qué métrica inclinó la balanza definitiva a favor de ML frente a NJ?",
        "options": {
            "a": "El número total de clústeres colapsó a 3 grupos bien separados en ML mientras que NJ se fragmentó en 467 pares aislados sin estructura.",
            "b": "El Estrés-1 de Kruskal fue significativamente menor en ML (21,4% frente a 48,9% en NJ), eliminando toda distorsión en la proyección MDS.",
            "c": "El tiempo total de ejecución fue tres veces menor en ML (904 minutos frente a 2.938 minutos en NJ) gracias al flag -nt AUTO en IQ-TREE.",
            "d": "El Coeficiente de Silueta fue superior en ML (−0,0604 frente a −0,0783 en NJ), quedando ~30% más cerca de la cohesión positiva."
        },
        "answer": [
            "d"
        ],
        "priority": 2,
        "isTrap": true,
        "isInformaticaFocus": true,
        "trapExplanation": "¡Ojo con los números! NJ tuvo menor tiempo (904 vs 2.938 min) y ligeramente menor Stress-1 MDS (33,7% vs 36,8%), PERO en el universo homogéneo de 3.806 genes ML obtuvo mejor Silueta (−0,0604 vs −0,0783), indicando estructura topológica ~30% más coherente.",
        "academicReference": "Mapa Conceptual / Memoria (Sección 3.4.3, Tabla 3.20)",
        "keyTakeaway": "ML ganó a NJ por Coeficiente de Silueta (−0,0604 vs −0,0783) en el universo podado de 3.806 genes, pese a mayor costo de cómputo."
    },
    {
        "id": 80,
        "category": "distancia",
        "categoryLabel": "Métricas de Distancia",
        "question": "En el mapa conceptual, ¿por qué se descartaron *Path Length Difference* (PLD) y *Quadratic Path Difference* (QPD) al exigir métricas sin longitud de ramas?",
        "options": {
            "a": "PLD separa genes homólogos por distintas tasas de mutación y QPD al elevar longitudes al cuadrado sobrepenaliza ramas largas y ruido.",
            "b": "PLD exige árboles estrictamente enraizados y QPD requiere calcular matrices de covarianza que escalan en tiempo exponencial NP-hard.",
            "c": "PLD solo opera sobre árboles binarios de máximo 50 taxones y QPD colapsa al saturarse en la cota combinatoria exacta de 2n − 6 = 936.",
            "d": "PLD ignora las biparticiones internas del formato Newick y QPD convierte las distancias topológicas en probabilidades a priori bayesianas."
        },
        "answer": [
            "a"
        ],
        "priority": 2,
        "isTrap": false,
        "isInformaticaFocus": true,
        "trapExplanation": "Exactamente como detalla el mapa conceptual: PLD compara distancias de caminos entre hojas (separando erróneamente genes homólogos solo por diferencias en tasas de mutación), mientras QPD eleva las longitudes de rama al cuadrado, sobrepenalizando ramas largas y magnificando ruido/artefactos.",
        "academicReference": "Mapa Conceptual Actualizado",
        "keyTakeaway": "PLD confunde tasa de mutación con divergencia topológica; QPD eleva longitudes al cuadrado amplificando ramas largas y ruido."
    },
    {
        "id": 81,
        "category": "distancia",
        "categoryLabel": "Métricas de Distancia",
        "question": "Además de usar información vinculada a la raíz, ¿qué otro sesgo estructural técnico invalidó la métrica Kendall-Colijn según el mapa conceptual?",
        "options": {
            "a": "Su complejidad algorítmica es cúbica respecto al número de cuartetos posibles y solo admite alineamientos proteicos validados en STRING.",
            "b": "Su cálculo exige conocer una raíz fija (árboles enraizados) y resulta fuertemente sesgado por el balance o simetría geométrica del árbol.",
            "c": "Su valor máximo teórico diverge hacia el infinito cuando dos árboles presentan una única politomía estrella en sus nodos terminales.",
            "d": "Su implementación estándar en Scikit-learn prohíbe matrices con valores enteros y exige normalización previa mediante distancia euclidiana."
        },
        "answer": [
            "b"
        ],
        "priority": 1,
        "isTrap": false,
        "isInformaticaFocus": true,
        "trapExplanation": "Dos argumentos técnicos del mapa conceptual contra Kendall-Colijn: 1) exige árboles estrictamente enraizados (nuestros árboles son unrooted), y 2) su cálculo está fuertemente sesgado por el balance del árbol (topologías tipo peine vs simétricas).",
        "academicReference": "Mapa Conceptual Actualizado",
        "keyTakeaway": "Kendall-Colijn queda descartada por exigir árboles enraizados y sufrir fuerte sesgo ante el desbalance topológico del árbol."
    },
    {
        "id": 82,
        "category": "distancia",
        "categoryLabel": "Métricas de Distancia",
        "question": "¿Cómo se validó matemáticamente la matriz de Quartet Distance (`n = 471`) y qué significa el máximo observado de ~`1,334 × 10⁹` en ML?",
        "options": {
            "a": "El máximo teórico es 2n−6 = 936×10⁶; observar 1,334×10⁹ evidencia un desbordamiento entero de 32 bits en las rutinas de tqDist.",
            "b": "El máximo combinatorio es 471³ = 104.487.111; observar 1,334×10⁹ demuestra que un 85% de los cuartetos quedaron en estrella sin resolver.",
            "c": "El máximo combinatorio es C(471,4) = 2.024.539.335; observar 1,334×10⁹ (~65,9%) valida el rango y refleja la cota aleatoria de 2/3.",
            "d": "El máximo teórico equivale a 3^(471); el valor observado de 1,334×10⁹ confirma que todos los genes comparten exactamente el mismo árbol."
        },
        "answer": [
            "c"
        ],
        "priority": 2,
        "isTrap": false,
        "isInformaticaFocus": true,
        "trapExplanation": "C(471,4) = (471×470×469×468)/24 = 2.024.539.335 cuartetos. Ninguna distancia superó este límite (0 errores/overflows). Además, para 2 árboles no enraizados aleatorios, el 66,7% (2/3) de cuartetos difiere; el máximo de 65,9% revela alta heterogeneidad y saturación estocástica en los pares extremos.",
        "academicReference": "Memoria (Sección 3.4.1, Ecuaciones 3.1-3.2 y Tabla 3.15)",
        "keyTakeaway": "Tope QD = C(471,4) ≈ 2,02×10⁹; máximo ML ≈ 1,33×10⁹ (65,9%), consistente con el 2/3 teórico entre topologías independientes."
    },
    {
        "id": 83,
        "category": "distancia",
        "categoryLabel": "Métricas de Distancia",
        "question": "¿Qué reveló la correlación de Spearman (`scipy.stats.spearmanr`) entre la longitud del alineamiento SNP y la distancia topológica promedio?",
        "options": {
            "a": "Una correlación positiva perfecta (r = +0,95) que demuestra que los genes más largos divergen más rápido entre cepas de levadura.",
            "b": "Ausencia total de correlación estadística (p > 0,50), probando que el filtro ≥ 70 pb eliminó por completo el efecto del tamaño del gen.",
            "c": "Una correlación negativa exclusiva de Neighbor Joining (r = −0,85), mientras Máxima Verosimilitud resultó inmune a la longitud del SNP.",
            "d": "Una correlación negativa significativa en todas las matrices, siendo casi el doble en ML con RF (r = −0,7325) que en ML con QD (−0,3711)."
        },
        "answer": [
            "d"
        ],
        "priority": 2,
        "isTrap": true,
        "isInformaticaFocus": true,
        "trapExplanation": "¡Dato clave de auditoría! Todas las matrices mostraron r < 0 (p < 0,001): genes más cortos tienen menos señal y quedan topológicamente más distantes del resto. Pero ML_RF tuvo r = −0,7325 vs ML_QD r = −0,3711: RF sufre casi el doble de sesgo por longitud de alineamiento.",
        "academicReference": "Memoria (Sección 3.4.1, Tabla 3.16)",
        "keyTakeaway": "Genes cortos tienen mayor distancia media por ruido (r < 0), pero RF sufre casi el doble de sesgo que QD (−0,7325 vs −0,3711)."
    },
    {
        "id": 84,
        "category": "visualizacion",
        "categoryLabel": "Visualización & MDS (Kruskal)",
        "question": "Además de un menor Stress-1 (36,79% vs 41,83%), ¿qué patrón en el Diagrama de Shepard demostró la superioridad de QD frente a RF?",
        "options": {
            "a": "RF presentó una acumulación vertical anómala en el techo RF = 936 destruyendo la monotonicidad, mientras QD mostró crecimiento continuo.",
            "b": "QD generó un agrupamiento bimodal estrictamente discreto en los extremos 0 y 1, mientras RF dispersó los puntos en una espiral lineal.",
            "c": "RF mostró correlación perfecta en la diagonal con cero dispersión residual, mientras QD presentó valores negativos en el eje de abscisas.",
            "d": "QD colapsó todas las distancias menores a 500 millones sobre el eje vertical, facilitando la separación visual en dos macro-clústeres."
        },
        "answer": [
            "a"
        ],
        "priority": 2,
        "isTrap": false,
        "isInformaticaFocus": true,
        "trapExplanation": "En el Diagrama de Shepard (distancia original vs distancia proyectada en 2D), RF acumula una pared vertical de puntos en el valor saturado 936, obligando a MDS a dispersarlos artificialmente en el plano (Stress-1 = 0,4183). QD mantiene una relación monótona ascendente continua (Stress-1 = 0,3679).",
        "academicReference": "Mapa Conceptual / Memoria (Sección 3.4.3, Figuras 3.6 y 3.7)",
        "keyTakeaway": "Diagrama de Shepard: RF se apila verticalmente en la saturación 936; QD preserva monotonicidad continua con menor Stress-1."
    },
    {
        "id": 85,
        "category": "agrupamiento",
        "categoryLabel": "Métodos de Agrupamiento",
        "question": "Según el mapa conceptual, ¿qué tres limitaciones prácticas llevaron a descartar el algoritmo Fuzzy (FANNY) en la fase de minería de datos?",
        "options": {
            "a": "Exige espacio euclidiano continuo, colapsa ante matrices simétricas y requiere tiempo cúbico O(n³) incompatible con 3.806 árboles.",
            "b": "Exige definir k grupos a priori, calibrar un exponente de borrosidad m y entrega grados de pertenencia en vez de grupos delimitados.",
            "c": "Exige construir un árbol de expansión mínima previo, descarta el 75% del genoma como ruido y necesita árboles estrictamente enraizados.",
            "d": "Exige cortes horizontales sobre un dendrograma jerárquico, sobrepenaliza ramas largas y falla si hay ramas negativas infinitesimales."
        },
        "answer": [
            "b"
        ],
        "priority": 1,
        "isTrap": false,
        "isInformaticaFocus": true,
        "trapExplanation": "Aunque FANNY sí opera sobre matrices de distancia pura, el mapa conceptual lo descarta por 3 razones: 1) requiere k a priori, 2) requiere el parámetro fuzzy m para la 'borrosidad', y 3) entrega grados de pertenencia continuos u_iv ∈ [0,1] en lugar de delimitar grupos con certeza.",
        "academicReference": "Mapa Conceptual Actualizado / Memoria (Sección 3.1)",
        "keyTakeaway": "FANNY se descarta porque pide k a priori, parámetro de borrosidad m y no delimita clústeres discretos sino grados de pertenencia."
    },
    {
        "id": 86,
        "category": "agrupamiento",
        "categoryLabel": "Métodos de Agrupamiento",
        "question": "¿Por qué falló DBSCAN al calibrar `ε` mediante el método del codo en la curva de k-distancias (`k = 3`), originando el 'fenómeno de percolación'?",
        "options": {
            "a": "La presencia de distancias nulas en la diagonal impide que el parámetro MinPts forme núcleos densos cuando la cantidad de cepas es impar (471).",
            "b": "La curva empírica presenta tres saltos discretos bruscos que obligan a Scikit-learn a dividir la memoria en submatrices triangulares incompatibles.",
            "c": "La curva empírica presenta una gradiente continua sin codo nítido: ε pequeño genera 75–95% de ruido (−1) y ε de inflexión fusiona >96% en 1 bloque.",
            "d": "El radio ε calculado en millones de cuartetos excede el tipo entero estándar de Python y colapsa la métrica de densidad en cero grupos válidos."
        },
        "answer": [
            "c"
        ],
        "priority": 2,
        "isTrap": false,
        "isInformaticaFocus": true,
        "trapExplanation": "En lugar de un 'codo' angular nítido, los datos presentan una gradiente continua (Tabla 3.17 y 3.18): un ε restrictivo manda 75%–95% de los genes a ruido (−1), mientras el ε de inflexión conecta todo por transitividad (fenómeno de percolación), absorbiendo >96% del genoma en un macro-clúster (3.677 genes en ML_QD).",
        "academicReference": "Mapa Conceptual / Memoria (Sección 3.4.2, Fig. 3.3, Tablas 3.17-3.18)",
        "keyTakeaway": "Sin codo en la curva k-distancia: DBSCAN oscila entre 75-95% ruido (ε bajo) o percolación de >96% del genoma en 1 grupo (ε medio)."
    },
    {
        "id": 87,
        "category": "agrupamiento",
        "categoryLabel": "Métodos de Agrupamiento",
        "question": "Al iterar el parámetro de vecindad `k` de MST-kNN entre `k = 2` y `k = 5` (Tabla 3.21), ¿qué definió el límite operativo inferior y superior?",
        "options": {
            "a": "En k=2 los grupos superan el máximo soportado por Biopython y en k=5 los valores de consistencia de vecindad caen por debajo del azar.",
            "b": "En k=2 la complejidad O(n² log n) excede los 16 GB de RAM y en k=5 el algoritmo diverge generando ciclos infinitos dentro del árbol MST.",
            "c": "En k=1 se generan 8 clústeres idénticos al nivel k=4 y en k=5 las componentes conexas quedan por debajo del umbral mínimo de 2.000 genes.",
            "d": "En k=1 el grafo se fragmenta en pares aislados sin resolución y en k=5 colapsa absorbiendo 3.709 de 3.806 genes en un macro-clúster."
        },
        "answer": [
            "d"
        ],
        "priority": 2,
        "isTrap": false,
        "isInformaticaFocus": true,
        "trapExplanation": "k=1 fragmenta excesivamente en pares; k=2 es el mínimo viable (100 grupos de 3 a 370 genes); k=3 (33 grupos) y k=4 (8 grupos) mantienen estructura; pero en k=5 la red colapsa a solo 3 grupos con uno gigante de 3.709/3.806 genes. Por eso el análisis se acota a k ∈ [2, 4].",
        "academicReference": "Memoria (Sección 3.4.2 y 3.4.3, Tabla 3.21)",
        "keyTakeaway": "Rango operativo MST-kNN: k ∈ [2, 4] (de 100 a 8 grupos); k=1 sobre-fragmenta y k=5 colapsa 3.709/3.806 genes en un bloque."
    },
    {
        "id": 88,
        "category": "agrupamiento",
        "categoryLabel": "Métodos de Agrupamiento",
        "question": "¿Por qué el 'seudodendrograma' de la Figura 4.1 (`k = 5` a `k = 2`) NO equivale a un dendrograma jerárquico aglomerativo clásico (UPGMA/NJ)?",
        "options": {
            "a": "Porque sus bifurcaciones codifican umbrales discretos de k validados por 100% de contención hereditaria, no distancias evolutivas continuas.",
            "b": "Porque se construye aplicando enlace completo (complete linkage) exclusivamente sobre la proyección 2D euclidiana calculada mediante MDS.",
            "c": "Porque sus nodos terminales representan las 471 cepas de levadura en lugar de los 3.806 árboles génicos ortólogos del conjunto ML.",
            "d": "Porque permite que un mismo gen pertenezca simultáneamente a dos ramas distintas del árbol mediante grados de membresía difusos u_iv."
        },
        "answer": [
            "a"
        ],
        "priority": 2,
        "isTrap": true,
        "isInformaticaFocus": true,
        "trapExplanation": "¡Distinción clave para ingenieros! Un dendrograma clásico fusiona pares por distancia continua. El seudodendrograma nace de particiones planas independientes de MST-kNN (k=2..5) y es matemáticamente válido solo porque empíricamente hubo 100% de contención hereditaria estricta al variar k.",
        "academicReference": "Memoria (Sección 4.2, Figura 4.1)",
        "keyTakeaway": "Seudodendrograma ≠ linkage continuo: es válido por 100% de anidamiento hereditario entre particiones discretas k=2..5."
    },
    {
        "id": 89,
        "category": "complejidades",
        "categoryLabel": "Complejidades y Algoritmos",
        "question": "Si MST-kNN tiene complejidad `O(n² log n)`, ¿por qué solo tomó ~44 minutos (con MDS) mientras calcular las matrices de distancia tomó 3.943 minutos?",
        "options": {
            "a": "Porque Scikit-learn ejecuta MST-kNN automáticamente en GPU mediante CUDA, mientras tqDist e IQ-TREE 2 están restringidos a un solo núcleo.",
            "b": "Porque en el clustering n=3.806 vértices y la matriz precomputada está en RAM, mientras la matriz previa evalúa miles de árboles de 471 hojas.",
            "c": "Porque MST-kNN descarta el 90% de las aristas antes de leer la matriz y solo ordena las distancias pertenecientes a los clústeres de STRING.",
            "d": "Porque en las matrices de distancia la variable n corresponde a las 5.574 cepas por el cuadrado del promedio de longitud de los alineamientos."
        },
        "answer": [
            "b"
        ],
        "priority": 2,
        "isTrap": false,
        "isInformaticaFocus": true,
        "trapExplanation": "Análisis asintótico práctico: en MST-kNN n=3.806 genes (n² ≈ 14,5M entradas en RAM), ejecutando en minutos; en cambio, construir la matriz QD implica ~7,24×10⁶ pares de árboles y en cada par evaluar la topología de C(471,4) ≈ 2,02×10⁹ cuartetos (o 468 splits en RF).",
        "academicReference": "Memoria (Sección 2.1.5, 3.4.1 y 4.2)",
        "keyTakeaway": "El costo de O(n² log n) sobre n=3.806 en RAM es ínfimo frente al costo interno de comparar árboles de 471 hojas en cada celda."
    },
    {
        "id": 90,
        "category": "complejidades",
        "categoryLabel": "Complejidades y Algoritmos",
        "question": "En la Fase 2 de MST-kNN, dada una arista `(u, v)` perteneciente al Árbol de Expansión Mínima (MST), ¿bajo qué condición lógica se conserva o se poda?",
        "options": {
            "a": "Se conserva solo si su peso wij supera el radio global ε de DBSCAN, y se poda en caso contrario para aislar el ruido estadístico.",
            "b": "Se conserva únicamente cuando ambos árboles génicos u y v tienen una distancia Robinson-Foulds estrictamente inferior al umbral 936.",
            "c": "Se conserva solo si u está entre los k vecinos más cercanos de v (o viceversa); si no cumple la regla k-NN se poda fragmentando el grafo.",
            "d": "Se conserva siempre que u y v compartan al menos una interacción proteína-proteína confirmada en STRING con confianza mayor a 400."
        },
        "answer": [
            "c"
        ],
        "priority": 2,
        "isTrap": false,
        "isInformaticaFocus": true,
        "trapExplanation": "Definición exacta del algoritmo (Sección 2.1.5): MST conecta todos los nodos sin ciclos; luego la intersección estructural conserva las aristas donde al menos un extremo está dentro de los k vecinos más cercanos del otro. Al podar las demás aristas, cada componente conexa resultante es un clúster.",
        "academicReference": "Inostroza-Ponta (2008) / Memoria (Sección 2.1.5)",
        "keyTakeaway": "Regla de poda MST-kNN: arista del MST sobrevive si satisface vecindad k-NN; las componentes conexas resultantes son los clústeres."
    },
    {
        "id": 91,
        "category": "validacion",
        "categoryLabel": "Validación, Parámetros & STRING",
        "question": "¿Qué restricción técnica de la plataforma STRING Database dictó diseñar la evaluación biológica con una estrategia descendente (`k = 4 → 3 → 2`)?",
        "options": {
            "a": "STRING solo permite validar árboles génicos enraizados cuando la vecindad k de MST-kNN es estrictamente superior a cinco componentes conexas.",
            "b": "STRING rechaza identificadores de levaduras en formato texto plano y exige procesar bloques de máximo 100 proteínas por cada llamada HTTP.",
            "c": "STRING calcula el coeficiente de Silueta interno en el servidor y colapsa cuando la matriz de distancias supera los 500 megabytes de RAM.",
            "d": "STRING limita las consultas de redes a un máximo de 2.000 genes, obligando a descomponer macro-clústeres como el Clúster 1 de k=4."
        },
        "answer": [
            "d"
        ],
        "priority": 1,
        "isTrap": false,
        "isInformaticaFocus": true,
        "trapExplanation": "Restricción técnica explícita (Sección 3.5): STRING Database es incapaz de procesar redes de más de 2.000 genes. Por ello el Clúster 1 de k=4 (>2.000 genes, con 2.614 en el mayor grupo) derivó a k=3, donde su Clúster 5 (1.955 genes, al límite) bajó a k=2.",
        "academicReference": "Memoria (Sección 3.5 y 3.5.1)",
        "keyTakeaway": "Límite técnico de STRING (≤ 2.000 genes) obligó a descomponer top-down los macro-grupos desde k=4 hacia k=3 y k=2."
    },
    {
        "id": 92,
        "category": "validacion",
        "categoryLabel": "Validación, Parámetros & STRING",
        "question": "Dado que STRING no soporta nativamente a *S. eubayanus*, ¿cómo se implementó el mapeo de genes y qué efecto tuvo sobre el Clúster 19 (`k = 2`)?",
        "options": {
            "a": "Se usó String Matching exacto de alias hacia S. cerevisiae (TaxID 4932); >11% de etiquetas DI49_ sin ortólogo impidió un grafo conexo.",
            "b": "Se usó alineamiento BLAST contra Homo sapiens; en el Clúster 19 duplicó las interacciones falsas por homología remota en enzimas.",
            "c": "Se entrenó un modelo de lenguaje en Python para traducir locus tags; el Clúster 19 alcanzó un 100% de mapeo sin secuencias huérfanas.",
            "d": "Se consultó directamente la API taxonómica de NCBI filtrando cepas de Patagonia A; el Clúster 19 quedó descartado por tener < 5 genes."
        },
        "answer": [
            "a"
        ],
        "priority": 2,
        "isTrap": false,
        "isInformaticaFocus": true,
        "trapExplanation": "Mapeo por ortología mediante coincidencia exacta de alias (String Matching) usando el archivo oficial de sinónimos de S. cerevisiae (TaxID 4932), logrando 85%–100% de mapeo. En el Clúster 19 (177 genes, 88,7% mapeados), >11% eran locus tags (DI49_) sin ortólogo, explicando la falta de grafo concluyente en STRING.",
        "academicReference": "Memoria (Sección 3.5.4, Tabla 3.22)",
        "keyTakeaway": "String Matching exacto contra S. cerevisiae (TaxID 4932); >11% de loci DI49_ no mapeados explica la ausencia de grafo en Clúster 19."
    },
    {
        "id": 93,
        "category": "validacion",
        "categoryLabel": "Validación, Parámetros & STRING",
        "question": "¿Cómo desenmascaró el modelo nulo (1.000 permutaciones sobre 3.806 genes) + FDR un falso positivo de STRING en el Clúster 4 (`k = 3`, 460 genes)?",
        "options": {
            "a": "STRING reportó p = 0,8500 por falta de mapeo, pero el modelo nulo descubrió 5.000 interacciones físicas ocultas tras ajustar el umbral a 900.",
            "b": "STRING reportó p = 0,000213, pero el nulo esperó 1.721,5 PPI frente a 1.629 observados (p empírico = 0,7150), probando sesgo de tamaño.",
            "c": "La corrección de Benjamini-Hochberg redujo el valor q del Clúster 4 a 0,0310, validándolo como el complejo físico más denso de todo el estudio.",
            "d": "Las 1.000 permutaciones demostraron que el Clúster 4 contenía únicamente secuencias repetidas de menos de 70 pb que debían volver a filtrarse."
        },
        "answer": [
            "b"
        ],
        "priority": 2,
        "isTrap": true,
        "isInformaticaFocus": true,
        "trapExplanation": "¡Hallazgo estadístico clave! STRING usa todo el genoma de S. cerevisiae como background, inflando falsamente la significancia de grupos grandes (Clúster 4: p=0,000213). Al permutar sobre el universo real de 3.806 genes, 1.629 PPI < 1.721,5 esperados (p=0,7150). Solo micro-módulos 28 y 32 superaron el azar (p<0,05; q=0,165≤0,20).",
        "academicReference": "Memoria (Sección 3.5.4, Tabla 3.22)",
        "keyTakeaway": "El background completo de STRING sesga macro-grupos (Clúster 4: 1.629 obs < 1.721,5 esp, p=0,715); el nulo valida micro-módulos (28 y 32)."
    },
    {
        "id": 94,
        "category": "validacion",
        "categoryLabel": "Validación, Parámetros & STRING",
        "question": "Si la Consistencia de Vecindad k-NN dio 87,36% (`k=4`), 82,01% (`k=3`) y 79,45% (`k=2`), ¿por qué NO sirve como validación externa del método?",
        "options": {
            "a": "Porque exige proyectar primero los datos en dos dimensiones con MDS, heredando un error cuadrático proporcional al Stress-1 de Kruskal.",
            "b": "Porque Scikit-learn calcula la consistencia k-NN asumiendo estrictamente distancia euclidiana L2 e ignora las entradas simétricas de QD.",
            "c": "Porque al construirse MST-kNN optimizando exactamente los k vecinos, medir consistencia k-NN es circular y solo describe densidad interna.",
            "d": "Porque un porcentaje inferior al 95% en k=2 demuestra estadísticamente que las componentes conexas están fragmentadas por ruido aleatorio."
        },
        "answer": [
            "c"
        ],
        "priority": 2,
        "isTrap": true,
        "isInformaticaFocus": true,
        "trapExplanation": "Autocrítica metodológica impecable (Sección 3.5.4): como MST-kNN forma clústeres justamente preservando aristas k-NN, obtener ~79–87% de consistencia k-NN es esperable por diseño (circular). Por eso se reporta solo como descriptor topológico de bordes irregulares (12–25% transición), recayendo la validación independiente en STRING + modelo nulo.",
        "academicReference": "Memoria (Sección 3.5.4, Tabla 3.24)",
        "keyTakeaway": "Consistencia k-NN (~80-87%) describe densidad local pero es circular respecto a MST-kNN; la validación independiente es STRING + modelo nulo."
    },
    {
        "id": 95,
        "category": "validacion",
        "categoryLabel": "Validación, Parámetros & STRING",
        "question": "¿Qué determinaron las pruebas post-clustering de Kruskal-Wallis y Mann-Whitney U sobre el sesgo de longitud de alineamientos SNP?",
        "options": {
            "a": "Ambos test demostraron que el Clúster 32 del citoesqueleto es un artefacto de secuenciación originado por la falta de filtros de longitud.",
            "b": "Kruskal-Wallis demostró que ningún clúster presenta diferencias de longitud (p=0,48), descartando la necesidad de aplicar Mann-Whitney U.",
            "c": "Mann-Whitney U detectó que todos los macro-clústeres (3, 4, 7 y 17) se agruparon exclusivamente por tener secuencias mayores a 1.000 pb.",
            "d": "Kruskal-Wallis confirmó heterogeneidad global (p<0,001), pero Mann-Whitney probó 7 de 10 clústeres limpios y sesgo en Clústeres 18, 19 y 28."
        },
        "answer": [
            "d"
        ],
        "priority": 2,
        "isTrap": false,
        "isInformaticaFocus": true,
        "trapExplanation": "Auditoría de sesgo (Tablas 3.25 y 3.26): Kruskal-Wallis global dio p < 0,001 (el sesgo no desaparece globalmente), pero al auditar los 10 clústeres clave con Mann-Whitney U, 7 de 10 fueron limpios (p > 0,05: 3, 4, 7, 10, 17, 31, 32) y solo 3 (18, 19 y 28) presentaron secuencias significativamente más largas (p < 0,05).",
        "academicReference": "Memoria (Sección 3.5.4, Tablas 3.25 y 3.26)",
        "keyTakeaway": "Mann-Whitney U auditó sesgo por longitud: 7/10 clústeres limpios (p>0,05); Clústeres 18, 19 y 28 influidos por mayor longitud SNP."
    },
    {
        "id": 96,
        "category": "validacion",
        "categoryLabel": "Validación, Parámetros & STRING",
        "question": "¿Qué límite teórico fundamental de los algoritmos basados solo en distancias evolutivas reveló el Clúster 31 (`k = 2`, 23 genes, `SGE1`)?",
        "options": {
            "a": "Que cuando un gen funcional está incrustado en un bloque de sintenia conservado, sus distancias QD son idénticas a las de sus vecinos físicos.",
            "b": "Que cuando un módulo supera los 20 genes en el nivel k=2, el algoritmo MST-kNN invierte el peso de las aristas fusionándolo con ruido de fondo.",
            "c": "Que las bombas de eflujo como SGE1 carecen de sustituciones sinónimas en ADN y obligan a IQ-TREE 2 a producir topologías en estrella no resueltas.",
            "d": "Que STRING Database bloquea automáticamente el análisis de genes de resistencia a toxinas cuando provienen de alineamientos PHYLIP podados."
        },
        "answer": [
            "a"
        ],
        "priority": 2,
        "isTrap": false,
        "isInformaticaFocus": true,
        "trapExplanation": "Descubrimiento clave (Sección 3.5.3): el Clúster 31 retuvo la bomba de eflujo SGE1 unida a genes estructurales cromosómicos. Al estar físicamente ligados en un bloque de sintenia (co-herencia por proximidad física en el cromosoma), sus árboles tienen distancias topológicas indistinguibles, marcando el límite de la minería puramente topológica.",
        "academicReference": "Memoria (Sección 3.5.3 y Glosario: Sintenia)",
        "keyTakeaway": "Límite de sintenia: genes ligados físicamente en un bloque cromosómico tienen árboles casi idénticos y no se separan solo por topología."
    },
    {
        "id": 97,
        "category": "trampas",
        "categoryLabel": "Trampas Mortales de Comisión",
        "question": "TRAMPA DE MÉTRICAS: Un evaluador dice: 'NJ con QD logró Stress-1 de 33,7% frente a 36,8% de ML con QD; luego NJ es superior a ML'. ¿Cómo respondes?",
        "options": {
            "a": "Stress-1 evalúa únicamente el sesgo de longitud SNP mediante Spearman; NJ alcanzó 33,7% solo porque procesó 5.565 archivos sin podar.",
            "b": "Stress-1 solo mide distorsión al proyectar a 2D en MDS, no calidad de clustering; en la matriz real ML obtuvo mejor Silueta (−0,0604 vs −0,0783).",
            "c": "Stress-1 menor en NJ demuestra un error de convergencia en Scikit-learn al desdoblar la matriz triangular de tqDist en formato float64.",
            "d": "Stress-1 es una métrica inversa donde valores más cercanos al 100% indican menor error geométrico, por lo que 36,8% supera directamente a 33,7%."
        },
        "answer": [
            "b"
        ],
        "priority": 2,
        "isTrap": true,
        "isInformaticaFocus": true,
        "trapExplanation": "¡Trampa clásica de ciencia de datos! Confundir bondad de proyección 2D (Kruskal Stress-1 de MDS) con calidad real de agrupamiento. Stress-1 más bajo significa que las distancias de NJ se aplastaron en 2D con menos error geométrico, pero la Silueta en el espacio métrico real probó que ML tiene clústeres ~30% más cohesivos.",
        "academicReference": "Memoria (Sección 3.4.3, Tabla 3.20)",
        "keyTakeaway": "Stress-1 mide fidelidad de proyección MDS 2D, no calidad del clustering; ML superó a NJ en Coeficiente de Silueta (−0,0604 vs −0,0783)."
    },
    {
        "id": 98,
        "category": "trampas",
        "categoryLabel": "Trampas Mortales de Comisión",
        "question": "TRAMPA ESTADÍSTICA: Si macro-clústeres como el 7 (`p = 0,281`) o el 18 (`p = 0,598`) no superaron el modelo nulo de PPI, ¿significa que el algoritmo falló?",
        "options": {
            "a": "Sí, confirma que MST-kNN mezcló aleatoriamente secuencias menores a 70 pb con genes largos por culpa del fenómeno de percolación en k=2.",
            "b": "Sí, demuestra que la métrica Quartet Distance perdió sensibilidad al superar la cota máxima de 936 biparticiones entre cepas de Patagonia.",
            "c": "No; el nulo mide densidad de interacción física directa PPI, mientras los macro-clústeres capturan vías metabólicas amplias y distribuidas.",
            "d": "No; se debe exclusivamente a que el test de 1.000 permutaciones requiere al menos 10.000 iteraciones para alcanzar significancia en k=2."
        },
        "answer": [
            "c"
        ],
        "priority": 2,
        "isTrap": true,
        "isInformaticaFocus": true,
        "trapExplanation": "¡No es un fracaso, es un hallazgo de escala! La tesis delimita el alcance analítico del flujo: los micro-módulos acotados (5–15 genes, ej. Clústeres 28 y 32) capturan complejos físicos densos (p < 0,05), mientras que los macro-grupos representan redes metabólicas distribuidas (nitrógeno, autofagia, carbono) o co-evolución global.",
        "academicReference": "Memoria (Sección 3.5.4 y 4.2)",
        "keyTakeaway": "Resolución dependiente de escala: micro-clústeres aíslan complejos físicos densos (p<0,05); macro-clústeres reflejan vías distribuidas."
    },
    {
        "id": 99,
        "category": "trampas",
        "categoryLabel": "Trampas Mortales de Comisión",
        "question": "TRAMPA ALGORÍTMICA: Si fijas `k = 2` en MST-kNN, ¿por qué el grupo más grande tiene 370 genes en vez de un máximo de 3 nodos (`nodo + 2 vecinos`)?",
        "options": {
            "a": "Porque el Árbol de Expansión Mínima agrega un nivel de profundidad recursiva por cada iteración del modelo evolutivo GTR+G hasta estabilizarse.",
            "b": "Porque la librería Scikit-learn multiplica automáticamente el parámetro k por el porcentaje de consistencia de vecindad antes de podar el grafo.",
            "c": "Porque al usar distancia de cuartetos los nodos se agrupan en bloques mínimos de cuatro taxones que se multiplican por las 471 cepas del genoma.",
            "d": "Porque k=2 limita los vecinos locales para conservar aristas del MST, pero la transitividad de componentes conexas forma cadenas de mayor tamaño."
        },
        "answer": [
            "d"
        ],
        "priority": 2,
        "isTrap": true,
        "isInformaticaFocus": true,
        "trapExplanation": "Confusión típica entre grado/vecindad local y tamaño de componente conexa. k=2 solo restringe qué aristas del MST sobreviven (las que caen dentro de los 2 vecinos más cercanos de un extremo); al encadenarse por transitividad A—B—C—D..., emergen componentes conexas de 3 hasta 370 genes.",
        "academicReference": "Memoria (Sección 2.1.5 y 3.4.2, Tabla 3.19)",
        "keyTakeaway": "En MST-kNN, k acota la vecindad local por nodo, no el tamaño del clúster: las componentes conexas crecen por transitividad."
    },
    {
        "id": 100,
        "category": "trampas",
        "categoryLabel": "Trampas Mortales de Comisión",
        "question": "TRAMPA DE PREPROCESAMIENTO: ¿Por qué no subir el umbral de longitud desde `≥ 70 pb` a `≥ 200 pb` para eliminar de raíz el sesgo por secuencias cortas?",
        "options": {
            "a": "Porque con promedio de 159 pb un corte ≥ 200 pb descartaría >50% del genoma, destruyendo representatividad; el sesgo se mitiga con QD y se audita.",
            "b": "Porque IQ-TREE 2 falla con error de segmentación si todas las secuencias del lote PHYLIP superan la moda empírica de 133 pares de bases.",
            "c": "Porque los genes mayores a 200 pb contienen exclusivamente secuencias repetitivas no codificantes que anulan el mapeo por ortología en STRING.",
            "d": "Porque la métrica Quartet Distance requiere al menos mil árboles de longitud menor a 150 pb para mantener la simetría de su matriz triangular."
        },
        "answer": [
            "a"
        ],
        "priority": 2,
        "isTrap": true,
        "isInformaticaFocus": true,
        "trapExplanation": "Trade-off ingenieril clave (Sección 3.2 y 3.5.4): la longitud media de SNPs es 158,97 pb (sesgada a la derecha). Cortar en ≥ 200 pb perdería >50% del core genome dejando solo genes hipervariables. Mantener ≥ 70 pb retiene 76,8%, QD reduce el sesgo Spearman a la mitad, y Mann-Whitney U audita qué clústeres quedan limpios.",
        "academicReference": "Memoria (Sección 3.2 y 3.5.4)",
        "keyTakeaway": "Trade-off ≥ 70 pb: preserva 76,8% del genoma (≥ 200 pb perdería >50%); el sesgo residual se atenúa con QD y se audita con Mann-Whitney."
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
