// Lingify — IELTS, TOEFL, SAT Mock Test Data

// ── IELTS ──────────────────────────────────────────────────────────────────

export const IELTS_READING_PASSAGES = [
  {
    id: 'ielts-r1',
    title: 'The History of the Internet',
    text: `The Internet, one of the most transformative technologies of the 20th century, has its roots in a project called ARPANET, developed in the late 1960s by the United States Department of Defense. The original purpose was to create a communication network that could survive a nuclear attack by routing information through multiple paths. By 1969, four computers were connected, forming the embryonic Internet.

Throughout the 1970s, researchers developed the fundamental protocols that make the modern Internet function. The Transmission Control Protocol (TCP) and Internet Protocol (IP) were introduced in 1974, establishing the framework for how data packets are transmitted across networks. These protocols remain the backbone of Internet communication today.

The 1980s saw the Internet expand beyond military and academic institutions. The term "Internet" was first used in 1982, and by 1986, the National Science Foundation had created NSFNET, which connected universities and research centers across the United States. Email, one of the Internet's first practical applications, became widely used during this period.

The revolutionary World Wide Web was invented by British scientist Tim Berners-Lee in 1989 while working at CERN, the European particle physics laboratory. Berners-Lee proposed a system of hypertext documents interconnected via the Internet, and by 1991, the first web page was live. This innovation transformed the Internet from a tool used primarily by scientists and academics into a global communication platform accessible to ordinary people.

The commercialization of the Internet in the 1990s led to explosive growth. Browsers like Mosaic and Netscape made the web accessible to non-technical users. Search engines, e-commerce sites, and social platforms emerged rapidly. By 2000, there were approximately 360 million Internet users worldwide — a number that would grow to billions in subsequent decades.`,
    questions: [
      {
        id: 'r1-q1',
        type: 'multiple_choice',
        question: 'What was the original purpose of ARPANET?',
        options: [
          'To connect universities across the United States',
          'To create a communication network that could survive a nuclear attack',
          'To develop commercial applications for the Internet',
          'To establish email communication between government agencies',
        ],
        correct: 1,
      },
      {
        id: 'r1-q2',
        type: 'multiple_choice',
        question: 'When were the TCP/IP protocols introduced?',
        options: ['1969', '1972', '1974', '1982'],
        correct: 2,
      },
      {
        id: 'r1-q3',
        type: 'multiple_choice',
        question: 'Who invented the World Wide Web?',
        options: [
          'An American scientist at DARPA',
          'A team of researchers at a US university',
          'British scientist Tim Berners-Lee at CERN',
          'The founders of Netscape',
        ],
        correct: 2,
      },
      {
        id: 'r1-q4',
        type: 'multiple_choice',
        question: 'According to the passage, which statement about the 1990s is TRUE?',
        options: [
          'The Internet was primarily used by military institutions',
          'TCP/IP protocols were introduced during this period',
          'The commercialization of the Internet led to explosive growth',
          'ARPANET was created in this decade',
        ],
        correct: 2,
      },
      {
        id: 'r1-q5',
        type: 'true_false_ng',
        question: 'NSFNET was created to help universities communicate with military institutions.',
        options: ['True', 'False', 'Not Given'],
        correct: 2,
      },
      {
        id: 'r1-q6',
        type: 'true_false_ng',
        question: 'The first web page went live in 1991.',
        options: ['True', 'False', 'Not Given'],
        correct: 0,
      },
      {
        id: 'r1-q7',
        type: 'multiple_choice',
        question: 'What does the word "embryonic" in paragraph 1 most likely mean?',
        options: ['fully developed', 'in an early stage', 'highly sophisticated', 'commercially successful'],
        correct: 1,
      },
    ],
  },
  {
    id: 'ielts-r2',
    title: 'Urban Farming: The Future of Food Production',
    text: `As the global population continues to grow and urbanization accelerates, traditional agricultural models face increasing pressure to meet food demands. Urban farming — the practice of cultivating food within cities — has emerged as a promising solution to these challenges. From rooftop gardens to vertical farms, cities around the world are experimenting with innovative approaches to food production.

Vertical farming, perhaps the most technologically advanced form of urban agriculture, involves growing crops in stacked layers within controlled environments. These facilities use artificial lighting, precise temperature control, and hydroponic or aeroponic systems to maximize yield while minimizing land use. A single vertical farm can produce the equivalent of dozens of hectares of traditional farmland in a fraction of the space.

The benefits of urban farming extend beyond simple food production. By growing food closer to consumers, urban farms can dramatically reduce transportation costs and carbon emissions associated with the food supply chain. Fresh produce can be harvested and delivered within hours rather than days, improving nutritional quality. Additionally, urban farms can be established in abandoned buildings or unused spaces, contributing to urban renewal.

However, urban farming faces significant challenges. The initial investment required for vertical farming infrastructure is substantial, and energy consumption for artificial lighting and climate control can be considerable. Critics argue that without renewable energy sources, the environmental benefits may be offset by increased electricity usage. Water management also presents challenges, though hydroponic systems typically use 70-90% less water than conventional farming.

Despite these obstacles, urban farming is gaining momentum. Singapore, facing severe land constraints, has invested heavily in vertical farming technology. In Detroit, once-vacant lots have been transformed into community gardens that provide fresh food to underserved neighborhoods. As technology advances and economies of scale reduce costs, urban farming may indeed become a significant component of future food systems.`,
    questions: [
      {
        id: 'r2-q1',
        type: 'multiple_choice',
        question: 'What is vertical farming?',
        options: [
          'Farming on the sides of mountains',
          'Growing crops in stacked layers in controlled environments',
          'Traditional farming that uses vertical irrigation',
          'Farming that relies entirely on natural sunlight',
        ],
        correct: 1,
      },
      {
        id: 'r2-q2',
        type: 'multiple_choice',
        question: 'According to the passage, one advantage of urban farming is:',
        options: [
          'It requires no initial investment',
          'It eliminates all carbon emissions',
          'It reduces transportation costs and carbon emissions',
          'It produces food that is always cheaper than conventionally farmed food',
        ],
        correct: 2,
      },
      {
        id: 'r2-q3',
        type: 'true_false_ng',
        question: 'Hydroponic systems use more water than conventional farming.',
        options: ['True', 'False', 'Not Given'],
        correct: 1,
      },
      {
        id: 'r2-q4',
        type: 'true_false_ng',
        question: 'Singapore has invested in vertical farming due to limited land.',
        options: ['True', 'False', 'Not Given'],
        correct: 0,
      },
      {
        id: 'r2-q5',
        type: 'multiple_choice',
        question: 'What is a key criticism of vertical farming?',
        options: [
          'It cannot produce enough food to be worthwhile',
          'High energy consumption may offset environmental benefits',
          'The technology is too complicated for widespread adoption',
          'It produces lower-quality food than traditional farming',
        ],
        correct: 1,
      },
    ],
  },
]

