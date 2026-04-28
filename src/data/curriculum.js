// Lingify — Full English Curriculum (O'zbek tilida tushuntirishlar bilan)

export const LEVELS = ['A0', 'A1', 'A2', 'B1', 'B2', 'C1']

export const LEVEL_LABELS = {
  A0: 'Mutlaq boshlang\'ich',
  A1: 'Boshlang\'ich',
  A2: 'Elementar',
  B1: 'O\'rta',
  B2: 'Yuqori o\'rta',
  C1: 'Ilg\'or',
}

export const curriculum = [
  // ─────────────────── A0 ───────────────────
  {
    id: 'a0-u1-l1',
    level: 'A0',
    unitId: 'a0-u1',
    unitTitle: 'Alifbo va Tovushlar',
    unitNumber: 1,
    lessonNumber: 1,
    title: 'Ingliz alifbosi',
    type: 'grammar',
    duration: '10 daqiqa',
    xp: 15,
    description: 'A dan Z gacha 26 harfni o\'rganamiz',
    content: {
      intro: 'Ingliz alifbosida 26 ta harf bor. Ular katta (uppercase) va kichik (lowercase) shaklida yoziladi.',
      sections: [
        {
          title: 'Harflar',
          body: 'Ingliz alifbosi:\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\na b c d e f g h i j k l m n o p q r s t u v w x y z',
        },
        {
          title: 'Unli harflar (Vowels)',
          body: 'A, E, I, O, U — bular unli harflar. Qolgan 21 ta harf undosh (consonant) hisoblanadi.',
        },
        {
          title: 'Misol',
          body: 'Apple → A harfi bilan boshlanadi\nBook → B harfi bilan boshlanadi\nCat → C harfi bilan boshlanadi',
        },
      ],
      exercises: [
        {
          id: 'ex1',
          type: 'multiple_choice',
          question: 'Ingliz alifbosida nechta harf bor?',
          options: ['24', '25', '26', '28'],
          correct: 2,
          explanation: 'Ingliz alifbosida 26 ta harf mavjud.',
        },
        {
          id: 'ex2',
          type: 'multiple_choice',
          question: 'Quyidagilardan qaysi biri unli harf (vowel)?',
          options: ['B', 'C', 'E', 'F'],
          correct: 2,
          explanation: 'E — unli harf. Unlilar: A, E, I, O, U',
        },
        {
          id: 'ex3',
          type: 'multiple_choice',
          question: '"Z" harfi alifboning nechanchi harfi?',
          options: ['24', '25', '26', '27'],
          correct: 2,
          explanation: 'Z — ingliz alifbosining oxirgi, 26-harfi.',
        },
      ],
    },
  },
  {
    id: 'a0-u1-l2',
    level: 'A0',
    unitId: 'a0-u1',
    unitTitle: 'Alifbo va Tovushlar',
    unitNumber: 1,
    lessonNumber: 2,
    title: 'Raqamlar: 1-20',
    type: 'vocabulary',
    duration: '12 daqiqa',
    xp: 15,
    description: '1 dan 20 gacha inglizcha raqamlarni o\'rganamiz',
    content: {
      intro: 'Ingliz tilida raqamlarni o\'rganish juda muhim. Kundalik hayotda doim ishlatiladi.',
      sections: [
        {
          title: 'Raqamlar 1-10',
          body: '1 = One\n2 = Two\n3 = Three\n4 = Four\n5 = Five\n6 = Six\n7 = Seven\n8 = Eight\n9 = Nine\n10 = Ten',
        },
        {
          title: 'Raqamlar 11-20',
          body: '11 = Eleven\n12 = Twelve\n13 = Thirteen\n14 = Fourteen\n15 = Fifteen\n16 = Sixteen\n17 = Seventeen\n18 = Eighteen\n19 = Nineteen\n20 = Twenty',
        },
      ],
      exercises: [
        {
          id: 'ex1',
          type: 'multiple_choice',
          question: '"Seven" inglizcha qaysi raqam?',
          options: ['5', '6', '7', '8'],
          correct: 2,
          explanation: 'Seven = 7',
        },
        {
          id: 'ex2',
          type: 'multiple_choice',
          question: '15 = ?',
          options: ['Thirteen', 'Fourteen', 'Fifteen', 'Sixteen'],
          correct: 2,
          explanation: '15 = Fifteen',
        },
        {
          id: 'ex3',
          type: 'multiple_choice',
          question: '"Twelve" nechani anglatadi?',
          options: ['10', '11', '12', '13'],
          correct: 2,
          explanation: 'Twelve = 12',
        },
      ],
    },
  },
  {
    id: 'a0-u2-l1',
    level: 'A0',
    unitId: 'a0-u2',
    unitTitle: 'Salomlashish va Tanishuv',
    unitNumber: 2,
    lessonNumber: 1,
    title: 'Salom va xayr',
    type: 'grammar',
    duration: '10 daqiqa',
    xp: 20,
    description: 'Inglizcha salomlashish va xayrlashish iboralari',
    content: {
      intro: 'Ingliz tilida salomlashishning bir necha usuli bor. Rasmiy va norasmiy shakllar farq qiladi.',
      sections: [
        {
          title: 'Salomlashish (Greetings)',
          body: 'Hello! — Salom! (rasmiy va norasmiy)\nHi! — Salom! (norasmiy)\nGood morning! — Xayrli tong! (ertalab)\nGood afternoon! — Xayrli kun! (tushdan keyin)\nGood evening! — Xayrli kech! (kechqurun)',
        },
        {
          title: 'Xayrlashish (Farewells)',
          body: 'Goodbye! — Xayr!\nBye! — Xayr! (norasmiy)\nGood night! — Xayrli tun!\nSee you later! — Ko\'rishguncha!\nTake care! — O\'zingni ehtiyot qil!',
        },
        {
          title: 'Ahvol so\'rashish',
          body: 'How are you? — Qandaysiz?\nI\'m fine, thank you. — Yaxshiman, rahmat.\nNot bad. — Yomon emas.\nI\'m great! — Zo\'rman!\nAnd you? — O\'zingiz-chi?',
        },
      ],
      exercises: [
        {
          id: 'ex1',
          type: 'multiple_choice',
          question: '"Good morning" qachon ishlatiladi?',
          options: ['Kechqurun', 'Tushdan keyin', 'Ertalab', 'Tunda'],
          correct: 2,
          explanation: '"Good morning" ertalab salomlashishda ishlatiladi.',
        },
        {
          id: 'ex2',
          type: 'multiple_choice',
          question: '"How are you?" ga to\'g\'ri javob qaysi?',
          options: ['Good morning!', 'I\'m fine, thank you.', 'Goodbye!', 'Hello!'],
          correct: 1,
          explanation: '"How are you?" — ahvol so\'rashadi. "I\'m fine, thank you." — to\'g\'ri javob.',
        },
        {
          id: 'ex3',
          type: 'multiple_choice',
          question: '"See you later!" nimani anglatadi?',
          options: ['Xayrli tong!', 'Qandaysiz?', 'Ko\'rishguncha!', 'Rahmat!'],
          correct: 2,
          explanation: '"See you later!" = Ko\'rishguncha!',
        },
      ],
    },
  },

  // ─────────────────── A1 ───────────────────
  {
    id: 'a1-u1-l1',
    level: 'A1',
    unitId: 'a1-u1',
    unitTitle: 'To\'liq jumlalar',
    unitNumber: 1,
    lessonNumber: 1,
    title: 'To be fe\'li: am, is, are',
    type: 'grammar',
    duration: '15 daqiqa',
    xp: 20,
    description: 'Ingliz tilining eng muhim fe\'li: "to be"ni o\'rganamiz',
    content: {
      intro: '"To be" fe\'li ingliz tilida eng ko\'p ishlatiladigan fe\'ldir. U "bo\'lmoq, borman, borsan" ma\'nolarini beradi.',
      sections: [
        {
          title: '"To be" fe\'li qoidasi',
          body: 'I am → Men ... man\nYou are → Sen ... san / Siz ... siz\nHe is → U ... dir (erkak)\nShe is → U ... dir (ayol)\nIt is → U ... dir (narsa/hayvon)\nWe are → Biz ... miz\nThey are → Ular ... dir',
        },
        {
          title: 'Misollar',
          body: 'I am a student. → Men talabaman.\nYou are a teacher. → Siz o\'qituvchisiz.\nHe is tall. → U balandqomat.\nShe is happy. → U xursand.\nWe are friends. → Biz do\'stmiz.\nThey are from Uzbekistan. → Ular O\'zbekistondan.',
        },
        {
          title: 'Inkor shakli (Negative)',
          body: 'I am not = I\'m not → Men ... emasman\nYou are not = You\'re not → Sen ... emassan\nHe is not = He\'s not → U ... emas\n\nMisol:\nI am not tired. → Men charchamadim.\nShe is not at home. → U uyda emas.',
        },
      ],
      exercises: [
        {
          id: 'ex1',
          type: 'multiple_choice',
          question: '"She ___ a doctor." Bo\'sh joyga nima kiradi?',
          options: ['am', 'are', 'is', 'be'],
          correct: 2,
          explanation: 'She (u-ayol) bilan "is" ishlatiladi: She is a doctor.',
        },
        {
          id: 'ex2',
          type: 'multiple_choice',
          question: '"We ___ students." Bo\'sh joyga nima kiradi?',
          options: ['am', 'is', 'are', 'be'],
          correct: 2,
          explanation: 'We (biz) bilan "are" ishlatiladi: We are students.',
        },
        {
          id: 'ex3',
          type: 'multiple_choice',
          question: '"I ___ not happy." Bo\'sh joyga nima kiradi?',
          options: ['is', 'are', 'am', 'be'],
          correct: 2,
          explanation: 'I (men) bilan "am" ishlatiladi: I am not happy.',
        },
        {
          id: 'ex4',
          type: 'multiple_choice',
          question: '"They ___ from Tashkent." nimani anglatadi?',
          options: ['They am from Tashkent.', 'They are from Tashkent.', 'They is from Tashkent.', 'They be from Tashkent.'],
          correct: 1,
          explanation: 'They (ular) bilan "are" ishlatiladi.',
        },
      ],
    },
  },
  {
    id: 'a1-u1-l2',
    level: 'A1',
    unitId: 'a1-u1',
    unitTitle: 'To\'liq jumlalar',
    unitNumber: 1,
    lessonNumber: 2,
    title: 'Olmoshlar (Pronouns)',
    type: 'grammar',
    duration: '12 daqiqa',
    xp: 20,
    description: 'Shaxs olmoshlari: I, you, he, she, it, we, they',
    content: {
      intro: 'Olmoshlar ot o\'rnida qo\'llaniladigan so\'zlardir. Jumlada qayta-qayta ism ishlatishdan qochish uchun zarur.',
      sections: [
        {
          title: 'Shaxs olmoshlari (Subject Pronouns)',
          body: 'I → Men\nYou → Sen / Siz\nHe → U (erkak)\nShe → U (ayol)\nIt → U (narsa, hayvon)\nWe → Biz\nThey → Ular',
        },
        {
          title: 'Misollar',
          body: 'Ahmad is a student. → He is a student.\nMalika is a teacher. → She is a teacher.\nThe cat is cute. → It is cute.\nAhmad and Malika are friends. → They are friends.',
        },
      ],
      exercises: [
        {
          id: 'ex1',
          type: 'multiple_choice',
          question: '"Ahmad is my brother. ___ is tall." Bo\'sh joyga nima kiradi?',
          options: ['She', 'It', 'He', 'They'],
          correct: 2,
          explanation: 'Ahmad — erkak, shuning uchun "He" ishlatiladi.',
        },
        {
          id: 'ex2',
          type: 'multiple_choice',
          question: '"The book is on the table. ___ is red." Bo\'sh joyga nima kiradi?',
          options: ['He', 'She', 'They', 'It'],
          correct: 3,
          explanation: 'Narsa (book) uchun "It" ishlatiladi.',
        },
        {
          id: 'ex3',
          type: 'multiple_choice',
          question: '"Kamola and Zulfiya are sisters. ___ are happy." Bo\'sh joyga nima kiradi?',
          options: ['He', 'She', 'They', 'It'],
          correct: 2,
          explanation: 'Bir nechta odam uchun "They" ishlatiladi.',
        },
      ],
    },
  },
  {
    id: 'a1-u2-l1',
    level: 'A1',
    unitId: 'a1-u2',
    unitTitle: 'Kundalik Hayot So\'zlari',
    unitNumber: 2,
    lessonNumber: 1,
    title: 'Oila a\'zolari',
    type: 'vocabulary',
    duration: '15 daqiqa',
    xp: 20,
    description: 'Oila a\'zolarini inglizcha nomlarini o\'rganamiz',
    content: {
      intro: 'Oila a\'zolari haqida gaplashish — ingliz tilini o\'rganishning muhim qismi.',
      sections: [
        {
          title: 'Oila a\'zolari',
          body: 'Father / Dad → Ota / Dadam\nMother / Mom → Ona / Onam\nBrother → Aka / Uka\nSister → Opa / Singil\nGrandfather → Bobo\nGrandmother → Buvi\nSon → O\'g\'il\nDaughter → Qiz\nHusband → Er\nWife → Xotin',
        },
        {
          title: 'Misol gaplar',
          body: 'My father is a doctor. → Otam shifokor.\nI have two brothers. → Menda ikki aka bor.\nShe is my sister. → U mening opam / singilim.\nMy grandmother is kind. → Mening buvim mehribon.',
        },
      ],
      exercises: [
        {
          id: 'ex1',
          type: 'multiple_choice',
          question: '"Mother" o\'zbek tilida nima?',
          options: ['Ota', 'Ona', 'Aka', 'Opa'],
          correct: 1,
          explanation: 'Mother = Ona / Mom = Onam',
        },
        {
          id: 'ex2',
          type: 'multiple_choice',
          question: '"My ___ is tall." (Otam baland bo\'yli) Bo\'sh joyga nima?',
          options: ['mother', 'sister', 'father', 'daughter'],
          correct: 2,
          explanation: 'Father = Ota. My father is tall. = Otam baland bo\'yli.',
        },
        {
          id: 'ex3',
          type: 'multiple_choice',
          question: '"Grandfather" o\'zbek tilida nima?',
          options: ['Buvi', 'Bobo', 'Ota', 'Aka'],
          correct: 1,
          explanation: 'Grandfather = Bobo',
        },
      ],
    },
  },

  // ─────────────────── A2 ───────────────────
  {
    id: 'a2-u1-l1',
    level: 'A2',
    unitId: 'a2-u1',
    unitTitle: 'Hozirgi Zamon',
    unitNumber: 1,
    lessonNumber: 1,
    title: 'Present Simple — Hozirgi oddiy zamon',
    type: 'grammar',
    duration: '20 daqiqa',
    xp: 25,
    description: 'Odatiy harakatlar va faktlar uchun Present Simple zamonini o\'rganamiz',
    content: {
      intro: 'Present Simple — odatiy, takrorlanadigan harakatlar va umumiy haqiqatlar uchun ishlatiladi.',
      sections: [
        {
          title: 'Qoidasi',
          body: 'Subject + fe\'l (base form)\n\nI / You / We / They → fe\'l (o\'zgarishsiz)\nHe / She / It → fe\'l + s/es\n\nMisol:\nI work every day. → Men har kuni ishlayman.\nShe works at a hospital. → U kasalxonada ishlaydi.\nThey study English. → Ular ingliz tilini o\'qiydi.',
        },
        {
          title: 'He/She/It uchun qoidalar',
          body: 'Oddiy fe\'llar: + s → works, reads, plays\n-ch, -sh, -o, -x bilan tugaganlar: + es → watches, washes, goes, fixes\n-y bilan tugasa (consonant+y): y → ies → study → studies, carry → carries',
        },
        {
          title: 'Inkor shakli',
          body: 'I / You / We / They + do not (don\'t) + fe\'l\nHe / She / It + does not (doesn\'t) + fe\'l\n\nI don\'t like coffee. → Men qahvani yoqtirmayman.\nShe doesn\'t watch TV. → U televizor ko\'rmaydi.',
        },
        {
          title: 'So\'roq shakli',
          body: 'Do + I/you/we/they + fe\'l?\nDoes + he/she/it + fe\'l?\n\nDo you speak English? → Siz inglizcha gaplashasizmi?\nDoes he live in Tashkent? → U Toshkentda yashaydimi?',
        },
      ],
      exercises: [
        {
          id: 'ex1',
          type: 'multiple_choice',
          question: '"She ___ (read) books every night." To\'g\'ri variantni tanlang.',
          options: ['read', 'reads', 'reading', 'readed'],
          correct: 1,
          explanation: 'She (ayol) bilan fe\'lga -s qo\'shiladi: reads',
        },
        {
          id: 'ex2',
          type: 'multiple_choice',
          question: '"They ___ not play football." Bo\'sh joyga nima?',
          options: ['does', 'do', 'is', 'are'],
          correct: 1,
          explanation: 'They bilan "do not" ishlatiladi: They do not play.',
        },
        {
          id: 'ex3',
          type: 'multiple_choice',
          question: '"___ she live in Samarkand?" So\'roq tuzamiz.',
          options: ['Do', 'Is', 'Does', 'Are'],
          correct: 2,
          explanation: 'She bilan so\'roq "Does" bilan boshlanadi.',
        },
        {
          id: 'ex4',
          type: 'multiple_choice',
          question: '"He ___ (watch) TV every day."',
          options: ['watch', 'watches', 'watchs', 'watching'],
          correct: 1,
          explanation: '-ch bilan tugaganlar He/She/It bilan +es oladi: watches',
        },
      ],
    },
  },
  {
    id: 'a2-u1-l2',
    level: 'A2',
    unitId: 'a2-u1',
    unitTitle: 'Hozirgi Zamon',
    unitNumber: 1,
    lessonNumber: 2,
    title: 'Present Continuous — Hozirgi davom zamon',
    type: 'grammar',
    duration: '18 daqiqa',
    xp: 25,
    description: 'Hozir bajarilayotgan harakatlar uchun Present Continuous',
    content: {
      intro: 'Present Continuous — hozir, ayni damda bo\'layotgan harakatlarni ifodalaydi.',
      sections: [
        {
          title: 'Qoidasi',
          body: 'Subject + am/is/are + fe\'l-ing\n\nI am studying. → Men o\'qiyapman.\nShe is cooking. → U ovqat pishiryapti.\nThey are playing. → Ular o\'ynayapti.',
        },
        {
          title: '-ing qo\'shish qoidalari',
          body: 'Oddiy: + ing → read → reading\nQisqa undosh+unli+undosh: undoshni ikkilashtir → sit → sitting, run → running\n-e bilan tugasa: e tashlab + ing → make → making, write → writing',
        },
        {
          title: 'Present Simple vs Present Continuous',
          body: 'Present Simple — odatiy (every day, usually, always)\nPresent Continuous — hozir (now, at the moment, right now)\n\nI eat lunch at 1pm. (har kuni)\nI am eating lunch now. (hozir)',
        },
      ],
      exercises: [
        {
          id: 'ex1',
          type: 'multiple_choice',
          question: '"He ___ (run) in the park right now."',
          options: ['run', 'runs', 'is running', 'running'],
          correct: 2,
          explanation: 'Hozir bo\'layotgan harakat: He is running.',
        },
        {
          id: 'ex2',
          type: 'multiple_choice',
          question: '"sit" fe\'liga -ing qo\'shsak?',
          options: ['siting', 'sitting', 'sit-ing', 'siting'],
          correct: 1,
          explanation: 'sit → undosh+unli+undosh → t ni ikkilashtir → sitting',
        },
        {
          id: 'ex3',
          type: 'multiple_choice',
          question: '"I ___ English right now." To\'g\'ri variantni tanlang.',
          options: ['study', 'studies', 'am studying', 'studying'],
          correct: 2,
          explanation: '"right now" — hozir degani. I am studying.',
        },
      ],
    },
  },
  {
    id: 'a2-u2-l1',
    level: 'A2',
    unitId: 'a2-u2',
    unitTitle: 'O\'tgan Zamon',
    unitNumber: 2,
    lessonNumber: 1,
    title: 'Past Simple — O\'tgan oddiy zamon',
    type: 'grammar',
    duration: '22 daqiqa',
    xp: 30,
    description: 'O\'tgan zamonda bo\'lgan harakatlarni ifodalash',
    content: {
      intro: 'Past Simple — o\'tgan zamonda tugagan harakatlarni ifodalaydi. Yesterday, last week, ago bilan ishlatiladi.',
      sections: [
        {
          title: 'Muntazam fe\'llar (Regular verbs)',
          body: 'fe\'l + ed → walked, played, watched, studied\n\nI walked to school yesterday. → Kecha maktabga piyoda bordim.\nShe watched a movie last night. → U kecha kino ko\'rdi.',
        },
        {
          title: 'Nomuntazam fe\'llar (Irregular verbs)',
          body: 'go → went\ncome → came\neat → ate\nsee → saw\nbuy → bought\nhave → had\nwrite → wrote\nmake → made\ntake → took\ngive → gave',
        },
        {
          title: 'Inkor va So\'roq',
          body: 'Inkor: Subject + did not (didn\'t) + fe\'l (base)\nSo\'roq: Did + subject + fe\'l (base)?\n\nI didn\'t go to school. → Men maktabga bormadim.\nDid you eat breakfast? → Siz nonushta qildingizmi?',
        },
      ],
      exercises: [
        {
          id: 'ex1',
          type: 'multiple_choice',
          question: '"go" ning Past Simple shakli?',
          options: ['goed', 'gone', 'went', 'going'],
          correct: 2,
          explanation: 'go — nomuntazam fe\'l. Past Simple = went',
        },
        {
          id: 'ex2',
          type: 'multiple_choice',
          question: '"She ___ (watch) TV yesterday."',
          options: ['watch', 'watches', 'watching', 'watched'],
          correct: 3,
          explanation: 'Regular verb + ed = watched. Yesterday — o\'tgan zamon.',
        },
        {
          id: 'ex3',
          type: 'multiple_choice',
          question: '"I ___ not eat breakfast this morning."',
          options: ['do', 'does', 'did', 'was'],
          correct: 2,
          explanation: 'O\'tgan zamon inkor: did not eat',
        },
        {
          id: 'ex4',
          type: 'multiple_choice',
          question: '"___ you see the match last night?"',
          options: ['Do', 'Does', 'Did', 'Were'],
          correct: 2,
          explanation: 'O\'tgan zamon so\'rogi: Did you see...',
        },
      ],
    },
  },

  // ─────────────────── B1 ───────────────────
  {
    id: 'b1-u1-l1',
    level: 'B1',
    unitId: 'b1-u1',
    unitTitle: 'Kelajak Zamon',
    unitNumber: 1,
    lessonNumber: 1,
    title: 'Future Simple: will va going to',
    type: 'grammar',
    duration: '20 daqiqa',
    xp: 30,
    description: 'Kelajakdagi rejalani ifodalash usullari',
    content: {
      intro: 'Ingliz tilida kelajakni ifodalashning asosiy ikki usuli: "will" va "be going to"',
      sections: [
        {
          title: 'Will — spontan qaror va bashorat',
          body: 'will + fe\'l (base form)\nBarcha shaxslarda o\'zgarishsiz: I will, You will, He will...\n\nI will call you tomorrow. → Ertaga senga qo\'ng\'iroq qilaman.\nIt will rain today. → Bugun yomg\'ir yog\'adi. (bashorat)\nI\'m hungry. I\'ll eat something. → (spontan qaror)',
        },
        {
          title: 'Be going to — oldindan rejalashtirilgan',
          body: 'am/is/are + going to + fe\'l\n\nI am going to visit my parents next week. → Kelasi hafta ota-onamnikiga boraman. (reja)\nShe is going to study medicine. → U tibbiyot o\'qiydi. (reja)',
        },
        {
          title: 'Farqi',
          body: 'Will → spontan qaror, bashorat, va\'da\nGoing to → oldindan belgilangan reja, alomatlarga asoslangan bashorat\n\nLook at those clouds! It\'s going to rain. (alomatga asoslangan)\nI think it will be a great day. (shaxsiy bashorat)',
        },
      ],
      exercises: [
        {
          id: 'ex1',
          type: 'multiple_choice',
          question: '"I\'m thirsty. I ___ get some water." (spontan qaror)',
          options: ['am going to', '\'ll', 'was', 'did'],
          correct: 1,
          explanation: 'Spontan qaror uchun "will/\'ll" ishlatiladi: I\'ll get some water.',
        },
        {
          id: 'ex2',
          type: 'multiple_choice',
          question: '"She ___ going to travel to London next month." (reja)',
          options: ['will', 'is', 'was', 'did'],
          correct: 1,
          explanation: 'She + going to → She is going to travel.',
        },
        {
          id: 'ex3',
          type: 'multiple_choice',
          question: '"___ you help me, please?"',
          options: ['Are', 'Do', 'Will', 'Did'],
          correct: 2,
          explanation: 'So\'rov va va\'da uchun "Will": Will you help me?',
        },
      ],
    },
  },
  {
    id: 'b1-u1-l2',
    level: 'B1',
    unitId: 'b1-u1',
    unitTitle: 'Kelajak Zamon',
    unitNumber: 1,
    lessonNumber: 2,
    title: 'Present Perfect: have/has + past participle',
    type: 'grammar',
    duration: '25 daqiqa',
    xp: 35,
    description: 'O\'tgan zamon natijasi hozirga ta\'sir qilganda ishlatiladi',
    content: {
      intro: 'Present Perfect — o\'tgan zamonda bo\'lgan, lekin hozirga aloqasi bor harakatlarni ifodalaydi.',
      sections: [
        {
          title: 'Qoidasi',
          body: 'Subject + have/has + Past Participle (V3)\n\nI/You/We/They → have\nHe/She/It → has\n\nI have finished my homework. → Uyimni vazifalarni tugatdim (hozir tayyor).\nShe has lived here for 5 years. → U bu yerda 5 yildan beri yashaydi.',
        },
        {
          title: 'Qachon ishlatiladi?',
          body: '1. Natijasi hozirga ta\'sir qilsa:\nI have lost my keys. (Kalitlarimni yo\'qotdim — hozir yo\'q)\n\n2. Hayotiy tajriba:\nI have visited London. (Hayotimda London ga borganimman)\n\n3. Just, already, yet, ever, never bilan:\nShe has just called me.\nHave you ever eaten sushi?\nI haven\'t finished yet.',
        },
        {
          title: 'Past Simple vs Present Perfect',
          body: 'Past Simple: aniq vaqt ko\'rsatilganda (yesterday, in 2020, last year)\nPresent Perfect: vaqt ko\'rsatilmaganda yoki hozirga aloqasi bo\'lganda\n\nI saw him yesterday. (Past Simple — aniq vaqt)\nI have seen that movie. (Present Perfect — tajriba)',
        },
      ],
      exercises: [
        {
          id: 'ex1',
          type: 'multiple_choice',
          question: '"She ___ (finish) her report." (endi tugatdi)',
          options: ['finish', 'finished', 'has finished', 'have finished'],
          correct: 2,
          explanation: 'She + has + V3: She has finished.',
        },
        {
          id: 'ex2',
          type: 'multiple_choice',
          question: '"___ you ever been to Japan?"',
          options: ['Did', 'Have', 'Do', 'Had'],
          correct: 1,
          explanation: 'Hayotiy tajriba so\'rog\'i: Have you ever been...?',
        },
        {
          id: 'ex3',
          type: 'multiple_choice',
          question: '"I ___ not seen that film yet."',
          options: ['did', 'do', 'have', 'am'],
          correct: 2,
          explanation: '"yet" bilan Present Perfect ishlatiladi: I have not seen...',
        },
        {
          id: 'ex4',
          type: 'multiple_choice',
          question: 'Qaysi gap to\'g\'ri?',
          options: [
            'I have seen him yesterday.',
            'I saw him yesterday.',
            'I have see him yesterday.',
            'I sees him yesterday.',
          ],
          correct: 1,
          explanation: '"yesterday" — aniq vaqt, shuning uchun Past Simple: I saw him yesterday.',
        },
      ],
    },
  },
  {
    id: 'b1-u2-l1',
    level: 'B1',
    unitId: 'b1-u2',
    unitTitle: 'Modal Fe\'llar',
    unitNumber: 2,
    lessonNumber: 1,
    title: 'Can, Could, Should, Must',
    type: 'grammar',
    duration: '22 daqiqa',
    xp: 30,
    description: 'Modal fe\'llar bilan imkon, ruxsat, maslahat va majburiyat ifodalash',
    content: {
      intro: 'Modal fe\'llar asosiy fe\'ldan oldin kelib, uning ma\'nosini o\'zgartiradi. Ulardan keyin infinitivning base shakli keladi.',
      sections: [
        {
          title: 'Can — imkon, qobiliyat',
          body: 'Can + fe\'l (base)\nI can swim. → Men suzа olaman.\nShe can speak three languages. → U uch tilda gaplasha oladi.\n\nInkor: cannot (can\'t)\nI can\'t drive. → Men mashina hayday olmayman.',
        },
        {
          title: 'Could — o\'tmishdagi imkon, muloyim so\'rov',
          body: 'He could run very fast when he was young. → U yosh paytida juda tez yugura olar edi.\nCould you help me, please? → Menga yordam bera olasizmi? (muloyim)',
        },
        {
          title: 'Should — maslahat',
          body: 'You should study every day. → Har kuni o\'qishing kerak. (maslahat)\nShe shouldn\'t eat so much sugar. → U bu qadar ko\'p shakar iste\'mol qilmasligi kerak.',
        },
        {
          title: 'Must — majburiyat, qattiq tavsiya',
          body: 'I must finish this report today. → Men bugun bu hisobotni tugatishim shart.\nYou must wear a seatbelt. → Xavfsizlik kamarini taqqan bo\'lishing shart.\nMustn\'t → taqiqlanadi: You mustn\'t smoke here. → Bu yerda chekish mumkin emas.',
        },
      ],
      exercises: [
        {
          id: 'ex1',
          type: 'multiple_choice',
          question: '"You look tired. You ___ rest." Maslahat bermoqchi.',
          options: ['must', 'can', 'should', 'could'],
          correct: 2,
          explanation: 'Maslahat berish uchun "should" ishlatiladi.',
        },
        {
          id: 'ex2',
          type: 'multiple_choice',
          question: '"She ___ speak English fluently." (qobiliyat)',
          options: ['must', 'can', 'should', 'would'],
          correct: 1,
          explanation: 'Qobiliyat uchun "can" ishlatiladi.',
        },
        {
          id: 'ex3',
          type: 'multiple_choice',
          question: '"You ___ not smoke in this room." (taqiq)',
          options: ['should', 'could', 'can', 'must'],
          correct: 3,
          explanation: 'Qat\'iy taqiq uchun "mustn\'t" ishlatiladi.',
        },
      ],
    },
  },

  // ─────────────────── B2 ───────────────────
  {
    id: 'b2-u1-l1',
    level: 'B2',
    unitId: 'b2-u1',
    unitTitle: 'Murakkab Zamonlar',
    unitNumber: 1,
    lessonNumber: 1,
    title: 'Passive Voice — Noaniq ega',
    type: 'grammar',
    duration: '25 daqiqa',
    xp: 40,
    description: 'Majhul nisbat — harakat kimga qaratilganini ifodalash',
    content: {
      intro: 'Passive Voice — harakatni kimligidan ko\'ra natijaga e\'tibor qaratilganda ishlatiladi.',
      sections: [
        {
          title: 'Qoidasi',
          body: 'Active: Subject + verb + object\nPassive: Object + be + past participle (V3) + (by + subject)\n\nActive: They build houses. → Ular uy quradi.\nPassive: Houses are built (by them). → Uylar quriladi.',
        },
        {
          title: 'Har xil zamonda Passive',
          body: 'Present Simple: am/is/are + V3 → English is spoken here.\nPast Simple: was/were + V3 → The letter was written by her.\nPresent Perfect: have/has been + V3 → The report has been finished.\nFuture: will be + V3 → The bridge will be built next year.',
        },
      ],
      exercises: [
        {
          id: 'ex1',
          type: 'multiple_choice',
          question: '"The cake ___ (eat) by the children." Past passive.',
          options: ['eat', 'ate', 'was eaten', 'is eaten'],
          correct: 2,
          explanation: 'Past Passive: was/were + V3 → was eaten',
        },
        {
          id: 'ex2',
          type: 'multiple_choice',
          question: '"English ___ all over the world." Present Passive.',
          options: ['speaks', 'spoke', 'is spoken', 'was speaking'],
          correct: 2,
          explanation: 'Present Passive: is/are + V3 → is spoken',
        },
      ],
    },
  },
  {
    id: 'b2-u1-l2',
    level: 'B2',
    unitId: 'b2-u1',
    unitTitle: 'Murakkab Zamonlar',
    unitNumber: 1,
    lessonNumber: 2,
    title: 'Conditional Sentences — Shart gaplar',
    type: 'grammar',
    duration: '28 daqiqa',
    xp: 40,
    description: 'Zero, First, Second va Third Conditional',
    content: {
      intro: 'Conditional sentences — shart va natijani ifodalaydi. 4 asosiy tur mavjud.',
      sections: [
        {
          title: 'Zero Conditional — Umumiy haqiqat',
          body: 'If + Present Simple, + Present Simple\nIf you heat water, it boils. → Suvni qizdirsa, qaynaydi. (ilmiy haqiqat)',
        },
        {
          title: 'First Conditional — Real imkoniyat',
          body: 'If + Present Simple, + will + fe\'l\nIf it rains, I will stay home. → Yomg\'ir yog\'sa, uyda qolaman. (real ehtimol)',
        },
        {
          title: 'Second Conditional — Xayoliy holat',
          body: 'If + Past Simple, + would + fe\'l\nIf I had money, I would travel. → Puling bo\'lsa, sayohat qilardim. (hozir yo\'q)',
        },
        {
          title: 'Third Conditional — O\'tgan xayol',
          body: 'If + Past Perfect, + would have + V3\nIf I had studied, I would have passed. → O\'qiganimda, o\'tar edim. (o\'tmish xatoligi)',
        },
      ],
      exercises: [
        {
          id: 'ex1',
          type: 'multiple_choice',
          question: '"If I ___ rich, I would buy a house." (xayoliy)',
          options: ['am', 'was/were', 'will be', 'have been'],
          correct: 1,
          explanation: 'Second Conditional: If + Past Simple → were/was',
        },
        {
          id: 'ex2',
          type: 'multiple_choice',
          question: '"If it rains, we ___ cancel the trip." (real)',
          options: ['would', 'will', 'had', 'were'],
          correct: 1,
          explanation: 'First Conditional: will + fe\'l',
        },
      ],
    },
  },
]

