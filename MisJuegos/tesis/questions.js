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