export const IELTS_LISTENING_SECTIONS = [
  {
    id: 'ielts-l1',
    section: 1,
    title: 'Conversation: Booking a Hotel Room',
    audioDescription: '[Audio: A conversation between a hotel receptionist and a guest]',
    transcript: `Receptionist: Good afternoon, Riverside Hotel, how may I help you?
Guest: Hi, I'd like to make a reservation, please.
Receptionist: Certainly! What dates are you looking at?
Guest: I need a room from the 15th to the 18th of March — so that's three nights.
Receptionist: And what type of room would you prefer?
Guest: A double room, please. Non-smoking if possible.
Receptionist: Let me check availability... Yes, we have a double non-smoking room available. That would be £85 per night, including breakfast.
Guest: That sounds perfect. Could I also request a room with a view?
Receptionist: I can note that as a preference, though we cannot guarantee it. May I take your name?
Guest: It's Johnson — David Johnson.
Receptionist: And a contact number?
Guest: 07854 321 098.
Receptionist: Wonderful. Your reservation is confirmed for March 15-18, double room, non-smoking, breakfast included. The total will be £255.`,
    questions: [
      {
        id: 'l1-q1',
        type: 'multiple_choice',
        question: 'How many nights does the guest want to stay?',
        options: ['Two', 'Three', 'Four', 'Five'],
        correct: 1,
      },
      {
        id: 'l1-q2',
        type: 'multiple_choice',
        question: 'What type of room does the guest request?',
        options: ['Single room', 'Twin room', 'Double non-smoking room', 'Suite'],
        correct: 2,
      },
      {
        id: 'l1-q3',
        type: 'multiple_choice',
        question: 'What is the price per night?',
        options: ['£75', '£80', '£85', '£90'],
        correct: 2,
      },
      {
        id: 'l1-q4',
        type: 'multiple_choice',
        question: 'What is the total cost of the stay?',
        options: ['£200', '£225', '£255', '£270'],
        correct: 2,
      },
      {
        id: 'l1-q5',
        type: 'multiple_choice',
        question: 'What additional request does the guest make?',
        options: [
          'A room with a bathtub',
          'A room with a view',
          'An early check-in',
          'Airport transfer',
        ],
        correct: 1,
      },
    ],
  },
]