// Group lessons by level
export function getLessonsByLevel(level) {
  return curriculum.filter((l) => l.level === level)
}

// Group by unit
export function groupByUnit(lessons) {
  const units = {}
  lessons.forEach((l) => {
    if (!units[l.unitId]) {
      units[l.unitId] = {
        id: l.unitId,
        title: l.unitTitle,
        number: l.unitNumber,
        level: l.level,
        lessons: [],
      }
    }
    units[l.unitId].lessons.push(l)
  })
  return Object.values(units).sort((a, b) => a.number - b.number)
}

export function getLessonById(id) {
  return curriculum.find((l) => l.id === id) || null
}

export function getNextLesson(currentId) {
  const idx = curriculum.findIndex((l) => l.id === currentId)
  return idx >= 0 && idx < curriculum.length - 1 ? curriculum[idx + 1] : null
}

export const PLACEMENT_TEST = [
  {
    id: 'pt1',
    question: 'Ingliz alifbosida nechta harf bor?',
    options: ['24', '25', '26', '28'],
    correct: 2,
    level: 'A0',
  },
  {
    id: 'pt2',
    question: '"Hello" nimani anglatadi?',
    options: ['Xayr', 'Salom', 'Rahmat', 'Kechirasiz'],
    correct: 1,
    level: 'A0',
  },
  {
    id: 'pt3',
    question: '"She ___ a teacher." Bo\'sh joyga nima?',
    options: ['am', 'is', 'are', 'be'],
    correct: 1,
    level: 'A1',
  },
  {
    id: 'pt4',
    question: '"They ___ from Tashkent." To\'g\'ri variant?',
    options: ['am', 'is', 'are', 'be'],
    correct: 2,
    level: 'A1',
  },
  {
    id: 'pt5',
    question: '"I ___ (study) English every day."',
    options: ['study', 'studies', 'studying', 'studied'],
    correct: 0,
    level: 'A2',
  },
  {
    id: 'pt6',
    question: '"She ___ (watch) TV last night." O\'tgan zamon.',
    options: ['watch', 'watches', 'watched', 'watching'],
    correct: 2,
    level: 'A2',
  },
  {
    id: 'pt7',
    question: '"go" ning Past Simple shakli?',
    options: ['goed', 'gone', 'went', 'goes'],
    correct: 2,
    level: 'A2',
  },
  {
    id: 'pt8',
    question: '"You look sick. You ___ see a doctor." Maslahat.',
    options: ['must', 'can', 'should', 'would'],
    correct: 2,
    level: 'B1',
  },
  {
    id: 'pt9',
    question: '"___ you ever been to London?"',
    options: ['Did', 'Have', 'Do', 'Had'],
    correct: 1,
    level: 'B1',
  },
  {
    id: 'pt10',
    question: '"The letter ___ (write) by her." Past Passive.',
    options: ['wrote', 'written', 'was written', 'is written'],
    correct: 2,
    level: 'B2',
  },
  {
    id: 'pt11',
    question: '"If I ___ rich, I would travel the world." (xayoliy)',
    options: ['am', 'was/were', 'will be', 'have been'],
    correct: 1,
    level: 'B2',
  },
  {
    id: 'pt12',
    question: '"Despite ___ tired, she continued working."',
    options: ['being', 'be', 'been', 'to be'],
    correct: 0,
    level: 'C1',
  },
  {
    id: 'pt13',
    question: '"It is essential that he ___ on time."',
    options: ['arrives', 'arrive', 'arrived', 'arriving'],
    correct: 1,
    level: 'C1',
  },
  {
    id: 'pt14',
    question: 'Choose the best word: "The scientist made a ___ discovery."',
    options: ['groundbreaking', 'grounding', 'foundational', 'breaking'],
    correct: 0,
    level: 'C1',
  },
  {
    id: 'pt15',
    question: '"Not only ___ she pass the exam, but she also got top marks."',
    options: ['had', 'did', 'was', 'has'],
    correct: 1,
    level: 'C1',
  },
]

// Determine level from placement test score
export function calculateLevel(answers, questions) {
  const levelScores = { A0: 0, A1: 0, A2: 0, B1: 0, B2: 0, C1: 0 }
  const levelTotals = { A0: 0, A1: 0, A2: 0, B1: 0, B2: 0, C1: 0 }

  questions.forEach((q, i) => {
    levelTotals[q.level] = (levelTotals[q.level] || 0) + 1
    if (answers[i] === q.correct) {
      levelScores[q.level] = (levelScores[q.level] || 0) + 1
    }
  })

  const correctTotal = Object.values(levelScores).reduce((a, b) => a + b, 0)
  const pct = correctTotal / questions.length

  if (pct >= 0.87) return 'C1'
  if (pct >= 0.73) return 'B2'
  if (pct >= 0.53) return 'B1'
  if (pct >= 0.40) return 'A2'
  if (pct >= 0.20) return 'A1'
  return 'A0'
}
