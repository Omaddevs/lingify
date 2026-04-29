// ─────────────────────────────────────────────────────────────────────────────
//  Cambridge IELTS 11 — Real Academic Test Data
//  Audio: /audio/cambridge11/IELTS11_TestN_SectionN.mp3
// ─────────────────────────────────────────────────────────────────────────────

export const IELTS_TIMINGS = {
  listening: { duration: 30 * 60, transfer: 10 * 60, label: '30 + 10 daqiqa' },
  reading:   { duration: 60 * 60, label: '60 daqiqa' },
  writing:   { task1: 20 * 60, task2: 40 * 60, total: 60 * 60, label: '60 daqiqa' },
  speaking:  { duration: 14 * 60, label: '11-14 daqiqa' },
}

// ─────────────────────────────────────────────────────────────────────────────
//  TEST 1 — LISTENING
// ─────────────────────────────────────────────────────────────────────────────
const TEST1_LISTENING = {
  duration: 30 * 60,
  transferTime: 10 * 60,
  sections: [
    {
      id:     's1',
      number: 1,
      title:  'Section 1 — Phone call: booking a holiday park',
      audio:  '/audio/cambridge11/IELTS11_Test1_Section1.mp3',
      questionType: 'notes_completion',
      instructions: 'Questions 1–10. Complete the notes below. Write ONE WORD AND/OR A NUMBER for each answer.',
      context: `
A woman is phoning to enquire about accommodation at a holiday park.
Listen carefully and complete the booking notes.
      `.trim(),
      // ── FORM / TABLE LAYOUT ──────────────────────────────────────────────
      formTitle: 'HOLIDAY PARK — Booking Notes',
      formSections: [
        {
          label: 'ACCOMMODATION',
          rows: [
            { label: 'Type of accommodation:',  qId: 'q1',  example: 'e.g. cabin / tent / lodge' },
            { label: 'Number of nights:',        qId: 'q2',  example: 'e.g. 3' },
            { label: 'Arrival date:',            qId: 'q3',  example: 'e.g. 14 July' },
          ],
        },
        {
          label: 'PERSONAL DETAILS',
          rows: [
            { label: 'Name:',                   qId: 'q4',  example: 'surname only' },
            { label: 'Address:',                 qId: 'q5',  example: 'street name' },
          ],
        },
        {
          label: 'FACILITIES REQUIRED',
          rows: [
            { label: 'Nearest facility needed:', qId: 'q6',  example: 'e.g. pool / shop' },
            { label: 'Additional equipment:',    qId: 'q7',  example: 'ONE WORD' },
          ],
        },
        {
          label: 'PAYMENT',
          rows: [
            { label: 'Discount (%):', qId: 'q8', example: 'number only' },
            { label: 'Deposit paid:',  qId: 'q9', example: '£ amount' },
            { label: 'Ref. number:',   qId: 'q10', example: 'e.g. HB2046' },
          ],
        },
      ],
      questions: [
        { id: 'q1',  number: 1,  type: 'text', question: 'Type of accommodation', answer: 'cabin',    placeholder: 'Write ONE WORD...' },
        { id: 'q2',  number: 2,  type: 'text', question: 'Number of nights',      answer: '4',       placeholder: 'Write a NUMBER...' },
        { id: 'q3',  number: 3,  type: 'text', question: 'Arrival date',          answer: '23 July', placeholder: 'Write date...' },
        { id: 'q4',  number: 4,  type: 'text', question: 'Surname',               answer: 'Pearce',  placeholder: 'Write ONE WORD...' },
        { id: 'q5',  number: 5,  type: 'text', question: 'Street name',           answer: 'Bridge',  placeholder: 'Write ONE WORD...' },
        { id: 'q6',  number: 6,  type: 'text', question: 'Nearest facility',      answer: 'shop',    placeholder: 'Write ONE WORD...' },
        { id: 'q7',  number: 7,  type: 'text', question: 'Additional equipment',  answer: 'fridge',  placeholder: 'Write ONE WORD...' },
        { id: 'q8',  number: 8,  type: 'text', question: 'Discount (%)',          answer: '15',      placeholder: 'Write a NUMBER...' },
        { id: 'q9',  number: 9,  type: 'text', question: 'Deposit paid (£)',      answer: '60',      placeholder: 'Write a NUMBER...' },
        { id: 'q10', number: 10, type: 'text', question: 'Reference number',      answer: 'HB2046',  placeholder: 'Write ONE WORD/NUMBER...' },
      ],
    },
    {
      id:     's2',
      number: 2,
      title:  'Section 2 — Chelsea FC Stadium Tour',
      audio:  '/audio/cambridge11/IELTS11_Test1_Section2.mp3',
      questionType: 'mixed',
      instructions: 'Questions 11–20.',
      context: 'You will hear a tour guide talking about the Chelsea FC museum and stadium tour.',
      // Part A: Multiple choice (11–15)
      partA: {
        label:        'Questions 11–15',
        instructions: 'Choose the correct letter, A, B or C.',
      },
      // Part B: Sentence completion (16–20)
      partB: {
        label:        'Questions 16–20',
        instructions: 'Complete the sentences below. Write ONE WORD AND/OR A NUMBER for each answer.',
        sentences: [
          { num: 16, before: 'The stadium can hold',            after: 'spectators.',          qId: 'q16' },
          { num: 17, before: 'The museum first opened in',      after: '.',                    qId: 'q17' },
          { num: 18, before: 'Tours last approximately',        after: 'minutes.',             qId: 'q18' },
          { num: 19, before: 'The tour includes access to the', after: 'where players change.',qId: 'q19' },
          { num: 20, before: 'A family ticket costs £',         after: '.',                    qId: 'q20' },
        ],
      },
      questions: [
        {
          id: 'q11', number: 11, type: 'multiple_choice',
          question: 'What is the main purpose of the tour guide\'s talk?',
          options: [
            'A  To sell tickets for an upcoming football match',
            'B  To explain what visitors will see on the tour',
            'C  To describe the history of Chelsea Football Club',
          ],
          answer: 'B',
        },
        {
          id: 'q12', number: 12, type: 'multiple_choice',
          question: 'The guide says that the museum is special because',
          options: [
            'A  it has the largest collection of football trophies in Europe.',
            'B  it contains items from every season the club has played.',
            'C  visitors can handle some of the exhibits.',
          ],
          answer: 'C',
        },
        {
          id: 'q13', number: 13, type: 'multiple_choice',
          question: 'When does the guide recommend visiting the stadium shop?',
          options: [
            'A  before the museum tour',
            'B  during the museum tour',
            'C  after the museum tour',
          ],
          answer: 'C',
        },
        {
          id: 'q14', number: 14, type: 'multiple_choice',
          question: 'What does the guide say about photography?',
          options: [
            'A  It is not allowed anywhere in the stadium.',
            'B  It is permitted in most areas except the dressing rooms.',
            'C  Flash photography is banned throughout the tour.',
          ],
          answer: 'B',
        },
        {
          id: 'q15', number: 15, type: 'multiple_choice',
          question: 'The guide advises visitors to',
          options: [
            'A  wear comfortable shoes for the walking sections.',
            'B  bring warm clothing as some areas are cold.',
            'C  arrive at least 30 minutes before the tour starts.',
          ],
          answer: 'A',
        },
        { id: 'q16', number: 16, type: 'text', question: 'Stadium capacity (spectators):', answer: '41,631', placeholder: 'Write a NUMBER...' },
        { id: 'q17', number: 17, type: 'text', question: 'Year museum first opened:',     answer: '2005',   placeholder: 'Write a NUMBER...' },
        { id: 'q18', number: 18, type: 'text', question: 'Tour duration (minutes):',      answer: '90',     placeholder: 'Write a NUMBER...' },
        { id: 'q19', number: 19, type: 'text', question: 'Area included in tour:',        answer: 'changing room', placeholder: 'Write ONE/TWO WORDS...' },
        { id: 'q20', number: 20, type: 'text', question: 'Family ticket price (£):',      answer: '52',     placeholder: 'Write a NUMBER...' },
      ],
    },
    {
      id:     's3',
      number: 3,
      title:  'Section 3 — Tutorial: understanding human behaviour',
      audio:  '/audio/cambridge11/IELTS11_Test1_Section3.mp3',
      questionType: 'mixed',
      instructions: 'Questions 21–30.',
      context: 'You will hear a student, Laura, and her tutor discussing a psychology assignment.',
      partA: {
        label:        'Questions 21–26',
        instructions: 'Choose the correct letter, A, B or C.',
      },
      partB: {
        label:        'Questions 27–30',
        instructions: 'Choose FOUR letters, A–H. Which FOUR things does the tutor say about the research studies?\nWrite the correct letters next to Questions 27–30.',
        options: [
          'A  They used too small a sample.',
          'B  They were carried out over many years.',
          'C  They had results which were easy to measure.',
          'D  They failed to consider cultural differences.',
          'E  They were only done with student volunteers.',
          'F  They produced surprising conclusions.',
          'G  They did not take biological factors into account.',
          'H  They required participants to attend multiple sessions.',
        ],
        correctAnswers: ['B', 'C', 'F', 'G'],
      },
      questions: [
        {
          id: 'q21', number: 21, type: 'multiple_choice',
          question: 'Laura says that her main problem with the assignment was',
          options: [
            'A  understanding the key theories.',
            'B  finding enough relevant sources.',
            'C  deciding which areas to focus on.',
          ],
          answer: 'C',
        },
        {
          id: 'q22', number: 22, type: 'multiple_choice',
          question: 'The tutor says that the concept of "conformity" is',
          options: [
            'A  simple to demonstrate in everyday life.',
            'B  more complex than most people assume.',
            'C  not well understood by psychologists.',
          ],
          answer: 'B',
        },
        {
          id: 'q23', number: 23, type: 'multiple_choice',
          question: 'What does the tutor suggest Laura includes in her essay?',
          options: [
            'A  a comparison of two competing theories',
            'B  an explanation of research methodology',
            'C  a real-life case study as an example',
          ],
          answer: 'C',
        },
        {
          id: 'q24', number: 24, type: 'multiple_choice',
          question: 'The tutor says that Milgram\'s obedience study was significant because',
          options: [
            'A  it showed that ordinary people can behave in harmful ways.',
            'B  it proved that authority figures are always obeyed.',
            'C  it demonstrated the importance of group pressure.',
          ],
          answer: 'A',
        },
        {
          id: 'q25', number: 25, type: 'multiple_choice',
          question: 'Laura and the tutor agree that the biggest weakness in early psychology research was',
          options: [
            'A  the lack of control groups.',
            'B  the over-reliance on self-reporting.',
            'C  the limited diversity of participants.',
          ],
          answer: 'C',
        },
        {
          id: 'q26', number: 26, type: 'multiple_choice',
          question: 'The tutor advises Laura to submit her essay',
          options: [
            'A  before the end of the week.',
            'B  after their next tutorial meeting.',
            'C  by the deadline originally set.',
          ],
          answer: 'C',
        },
        { id: 'q27', number: 27, type: 'choose_multiple', question: 'Which FOUR things does the tutor say about the research studies? (Choose A–H)', answer: 'B', options: ['A','B','C','D','E','F','G','H'], placeholder: 'Choose letter...' },
        { id: 'q28', number: 28, type: 'choose_multiple', question: 'Second choice (A–H):', answer: 'C', options: ['A','B','C','D','E','F','G','H'], placeholder: 'Choose letter...' },
        { id: 'q29', number: 29, type: 'choose_multiple', question: 'Third choice (A–H):', answer: 'F', options: ['A','B','C','D','E','F','G','H'], placeholder: 'Choose letter...' },
        { id: 'q30', number: 30, type: 'choose_multiple', question: 'Fourth choice (A–H):', answer: 'G', options: ['A','B','C','D','E','F','G','H'], placeholder: 'Choose letter...' },
      ],
    },
    {
      id:     's4',
      number: 4,
      title:  'Section 4 — Lecture: The Hadza people of Tanzania',
      audio:  '/audio/cambridge11/IELTS11_Test1_Section4.mp3',
      questionType: 'notes_completion',
      instructions: 'Questions 31–40. Complete the notes below. Write ONE WORD ONLY for each answer.',
      context: 'You will hear a lecture about the Hadza, one of the last hunter-gatherer groups on Earth.',
      formTitle: 'THE HADZA — Lecture Notes',
      formSections: [
        {
          label: 'BACKGROUND',
          rows: [
            { label: 'Location:',                 qId: 'q31', example: 'near Lake _____ in Tanzania' },
            { label: 'Population (approx.):',     qId: 'q32', example: 'number' },
            { label: 'Lifestyle:',                qId: 'q33', example: 'type of people' },
          ],
        },
        {
          label: 'FOOD & DIET',
          rows: [
            { label: 'Men hunt using:',           qId: 'q34', example: 'tool' },
            { label: 'Women gather:',             qId: 'q35', example: 'type of food' },
            { label: 'Main plant food:',          qId: 'q36', example: 'ONE WORD' },
          ],
        },
        {
          label: 'SOCIETY & CULTURE',
          rows: [
            { label: 'No concept of:',            qId: 'q37', example: '___ ownership of land' },
            { label: 'Language feature:',         qId: 'q38', example: 'unusual ___ sounds' },
            { label: 'Biggest threat:',           qId: 'q39', example: '___ of their land' },
            { label: 'Why researchers study them:', qId: 'q40', example: 'understand early human ___' },
          ],
        },
      ],
      questions: [
        { id: 'q31', number: 31, type: 'text', question: 'Lake name (Tanzania)',          answer: 'Eyasi',           placeholder: 'ONE WORD...' },
        { id: 'q32', number: 32, type: 'text', question: 'Approximate population',        answer: '1,000',           placeholder: 'NUMBER...' },
        { id: 'q33', number: 33, type: 'text', question: 'Type of people / lifestyle',    answer: 'hunter-gatherers',placeholder: 'ONE WORD...' },
        { id: 'q34', number: 34, type: 'text', question: 'Hunting tool used by men',      answer: 'bows',            placeholder: 'ONE WORD...' },
        { id: 'q35', number: 35, type: 'text', question: 'Food gathered by women',        answer: 'berries',         placeholder: 'ONE WORD...' },
        { id: 'q36', number: 36, type: 'text', question: 'Main plant food source',        answer: 'baobab',          placeholder: 'ONE WORD...' },
        { id: 'q37', number: 37, type: 'text', question: 'No concept of ___ ownership',  answer: 'private',         placeholder: 'ONE WORD...' },
        { id: 'q38', number: 38, type: 'text', question: 'Unusual type of sounds',        answer: 'click',           placeholder: 'ONE WORD...' },
        { id: 'q39', number: 39, type: 'text', question: 'Biggest threat to lifestyle',   answer: 'loss',            placeholder: 'ONE WORD...' },
        { id: 'q40', number: 40, type: 'text', question: 'Researchers study their ___',   answer: 'diet',            placeholder: 'ONE WORD...' },
      ],
    },
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
//  TEST 1 — READING  (Cambridge IELTS 11 Academic)
// ─────────────────────────────────────────────────────────────────────────────
const TEST1_READING = {
  duration: 60 * 60,
  passages: [
    {
      id: 'r1',
      number: 1,
      title: 'Passage 1 — Crop-Growing Skyscrapers',
      questions_range: '1–13',
      text: `In recent years, **vertical farming** — growing food in vertically stacked layers inside buildings — has moved from science fiction to commercial reality. Proponents claim it can help feed a rapidly growing global population using far less land and water than conventional agriculture.

The concept was popularised by American ecologist Dickson Despommier in 1999, who proposed that a single 30-storey building could feed 50,000 people year-round. Since then, dozens of commercial vertical farms have opened worldwide. Companies such as AeroFarms in New Jersey and Plenty in California have raised hundreds of millions of dollars in investment.

Vertical farms use **controlled-environment agriculture (CEA)**: temperature, humidity, CO₂ levels, and light are all managed precisely. Plants grow without natural sunlight, relying instead on LED lighting tuned to specific wavelengths that optimise photosynthesis. Nutrients are delivered directly to roots through **hydroponic** or **aeroponic** systems, using up to 95% less water than field farming.

The advantages are substantial. Vertical farms can operate anywhere — in urban warehouses, abandoned factories, or even underground — without concern for seasons, weather, or pests. Pesticide use is dramatically reduced or eliminated. Produce can be grown and delivered within hours, rather than days or weeks, preserving nutritional value and reducing food miles.

However, the technology faces significant challenges. The greatest is energy consumption: artificial lighting, climate control, and water-circulation systems require enormous amounts of electricity. Critics argue that without renewable energy, the carbon footprint of vertical farming may match or exceed that of conventional agriculture. Labour costs are also high, and most vertical farms currently focus on fast-growing, high-value crops such as leafy greens, herbs, and strawberries — not the staple crops like wheat, rice, and maize that make up the bulk of the human diet.

Despite these limitations, optimists point to rapid improvements in LED efficiency and the falling cost of renewable energy. If these trends continue, vertical farming could eventually offer a sustainable path to food security in an increasingly urbanised and climate-challenged world.`,
      questionGroups: [
        {
          type:         'true_false_ng',
          label:        'Questions 1–7',
          instructions: 'Do the following statements agree with the information given in the Reading Passage?\nIn boxes 1–7 on your answer sheet, write:\nTRUE — if the statement agrees with the information\nFALSE — if the statement contradicts the information\nNOT GIVEN — if there is no information on this',
          questions: [
            { id: 'r1q1',  number: 1,  type: 'true_false_ng', question: 'Dickson Despommier introduced the idea of vertical farming in the 1990s.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], answer: 'TRUE' },
            { id: 'r1q2',  number: 2,  type: 'true_false_ng', question: 'AeroFarms is based in California.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], answer: 'FALSE' },
            { id: 'r1q3',  number: 3,  type: 'true_false_ng', question: 'Vertical farms use sunlight filtered through special glass panels.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], answer: 'FALSE' },
            { id: 'r1q4',  number: 4,  type: 'true_false_ng', question: 'Hydroponic systems typically use significantly less water than conventional farming.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], answer: 'TRUE' },
            { id: 'r1q5',  number: 5,  type: 'true_false_ng', question: 'Vertical farms can be built underground.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], answer: 'TRUE' },
            { id: 'r1q6',  number: 6,  type: 'true_false_ng', question: 'Most vertical farms currently produce wheat and maize.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], answer: 'FALSE' },
            { id: 'r1q7',  number: 7,  type: 'true_false_ng', question: 'Some scientists believe vertical farming will replace all conventional farming by 2050.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], answer: 'NOT GIVEN' },
          ],
        },
        {
          type:         'sentence_completion',
          label:        'Questions 8–13',
          instructions: 'Complete the sentences below. Choose NO MORE THAN TWO WORDS AND/OR A NUMBER from the passage for each answer.',
          sentences: [
            { num: 8,  before: 'According to Despommier, a 30-storey building could feed',           after: 'people every year.',               qId: 'r1q8',  answer: '50,000' },
            { num: 9,  before: 'In vertical farms, the delivery of nutrients to plant roots is called', after: 'or aeroponic cultivation.',        qId: 'r1q9',  answer: 'hydroponic' },
            { num: 10, before: 'The precise management of growing conditions is known as',            after: '.',                                qId: 'r1q10', answer: 'controlled-environment agriculture' },
            { num: 11, before: 'Vertical farms can reduce or eliminate the use of',                   after: '.',                                qId: 'r1q11', answer: 'pesticides' },
            { num: 12, before: 'The biggest challenge currently facing vertical farms is high',        after: 'consumption.',                     qId: 'r1q12', answer: 'energy' },
            { num: 13, before: 'Some analysts believe vertical farming\'s carbon footprint may equal that of',  after: 'if powered by fossil fuels.', qId: 'r1q13', answer: 'conventional agriculture' },
          ],
          questions: [
            { id: 'r1q8',  number: 8,  type: 'text', answer: '50,000',                      placeholder: 'TWO WORDS/NUMBER...' },
            { id: 'r1q9',  number: 9,  type: 'text', answer: 'hydroponic',                  placeholder: 'ONE WORD...' },
            { id: 'r1q10', number: 10, type: 'text', answer: 'controlled-environment agriculture', placeholder: 'THREE WORDS...' },
            { id: 'r1q11', number: 11, type: 'text', answer: 'pesticides',                  placeholder: 'ONE WORD...' },
            { id: 'r1q12', number: 12, type: 'text', answer: 'energy',                      placeholder: 'ONE WORD...' },
            { id: 'r1q13', number: 13, type: 'text', answer: 'conventional agriculture',    placeholder: 'TWO WORDS...' },
          ],
        },
      ],
      // Flat list for scoring
      questions: [
        { id: 'r1q1',  number: 1,  type: 'true_false_ng', question: 'Dickson Despommier introduced the idea of vertical farming in the 1990s.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], answer: 'TRUE' },
        { id: 'r1q2',  number: 2,  type: 'true_false_ng', question: 'AeroFarms is based in California.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], answer: 'FALSE' },
        { id: 'r1q3',  number: 3,  type: 'true_false_ng', question: 'Vertical farms use sunlight filtered through special glass panels.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], answer: 'FALSE' },
        { id: 'r1q4',  number: 4,  type: 'true_false_ng', question: 'Hydroponic systems typically use significantly less water than conventional farming.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], answer: 'TRUE' },
        { id: 'r1q5',  number: 5,  type: 'true_false_ng', question: 'Vertical farms can be built underground.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], answer: 'TRUE' },
        { id: 'r1q6',  number: 6,  type: 'true_false_ng', question: 'Most vertical farms currently produce wheat and maize.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], answer: 'FALSE' },
        { id: 'r1q7',  number: 7,  type: 'true_false_ng', question: 'Some scientists believe vertical farming will replace all conventional farming by 2050.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], answer: 'NOT GIVEN' },
        { id: 'r1q8',  number: 8,  type: 'text', answer: '50,000' },
        { id: 'r1q9',  number: 9,  type: 'text', answer: 'hydroponic' },
        { id: 'r1q10', number: 10, type: 'text', answer: 'controlled-environment agriculture' },
        { id: 'r1q11', number: 11, type: 'text', answer: 'pesticides' },
        { id: 'r1q12', number: 12, type: 'text', answer: 'energy' },
        { id: 'r1q13', number: 13, type: 'text', answer: 'conventional agriculture' },
      ],
    },

    {
      id: 'r2',
      number: 2,
      title: 'Passage 2 — The Falkirk Wheel',
      questions_range: '14–26',
      text: `The **Falkirk Wheel** is the world's only rotating boat lift and one of Scotland's most spectacular engineering achievements. Located near the town of Falkirk, it was built to reconnect two historic canal systems — the **Forth & Clyde Canal** and the **Union Canal** — which had been severed for over fifty years. When fully operational in 2002, it could raise or lower canal boats by 24 metres in just 15 minutes, a journey that had previously required locking through a flight of eleven locks, which took most of a day.

The wheel was the centrepiece of a £84.5 million project called the **Millennium Link**, which aimed to restore 110 kilometres of canal across central Scotland. The project was not simply an engineering exercise: it was also intended to regenerate communities along the canal corridors, creating tourism, housing, and business development.

The design challenge was formidable. Engineers had to find a way to lift boats between two canals at very different heights without consuming excessive energy. Their solution was inspired by Archimedes' principle: because a floating boat displaces its own weight in water, the weight in each gondola remains constant regardless of whether a boat is present. As one gondola descends, the other rises, and since the two gondolas are always equal in weight, the system is almost perfectly balanced. Only 1.5 kilowatt-hours of energy are needed per rotation — enough to boil eight household kettles — a figure that astonished engineers when it was first calculated.

The wheel consists of two opposing gondolas, each capable of holding two canal boats, attached to a central spine that rotates 180° to complete each exchange. The structure stands 35 metres tall and weighs 1,800 tonnes. Eight hydraulic motors drive the rotation, but such is the precision of the engineering that it could theoretically be turned by hand.

Since opening, the Falkirk Wheel has welcomed over 750,000 visitors per year, making it Scotland's most visited paid attraction. Its success has stimulated interest in similar canal restoration projects around the world. In 2003, it won the prestigious **Institution of Structural Engineers** award for the world's best structure.`,
      questionGroups: [
        {
          type:         'multiple_choice',
          label:        'Questions 14–18',
          instructions: 'Choose the correct letter, A, B, C or D.',
          questions: [
            {
              id: 'r2q14', number: 14, type: 'multiple_choice',
              question: 'What was the main reason for building the Falkirk Wheel?',
              options: [
                'A  To provide a tourist attraction for central Scotland',
                'B  To reconnect two canal systems that had been separated',
                'C  To replace a series of eleven old locks on the Union Canal',
                'D  To demonstrate new engineering techniques to the world',
              ],
              answer: 'B',
            },
            {
              id: 'r2q15', number: 15, type: 'multiple_choice',
              question: 'The Millennium Link project was designed to',
              options: [
                'A  restore only the Forth & Clyde Canal.',
                'B  create a new direct route between Edinburgh and Glasgow.',
                'C  rehabilitate 110 kilometres of canal and regenerate local communities.',
                'D  reduce the number of cars on Scottish roads.',
              ],
              answer: 'C',
            },
            {
              id: 'r2q16', number: 16, type: 'multiple_choice',
              question: 'The Falkirk Wheel uses very little energy because',
              options: [
                'A  solar panels on the roof generate sufficient electricity.',
                'B  the weight of the two gondolas is always approximately equal.',
                'C  the motors are exceptionally efficient by modern standards.',
                'D  the wheel only operates during daylight hours.',
              ],
              answer: 'B',
            },
            {
              id: 'r2q17', number: 17, type: 'multiple_choice',
              question: 'Which of the following statements about the wheel\'s structure is TRUE?',
              options: [
                'A  Each gondola can carry four canal boats at once.',
                'B  The wheel is powered entirely by hydraulic pressure.',
                'C  The wheel stands 35 metres tall and weighs 1,800 tonnes.',
                'D  It rotates 360° to complete each exchange of boats.',
              ],
              answer: 'C',
            },
            {
              id: 'r2q18', number: 18, type: 'multiple_choice',
              question: 'The phrase "could theoretically be turned by hand" (paragraph 4) emphasises the wheel\'s',
              options: [
                'A  small physical dimensions.',
                'B  exceptionally precise engineering balance.',
                'C  simple mechanical design.',
                'D  low cost of construction.',
              ],
              answer: 'B',
            },
          ],
        },
        {
          type:         'sentence_completion',
          label:        'Questions 19–26',
          instructions: 'Complete the summary below. Choose NO MORE THAN TWO WORDS AND/OR A NUMBER from the passage.',
          sentences: [
            { num: 19, before: 'The Falkirk Wheel was opened in',                        after: '.',                        qId: 'r2q19', answer: '2002' },
            { num: 20, before: 'It can raise boats by',                                  after: 'metres in 15 minutes.',    qId: 'r2q20', answer: '24' },
            { num: 21, before: 'The Millennium Link project cost £',                      after: 'million.',                 qId: 'r2q21', answer: '84.5' },
            { num: 22, before: 'Each rotation requires only',                             after: 'kilowatt-hours of energy.',qId: 'r2q22', answer: '1.5' },
            { num: 23, before: 'The wheel is driven by',                                  after: 'hydraulic motors.',        qId: 'r2q23', answer: 'eight' },
            { num: 24, before: 'The Wheel attracts over',                                 after: 'visitors annually.',       qId: 'r2q24', answer: '750,000' },
            { num: 25, before: 'It won the',                                               after: 'award in 2003.',          qId: 'r2q25', answer: 'Institution of Structural Engineers' },
            { num: 26, before: 'The principle that makes the wheel efficient was first described by', after: '.', qId: 'r2q26', answer: 'Archimedes' },
          ],
          questions: [
            { id: 'r2q19', number: 19, type: 'text', answer: '2002', placeholder: 'NUMBER...' },
            { id: 'r2q20', number: 20, type: 'text', answer: '24', placeholder: 'NUMBER...' },
            { id: 'r2q21', number: 21, type: 'text', answer: '84.5', placeholder: 'NUMBER...' },
            { id: 'r2q22', number: 22, type: 'text', answer: '1.5', placeholder: 'NUMBER...' },
            { id: 'r2q23', number: 23, type: 'text', answer: 'eight', placeholder: 'ONE WORD...' },
            { id: 'r2q24', number: 24, type: 'text', answer: '750,000', placeholder: 'NUMBER...' },
            { id: 'r2q25', number: 25, type: 'text', answer: 'Institution of Structural Engineers', placeholder: 'THREE WORDS...' },
            { id: 'r2q26', number: 26, type: 'text', answer: 'Archimedes', placeholder: 'ONE WORD...' },
          ],
        },
      ],
      questions: [
        { id: 'r2q14', number: 14, type: 'multiple_choice', question: 'Main reason for building the Falkirk Wheel?', options: ['A  To provide a tourist attraction','B  To reconnect two canal systems','C  To replace old locks','D  To demonstrate engineering'], answer: 'B' },
        { id: 'r2q15', number: 15, type: 'multiple_choice', question: 'Millennium Link project was designed to:', options: ['A  Restore only Forth & Clyde Canal','B  Create new route Edinburgh–Glasgow','C  Rehabilitate 110km of canal','D  Reduce road traffic'], answer: 'C' },
        { id: 'r2q16', number: 16, type: 'multiple_choice', question: 'Why does the wheel use little energy?', options: ['A  Solar panels','B  Equal gondola weights','C  Efficient motors','D  Daytime only'], answer: 'B' },
        { id: 'r2q17', number: 17, type: 'multiple_choice', question: 'Which statement is TRUE?', options: ['A  Each gondola holds 4 boats','B  Powered by hydraulic pressure','C  35m tall, 1,800 tonnes','D  Rotates 360°'], answer: 'C' },
        { id: 'r2q18', number: 18, type: 'multiple_choice', question: '"Turned by hand" emphasises:', options: ['A  Small dimensions','B  Precise engineering','C  Simple design','D  Low cost'], answer: 'B' },
        { id: 'r2q19', number: 19, type: 'text', answer: '2002' },
        { id: 'r2q20', number: 20, type: 'text', answer: '24' },
        { id: 'r2q21', number: 21, type: 'text', answer: '84.5' },
        { id: 'r2q22', number: 22, type: 'text', answer: '1.5' },
        { id: 'r2q23', number: 23, type: 'text', answer: 'eight' },
        { id: 'r2q24', number: 24, type: 'text', answer: '750,000' },
        { id: 'r2q25', number: 25, type: 'text', answer: 'Institution of Structural Engineers' },
        { id: 'r2q26', number: 26, type: 'text', answer: 'Archimedes' },
      ],
    },

    {
      id: 'r3',
      number: 3,
      title: 'Passage 3 — What is the purpose of gaining knowledge?',
      questions_range: '27–40',
      text: `The question of why humans seek knowledge has occupied philosophers, educators, and scientists for millennia. While the answer may seem obvious — knowledge is useful — a deeper examination reveals a far more complex picture, one in which utility is only one of several competing motivations.

**A**  The ancient Greeks drew a distinction between two types of knowledge. *Episteme* referred to theoretical knowledge — understanding the principles that underlie the world. *Techne* referred to practical knowledge — knowing how to make or do things. For Aristotle, episteme was superior because it concerned itself with truths that were permanent and universal, while techne was merely contingent on circumstances. This hierarchy has had lasting consequences, shaping educational systems that prize abstract academic learning over vocational training.

**B**  The scientific revolution of the 16th and 17th centuries challenged this framework. Francis Bacon famously declared that "knowledge is power," arguing that the purpose of learning was to extend human mastery over nature. This instrumentalist view — that knowledge is valuable primarily as a tool for achieving practical ends — came to dominate Western thought. It underpins the modern emphasis on science, technology, engineering, and mathematics in educational policy.

**C**  Yet the instrumentalist position has been challenged by those who argue that knowledge has **intrinsic value** — that it is worth having for its own sake, regardless of any practical benefit. This position was eloquently defended by the philosopher John Henry Newman in his 1852 work *The Idea of a University*, in which he argued that a liberal education cultivates the intellect and produces individuals capable of contributing to society in ways that cannot be anticipated in advance.

**D**  A third perspective holds that knowledge is fundamentally **social in nature**. On this view, what counts as knowledge is not determined by individual minds engaging with an objective world, but by communities of people with shared practices, values, and institutions. The philosopher Ludwig Wittgenstein influentially argued that even seemingly private experiences — such as pain — can only be expressed and understood through shared language. Knowledge, on this view, is always already communal.

**E**  In recent decades, a growing body of research in cognitive science has shed new light on the question. Psychologists have found that humans appear to have an intrinsic drive to explore and understand the world — what researchers call **curiosity**. Infants display this drive long before they can derive any practical benefit from the information they gather. Studies suggest that the brain treats the acquisition of new information as inherently rewarding, releasing dopamine in response to novel stimuli in the same way it does in response to food or social interaction.

**F**  If knowledge-seeking is indeed hardwired into human neurology, this has significant implications for education. It suggests that the best learning environments are those that stimulate curiosity rather than suppress it — that treat students as active agents rather than passive recipients of information. The educational philosopher John Dewey argued along similar lines, contending that learning is most effective when it emerges from genuine inquiry motivated by real problems, rather than the rote acquisition of facts.`,
      questionGroups: [
        {
          type:         'matching_headings',
          label:        'Questions 27–32',
          instructions: 'The reading passage has six paragraphs, A–F. Choose the correct heading for each paragraph from the list of headings below.\nWrite the correct number, i–ix, in boxes 27–32.',
          headingList: [
            'i    The neurological basis of curiosity',
            'ii   A philosopher argues for knowledge as a social construction',
            'iii  The Greek distinction between types of knowledge',
            'iv   Evidence from experiments with animals',
            'v    Francis Bacon and the practical purpose of knowledge',
            'vi   Newman\'s defence of education for its own sake',
            'vii  Implications for classroom teaching',
            'viii The economic value of higher education',
            'ix   Wittgenstein and language',
          ],
          questions: [
            { id: 'r3q27', number: 27, type: 'matching', question: 'Paragraph A', options: ['i','ii','iii','iv','v','vi','vii','viii','ix'], answer: 'iii' },
            { id: 'r3q28', number: 28, type: 'matching', question: 'Paragraph B', options: ['i','ii','iii','iv','v','vi','vii','viii','ix'], answer: 'v'   },
            { id: 'r3q29', number: 29, type: 'matching', question: 'Paragraph C', options: ['i','ii','iii','iv','v','vi','vii','viii','ix'], answer: 'vi'  },
            { id: 'r3q30', number: 30, type: 'matching', question: 'Paragraph D', options: ['i','ii','iii','iv','v','vi','vii','viii','ix'], answer: 'ii'  },
            { id: 'r3q31', number: 31, type: 'matching', question: 'Paragraph E', options: ['i','ii','iii','iv','v','vi','vii','viii','ix'], answer: 'i'   },
            { id: 'r3q32', number: 32, type: 'matching', question: 'Paragraph F', options: ['i','ii','iii','iv','v','vi','vii','viii','ix'], answer: 'vii' },
          ],
        },
        {
          type:         'true_false_ng',
          label:        'Questions 33–36',
          instructions: 'Do the following statements agree with the claims of the writer?\nTRUE — if the statement agrees with the claims\nFALSE — if the statement contradicts the claims\nNOT GIVEN — if it is impossible to say what the writer thinks',
          questions: [
            { id: 'r3q33', number: 33, type: 'true_false_ng', question: 'Aristotle believed that practical knowledge was more valuable than theoretical knowledge.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], answer: 'FALSE' },
            { id: 'r3q34', number: 34, type: 'true_false_ng', question: 'Bacon\'s view of knowledge influenced modern policies on education in STEM subjects.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], answer: 'TRUE' },
            { id: 'r3q35', number: 35, type: 'true_false_ng', question: 'Newman believed that the benefits of a liberal education could be predicted in advance.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], answer: 'FALSE' },
            { id: 'r3q36', number: 36, type: 'true_false_ng', question: 'Wittgenstein\'s ideas about language have been rejected by most modern philosophers.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], answer: 'NOT GIVEN' },
          ],
        },
        {
          type:         'multiple_choice',
          label:        'Questions 37–40',
          instructions: 'Choose the correct letter, A, B, C or D.',
          questions: [
            {
              id: 'r3q37', number: 37, type: 'multiple_choice',
              question: 'What do psychologists\' findings about curiosity suggest?',
              options: [
                'A  People learn only when there is a practical reward involved.',
                'B  The desire to acquire knowledge may be biologically innate.',
                'C  Infants are more curious than adults.',
                'D  The brain cannot distinguish between types of knowledge.',
              ],
              answer: 'B',
            },
            {
              id: 'r3q38', number: 38, type: 'multiple_choice',
              question: 'The writer refers to dopamine release in the brain in order to',
              options: [
                'A  explain why some people become addicted to studying.',
                'B  show that knowledge-seeking is as rewarding as food or social contact.',
                'C  argue that schools should use reward systems to motivate students.',
                'D  demonstrate that curiosity decreases with age.',
              ],
              answer: 'B',
            },
            {
              id: 'r3q39', number: 39, type: 'multiple_choice',
              question: 'According to John Dewey, learning is most effective when',
              options: [
                'A  students memorise key facts and theories.',
                'B  teachers use a structured and systematic curriculum.',
                'C  it is driven by genuine questions and real problems.',
                'D  students compete against each other.',
              ],
              answer: 'C',
            },
            {
              id: 'r3q40', number: 40, type: 'multiple_choice',
              question: 'What is the writer\'s main conclusion in the passage?',
              options: [
                'A  Theoretical knowledge is more important than practical knowledge.',
                'B  Knowledge-seeking is motivated by a complex range of factors.',
                'C  Modern education systems fully meet the needs of curious students.',
                'D  Curiosity can be taught in the same way as any other skill.',
              ],
              answer: 'B',
            },
          ],
        },
      ],
      questions: [
        { id: 'r3q27', number: 27, type: 'matching',       question: 'Paragraph A', options: ['i','ii','iii','iv','v','vi','vii','viii','ix'], answer: 'iii' },
        { id: 'r3q28', number: 28, type: 'matching',       question: 'Paragraph B', options: ['i','ii','iii','iv','v','vi','vii','viii','ix'], answer: 'v'   },
        { id: 'r3q29', number: 29, type: 'matching',       question: 'Paragraph C', options: ['i','ii','iii','iv','v','vi','vii','viii','ix'], answer: 'vi'  },
        { id: 'r3q30', number: 30, type: 'matching',       question: 'Paragraph D', options: ['i','ii','iii','iv','v','vi','vii','viii','ix'], answer: 'ii'  },
        { id: 'r3q31', number: 31, type: 'matching',       question: 'Paragraph E', options: ['i','ii','iii','iv','v','vi','vii','viii','ix'], answer: 'i'   },
        { id: 'r3q32', number: 32, type: 'matching',       question: 'Paragraph F', options: ['i','ii','iii','iv','v','vi','vii','viii','ix'], answer: 'vii' },
        { id: 'r3q33', number: 33, type: 'true_false_ng',  question: 'Aristotle believed practical knowledge was superior.', options: ['TRUE','FALSE','NOT GIVEN'], answer: 'FALSE' },
        { id: 'r3q34', number: 34, type: 'true_false_ng',  question: 'Bacon\'s view influenced modern STEM education policies.', options: ['TRUE','FALSE','NOT GIVEN'], answer: 'TRUE' },
        { id: 'r3q35', number: 35, type: 'true_false_ng',  question: 'Newman believed liberal education benefits could be predicted.', options: ['TRUE','FALSE','NOT GIVEN'], answer: 'FALSE' },
        { id: 'r3q36', number: 36, type: 'true_false_ng',  question: 'Wittgenstein\'s ideas rejected by modern philosophers.', options: ['TRUE','FALSE','NOT GIVEN'], answer: 'NOT GIVEN' },
        { id: 'r3q37', number: 37, type: 'multiple_choice', question: 'What do psychologists\' findings about curiosity suggest?', options: ['A  Practical rewards only','B  Knowledge-seeking may be innate','C  Infants more curious','D  Brain cannot distinguish'], answer: 'B' },
        { id: 'r3q38', number: 38, type: 'multiple_choice', question: 'Writer mentions dopamine to:', options: ['A  Addiction to studying','B  Learning as rewarding as food','C  School reward systems','D  Curiosity decreases with age'], answer: 'B' },
        { id: 'r3q39', number: 39, type: 'multiple_choice', question: 'Dewey says learning is most effective when:', options: ['A  Memorising facts','B  Structured curriculum','C  Real problems & questions','D  Competition'], answer: 'C' },
        { id: 'r3q40', number: 40, type: 'multiple_choice', question: 'Writer\'s main conclusion:', options: ['A  Theory > practice','B  Complex motivations','C  Modern systems adequate','D  Curiosity teachable'], answer: 'B' },
      ],
    },
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
//  FULL TEST OBJECTS
// ─────────────────────────────────────────────────────────────────────────────
export const C11_TEST1 = {
  id:    'cambridge11-test1',
  book:  'Cambridge IELTS 11',
  test:  'Test 1',
  level: 'Academic',
  listening: TEST1_LISTENING,
  reading:   TEST1_READING,
  writing: {
    duration: 60 * 60,
    task1: {
      time: 20 * 60, minWords: 150,
      title: 'Academic Writing Task 1',
      prompt: `The graph below shows the percentage of households in owned and rented accommodation in England and Wales between 1918 and 2011.

[Line Graph:
• Owner-occupied: rises from ~23% (1918) to peak ~69% (2001), then falls slightly to ~64% (2011)
• Private rented: falls from ~76% (1918) to ~9% (2001), rises to ~15% (2011)
• Social rented: rises from ~1% (1918) to peak ~31% (1981), falls to ~17% (2011)]

Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.`,
      assessmentCriteria: ['Task Achievement — Barcha asosiy trendlar qamrab olinsin','Coherence & Cohesion — Mantiqiy tashkil etilsin','Lexical Resource — Trend so\'zlari: rose, fell, peaked, fluctuated','Grammatical Range & Accuracy — Passive, comparatives'],
      modelIntro: 'The line graph illustrates changes in three types of housing tenure in England and Wales over a 93-year period from 1918 to 2011.',
    },
    task2: {
      time: 40 * 60, minWords: 250,
      title: 'Academic Writing Task 2',
      prompt: `Some people believe that it is best to accept a bad situation, such as an unsatisfactory job or shortage of money. Others argue that it is better to try and improve such situations.

Discuss both these views and give your own opinion.

Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.`,
      assessmentCriteria: ['Task Response — Aniq pozitsiya, rivojlangan argumentlar','Coherence & Cohesion — Mantiqiy paragraflash','Lexical Resource — Mavzuga oid so\'zlar','Grammatical Range & Accuracy — Murakkab gaplar'],
    },
  },
  speaking: {
    duration: 14 * 60,
    parts: [
      {
        part: 1, title: 'Part 1 — Introduction (4–5 minutes)',
        instructions: 'The examiner will ask you questions about yourself and familiar topics.',
        questions: ['Can you tell me your full name, please?','Where are you from?','Do you work or are you a student?','What do you enjoy doing in your free time?','Do you like reading? Why or why not?','How often do you use the internet?'],
      },
      {
        part: 2, title: 'Part 2 — Individual Long Turn (3–4 minutes)',
        instructions: 'You have 1 minute to prepare, then speak for 1–2 minutes.',
        cueCard: {
          topic: 'Describe a time when you helped someone.',
          points: ['Who you helped','What the situation was','How you helped them','And explain how you felt about helping this person'],
        },
      },
      {
        part: 3, title: 'Part 3 — Two-way Discussion (4–5 minutes)',
        instructions: 'The examiner will ask more abstract questions.',
        questions: ['In your culture, how important is it to help others?','Do you think volunteering should be compulsory for young people?','How have attitudes towards community service changed in recent years?','Some people argue that helping others is ultimately selfish. What do you think?'],
      },
    ],
  },
}

// Simplified Tests 2–4
function makeSimpleTest(n) {
  return {
    id: `cambridge11-test${n}`,
    book: 'Cambridge IELTS 11',
    test: `Test ${n}`,
    level: 'Academic',
    listening: {
      duration: 30 * 60,
      transferTime: 10 * 60,
      sections: [1,2,3,4].map((s) => ({
        id: `t${n}s${s}`, number: s,
        title: [`Section ${s} — Museum visit enquiry`, `Section ${s} — Recycling programme`, `Section ${s} — Marketing assignment`, `Section ${s} — Weather forecasting lecture`][s-1],
        audio: `/audio/cambridge11/IELTS11_Test${n}_Section${s}.mp3`,
        questionType: 'notes_completion',
        instructions: `Questions ${(s-1)*10+1}–${s*10}. Write ONE WORD AND/OR A NUMBER for each answer.`,
        questions: Array.from({ length: 10 }, (_, i) => ({
          id: `t${n}s${s}q${i+1}`, number: (s-1)*10+i+1,
          type: 'text', question: `Question ${(s-1)*10+i+1}`, answer: '', placeholder: 'ONE WORD AND/OR A NUMBER...',
        })),
      })),
    },
    writing: C11_TEST1.writing,
    speaking: C11_TEST1.speaking,
  }
}
export const C11_TEST2 = makeSimpleTest(2)
export const C11_TEST3 = makeSimpleTest(3)
export const C11_TEST4 = makeSimpleTest(4)

// ─────────────────────────────────────────────────────────────────────────────
//  CATALOG & HELPERS
// ─────────────────────────────────────────────────────────────────────────────
export const CAMBRIDGE_CATALOG = Array.from({ length: 19 }, (_, i) => {
  const book = i + 1
  const available = book === 11
  return {
    id: `cambridge${book}`, book: `Cambridge IELTS ${book}`,
    shortName: `C${book}`, year: 1995 + (book - 1) * 2,
    tests: 4, available, audioAvailable: available,
    tests_data: available ? ['cambridge11-test1','cambridge11-test2','cambridge11-test3','cambridge11-test4'] : [],
    comingSoon: !available,
  }
})

export function getCambridgeTest(testId) {
  return { 'cambridge11-test1': C11_TEST1, 'cambridge11-test2': C11_TEST2, 'cambridge11-test3': C11_TEST3, 'cambridge11-test4': C11_TEST4 }[testId] || null
}

export function getListeningBand(c) {
  if (c>=39)return 9.0;if(c>=37)return 8.5;if(c>=35)return 8.0;if(c>=33)return 7.5
  if (c>=30)return 7.0;if(c>=27)return 6.5;if(c>=23)return 6.0;if(c>=20)return 5.5
  if (c>=16)return 5.0;if(c>=13)return 4.5;if(c>=10)return 4.0;return 3.5
}
export function getReadingBand(c) {
  if (c>=39)return 9.0;if(c>=37)return 8.5;if(c>=35)return 8.0;if(c>=33)return 7.5
  if (c>=30)return 7.0;if(c>=27)return 6.5;if(c>=23)return 6.0;if(c>=19)return 5.5
  if (c>=15)return 5.0;if(c>=13)return 4.5;if(c>=10)return 4.0;return 3.5
}
export function getOverallBand(l,r,w=6.0,s=6.0) {
  return Math.round(((l+r+w+s)/4)*2)/2
}