export const IELTS_WRITING_TASKS = [
  {
    id: 'ielts-w1',
    task: 1,
    title: 'Academic Writing Task 1',
    prompt: `The graph below shows the percentage of households in the UK with access to the Internet between 1998 and 2022.

[Chart Description: A line graph showing Internet access rising from approximately 9% in 1998 to 96% in 2022, with rapid growth between 2000-2010]

Summarise the information by selecting and reporting the main features, and make comparisons where relevant.

Write at least 150 words.`,
    timeLimit: 20,
    wordLimit: 150,
    bandDescriptors: [
      'Task Achievement — How well you address the task',
      'Coherence & Cohesion — Organization and flow',
      'Lexical Resource — Range and accuracy of vocabulary',
      'Grammatical Range & Accuracy — Grammar complexity and correctness',
    ],
    modelAnswer: `The line graph illustrates the proportion of UK households with Internet access from 1998 to 2022.

Overall, there was a dramatic increase in Internet penetration over the 24-year period, rising from a mere 9% in 1998 to an impressive 96% by 2022.

In the initial years, growth was relatively modest, with Internet access reaching approximately 25% by 2000. However, the period between 2000 and 2010 witnessed the most rapid expansion, as access rates surged from around 25% to approximately 73%. This steep rise can largely be attributed to the proliferation of broadband technology and falling equipment costs.

Between 2010 and 2022, the growth rate slowed considerably as the market approached saturation. Nevertheless, access continued to climb steadily, reaching 96% by 2022, suggesting that near-universal Internet connectivity was achieved across UK households.

In conclusion, Internet access transformed from a minority luxury to an almost universal household feature over this period.`,
  },
  {
    id: 'ielts-w2',
    task: 2,
    title: 'Academic Writing Task 2',
    prompt: `Some people believe that university education should be free for all students, while others argue that students should pay for their own tuition fees.

Discuss both views and give your own opinion.

Write at least 250 words.`,
    timeLimit: 40,
    wordLimit: 250,
    bandDescriptors: [
      'Task Response — Arguments are clear, relevant, and fully developed',
      'Coherence & Cohesion — Logical paragraphing with clear progression',
      'Lexical Resource — Varied and precise vocabulary',
      'Grammatical Range & Accuracy — Wide range of structures used accurately',
    ],
  },
]

