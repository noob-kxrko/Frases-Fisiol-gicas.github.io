const baseTopics = [
  {
    id: 'existencia',
    label: 'Existencia',
    description: 'Sentido, angustia, libertad y decisión.'
  },
  {
    id: 'conocimiento',
    label: 'Conocimiento',
    description: 'Verdad, método, duda y lenguaje.'
  },
  {
    id: 'etica',
    label: 'Ética',
    description: 'Virtud, deber, bien y carácter.'
  },
  {
    id: 'politica',
    label: 'Política',
    description: 'Poder, justicia, comunidad y responsabilidad.'
  },
  {
    id: 'felicidad',
    label: 'Felicidad',
    description: 'Serenidad, placer, prudencia y vida buena.'
  },
  {
    id: 'amor',
    label: 'Amor',
    description: 'Deseo, cuidado, vínculo y alteridad.'
  },
  {
    id: 'tiempo',
    label: 'Tiempo',
    description: 'Cambio, memoria, instante y devenir.'
  },
  {
    id: 'sociedad',
    label: 'Sociedad',
    description: 'Normas, cultura, trabajo y convivencia.'
  },
  {
    id: 'metafisica',
    label: 'Metafísica',
    description: 'Ser, causa, sustancia y fundamentos.'
  },
  {
    id: 'religion',
    label: 'Religión',
    description: 'Fe, trascendencia, sentido y comunidad.'
  },
  {
    id: 'estetica',
    label: 'Estética',
    description: 'Arte, belleza, creación y experiencia.'
  },
  {
    id: 'mente',
    label: 'Mente',
    description: 'Conciencia, deseo, emoción y subjetividad.'
  }
];

const extraTopicLabels = [
  'Metafísica',
  'Ontología',
  'Epistemología',
  'Gnoseología',
  'Lógica',
  'Ética',
  'Ética aplicada',
  'Bioética',
  'Estética',
  'Axiología',
  'Antropología filosófica',
  'Filosofía del ser',
  'Filosofía del conocimiento',
  'Filosofía de la verdad',
  'Filosofía de la mente',
  'Filosofía del lenguaje',
  'Filosofía de la conciencia',
  'Filosofía de la percepción',
  'Filosofía del tiempo',
  'Filosofía del espacio',
  'Filosofía moral',
  'Filosofía política',
  'Filosofía del derecho',
  'Filosofía de la justicia',
  'Filosofía del poder',
  'Filosofía social',
  'Filosofía de la sociedad',
  'Filosofía de la cultura',
  'Filosofía de la educación',
  'Filosofía de la economía',
  'Filosofía del trabajo',
  'Filosofía de la historia',
  'Filosofía de la comunicación',
  'Filosofía de la ciencia',
  'Filosofía de la tecnología',
  'Filosofía de la matemática',
  'Filosofía de la física',
  'Filosofía de la biología',
  'Filosofía de la psicología',
  'Filosofía de la medicina',
  'Filosofía ambiental',
  'Filosofía de la naturaleza',
  'Filosofía del arte',
  'Filosofía de la música',
  'Filosofía de la literatura',
  'Filosofía de la creatividad',
  'Filosofía de la belleza',
  'Filosofía de la religión',
  'Filosofía de Dios',
  'Teología filosófica',
  'Filosofía espiritual',
  'Filosofía del amor',
  'Filosofía del eros',
  'Filosofía del afecto',
  'Filosofía de la amistad',
  'Filosofía de las relaciones humanas',
  'Filosofía de la intimidad',
  'Filosofía de la sexualidad',
  'Filosofía del deseo',
  'Filosofía existencialista',
  'Filosofía humanista',
  'Filosofía marxista',
  'Filosofía idealista',
  'Filosofía materialista',
  'Filosofía racionalista',
  'Filosofía empirista',
  'Filosofía positivista',
  'Filosofía pragmatista',
  'Filosofía nihilista',
  'Filosofía vitalista',
  'Filosofía fenomenológica',
  'Filosofía hermenéutica',
  'Filosofía estructuralista',
  'Filosofía posestructuralista',
  'Filosofía posmoderna',
  'Filosofía crítica',
  'Filosofía analítica',
  'Filosofía continental',
  'Filosofía antigua',
  'Filosofía medieval',
  'Filosofía moderna',
  'Filosofía contemporánea',
  'Filosofía occidental',
  'Filosofía oriental',
  'Filosofía africana',
  'Filosofía latinoamericana'
];

function clampText(s) {
  return String(s || '').replace(/\s+/g, ' ').trim();
}