export const IELTS_SPEAKING_PARTS = [
  {
    id: 'ielts-s1',
    part: 1,
    title: 'Part 1 — Introduction & Interview',
    duration: '4-5 minutes',
    questions: [
      'Can you tell me your full name, please?',
      'Where are you from?',
      'Do you work or are you a student?',
      'What do you enjoy doing in your free time?',
      'Do you like reading? Why or why not?',
      'How often do you use public transport?',
    ],
  },
  {
    id: 'ielts-s2',
    part: 2,
    title: 'Part 2 — Individual Long Turn',
    duration: '3-4 minutes (1 min prep + 2 min talk)',
    cueCard: {
      topic: 'Describe a place you have visited that you particularly enjoyed.',
      points: [
        'Where it is',
        'When you went there',
        'What you did there',
        'And explain why you particularly enjoyed this place',
      ],
    },
  },
  {
    id: 'ielts-s3',
    part: 3,
    title: 'Part 3 — Two-way Discussion',
    duration: '4-5 minutes',
    questions: [
      'Why do you think people enjoy traveling?',
      'How has tourism changed in recent years?',
      'What are the advantages and disadvantages of mass tourism?',
      'Do you think people will travel more or less in the future?',
      'How can countries attract more tourists while protecting the environment?',
    ],
  },
]

// ── TOEFL ─────────────────────────────────────────────────────────────────

export const TOEFL_READING = [
  {
    id: 'toefl-r1',
    title: 'The Formation of Coral Reefs',
    text: `Coral reefs are among the most biologically diverse ecosystems on Earth, often called the "rainforests of the sea." These complex structures are built over thousands of years through the accumulated skeletons of tiny marine animals called coral polyps. Understanding how coral reefs form requires examining both the biology of coral organisms and the geological processes that shape these environments.

Coral polyps are small, soft-bodied organisms related to sea anemones and jellyfish. They secrete calcium carbonate to form a hard exoskeleton that provides protection and structure. When polyps die, their skeletons remain, and new polyps grow on top of them. Over time, this process creates the massive limestone structures we recognize as coral reefs.

The relationship between coral and microscopic algae called zooxanthellae is fundamental to reef formation. These algae live within coral tissue and provide up to 90% of the energy coral needs through photosynthesis. In return, coral offers the algae shelter and nutrients. This symbiotic relationship explains why coral reefs are predominantly found in shallow, clear, warm tropical waters — conditions that allow sunlight to penetrate and support algal growth.

Coral reefs develop in several distinct forms. Fringing reefs grow directly along coastlines. Barrier reefs are separated from the shore by a lagoon, with Australia's Great Barrier Reef being the most famous example. Atolls are ring-shaped reefs that form around submerged volcanic islands.

Today, coral reefs face unprecedented threats from climate change. Rising ocean temperatures cause coral bleaching, a process where stressed coral expels its zooxanthellae, turning white and becoming vulnerable to disease. Ocean acidification, caused by increased absorption of atmospheric carbon dioxide, weakens coral skeletons by reducing calcium carbonate availability. Scientists estimate that without significant reductions in carbon emissions, most coral reefs could be severely degraded by 2050.`,
    questions: [
      {
        id: 'tr1-q1',
        type: 'multiple_choice',
        question: 'What is the primary building material of coral reefs?',
        options: [
          'Zooxanthellae algae',
          'Calcium carbonate from coral skeletons',
          'Limestone from volcanic activity',
          'Sand and sediment from ocean floors',
        ],
        correct: 1,
      },
      {
        id: 'tr1-q2',
        type: 'multiple_choice',
        question: 'What percentage of energy do zooxanthellae provide to coral?',
        options: ['Up to 50%', 'Up to 70%', 'Up to 90%', 'Up to 100%'],
        correct: 2,
      },
      {
        id: 'tr1-q3',
        type: 'multiple_choice',
        question: 'What is an atoll?',
        options: [
          'A reef growing directly along a coastline',
          'A reef separated from shore by a lagoon',
          'A ring-shaped reef around a submerged volcanic island',
          'A deep-water reef formation',
        ],
        correct: 2,
      },
      {
        id: 'tr1-q4',
        type: 'multiple_choice',
        question: 'What causes coral bleaching?',
        options: [
          'Low salinity levels in ocean water',
          'Rising ocean temperatures causing coral to expel zooxanthellae',
          'Increased UV radiation reaching ocean surfaces',
          'Overgrowth of competing marine organisms',
        ],
        correct: 1,
      },
      {
        id: 'tr1-q5',
        type: 'multiple_choice',
        question: 'The word "symbiotic" in paragraph 3 refers to a relationship that is:',
        options: [
          'competitive and harmful',
          'mutually beneficial',
          'one-sided and parasitic',
          'temporary and unstable',
        ],
        correct: 1,
      },
    ],
  },
]

// ── SAT ───────────────────────────────────────────────────────────────────

export const SAT_MATH = [
  {
    id: 'sat-m1',
    section: 'Math — No Calculator',
    questions: [
      {
        id: 'sm-q1',
        question: 'If 3x + 7 = 22, what is the value of x?',
        options: ['3', '5', '7', '9'],
        correct: 1,
        explanation: '3x + 7 = 22 → 3x = 15 → x = 5',
      },
      {
        id: 'sm-q2',
        question: 'A rectangle has a length of 12 and a width of 8. What is its perimeter?',
        options: ['20', '40', '96', '48'],
        correct: 1,
        explanation: 'Perimeter = 2(l + w) = 2(12 + 8) = 2(20) = 40',
      },
      {
        id: 'sm-q3',
        question: 'If f(x) = 2x² - 3x + 1, what is f(3)?',
        options: ['10', '12', '13', '14'],
        correct: 0,
        explanation: 'f(3) = 2(9) - 3(3) + 1 = 18 - 9 + 1 = 10',
      },
      {
        id: 'sm-q4',
        question: 'Which of the following is equivalent to (x + 3)(x - 2)?',
        options: ['x² + x - 6', 'x² - x - 6', 'x² + 5x - 6', 'x² - 5x + 6'],
        correct: 0,
        explanation: '(x+3)(x-2) = x² - 2x + 3x - 6 = x² + x - 6',
      },
      {
        id: 'sm-q5',
        question: 'What is 15% of 240?',
        options: ['32', '36', '38', '40'],
        correct: 1,
        explanation: '15% × 240 = 0.15 × 240 = 36',
      },
    ],
  },
]

// ── Test Catalog ───────────────────────────────────────────────────────────