function normalizeLabel(s) {
  return clampText(s)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function topicSlug(label) {
  return normalizeLabel(label)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function ensureUniqueId(base, used) {
  let id = base;
  let i = 2;
  while (used.has(id)) {
    id = `${base}-${i}`;
    i += 1;
  }
  used.add(id);
  return id;
}

function makeDescription(label) {
  const l = clampText(label);
  const lower = l.toLowerCase();

  if (lower.startsWith('filosofía de las ')) return `Conceptos y preguntas sobre ${lower.replace('filosofía de las ', '')}.`;
  if (lower.startsWith('filosofía de la ')) return `Conceptos y preguntas sobre ${lower.replace('filosofía de la ', '')}.`;
  if (lower.startsWith('filosofía del ')) return `Conceptos y preguntas sobre ${lower.replace('filosofía del ', '')}.`;
  if (lower.startsWith('filosofía de ')) return `Conceptos y preguntas sobre ${lower.replace('filosofía de ', '')}.`;
  if (lower.startsWith('filosofía ')) return `Corriente y enfoque: ${lower.replace('filosofía ', '')}.`;

  return `Conceptos, problemas y debates en ${lower}.`;
}

const baseLabelSet = new Set(baseTopics.map((t) => normalizeLabel(t.label)));
const usedIds = new Set(baseTopics.map((t) => t.id));

const extraTopics = extraTopicLabels
  .map(clampText)
  .filter(Boolean)
  .filter((label) => !baseLabelSet.has(normalizeLabel(label)))
  .map((label) => ({
    id: ensureUniqueId(topicSlug(label), usedIds),
    label,
    description: makeDescription(label)
  }));

export const topics = [...baseTopics, ...extraTopics];

export const authors = [
  {
    id: 'platon',
    name: 'Platón',
    years: '427–347 a. C.',
    tradition: 'Filosofía clásica',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Plato%20Silanion%20Musei%20Capitolini%20MC1377.jpg',
    bio:
      'Exploró la justicia, el conocimiento y el bien a través del diálogo filosófico. Fundó la Academia.'
  },
  {
    id: 'aristoteles',
    name: 'Aristóteles',
    years: '384–322 a. C.',
    tradition: 'Filosofía clásica',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Aristotle%20Altemps%20Inv8575.jpg',
    bio:
      'Investigó lógica, ética y política con un enfoque sistemático. Su idea de virtud une hábito y razón.'
  },
  {
    id: 'epicuro',
    name: 'Epicuro',
    years: '341–270 a. C.',
    tradition: 'Helenismo',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Epicurus%20Massimo.jpg',
    bio:
      'Defendió una ética de la serenidad: placer sobrio, amistad y ausencia de temor como camino de vida.'
  },
  {
    id: 'seneca',
    name: 'Séneca',
    years: '4 a. C.–65 d. C.',
    tradition: 'Estoicismo',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Seneca%20bust%20Louvre%20Ma1332%20n2.jpg',
    bio:
      'Pensador estoico: enfatizó la disciplina interior, el tiempo como bien finito y la virtud como libertad.'
  },
  {
    id: 'descartes',
    name: 'René Descartes',
    years: '1596–1650',
    tradition: 'Racionalismo',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Frans%20Hals%20-%20Portret%20van%20Ren%C3%A9%20Descartes.jpg',
    bio:
      'Impulsó el método de la duda para fundamentar el conocimiento. Su proyecto une claridad, razón y método.'
  },
  {
    id: 'spinoza',
    name: 'Baruch Spinoza',
    years: '1632–1677',
    tradition: 'Racionalismo',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Spinoza.jpg',
    bio:
      'Propuso una ética de la comprensión: libertad como conocimiento de las causas, alegría como aumento de potencia.'
  },
  {
    id: 'kant',
    name: 'Immanuel Kant',
    years: '1724–1804',
    tradition: 'Ilustración',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Immanuel%20Kant%20(portrait).jpg',
    bio:
      'Replanteó el conocimiento y la moral: autonomía, deber y universalidad como núcleo de la ética.'
  },
  {
    id: 'nietzsche',
    name: 'Friedrich Nietzsche',
    years: '1844–1900',
    tradition: 'Filosofía moderna',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nietzsche187a.jpg',
    bio:
      'Crítico de la moral tradicional, pensó el nihilismo, la creación de valores y el estilo como filosofía.'
  },
  {
    id: 'kierkegaard',
    name: 'Søren Kierkegaard',
    years: '1813–1855',
    tradition: 'Existencialismo',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/S%C3%B8ren%20Kierkegaard%20-%20Portrait%20by%20Luplau%20Janssen.jpg',
    bio:
      'Puso la subjetividad y la decisión en el centro: vivir es elegir, y la verdad se encarna en la existencia.'
  },
  {
    id: 'beauvoir',
    name: 'Simone de Beauvoir',
    years: '1908–1986',
    tradition: 'Existencialismo',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Simone%20de%20Beauvoir2.png',
    bio:
      'Exploró libertad, ética y opresión. Su pensamiento articula existencia, cuerpo, proyecto y responsabilidad.'
  },
  {
    id: 'arendt',
    name: 'Hannah Arendt',
    years: '1906–1975',
    tradition: 'Filosofía política',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Hannah%20Arendt%201975.jpg',
    bio:
      'Pensó la acción y el espacio público. Analizó la banalidad del mal y la fragilidad de la vida política.'
  },
  {
    id: 'wittgenstein',
    name: 'Ludwig Wittgenstein',
    years: '1889–1951',
    tradition: 'Filosofía del lenguaje',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ludwig%20Wittgenstein.jpg',
    bio:
      'Reformuló problemas filosóficos como problemas de lenguaje. Sus ideas cambian según el uso y el contexto.'
  },
  {
    id: 'confucio',
    name: 'Confucio',
    years: '551–479 a. C.',
    tradition: 'Filosofía china',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Confucius%20the%20scholar.png',
    bio:
      'Destacó la formación del carácter y el orden social a través de la virtud, el respeto y el ritual.'
  },
  {
    id: 'laozi',
    name: 'Laozi',
    years: 's. VI–V a. C. (trad.)',
    tradition: 'Taoísmo',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Laozi.jpg',
    bio:
      'Atribuido al Tao Te Ching. Pensó el Tao, el fluir y la acción sin forzar (wu wei).' 
  },
  {
    id: 'socrates',
    name: 'Sócrates',
    years: '470–399 a. C.',
    tradition: 'Filosofía clásica',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Socrates%20statue%20at%20the%20Louvre%2C%208%20April%202013.jpg',
    bio:
      'Figura central de la filosofía ateniense. Su método de diálogo cuestiona supuestos y orienta la vida hacia la virtud.'
  },
  {
    id: 'agustin',
    name: 'Agustín de Hipona',
    years: '354–430',
    tradition: 'Filosofía tardoantigua',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Champaigne,_Philippe_de_-_Saint_Augustin_-_1645-1650.jpg',
    bio:
      'Pensó el tiempo, la interioridad y el deseo de verdad. Articuló razón y fe como búsqueda de sentido.'
  },
  {
    id: 'aquinas',
    name: 'Tomás de Aquino',
    years: '1225–1274',
    tradition: 'Escolástica',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/St-thomas-aquinas.jpg',
    bio:
      'Unió Aristóteles y teología medieval. Abordó ética, ley natural y fundamentos del conocimiento.'
  },
  {
    id: 'machiavelli',
    name: 'Nicolás Maquiavelo',
    years: '1469–1527',
    tradition: 'Filosofía política',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Portrait%20of%20Niccol%C3%B2%20Machiavelli%20by%20Santi%20di%20Tito.jpg',
    bio:
      'Analizó el poder político desde el realismo: instituciones, conflicto y estabilidad de la república.'
  },
  {
    id: 'hobbes',
    name: 'Thomas Hobbes',
    years: '1588–1679',
    tradition: 'Filosofía política',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Thomas%20Hobbes%20by%20John%20Michael%20Wright1.jpg',
    bio:
      'Pensó el contrato social y el Estado como respuesta al conflicto. Su obra busca orden y seguridad.'
  },
  {
    id: 'locke',
    name: 'John Locke',
    years: '1632–1704',
    tradition: 'Empirismo',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/John%20Locke%27s%20Kit-cat%20portrait%20by%20Godfrey%20Kneller%2C%20National%20Portrait%20Gallery%2C%20London.JPG',
    bio:
      'Defendió derechos, tolerancia y gobierno limitado. En epistemología, enfatizó experiencia y reflexión.'
  },
  {
    id: 'hume',
    name: 'David Hume',
    years: '1711–1776',
    tradition: 'Empirismo',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Painting%20of%20David%20Hume.jpg',
    bio:
      'Cuestionó causalidad y fundamentos de la certeza. Propuso una filosofía centrada en hábitos y experiencia.'
  },
  {
    id: 'rousseau',
    name: 'Jean-Jacques Rousseau',
    years: '1712–1778',
    tradition: 'Ilustración',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Jean-Jacques%20Rousseau%20(painted%20portrait).jpg',
    bio:
      'Pensó libertad, contrato social y educación. Exploró tensiones entre sociedad, autenticidad y desigualdad.'
  },
  {
    id: 'mill',
    name: 'John Stuart Mill',
    years: '1806–1873',
    tradition: 'Utilitarismo',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/JohnStuartMill.JPG',
    bio:
      'Defendió la libertad individual y el debate público. Su ética utilitarista busca maximizar bienestar.'
  },
  {
    id: 'marx',
    name: 'Karl Marx',
    years: '1818–1883',
    tradition: 'Filosofía social',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Karl%20Marx.jpg',
    bio:
      'Analizó trabajo, ideología y estructura social. Su crítica conecta economía, historia y emancipación.'
  },
  {
    id: 'sartre',
    name: 'Jean-Paul Sartre',
    years: '1905–1980',
    tradition: 'Existencialismo',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Jean-Paul%20Sartre%20FP.JPG',
    bio:
      'Pensó la libertad radical y la responsabilidad. La existencia precede a la esencia: el sujeto se construye.'
  },
  {
    id: 'camus',
    name: 'Albert Camus',
    years: '1913–1960',
    tradition: 'Filosofía moderna',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Albert%20Camus%201945%20(cropped).jpg',
    bio:
      'Exploró el absurdo, la rebelión y la dignidad. Su ética se orienta por lucidez y límite.'
  },
  {
    id: 'heidegger',
    name: 'Martin Heidegger',
    years: '1889–1976',
    tradition: 'Fenomenología',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Martin_Heidegger_for_WP.jpg',
    bio:
      'Replanteó la pregunta por el ser, la existencia y el tiempo. Analizó la autenticidad y la cotidianidad.'
  },
  {
    id: 'foucault',
    name: 'Michel Foucault',
    years: '1926–1984',
    tradition: 'Filosofía contemporánea',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Michel%20Foucault.jpg',
    bio:
      'Estudió poder, saber y subjetividad. Investigó instituciones, discursos y prácticas que nos constituyen.'
  },
  {
    id: 'wollstonecraft',
    name: 'Mary Wollstonecraft',
    years: '1759–1797',
    tradition: 'Filosofía política',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Mary%20Wollstonecraft%20Tate%20portrait.jpg',
    bio:
      'Defendió la igualdad y la educación como emancipación. Criticó normas que subordinan y empobrecen la vida.'
  },
  {
    id: 'hypatia',
    name: 'Hipatia de Alejandría',
    years: 'c. 370–415',
    tradition: 'Neoplatonismo',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Hypatia%20(Charles%20William%20Mitchell).jpg',
    bio:
      'Filósofa y matemática. Símbolo de investigación y enseñanza en un contexto de tensiones culturales y políticas.'
  },
  {
    id: 'rawls',
    name: 'John Rawls',
    years: '1921–2002',
    tradition: 'Filosofía política',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/John_Rawls_(1937_senior_portrait).jpg',
    bio:
      'Reconstruyó la justicia como equidad: instituciones justas, libertades básicas y criterios de imparcialidad.'
  },
  {
    id: 'biblioteca',
    name: 'Biblioteca Filosófica',
    years: '—',
    tradition: 'Aforismos (original)',
    image: './assets/avatar-fallback.svg',
    bio:
      'Colección de frases originales para clasificar temas y facilitar el estudio. Úsalas como disparadores de reflexión.'
  }
];

export const quotes = [
  {
    id: 'q1',
    text: 'El comienzo es la parte más importante del trabajo.',
    authorId: 'platon',
    topicIds: ['conocimiento', 'existencia']
  },
  {
    id: 'q2',
    text: 'La medida de un hombre es lo que hace con el poder.',
    authorId: 'platon',
    topicIds: ['politica', 'etica']
  },
  {
    id: 'q3',
    text: 'Somos lo que hacemos repetidamente. La excelencia, entonces, no es un acto, sino un hábito.',
    authorId: 'aristoteles',
    topicIds: ['etica', 'felicidad']
  },
  {
    id: 'q4',
    text: 'La felicidad depende de nosotros mismos.',
    authorId: 'aristoteles',
    topicIds: ['felicidad', 'etica']
  },
  {
    id: 'q5',
    text: 'No arruines lo que tienes deseando lo que no tienes; recuerda que lo que ahora tienes estuvo una vez entre tus deseos.',
    authorId: 'epicuro',
    topicIds: ['felicidad', 'existencia']
  },
  {
    id: 'q6',
    text: 'De todos los bienes que la sabiduría procura para la felicidad, el mayor con mucho es la amistad.',
    authorId: 'epicuro',
    topicIds: ['felicidad', 'amor', 'sociedad']
  },
  {
    id: 'q7',
    text: 'No es que tengamos poco tiempo, sino que perdemos mucho.',
    authorId: 'seneca',
    topicIds: ['tiempo', 'existencia']
  },
  {
    id: 'q8',
    text: 'La vida es larga, si sabes utilizarla.',
    authorId: 'seneca',
    topicIds: ['tiempo', 'felicidad']
  },
  {
    id: 'q9',
    text: 'Pienso, luego existo.',
    authorId: 'descartes',
    topicIds: ['conocimiento', 'existencia']
  },
  {
    id: 'q10',
    text: 'Para investigar la verdad es preciso dudar, en cuanto sea posible, de todas las cosas.',
    authorId: 'descartes',
    topicIds: ['conocimiento']
  },
  {
    id: 'q11',
    text: 'La libertad es el conocimiento de la necesidad.',
    authorId: 'spinoza',
    topicIds: ['existencia', 'conocimiento', 'etica']
  },
  {
    id: 'q12',
    text: 'La alegría es el paso del hombre de una menor a una mayor perfección.',
    authorId: 'spinoza',
    topicIds: ['felicidad', 'etica']
  },
  {
    id: 'q13',
    text: 'Obra solo según aquella máxima por la cual puedas querer que al mismo tiempo se convierta en ley universal.',
    authorId: 'kant',
    topicIds: ['etica']
  },
  {
    id: 'q14',
    text: 'La libertad consiste en obedecer una ley que uno mismo se ha dado.',
    authorId: 'kant',
    topicIds: ['etica', 'politica', 'existencia']
  },
  {
    id: 'q15',
    text: 'Quien tiene un porqué para vivir puede soportar casi cualquier cómo.',
    authorId: 'nietzsche',
    topicIds: ['existencia']
  },
  {
    id: 'q16',
    text: 'Sin música, la vida sería un error.',
    authorId: 'nietzsche',
    topicIds: ['existencia', 'sociedad']
  },
  {
    id: 'q17',
    text: 'La vida solo puede ser comprendida hacia atrás; pero debe ser vivida hacia adelante.',
    authorId: 'kierkegaard',
    topicIds: ['tiempo', 'existencia']
  },
  {
    id: 'q18',
    text: 'Atreverse es perder el equilibrio momentáneamente. No atreverse es perderse a uno mismo.',
    authorId: 'kierkegaard',
    topicIds: ['existencia', 'etica']
  },
  {
    id: 'q19',
    text: 'No se nace mujer: se llega a serlo.',
    authorId: 'beauvoir',
    topicIds: ['sociedad', 'existencia', 'politica']
  },
  {
    id: 'q20',
    text: 'Cambiar la vida: ese es el objetivo. La moral no es un catálogo, es una elección.',
    authorId: 'beauvoir',
    topicIds: ['etica', 'existencia']
  },
  {
    id: 'q21',
    text: 'El poder corresponde a la capacidad humana no solo de actuar, sino de actuar en concierto.',
    authorId: 'arendt',
    topicIds: ['politica', 'sociedad']
  },
  {
    id: 'q22',
    text: 'El perdón es la única reacción que no se limita a repetir lo que ya sucedió.',
    authorId: 'arendt',
    topicIds: ['etica', 'politica', 'amor']
  },
  {
    id: 'q23',
    text: 'Los límites de mi lenguaje son los límites de mi mundo.',
    authorId: 'wittgenstein',
    topicIds: ['conocimiento']
  },
  {
    id: 'q24',
    text: 'De lo que no se puede hablar, hay que callar.',
    authorId: 'wittgenstein',
    topicIds: ['conocimiento']
  },
  {
    id: 'q25',
    text: 'Exígete mucho a ti mismo y espera poco de los demás. Así te ahorrarás disgustos.',
    authorId: 'confucio',
    topicIds: ['etica', 'sociedad']
  },
  {
    id: 'q26',
    text: 'Nuestra mayor gloria no está en no caer nunca, sino en levantarnos cada vez que caemos.',
    authorId: 'confucio',
    topicIds: ['etica', 'existencia']
  },
  {
    id: 'q27',
    text: 'El que sabe no habla; el que habla no sabe.',
    authorId: 'laozi',
    topicIds: ['conocimiento']
  },
  {
    id: 'q28',
    text: 'Un viaje de mil millas comienza con un solo paso.',
    authorId: 'laozi',
    topicIds: ['existencia', 'tiempo']
  },
  {
    id: 'q29',
    text: 'La justicia consiste en tratar igual a los iguales y desigual a los desiguales.',
    authorId: 'aristoteles',
    topicIds: ['politica', 'etica']
  },
  {
    id: 'q30',
    text: 'La tranquilidad es el placer más grande.',
    authorId: 'epicuro',
    topicIds: ['felicidad']
  },
  {
    id: 'q31',
    text: 'Una vida sin examen no merece ser vivida.',
    authorId: 'socrates',
    topicIds: ['existencia', 'etica', 'conocimiento']
  },
  {
    id: 'q32',
    text: 'Solo sé que no sé nada.',
    authorId: 'socrates',
    topicIds: ['conocimiento']
  },
  {
    id: 'q33',
    text: 'La medida del amor es amar sin medida.',
    authorId: 'agustin',
    topicIds: ['amor', 'religion', 'existencia']
  },
  {
    id: 'q34',
    text: 'El mundo es un libro, y quienes no viajan leen solo una página.',
    authorId: 'agustin',
    topicIds: ['existencia', 'conocimiento', 'tiempo']
  },
  {
    id: 'q35',
    text: 'El bien puede entenderse como aquello a lo que todas las cosas tienden.',
    authorId: 'aquinas',
    topicIds: ['etica', 'metafisica']
  },
  {
    id: 'q36',
    text: 'La razón es una luz natural que orienta la acción.',
    authorId: 'aquinas',
    topicIds: ['etica', 'conocimiento']
  },
  {
    id: 'q37',
    text: 'Los hombres olvidan antes la muerte de su padre que la pérdida de su patrimonio.',
    authorId: 'machiavelli',
    topicIds: ['politica', 'sociedad']
  },
  {
    id: 'q38',
    text: 'Quien desea ser obedecido debe saber mandar.',
    authorId: 'machiavelli',
    topicIds: ['politica']
  },
  {
    id: 'q39',
    text: 'El hombre es un lobo para el hombre.',
    authorId: 'hobbes',
    topicIds: ['sociedad', 'politica', 'existencia']
  },
  {
    id: 'q40',
    text: 'La libertad de un hombre está en aquello que la ley permite.',
    authorId: 'hobbes',
    topicIds: ['politica', 'etica']
  },
  {
    id: 'q41',
    text: 'La mente es una hoja en blanco.',
    authorId: 'locke',
    topicIds: ['conocimiento', 'mente']
  },
  {
    id: 'q42',
    text: 'Donde no hay ley no hay libertad.',
    authorId: 'locke',
    topicIds: ['politica']
  },
  {
    id: 'q43',
    text: 'La razón es y debe ser esclava de las pasiones.',
    authorId: 'hume',
    topicIds: ['mente', 'etica']
  },
  {
    id: 'q44',
    text: 'La costumbre es el gran guía de la vida humana.',
    authorId: 'hume',
    topicIds: ['conocimiento', 'sociedad']
  },
  {
    id: 'q45',
    text: 'El hombre nace libre, y en todas partes está encadenado.',
    authorId: 'rousseau',
    topicIds: ['politica', 'sociedad', 'existencia']
  },
  {
    id: 'q46',
    text: 'La paciencia es amarga, pero su fruto es dulce.',
    authorId: 'rousseau',
    topicIds: ['etica', 'tiempo']
  },
  {
    id: 'q47',
    text: 'La libertad consiste en hacer lo que se desea.',
    authorId: 'mill',
    topicIds: ['politica', 'existencia']
  },
  {
    id: 'q48',
    text: 'La originalidad es la única cosa cuya utilidad las mentes no originales no pueden comprender.',
    authorId: 'mill',
    topicIds: ['sociedad', 'existencia']
  },
  {
    id: 'q49',
    text: 'La historia de toda sociedad hasta nuestros días es la historia de la lucha de clases.',
    authorId: 'marx',
    topicIds: ['sociedad', 'politica']
  },
  {
    id: 'q50',
    text: 'Los filósofos no han hecho más que interpretar el mundo; de lo que se trata es de transformarlo.',
    authorId: 'marx',
    topicIds: ['sociedad', 'politica', 'etica']
  },
  {
    id: 'q51',
    text: 'El hombre está condenado a ser libre.',
    authorId: 'sartre',
    topicIds: ['existencia', 'etica']
  },
  {
    id: 'q52',
    text: 'La existencia precede a la esencia.',
    authorId: 'sartre',
    topicIds: ['existencia', 'metafisica']
  },
  {
    id: 'q53',
    text: 'En el fondo del invierno, aprendí por fin que había en mí un verano invencible.',
    authorId: 'camus',
    topicIds: ['existencia', 'felicidad']
  },
  {
    id: 'q54',
    text: 'La rebelión es la afirmación de un límite.',
    authorId: 'camus',
    topicIds: ['etica', 'politica', 'existencia']
  },
  {
    id: 'q55',
    text: 'El tiempo no es una cosa, sino el modo en que existimos.',
    authorId: 'heidegger',
    topicIds: ['tiempo', 'existencia']
  },
  {
    id: 'q56',
    text: 'Preguntar es la piedad del pensamiento.',
    authorId: 'heidegger',
    topicIds: ['conocimiento', 'existencia']
  },
  {
    id: 'q57',
    text: 'El poder no se posee; se ejerce.',
    authorId: 'foucault',
    topicIds: ['politica', 'sociedad']
  },
  {
    id: 'q58',
    text: 'Donde hay poder, hay resistencia.',
    authorId: 'foucault',
    topicIds: ['politica', 'sociedad']
  },
  {
    id: 'q59',
    text: 'La belleza es una promesa de felicidad.',
    authorId: 'nietzsche',
    topicIds: ['estetica', 'felicidad']
  },
  {
    id: 'q60',
    text: 'No deseo que las mujeres tengan poder sobre los hombres, sino sobre sí mismas.',
    authorId: 'wollstonecraft',
    topicIds: ['sociedad', 'politica', 'etica']
  },
  {
    id: 'q61',
    text: 'Fortalecer la mente por el estudio es el mejor remedio contra la adversidad.',
    authorId: 'wollstonecraft',
    topicIds: ['conocimiento', 'existencia']
  },
  {
    id: 'q62',
    text: 'Enseñar es encender una chispa, no llenar un recipiente.',
    authorId: 'hypatia',
    topicIds: ['conocimiento', 'sociedad']
  },
  {
    id: 'q63',
    text: 'La justicia es la primera virtud de las instituciones sociales.',
    authorId: 'rawls',
    topicIds: ['politica', 'etica', 'sociedad']
  },
  {
    id: 'q64',
    text: 'La imparcialidad exige pensar desde un lugar que no privilegie a nadie.',
    authorId: 'rawls',
    topicIds: ['politica', 'etica']
  }
];

const SYNTHETIC_PER_TOPIC = 500;

function capitalize(s) {
  const x = clampText(s);
  if (!x) return x;
  return x[0].toUpperCase() + x.slice(1);
}

function topicPhrase(label) {
  const l = clampText(label);
  const lower = l.toLowerCase();
  if (lower.startsWith('filosofía')) return lower;
  return `la ${lower}`;
}

function inferBaseTopicIds(label) {
  const l = normalizeLabel(label);
  const ids = new Set();

  if (/(conocimiento|epistemologia|gnoseologia|verdad|ciencia|tecnologia|matematica|fisica|biologia|psicologia|medicina|lenguaje)/.test(l)) {
    ids.add('conocimiento');
  }

  if (/(etica|moral|bioetica|axiologia|justicia|derecho)/.test(l)) {
    ids.add('etica');
  }

  if (/(politica|poder|estado|derecho|justicia|marxista)/.test(l)) {
    ids.add('politica');
  }

  if (/(sociedad|social|cultura|educacion|economia|trabajo|historia|comunicacion)/.test(l)) {
    ids.add('sociedad');
  }

  if (/(amor|eros|afecto|amistad|relaciones|intimidad|sexualidad|deseo)/.test(l)) {
    ids.add('amor');
  }

  if (/(tiempo)/.test(l)) {
    ids.add('tiempo');
  }

  if (/(mente|conciencia|percepcion|lenguaje|psicologia)/.test(l)) {
    ids.add('mente');
  }

  if (/(estetica|arte|musica|literatura|creatividad|belleza)/.test(l)) {
    ids.add('estetica');
  }

  if (/(religion|dios|teologia|espiritual)/.test(l)) {
    ids.add('religion');
  }

  if (/(metafisica|ontologia|ser|espacio|naturaleza)/.test(l)) {
    ids.add('metafisica');
  }

  if (/(existencialista|nihilista|vitalista|humanista|fenomenologica|hermeneutica|posmoderna|critica|analitica|continental|antigua|medieval|moderna|contemporanea|occidental|oriental|africana|latinoamericana|idealista|materialista|racionalista|empirista|positivista|pragmatista)/.test(l)) {
    ids.add('existencia');
  }

  return Array.from(ids);
}

function makeTopicTemplates(label) {
  const p = topicPhrase(label);
  const nameLower = clampText(label).toLowerCase();

  const templates = [
    () => `${capitalize(p)} empieza cuando dejamos de repetir respuestas y nos atrevemos a precisar preguntas.`,
    () => `En ${nameLower}, una definición clara vale más que cien opiniones rápidas.`,
    () => `${capitalize(p)} no busca cerrar la discusión: busca hacerla más honesta.`,
    () => `La tarea de ${nameLower} es distinguir lo esencial de lo accesorio sin perder el matiz.`,
    () => `Pensar ${nameLower} es aprender a ver supuestos donde antes solo veíamos costumbre.`,
    () => `Toda reflexión en ${nameLower} revela, en el fondo, una idea de vida buena.`,
    () => `${capitalize(p)} no es un lujo: es una necesidad para el pensamiento libre.`,
    () => `En ${nameLower}, cada concepto es una puerta a otras preguntas.`,
    () => `Quien ignora ${nameLower} termina repitiendo ideas sin saber por qué.`,
    () => `${capitalize(p)} enseña que no hay respuestas finales, solo mejores preguntas.`,
    () => `El rigor en ${nameLower} no impide la creatividad: la exige.`,
    () => `En ${nameLower}, el error es tan útil como el acierto si se sabe leer.`,
    () => `${capitalize(p)} nos obliga a confrontar lo que creemos saber.`,
    () => `Sin ${nameLower}, el conocimiento se vuelve un catálogo sin orden.`,
    () => `En ${nameLower}, la claridad no es simplicidad: es precisión.`,
    () => `${capitalize(p)} nos recuerda que toda certeza es provisional.`,
    () => `En ${nameLower}, las palabras importan tanto como las ideas.`,
    () => `${capitalize(p)} es el arte de pensar sobre cómo pensamos.`,
    () => `En ${nameLower}, el contexto lo es todo: cambia el sentido de todo.`,
    () => `${capitalize(p)} no es para especialistas: es para quienes quieren pensar mejor.`,
    () => `En ${nameLower}, la duda no es debilidad: es método.`,
    () => `${capitalize(p)} nos enseña a distinguir entre opinión y argumento.`,
    () => `En ${nameLower}, cada término es una historia de debates.`,
    () => `${capitalize(p)} es como un mapa: no muestra el camino, solo los posibles.`,
    () => `En ${nameLower}, lo obvio es lo que más hay que cuestionar.`,
    () => `${capitalize(p)} nos invita a pensar sin prisa, pero sin pausa.`,
    () => `En ${nameLower}, la lógica no lo es todo: la intuición también cuenta.`,
    () => `${capitalize(p)} es el ejercicio de pensar con cuidado y coraje.`,
    () => `En ${nameLower}, las preguntas valen más que las respuestas.`,
    () => `${capitalize(p)} nos enseña que no hay neutralidad, solo responsabilidad.`,
    () => `En ${nameLower}, cada concepto es una herramienta para ver mejor.`,
    () => `${capitalize(p)} es la disciplina de decir lo que se quiere decir.`,
    () => `En ${nameLower}, el silencio también habla: hay que saber escuchar.`,
    () => `${capitalize(p)} nos obliga a elegir nuestras palabras con intención.`,
    () => `En ${nameLower}, la precisión es una forma de respeto al lector.`,
    () => `${capitalize(p)} es el intento de hacer visible lo invisible.`,
    () => `En ${nameLower}, cada idea es un eslabón en una cadena más larga.`,
    () => `${capitalize(p)} nos enseña a pensar antes de actuar, y a actuar después de pensar.`,
    () => `En ${nameLower}, la evidencia es el principio, no el final.`,
    () => `${capitalize(p)} nos muestra que no hay verdad sin contexto.`,
    () => `En ${nameLower}, la contradicción es una oportunidad para aprender.`,
    () => `${capitalize(p)} es el arte de encontrar sentido en el caos.`,
    () => `En ${nameLower}, cada pregunta genera nuevas preguntas.`,
    () => `${capitalize(p)} nos enseña a dudar de nuestras propias certezas.`,
    () => `En ${nameLower}, la simplicidad es el máximo refinamiento.`,
    () => `${capitalize(p)} es el camino para entender por qué creemos lo que creemos.`,
    () => `En ${nameLower}, cada concepto tiene una historia que contar.`,
    () => `${capitalize(p)} nos obliga a pensar más allá de lo evidente.`,
    () => `En ${nameLower}, la honestidad intelectual es la primera virtud.`,
    () => `${capitalize(p)} es el ejercicio de pensar con claridad y profundidad.`,
    () => `En ${nameLower}, cada término es una ventana a un universo.`,
    () => `${capitalize(p)} nos enseña a valorar el proceso tanto como el resultado.`,
    () => `En ${nameLower}, la curiosidad es el motor del progreso.`,
    () => `${capitalize(p)} es el arte de formular las preguntas correctas.`,
    () => `En ${nameLower}, cada respuesta abre nuevas puertas.`,
    () => `${capitalize(p)} nos recuerda que pensar es un acto de libertad.`,
    () => `En ${nameLower}, la paciencia es tan importante como la perspicacia.`,
    () => `${capitalize(p)} es el camino hacia una comprensión más profunda.`,
    () => `En ${nameLower}, cada idea merece ser examinada con cuidado.`,
    () => `${capitalize(p)} nos enseña a pensar por nosotros mismos.`,
    () => `En ${nameLower}, la humildad es el comienzo del saber.`,
    () => `${capitalize(p)} es el arte de ver lo que otros no ven.`,
    () => `En ${nameLower}, cada concepto es una herramienta para transformar.`,
    () => `${capitalize(p)} nos invita a explorar los límites del pensamiento.`,
    () => `En ${nameLower}, la originalidad nace de entender profundamente.`,
    () => `${capitalize(p)} es el ejercicio de pensar con propósito y dirección.`,
    () => `En ${nameLower}, cada término tiene múltiples facetas.`,
    () => `${capitalize(p)} nos enseña a apreciar la complejidad.`,
    () => `En ${nameLower}, la claridad es el resultado del pensamiento riguroso.`,
    () => `${capitalize(p)} es el camino para entender el mundo y nosotros mismos.`,
    () => `En ${nameLower}, cada idea es una oportunidad para crecer.`,
    () => `${capitalize(p)} nos obliga a cuestionar lo que damos por sentado.`,
    () => `En ${nameLower}, la profundidad es más valiosa que la superficialidad.`,
    () => `${capitalize(p)} es el arte de pensar con independencia y rigor.`,
    () => `En ${nameLower}, cada concepto es una pieza de un rompecabezas mayor.`,
    () => `${capitalize(p)} nos enseña a valorar la calidad sobre la cantidad.`,
    () => `En ${nameLower}, la perseverancia es clave para el entendimiento.`,
    () => `${capitalize(p)} es el ejercicio de pensar con método y creatividad.`,
    () => `En ${nameLower}, cada término tiene matices que merecen ser explorados.`,
    () => `${capitalize(p)} nos recuerda que el pensamiento es una aventura.`,
    () => `En ${nameLower}, la flexibilidad mental es tan importante como la disciplina.`,
    () => `${capitalize(p)} es el camino para desarrollar un pensamiento crítico.`,
    () => `En ${nameLower}, cada idea es una conversación con la tradición.`,
    () => `${capitalize(p)} nos enseña a pensar con originalidad y fundamento.`,
    () => `En ${nameLower}, la apertura mental es esencial para el progreso.`,
    () => `${capitalize(p)} es el arte de encontrar la belleza en el pensamiento.`,
    () => `En ${nameLower}, cada concepto es una invitación a explorar más.`,
    () => `${capitalize(p)} nos obliga a pensar con ética y responsabilidad.`,
    () => `En ${nameLower}, la coherencia es el sello del pensamiento maduro.`,
    () => `${capitalize(p)} es el ejercicio de pensar con pasión y razón.`,
    () => `En ${nameLower}, cada término es una herramienta para transformar la realidad.`,
    () => `${capitalize(p)} nos enseña a valorar el diálogo y el debate.`,
    () => `En ${nameLower}, la diversidad de perspectivas enriquece el entendimiento.`,
    () => `${capitalize(p)} es el camino para construir un mundo mejor.`,
    () => `En ${nameLower}, cada idea es un acto de creación.`,
    () => `${capitalize(p)} nos recuerda que pensar es un acto revolucionario.`,
    () => `En ${nameLower}, la valentía intelectual es tan importante como la inteligencia.`,
    () => `${capitalize(p)} es el arte de pensar con libertad y compromiso.`,
    () => `En ${nameLower}, cada concepto es una semilla para el futuro.`,
    () => `${capitalize(p)} nos enseña a pensar con trascendencia.`,
    () => `En ${nameLower}, la esperanza es el combustible del pensamiento.`,
    () => `${capitalize(p)} es el ejercicio de pensar con propósito y visión.`,
    () => `En ${nameLower}, cada término es una promesa de posibilidad.`,
    () => `${capitalize(p)} nos invita a soñar con los ojos abiertos.`,
    () => `En ${nameLower}, la imaginación es el límite del pensamiento.`,
    () => `${capitalize(p)} es el camino para crear nuevos mundos.`
  ];

  return templates;
}

function generateSyntheticQuotes() {
  const existingIds = new Set(quotes.map((q) => q.id));
  let seq = 1;

  const out = [];
  for (const t of topics) {
    const templates = makeTopicTemplates(t.label);
    const baseIds = inferBaseTopicIds(t.label);

    for (let i = 0; i < Math.min(SYNTHETIC_PER_TOPIC, templates.length); i += 1) {
      let id = `auto-${t.id}-${seq}`;
      while (existingIds.has(id)) {
        seq += 1;
        id = `auto-${t.id}-${seq}`;
      }
      existingIds.add(id);

      const topicIds = Array.from(new Set([t.id, ...baseIds]));
      out.push({
        id,
        text: templates[i](),
        authorId: 'biblioteca',
        topicIds
      });
      seq += 1;
    }
  }

  return out;
}

quotes.push(...generateSyntheticQuotes());