export const TEST_CATALOG = [
  {
    id: 'ielts-full-1',
    type: 'IELTS',
    title: 'IELTS Academic — Full Mock Test 1',
    level: 'B1 - C2',
    sections: ['Listening', 'Reading', 'Writing', 'Speaking'],
    totalTime: 165,
    questions: 40,
    band: null,
    description: 'To\'liq IELTS Academic imtixoni simulyatsiyasi. 4 bo\'lim, 165 daqiqa.',
    difficulty: 'Mixed',
    premium: false,
  },
  {
    id: 'ielts-reading-1',
    type: 'IELTS',
    title: 'IELTS Reading — Practice Test 1',
    level: 'B1 - C1',
    sections: ['Reading'],
    totalTime: 60,
    questions: 13,
    band: null,
    description: 'IELTS Academic Reading bo\'limi — 2 ta passage, 13 ta savol.',
    difficulty: 'Intermediate',
    premium: false,
  },
  {
    id: 'ielts-listening-1',
    type: 'IELTS',
    title: 'IELTS Listening — Practice Test 1',
    level: 'A2 - C1',
    sections: ['Listening'],
    totalTime: 30,
    questions: 5,
    description: 'IELTS Listening — Section 1: Suhbat',
    difficulty: 'Beginner',
    premium: false,
  },
  {
    id: 'ielts-writing-1',
    type: 'IELTS',
    title: 'IELTS Writing — Task 1 + Task 2',
    level: 'B1 - C1',
    sections: ['Writing'],
    totalTime: 60,
    questions: 2,
    description: 'IELTS Academic Writing Task 1 (grafik tahlil) + Task 2 (esse)',
    difficulty: 'Intermediate',
    premium: true,
  },
  {
    id: 'ielts-full-2',
    type: 'IELTS',
    title: 'IELTS Academic — Full Mock Test 2',
    level: 'B2 - C2',
    sections: ['Listening', 'Reading', 'Writing', 'Speaking'],
    totalTime: 165,
    questions: 40,
    description: 'IELTS Full Mock Test 2 — qiyinroq savollar.',
    difficulty: 'Hard',
    premium: true,
  },
  {
    id: 'toefl-reading-1',
    type: 'TOEFL',
    title: 'TOEFL Reading — Section Practice',
    level: 'B1 - C1',
    sections: ['Reading'],
    totalTime: 54,
    questions: 5,
    description: 'TOEFL iBT Reading bo\'limi — Academic matn tahlili',
    difficulty: 'Intermediate',
    premium: false,
  },
  {
    id: 'sat-math-1',
    type: 'SAT',
    title: 'SAT Math — No Calculator Section',
    level: 'B1 - C1',
    sections: ['Math'],
    totalTime: 25,
    questions: 5,
    description: 'SAT Math bo\'limi — Algebraic expressions, functions',
    difficulty: 'Intermediate',
    premium: false,
  },
]

// ── Section configs ─────────────────────────────────────────────────────────

export function getTestById(id) {
  return TEST_CATALOG.find((t) => t.id === id) || null
}

export function getTestQuestions(testId) {
  switch (testId) {
    case 'ielts-reading-1':
      return {
        type: 'reading',
        passages: IELTS_READING_PASSAGES,
        allQuestions: IELTS_READING_PASSAGES.flatMap((p) => p.questions),
      }
    case 'ielts-listening-1':
      return {
        type: 'listening',
        sections: IELTS_LISTENING_SECTIONS,
        allQuestions: IELTS_LISTENING_SECTIONS.flatMap((s) => s.questions),
      }
    case 'ielts-writing-1':
      return {
        type: 'writing',
        tasks: IELTS_WRITING_TASKS,
      }
    case 'toefl-reading-1':
      return {
        type: 'reading',
        passages: TOEFL_READING,
        allQuestions: TOEFL_READING.flatMap((p) => p.questions),
      }
    case 'sat-math-1':
      return {
        type: 'mcq',
        allQuestions: SAT_MATH[0].questions,
      }
    default:
      return null
  }
}

// ── Band score calculator ───────────────────────────────────────────────────
export function calculateBandScore(correct, total) {
  const pct = correct / total
  if (pct >= 0.90) return 9.0
  if (pct >= 0.83) return 8.5
  if (pct >= 0.75) return 8.0
  if (pct >= 0.67) return 7.5
  if (pct >= 0.60) return 7.0
  if (pct >= 0.53) return 6.5
  if (pct >= 0.46) return 6.0
  if (pct >= 0.39) return 5.5
  if (pct >= 0.32) return 5.0
  if (pct >= 0.25) return 4.5
  if (pct >= 0.18) return 4.0
  return 3.5
}

// ── Test results storage ────────────────────────────────────────────────────
const RESULTS_KEY = 'lingify_test_results'

export function saveTestResult(result) {
  const existing = JSON.parse(localStorage.getItem(RESULTS_KEY) || '[]')
  existing.unshift({ ...result, id: `result-${Date.now()}`, takenAt: Date.now() })
  localStorage.setItem(RESULTS_KEY, JSON.stringify(existing.slice(0, 20)))
}

export function getTestResults() {
  return JSON.parse(localStorage.getItem(RESULTS_KEY) || '[]')
}
