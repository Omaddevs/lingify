import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY    = 'lingify_vocabulary'
const FOLDERS_KEY    = 'lingify_vocab_folders'
const PROGRESS_KEY   = 'lingify_lesson_progress'
const SEEDED_KEY     = 'lingify_vocab_seeded_v2'

function load(key, fallback) {
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fallback }
  catch { return fallback }
}
function save(key, value) { localStorage.setItem(key, JSON.stringify(value)) }

// ── Helpers ──────────────────────────────────────────────────────────────────
let _wid = 1
function w(word, definition, translation, example, pronunciation, level, folderId, mastery = 0) {
  return {
    id: `w${_wid++}`,
    word, definition, translation, example, pronunciation, level, folderId,
    createdAt: Date.now() - Math.floor(Math.random() * 30) * 86400000,
    mastery,
    nextReview: Date.now() + (mastery > 0 ? [1,3,7,14,30,90][mastery - 1] * 86400000 : 0),
  }
}

// ── DEFAULT FOLDERS ──────────────────────────────────────────────────────────
const DEFAULT_FOLDERS = [
  { id: 'f1', name: 'Academic Words',  color: '#6366f1', emoji: '📚' },
  { id: 'f2', name: 'IELTS So\'zlari', color: '#ef4444', emoji: '📝' },
  { id: 'f3', name: 'Kundalik Hayot',  color: '#10b981', emoji: '☀️' },
  { id: 'f4', name: 'Business',        color: '#f59e0b', emoji: '💼' },
  { id: 'f5', name: 'SAT So\'zlari',   color: '#8b5cf6', emoji: '🎓' },
]

// ─────────────────────────────────────────────────────────────────────────────
//  📚 ACADEMIC WORDS — 100 ta so'z (f1)
// ─────────────────────────────────────────────────────────────────────────────
const ACADEMIC_WORDS = [
  w('Analyse','Examine in detail to discover meaning or essential features','Tahlil qilmoq','The researchers analysed the data carefully.','ˈænəlaɪz','B2','f1',3),
  w('Approach','A way of dealing with a situation or problem','Yondashuv; munosabat','We need a new approach to solve this problem.','əˈprəʊtʃ','B1','f1',2),
  w('Argue','Give reasons or evidence in support of an idea','Dalil keltirmoq; bahslashmoq','She argued that the policy was unfair.','ˈɑːɡjuː','B1','f1',4),
  w('Assess','Evaluate or estimate the nature or quality of something','Baholamoq; o\'lchamoq','Teachers assess students\' progress regularly.','əˈses','B2','f1',2),
  w('Assume','Suppose to be the case without proof','Faraz qilmoq; taxmin qilmoq','We assumed the results would be positive.','əˈsjuːm','B2','f1',1),
  w('Attribute','Regard something as being caused by','Bog\'liq deb bilmoq; bog\'lamoq','Success is often attributed to hard work.','əˈtrɪbjuːt','C1','f1',2),
  w('Authority','The power to give orders and make decisions','Vakolat; hokimiyat; mutaxassis','The government authority issued new regulations.','ɔːˈθɒrɪti','B2','f1',3),
  w('Available','Able to be used or obtained','Mavjud; foydalanish mumkin bo\'lgan','The data is available online for free.','əˈveɪləbl','A2','f1',5),
  w('Benefit','An advantage or profit gained from something','Foyda; manfaat','Regular exercise has many health benefits.','ˈbenɪfɪt','A2','f1',4),
  w('Category','A class or division of things','Kategoriya; turkum; sinf','This word belongs to the academic category.','ˈkætəɡəri','B1','f1',3),
  w('Cause','A person or thing that gives rise to an action','Sabab; olib kelmoq','Pollution is a major cause of climate change.','kɔːz','A2','f1',4),
  w('Chapter','A main division of a book','Bob; qism; bo\'lim','Please read the first chapter for homework.','ˈtʃæptə','A2','f1',5),
  w('Claim','State or assert as true','Da\'vo qilmoq; ta\'kidlamoq','The study claims that sleep improves memory.','kleɪm','B2','f1',2),
  w('Conclusion','A judgment reached by reasoning','Xulosa; natija','The conclusion of the essay summarised the key points.','kənˈkluːʒən','B1','f1',3),
  w('Conduct','Carry out or manage an activity','O\'tkazmoq; amalga oshirmoq','Scientists conducted the experiment for three months.','kənˈdʌkt','B2','f1',2),
  w('Consequence','A result or effect of an action','Oqibat; natija','Deforestation has serious consequences for wildlife.','ˈkɒnsɪkwəns','B2','f1',3),
  w('Consider','Think carefully about','Mulohaza qilmoq; ko\'rib chiqmoq','Please consider all the options before deciding.','kənˈsɪdə','B1','f1',4),
  w('Context','The circumstances surrounding an event','Kontekst; munosabat; sharoit','Understanding the historical context is important.','ˈkɒntekst','B2','f1',3),
  w('Contract','A written legal agreement between parties','Shartnoma; kelishuv','Both parties signed the contract yesterday.','ˈkɒntrækt','B2','f1',2),
  w('Create','Bring something into existence','Yaratmoq; hosil qilmoq','The artist created a stunning painting.','kriˈeɪt','A2','f1',5),
  w('Data','Facts and statistics collected for analysis','Ma\'lumotlar; raqamlar','The data shows a significant increase in sales.','ˈdeɪtə','B1','f1',4),
  w('Define','State the meaning of a word or phrase','Ta\'riflash; aniqlash','Please define the key terms before writing.','dɪˈfaɪn','B1','f1',3),
  w('Demonstrate','Show the existence of something by evidence','Ko\'rsatmoq; isbotlamoq','The results demonstrate a clear improvement.','ˈdemənstreɪt','B2','f1',2),
  w('Design','Plan and make something with a specific purpose','Loyihalash; dizayn qilmoq','Engineers designed the bridge carefully.','dɪˈzaɪn','B1','f1',3),
  w('Develop','Grow or cause to grow more advanced','Rivojlanmoq; takomillashtirmoq','The country is developing rapidly.','dɪˈveləp','B1','f1',4),
  w('Distribution','The way something is spread over an area','Tarqatish; taqsimot','The distribution of resources was unequal.','ˌdɪstrɪˈbjuːʃən','C1','f1',1),
  w('Environment','The natural world in which people live','Muhit; atrof-muhit','We must protect the environment for future generations.','ɪnˈvaɪrənmənt','B1','f1',4),
  w('Establish','Set up permanently; demonstrate the truth of','O\'rnatmoq; asoslamoq','The university was established in 1890.','ɪˈstæblɪʃ','B2','f1',2),
  w('Evaluate','Form an idea of the amount or value of','Baholamoq; o\'lchamoq','Students must evaluate the evidence critically.','ɪˈvæljueɪt','B2','f1',2),
  w('Evidence','Available facts indicating whether something is true','Dalil; isbот','There is strong evidence linking smoking to cancer.','ˈevɪdəns','B2','f1',3),
  w('Factor','A circumstance contributing to a result','Omil; sabab','Climate is a major factor in crop production.','ˈfæktə','B2','f1',3),
  w('Feature','A distinctive attribute or aspect','Xususiyat; belgi; xislat','The main feature of this study is its scope.','ˈfiːtʃə','B1','f1',4),
  w('Function','The purpose something is designed or used for','Vazifa; funksiya','The function of the liver is to filter blood.','ˈfʌŋkʃən','B2','f1',3),
  w('Generate','Produce or create','Hosil qilmoq; yaratmoq','Solar panels generate electricity from sunlight.','ˈdʒenəreɪt','B2','f1',2),
  w('Global','Relating to the whole world','Global; dunyo miqyosidagi','Climate change is a global problem.','ˈɡləʊbəl','B1','f1',4),
  w('Hypothesis','A proposed explanation for a phenomenon','Gipoteza; faraz; taxmin','The scientist formed a hypothesis to test.','haɪˈpɒθɪsɪs','C1','f1',1),
  w('Identify','Recognise and establish the identity of','Aniqlash; belgilamoq; topmoq','Can you identify the main cause of the problem?','aɪˈdentɪfaɪ','B1','f1',4),
  w('Impact','The strong effect something has','Ta\'sir; samara; oqibat','Technology has a huge impact on daily life.','ˈɪmpækt','B2','f1',3),
  w('Implication','The conclusion that can be drawn from something','Oqibat; ma\'no; ahamiyat','Consider the implications of this decision.','ˌɪmplɪˈkeɪʃən','C1','f1',1),
  w('Indicate','Point out or show','Ko\'rsatmoq; bildirmoq','The graph indicates a downward trend.','ˈɪndɪkeɪt','B2','f1',2),
  w('Individual','Single person or thing separate from a group','Individual; shaxsiy; yakka','Each individual has unique learning needs.','ˌɪndɪˈvɪdʒuəl','B2','f1',3),
  w('Interpret','Explain the meaning of something','Izohlash; sharhlash; talqin qilmoq','It is difficult to interpret these results.','ɪnˈtɜːprɪt','B2','f1',2),
  w('Involve','Include as a necessary part','O\'z ichiga olmoq; jalb etmoq','The research involves collecting large amounts of data.','ɪnˈvɒlv','B2','f1',3),
  w('Issue','An important topic or problem for debate','Masala; muammo; savol','Climate change is the key issue of our time.','ˈɪʃuː','B1','f1',4),
  w('Justify','Show or prove to be right or reasonable','Asoslash; isbotlash','Can you justify your decision?','ˈdʒʌstɪfaɪ','B2','f1',2),
  w('Method','A particular procedure for accomplishing something','Usul; metod; yo\'l','This method of learning is very effective.','ˈmeθəd','B1','f1',4),
  w('Obtain','Get or acquire something','Qo\'lga kiritmoq; erishmoq','Scientists obtained new data from the experiment.','əbˈteɪn','B2','f1',2),
  w('Perspective','A particular attitude toward something','Nuqtai nazar; qarash; ko\'rinish','From a historical perspective, this is significant.','pəˈspektɪv','C1','f1',1),
  w('Policy','A course of action adopted by an organisation','Siyosat; yo\'l-yo\'riq; qoidalar','The government introduced a new education policy.','ˈpɒlɪsi','B2','f1',2),
  w('Principle','A fundamental truth or proposition','Tamoyil; qoida; printsip','The experiment is based on a simple principle.','ˈprɪnsɪpl','B2','f1',3),
  w('Process','A series of actions to achieve a result','Jarayon; protsess; usul','Learning is a gradual process.','ˈprəʊses','B1','f1',4),
  w('Propose','Put forward a plan or suggestion','Taklif qilmoq; ilgari surmoq','The researcher proposed a new theory.','prəˈpəʊz','B2','f1',2),
  w('Provide','Make available for use; supply','Ta\'minlash; bermoq; taqdim etmoq','The government provides free education for all.','prəˈvaɪd','B1','f1',4),
  w('Publish','Print and issue a book or article','Nashr qilmoq; chop etmoq','The findings were published in a scientific journal.','ˈpʌblɪʃ','B1','f1',3),
  w('Relevant','Closely connected to the matter at hand','Tegishli; muhim; aloqali','Provide only relevant information in your essay.','ˈreləvənt','B2','f1',3),
  w('Research','Systematic investigation to establish facts','Tadqiqot; ilmiy ish; o\'rganish','The research took three years to complete.','rɪˈsɜːtʃ','B1','f1',4),
  w('Resource','A stock that can be used','Resurs; manba; imkoniyat','Natural resources are becoming scarce.','rɪˈzɔːs','B2','f1',3),
  w('Response','A reaction to something','Javob; munosabat; reaksiya','The response to the new policy was positive.','rɪˈspɒns','B1','f1',4),
  w('Role','The function assumed by someone','Rol; vazifa; o\'rin','Education plays a crucial role in development.','rəʊl','B1','f1',4),
  w('Section','A distinct part or subdivision','Bo\'lim; qism; belgi','Please read section three of the textbook.','ˈsekʃən','A2','f1',5),
  w('Significant','Important; having a major effect','Muhim; katta; sezilarli','There was a significant improvement in results.','sɪɡˈnɪfɪkənt','B2','f1',3),
  w('Similar','Resembling without being identical','O\'xshash; shunday; mushtarak','The two studies produced similar results.','ˈsɪmɪlə','B1','f1',4),
  w('Source','A place from which information comes','Manba; asos; o\'choq','Always cite your sources in an academic paper.','sɔːs','B2','f1',3),
  w('Specific','Clearly defined or identified','Aniq; muayyan; maxsus','Can you give a specific example?','spɪˈsɪfɪk','B1','f1',4),
  w('Structure','The arrangement of parts','Tuzilma; qurilma; tarkib','The structure of the essay must be clear.','ˈstrʌktʃə','B2','f1',3),
  w('Survey','Examine and record the features of','So\'rov; tadqiqot; o\'rganish','A survey of 500 students was conducted.','ˈsɜːveɪ','B1','f1',4),
  w('Theory','A system of ideas intended to explain something','Nazariya; teоriya; fikr','Darwin developed the theory of evolution.','ˈθɪəri','B2','f1',3),
  w('Trend','A general direction in which something changes','Trend; yo\'nalish; o\'zgarish','There is a growing trend towards online learning.','trend','B2','f1',2),
  w('Valid','Actually supporting the intended point','To\'g\'ri; haqqoniy; kuchli','Is this a valid argument?','ˈvælɪd','C1','f1',1),
  w('Variable','An element that may change during an experiment','O\'zgaruvchi; turli-tuman','Temperature is a key variable in this experiment.','ˈveəriəbl','C1','f1',1),
  w('Whereas','In contrast or comparison to the fact that','Holbuki; qachonki; ammo','Some prefer urban life, whereas others prefer rural.','weərˈæz','C1','f1',1),
  w('Comprehensive','Including all elements; thorough','Keng qamrovli; to\'liq','The report provides a comprehensive analysis.','ˌkɒmprɪˈhensɪv','C1','f1',2),
  w('Predominantly','Mainly; for the most part','Asosan; ko\'pincha; ko\'proq','The region is predominantly agricultural.','prɪˈdɒmɪnəntli','C1','f1',1),
  w('Empirical','Based on observation or experience','Empirik; tajribaviy; amaliy','The study provides empirical evidence.','ɪmˈpɪrɪkəl','C1','f1',1),
  w('Abstract','Existing in thought rather than concrete form','Mavhum; abstrakt; g\'oyaviy','The concept is too abstract to grasp easily.','ˈæbstrækt','C1','f1',1),
  w('Ambiguous','Open to more than one interpretation','Noaniq; ikki ma\'noli; belirsiz','The instructions were ambiguous and confusing.','æmˈbɪɡjuəs','C1','f1',2),
  w('Coherent','Logical and consistent','Mantiqiy; izchil; bir-biri bilan bog\'liq','The essay must present a coherent argument.','kəʊˈhɪərənt','C1','f1',1),
  w('Concise','Giving information clearly in few words','Ixcham; qisqacha; aniq','Write a concise summary of the text.','kənˈsaɪs','C1','f1',2),
  w('Criterion','A principle by which something is judged','Mezon; o\'lchov; kriter','What criteria did you use to select participants?','kraɪˈtɪəriən','C1','f1',1),
  w('Deduce','Arrive at a conclusion by reasoning','Xulosa chiqarmoq; isbotlamoq','From the evidence, we can deduce that...','dɪˈdjuːs','C1','f1',1),
  w('Diminish','Make or become smaller','Kamaymoq; susaymoq; kichraytirmoq','The importance of the finding should not be diminished.','dɪˈmɪnɪʃ','C1','f1',1),
  w('Explicit','Stated clearly and in detail','Aniq; ochiq; ravshan','The instructions must be explicit and detailed.','ɪkˈsplɪsɪt','C1','f1',1),
  w('Facilitate','Make an action easier','Osonlashtirmoq; ko\'maklashmoq','Technology facilitates communication.','fəˈsɪlɪteɪt','C1','f1',2),
  w('Fundamental','Forming a necessary base; essential','Asosiy; zaruriy; muhim','This is a fundamental concept in mathematics.','ˌfʌndəˈmentəl','B2','f1',2),
  w('Inherent','Existing as a permanent essential quality','Tug\'ma; tabiiy; ichki','There are inherent risks in every business.','ɪnˈhɪərənt','C1','f1',1),
  w('Integrate','Combine one thing with another','Birlashtirmoq; qo\'shmoq; integratsiya qilmoq','We need to integrate theory with practice.','ˈɪntɪɡreɪt','C1','f1',2),
  w('Meticulous','Showing great attention to detail','Puxta; aniq; e\'tiborli','She was meticulous in her research methods.','mɪˈtɪkjʊləs','C1','f1',2),
  w('Paradigm','A typical example or pattern','Namuna; paradigma; andoza','This discovery shifted the scientific paradigm.','ˈpærədaɪm','C1','f1',1),
  w('Phenomenon','A fact or situation observed to exist','Hodisa; fenomen; voqea','Social media is a relatively new phenomenon.','fɪˈnɒmɪnən','C1','f1',1),
  w('Rationale','A set of reasons or a logical basis','Sabab; asos; mantiq','Can you explain the rationale behind this decision?','ˌræʃəˈnɑːl','C1','f1',1),
  w('Subsequent','Coming after or following','Keyingi; undan keyin keluvchi','Subsequent studies confirmed the findings.','ˈsʌbsɪkwənt','C1','f1',1),
  w('Synthesise','Combine elements into a coherent whole','Sintez qilmoq; birlashtirmoq','The essay should synthesise ideas from multiple sources.','ˈsɪnθɪsaɪz','C1','f1',1),
  w('Underlying','Being the basis of something','Asosida yotuvchi; asosiy; yashirin','The underlying cause of the problem is poverty.','ˌʌndəˈlaɪɪŋ','C1','f1',1),
  w('Inevitable','Certain to happen; unavoidable','Muqarrar; oldini olib bo\'lmas','Change is inevitable in any organisation.','ɪnˈevɪtəbl','B2','f1',2),
  w('Objective','Not influenced by personal feelings','Ob\'ektiv; xolisona; maqsad','Try to remain objective when evaluating the data.','əbˈdʒektɪv','B2','f1',2),
  w('Complexity','The state of being complicated','Murakkablik; qiyinchilik; ko\'p qirralilik','The complexity of the issue requires careful study.','kəmˈpleksɪti','C1','f1',1),
]

// ─────────────────────────────────────────────────────────────────────────────
//  📝 IELTS SO'ZLARI — 100 ta so'z (f2)
// ─────────────────────────────────────────────────────────────────────────────
const IELTS_WORDS = [
  w('Accelerate','Increase in rate or speed','Tezlashtirmoq; jadallashmoq','Global warming is accelerating climate change.','əkˈseləreɪt','B2','f2',2),
  w('Accommodate','Provide lodging or space for','Joylashtirmoq; moslashmoq; imkon bermoq','The city cannot accommodate more vehicles.','əˈkɒmədeɪt','B2','f2',2),
  w('Acknowledge','Accept or admit the truth of','Tan olmoq; e\'tirof etmoq','He acknowledged his mistake publicly.','əkˈnɒlɪdʒ','B2','f2',3),
  w('Acquire','Come to have or possess','Qo\'lga kiritmoq; egallash; olmoq','Children acquire language naturally.','əˈkwaɪə','B2','f2',2),
  w('Adequate','Satisfactory or acceptable in quality','Yetarli; maqbul; to\'g\'ri','The evidence is not adequate to prove the claim.','ˈædɪkwɪt','B2','f2',3),
  w('Adverse','Preventing success; harmful','Noqulay; salbiy; zararli','Adverse weather conditions delayed the flight.','ˈædvɜːs','C1','f2',1),
  w('Advocate','Publicly recommend or support','Tarafdor bo\'lmoq; qo\'llab-quvvatlamoq','She advocates for women\'s education rights.','ˈædvəkeɪt','C1','f2',2),
  w('Affluent','Having a great deal of wealth','Badavlat; boylik; serquyosh','Affluent countries produce the most carbon emissions.','ˈæfluənt','C1','f2',1),
  w('Allocate','Distribute resources for a particular purpose','Ajratmoq; taqsimlamoq; belgilamoq','The budget is allocated to education and health.','ˈæləkeɪt','C1','f2',1),
  w('Alleviate','Make suffering less severe','Yengillashtirmoq; kamaytirmoq','Exercise can help alleviate stress.','əˈliːvieɪt','C1','f2',1),
  w('Alter','Change in character or composition','O\'zgartirmoq; o\'zgarmoq','Climate change has altered weather patterns.','ˈɔːltə','B2','f2',2),
  w('Ambitious','Having a strong desire for success','Ambitsiyali; maqsadli; intiluvchi','He is ambitious and works very hard.','æmˈbɪʃəs','B2','f2',3),
  w('Analogous','Comparable in certain respects','O\'xshash; parallel; muqobil','The situation is analogous to what happened in 2008.','əˈnæləɡəs','C1','f2',1),
  w('Anticipate','Expect or predict','Kutmoq; oldindan sezmoq; taxmin qilmoq','We anticipate a significant increase in demand.','ænˈtɪsɪpeɪt','C1','f2',2),
  w('Apparent','Clearly visible or understood','Ravshan; ko\'rinib turuvchi; aniq','The solution to the problem is not immediately apparent.','əˈpærənt','B2','f2',2),
  w('Approximately','Close to the actual; roughly','Taxminan; yaqincha; deyarli','There are approximately seven billion people on Earth.','əˈprɒksɪmətli','B2','f2',3),
  w('Arise','Come into existence','Paydo bo\'lmoq; kelib chiqmoq','Problems may arise during the project.','əˈraɪz','B2','f2',2),
  w('Aspect','A particular part or feature','Jihat; tomoni; xususiyat','Consider every aspect of the problem.','ˈæspekt','B2','f2',3),
  w('Augment','Make something greater by adding to it','Ko\'paytirmoq; kuchaytirmoq; qo\'shmoq','Technology augments human capabilities.','ɔːɡˈment','C1','f2',1),
  w('Barrier','A circumstance preventing progress','To\'siq; g\'ov; to\'sqinlik','Language is a major barrier to integration.','ˈbæriə','B2','f2',3),
  w('Bias','An unfair inclination towards one side','Tarafkashlik; noto\'g\'ri yondashuv','The study may have a gender bias.','baɪəs','B2','f2',2),
  w('Biodiversity','Variety of life in a particular habitat','Biologik xilma-xillik','Rainforests are rich in biodiversity.','ˌbaɪəʊdaɪˈvɜːsɪti','C1','f2',1),
  w('Capacity','The maximum amount something can hold','Sig\'im; quvvat; imkoniyat','The hall has a capacity of 500 people.','kəˈpæsɪti','B2','f2',2),
  w('Catastrophic','Involving or causing a catastrophe','Halokatli; dahshatli; fojiali','The oil spill had catastrophic effects.','ˌkætəˈstrɒfɪk','C1','f2',1),
  w('Challenge','Something needing great mental or physical effort','Qiyinlik; muammo; sinov','Poverty remains a major challenge globally.','ˈtʃælɪndʒ','B1','f2',4),
  w('Chronic','Persisting for a long time','Surunkali; uzoq muddatli; doimiy','He suffers from chronic back pain.','ˈkrɒnɪk','C1','f2',2),
  w('Cite','Refer to as evidence or example','Keltirib o\'tmoq; iqtibos keltirmoq','The author cites several studies to support the claim.','saɪt','B2','f2',2),
  w('Coherent','Logical and consistent; making sense','Mantiqiy; bog\'liq; izchil','The argument must be coherent and well-structured.','kəʊˈhɪərənt','C1','f2',1),
  w('Collapse','Fall down suddenly; fail completely','Qulamoq; yiqilmoq; barbod bo\'lmoq','The economy collapsed during the crisis.','kəˈlæps','B2','f2',2),
  w('Compensate','Give something to make up for loss','Qoplash; o\'rnini bosmoq; kompensatsiya','Exercise can compensate for a sedentary job.','ˈkɒmpenseɪt','B2','f2',2),
  w('Competitive','Relating to or involving competition','Raqobatbardosh; raqobatli','The job market is very competitive today.','kəmˈpetɪtɪv','B2','f2',3),
  w('Comprise','Be made up of; consist of','Tashkil topmoq; o\'z ichiga olmoq','The committee comprises five members.','kəmˈpraɪz','C1','f2',1),
  w('Conceal','Keep from sight; hide','Yashirmoq; berkitmoq; sir tutmoq','He tried to conceal the evidence.','kənˈsiːl','B2','f2',2),
  w('Considerably','To a great extent; much','Sezilarli darajada; ancha; juda','The situation has improved considerably.','kənˈsɪdərəbli','B2','f2',3),
  w('Constitute','Be a part of a whole','Tashkil qilmoq; o\'rnatmoq','This constitutes a major breakthrough.','ˈkɒnstɪtjuːt','C1','f2',1),
  w('Contemporary','Existing or occurring at the same time','Zamondosh; hozirgi; zamonaviy','Contemporary art is often controversial.','kənˈtempərəri','B2','f2',2),
  w('Contradict','Deny the truth of a statement','Qarama-qarshi bo\'lmoq; rad etmoq','The new evidence contradicts earlier findings.','ˌkɒntrəˈdɪkt','B2','f2',2),
  w('Controversy','Prolonged public disagreement','Munozara; bahs; nizo','The issue has caused significant controversy.','ˈkɒntrəvɜːsi','B2','f2',2),
  w('Conventional','Based on what is traditionally done','An\'anaviy; odatiy; qabul qilingan','Conventional farming uses a lot of water.','kənˈvenʃənəl','B2','f2',2),
  w('Criteria','Plural of criterion; principles for judgement','Mezonlar; standartlar','The selection criteria are very strict.','kraɪˈtɪəriə','B2','f2',2),
  w('Crucial','Decisive; extremely important','Hal qiluvchi; o\'ta muhim; zaruriy','It is crucial to address climate change now.','ˈkruːʃəl','B2','f2',3),
  w('Cultivate','Prepare land for growing crops; develop','Etishtirmoq; rivojlanmoq; o\'stirmoq','We must cultivate a culture of respect.','ˈkʌltɪveɪt','B2','f2',2),
  w('Decade','A period of ten years','O\'n yillik; dekaда','The economy grew rapidly in the last decade.','ˈdekeɪd','B1','f2',4),
  w('Decline','Become smaller or fewer; reduce','Kamaymoq; pasaymoq; rad etmoq','Birth rates have declined in many countries.','dɪˈklaɪn','B2','f2',3),
  w('Deforestation','Clearing a wide area of trees','O\'rmonni yo\'q qilish','Deforestation destroys natural habitats.','ˌdiːˌfɒrɪˈsteɪʃən','B2','f2',2),
  w('Demographic','Relating to population statistics','Demografik; aholi bilan bog\'liq','Demographic changes affect economic growth.','ˌdeməˈɡræfɪk','C1','f2',1),
  w('Deplete','Use up the supply of a resource','Tugатmoq; sarflash; kamаytirishmoq','Fossil fuels are being rapidly depleted.','dɪˈpliːt','C1','f2',1),
  w('Derive','Obtain from a specified source','Keltirib chiqarmoq; olmoq; ко\'paytirmoq','Many English words derive from Latin.','dɪˈraɪv','C1','f2',1),
  w('Detect','Discover or identify the presence of something','Aniqlash; topmoq; sezmoq','Scientists detected a new chemical compound.','dɪˈtekt','B2','f2',2),
  w('Deteriorate','Become progressively worse','Yomonlashmoq; pasaymoq; buzilmoq','His health began to deteriorate rapidly.','dɪˈtɪəriəreɪt','C1','f2',1),
  w('Diverse','Showing a great deal of variety','Xilma-xil; turli; ko\'p qirrali','The city has a diverse population.','daɪˈvɜːs','B2','f2',3),
  w('Domestic','Relating to the home or family; not foreign','Ichki; mahalliy; uy-oila','Domestic violence is a serious issue.','dəˈmestɪk','B2','f2',2),
  w('Dominate','Have a commanding influence over','Ustunlik qilmoq; hokimlik qilmoq','English dominates international business.','ˈdɒmɪneɪt','B2','f2',2),
  w('Drought','A prolonged period of abnormally low rainfall','Qurg\'oqchilik; suvsizlik; qahAtchiliq','The region is suffering from a severe drought.','draʊt','B2','f2',2),
  w('Emerge','Come out from a covered position','Paydo bo\'lmoq; chiqmoq; anglashilmoq','New technologies are emerging rapidly.','ɪˈmɜːdʒ','B2','f2',3),
  w('Emission','The production and discharge of gas','Emissiya; chiqarish; tarqatish','Carbon emissions must be reduced significantly.','ɪˈmɪʃən','C1','f2',2),
  w('Emphasise','Give special importance to something','Ta\'kidlamoq; urg\'u bermoq; ahamiyat bermoq','The teacher emphasised the importance of reading.','ˈemfəsaɪz','B2','f2',3),
  w('Enable','Give the means to do something','Imkon bermoq; qo\'llamoq; yordam bermoq','Education enables people to reach their potential.','ɪˈneɪbl','B2','f2',3),
  w('Enhance','Intensify; improve','Yaxshilamoq; kuchaytirmoq; oshirmoq','Exercise enhances mental wellbeing.','ɪnˈhɑːns','B2','f2',3),
  w('Enormous','Very large in size or quantity','Katta; ulkan; juda ko\'p','The project required an enormous amount of funding.','ɪˈnɔːməs','B1','f2',4),
  w('Entrepreneurship','Activity of setting up a business','Tadbirkorlik; biznesmenlik','Entrepreneurship drives economic growth.','ˌɒntrəprəˈnɜːʃɪp','C1','f2',1),
  w('Erosion','The gradual destruction by natural forces','Eroziya; yeyilish; buzilish','Coastal erosion is a major environmental concern.','ɪˈrəʊʒən','C1','f2',1),
  w('Essential','Absolutely necessary; extremely important','Zaruriy; muhim; asosiy','Water is essential for all forms of life.','ɪˈsenʃəl','B1','f2',4),
  w('Exacerbate','Make a problem or situation worse','Yomonlashtirmoq; kuchaytirmoq','Pollution exacerbates climate change.','ɪɡˈzæsəbeɪt','C1','f2',1),
  w('Exceed','Go beyond the limits of','Oshib ketmoq; o\'tib ketmoq; ortiqcha bo\'lmoq','Demand now exceeds supply in many sectors.','ɪkˈsiːd','B2','f2',2),
  w('Exploit','Make full use of; use selfishly','Ishlatmoq; manfaat olmoq; ekspluatatsiya qilmoq','Some companies exploit cheap labour.','ɪkˈsplɔɪt','B2','f2',2),
  w('Extensive','Covering or affecting a large area','Keng; katta miqyosli; chuqur','The researchers conducted extensive studies.','ɪkˈstensɪv','B2','f2',2),
  w('Fluctuate','Rise and fall irregularly','Tebranmoq; o\'zgarib turmoq; barqaror bo\'lmaslik','Prices fluctuate depending on demand.','ˈflʌktjueɪt','C1','f2',1),
  w('Fossil fuel','Natural fuel formed from organic remains','Qazilma yoqilg\'i','Burning fossil fuels releases carbon dioxide.','ˈfɒsl fjuːəl','B2','f2',2),
  w('Fragile','Easily broken or damaged','Mo\'rt; nozik; zaif','The ecosystem is extremely fragile.','ˈfrædʒaɪl','B2','f2',2),
  w('Globalisation','The process of integration worldwide','Globallashuv; butundunyo integratsiyasi','Globalisation has transformed world trade.','ˌɡləʊbəlaɪˈzeɪʃən','C1','f2',2),
  w('Greenhouse gas','A gas contributing to the greenhouse effect','Issiqxona gazi','CO₂ is the main greenhouse gas.','ˈɡriːnhaʊs ɡæs','B2','f2',2),
  w('Inequality','Difference in quality or social position','Tengsizlik; farq; adolatsizlik','Income inequality is rising in many countries.','ˌɪnɪˈkwɒlɪti','C1','f2',1),
  w('Infrastructure','Basic facilities and systems of a country','Infratuzilma; asosiy kommunikatsiyalar','Good infrastructure is essential for development.','ˈɪnfrəstrʌktʃə','C1','f2',1),
  w('Innovative','Featuring new ideas or methods','Innovatsion; yangilikchi; ijodiy','We need innovative solutions to global problems.','ˈɪnəveɪtɪv','B2','f2',2),
  w('Interconnected','Mutually joined or related','O\'zaro bog\'liq; bog\'langan','The world economy is deeply interconnected.','ˌɪntəkəˈnektɪd','C1','f2',1),
  w('Irrefutable','Impossible to deny or disprove','Rad etib bo\'lmas; aniq; isbotlangan','The evidence is irrefutable.','ɪˈrefjʊtəbl','C1','f2',1),
  w('Litigation','The process of taking legal action','Sudlov jarayoni; da\'vo; qonuniy kurash','The company faced lengthy litigation.','ˌlɪtɪˈɡeɪʃən','C1','f2',0),
  w('Marginalise','Treat as unimportant or powerless','Marginallashmoq; chekkaga surmoq','Poor communities are often marginalised.','ˈmɑːdʒɪnəlaɪz','C1','f2',0),
  w('Mitigate','Lessen the gravity or severity','Yumshatmoq; kamaytirmoq; oldini olmoq','Technology can mitigate environmental damage.','ˈmɪtɪɡeɪt','C1','f2',1),
  w('Mobility','Ability to move or be moved freely','Harakatchanlik; ko\'chish imkoniyati','Social mobility is important in a fair society.','məʊˈbɪlɪti','C1','f2',1),
  w('Monitor','Observe and check over a period of time','Kuzatmoq; nazorat qilmoq; monitoring qilmoq','Scientists monitor pollution levels constantly.','ˈmɒnɪtə','B2','f2',2),
  w('Mortality','The rate of death in a population','O\'lim darajasi; hayot muddati','Child mortality has fallen significantly.','mɔːˈtælɪti','C1','f2',1),
  w('Negotiate','Try to reach an agreement','Muzokaralar olib bormoq; kelishmoq','The two governments negotiated a peace deal.','nɪˈɡəʊʃieɪt','B2','f2',2),
  w('Neutral','Not supporting any side in a conflict','Neytral; betaraf; mustaqqil','Switzerland remained neutral during the war.','ˈnjuːtrəl','B2','f2',2),
  w('Obligation','An act one is morally bound to do','Majburiyat; burch; zimmasiga olmoq','It is an obligation to pay taxes.','ˌɒblɪˈɡeɪʃən','C1','f2',1),
  w('Obstacle','A thing that blocks progress','To\'siq; qarshilik; halaqit','Language barriers are a major obstacle.','ˈɒbstəkl','B2','f2',2),
  w('Offset','Counteract something by an opposite force','Qoplash; muvozanat; ko\'rsatmoq','Tree planting can offset carbon emissions.','ˈɒfset','C1','f2',1),
  w('Overcome','Succeed in dealing with a problem','Yengmoq; g\'alaba qilmoq; eploq bo\'lmoq','She overcame many obstacles to succeed.','ˌəʊvəˈkʌm','B2','f2',2),
  w('Pandemic','A disease prevalent over a whole country','Pandemiya; keng tarqalgan kasallik','The COVID-19 pandemic changed life globally.','pænˈdemɪk','B2','f2',3),
  w('Perpetuate','Make something continue indefinitely','Davom ettirmoq; abadiylashtirmoq','Education should not perpetuate inequality.','pəˈpetʃueɪt','C1','f2',0),
  w('Plausible','Seeming reasonable; probable','Ishonchli; ehtimoliy; mumkin bo\'lgan','The explanation seems plausible.','ˈplɔːzɪbl','C1','f2',1),
  w('Prerequisite','A thing required before something else','Oldindan talab; shart; zaruriy narsa','A degree is a prerequisite for this job.','priːˈrekwɪzɪt','C1','f2',1),
  w('Prevalent','Widespread in a particular area','Keng tarqalgan; ommabop; ustun','Obesity is increasingly prevalent in developed countries.','ˈprevələnt','C1','f2',1),
  w('Profound','Very great or intense; insightful','Chuqur; kuchli; o\'tkir','The invention had a profound effect on society.','prəˈfaʊnd','C1','f2',1),
  w('Prohibit','Formally forbid something','Taqiqlamoq; man etmoq; ruxsat bermaslik','Smoking is prohibited in public places.','prəˈhɪbɪt','B2','f2',2),
  w('Promote','Support or encourage actively','Rivojlantirmoq; rag\'batlantirmoq; targ\'ib qilmoq','Education promotes social mobility.','prəˈməʊt','B1','f2',3),
  w('Proportion','A part considered in relation to the whole','Nisbat; qism; ulush','A large proportion of students passed.','prəˈpɔːʃən','B2','f2',2),
  w('Prospect','The possibility of something happening','Istiqbol; ehtimol; ko\'z oldida','The prospects for economic growth look good.','ˈprɒspekt','B2','f2',2),
  w('Sustainable','Able to be maintained without harming the environment','Barqaror; davomli; atrof-muhitga zarar yetkazmaydigan','We need a sustainable energy source.','səˈsteɪnəbl','B2','f2',3),
  w('Yield','Produce or provide','Hosil bermoq; natija bermoq; taslim bo\'lmoq','The farmland yields a large harvest.','jiːld','B2','f2',2),
]

// ─────────────────────────────────────────────────────────────────────────────
//  ☀️ KUNDALIK HAYOT — 100 ta so'z (f3)
// ─────────────────────────────────────────────────────────────────────────────
const DAILY_WORDS = [
  w('Alarm clock','A clock that can be set to ring at a time','Uyg\'otgich soat','I set my alarm clock for 6 am.','əˈlɑːm klɒk','A1','f3',5),
  w('Appetite','Natural desire to eat','Ishtaha; taom yeish istagi','Exercise gives me a good appetite.','ˈæpɪtaɪt','A2','f3',4),
  w('Argue','To have a disagreement with someone','Bahslashmoq; janjallashmoq','They argued about money all the time.','ˈɑːɡjuː','A2','f3',4),
  w('Arrange','To put things in a particular order','Tartiblamoq; tashkil qilmoq','She arranged the flowers beautifully.','əˈreɪndʒ','A2','f3',3),
  w('Balance','Keep or put something in a steady position','Balans; muvozanat; tenglik','It is hard to balance work and family life.','ˈbæləns','A2','f3',4),
  w('Bargain','An agreement where both parties get benefit','Kelishuv; arzon narxdagi narsa','That coat was a real bargain!','ˈbɑːɡɪn','A2','f3',3),
  w('Behaviour','The way someone acts','Xulq-atvor; munosabat','Good behaviour is expected at school.','bɪˈheɪvjə','A2','f3',4),
  w('Borrow','Take something with the intention of returning it','Qarz olmoq; vaqtincha olmoq','Can I borrow your pen for a minute?','ˈbɒrəʊ','A1','f3',5),
  w('Budget','An estimate of income and expenditure','Byudjet; moliyaviy reja','We need to stick to our monthly budget.','ˈbʌdʒɪt','A2','f3',3),
  w('Celebrate','Mark a special occasion with festivities','Nishonlamoq; bayram qilmoq','We celebrated her birthday at a restaurant.','ˈselɪbreɪt','A1','f3',5),
  w('Chore','A routine task around the house','Uy ishi; kundalik yumush','Washing dishes is my least favourite chore.','tʃɔː','A2','f3',4),
  w('Commute','Travel between home and work regularly','Ishga borib-kelmoq; qatnash','She commutes two hours every day.','kəˈmjuːt','B1','f3',3),
  w('Complain','Express dissatisfaction','Shikoyat qilmoq; norozi bo\'lmoq','He complained about the noisy neighbours.','kəmˈpleɪn','A2','f3',4),
  w('Convenience','The state of being suitable','Qulay holat; qulaylik','Supermarkets offer great convenience.','kənˈviːniəns','B1','f3',3),
  w('Conversation','Informal talk between people','Suhbat; muloqot; gaplashuv','We had a long conversation over coffee.','ˌkɒnvəˈseɪʃən','A2','f3',4),
  w('Cope','Deal effectively with something difficult','Eplamoq; dosh bermoq; o\'rganmoq','It is hard to cope with stress at work.','kəʊp','B1','f3',3),
  w('Courtesy','Polite behaviour','Odobi; nazokati; muloyimlik','It is a courtesy to hold the door open.','ˈkɜːtɪsi','B1','f3',2),
  w('Craving','A powerful desire for something','Ishtiyoq; qattiq xohish; intilish','She had a craving for chocolate cake.','ˈkreɪvɪŋ','B1','f3',2),
  w('Crowd','A large number of people gathered together','Olomon; to\'p; jamoa','The streets were crowded with tourists.','kraʊd','A1','f3',5),
  w('Deadline','The time by which something must be done','Muddat; belgilangan vaqt','The deadline for applications is Friday.','ˈdedlaɪn','A2','f3',4),
  w('Delicious','Highly pleasant to the taste','Mazali; lazzatli; totli','The pizza was absolutely delicious!','dɪˈlɪʃəs','A1','f3',5),
  w('Delivery','The action of delivering goods','Yetkazib berish; ta\'minlash','The parcel arrived by next-day delivery.','dɪˈlɪvəri','A2','f3',4),
  w('Depend','Be controlled or determined by','Bog\'liq bo\'lmoq; ishonmoq','Success depends on hard work.','dɪˈpend','A2','f3',4),
  w('Diet','The kinds of food a person usually eats','Parhez; ovqatlanish tartibi','She went on a strict diet before summer.','ˈdaɪət','A2','f3',4),
  w('Disagree','Have a different opinion','Rozi bo\'lmaslik; kelishomaslik','I disagree with his opinion about this.','ˌdɪsəˈɡriː','A2','f3',4),
  w('Embarrass','Make someone feel awkward or ashamed','Uyaltirmoq; xijolat qilmoq','He was embarrassed by the mistake.','ɪmˈbærəs','B1','f3',3),
  w('Emergency','A serious unexpected situation requiring action','Favqulodda holat; shoshilinch','Call an ambulance — it\'s an emergency!','ɪˈmɜːdʒənsi','A2','f3',4),
  w('Encourage','Give support or confidence to someone','Rag\'batlantirmoq; qo\'llamoq','Her parents always encouraged her to study.','ɪnˈkʌrɪdʒ','A2','f3',4),
  w('Exercise','Activity requiring physical effort for fitness','Mashq; jismoniy faollik','I try to exercise for 30 minutes every day.','ˈeksəsaɪz','A1','f3',5),
  w('Exhausted','Extremely tired','Holdan toygan; charchagan','After the marathon, she was completely exhausted.','ɪɡˈzɔːstɪd','B1','f3',3),
  w('Expectation','A strong belief that something will happen','Kutish; umid; taxmin','The film didn\'t live up to my expectations.','ˌekspekˈteɪʃən','B1','f3',3),
  w('Expense','The cost required for something','Xarajat; chiqim; sarf','Daily living expenses have increased.','ɪkˈspens','B1','f3',3),
  w('Familiar','Well known from long association','Tanish; ko\'nikma; yaqin','The voice sounded familiar to me.','fəˈmɪliə','A2','f3',4),
  w('Favour','A kind act done for another','Yaxshilik; iltimos; marhamat','Could you do me a favour?','ˈfeɪvə','A2','f3',4),
  w('Flexible','Able to bend easily; adaptable','Moslashuvchan; egiluvchan; o\'zgaruvchan','The new job offers flexible working hours.','ˈfleksɪbl','B1','f3',3),
  w('Forgive','Stop feeling angry towards someone','Kechirmoq; avf etmoq','It is important to forgive and move on.','fəˈɡɪv','B1','f3',3),
  w('Frustrate','Make someone feel upset or annoyed','Hafsalasini pir qilmoq; bezovtalamoq','The slow internet frustrated him greatly.','frʌˈstreɪt','B1','f3',3),
  w('Gather','Come together; collect','Yig\'moq; to\'plamoq; jam bo\'lmoq','The family gathered for the holidays.','ˈɡæðə','A2','f3',4),
  w('Gossip','Casual conversation about others','G\'iybat; mish-mish; suhbat','She loves gossiping with her neighbours.','ˈɡɒsɪp','B1','f3',3),
  w('Grateful','Feeling or showing thanks','Minnatdor; shukrona; qadrdon','I am very grateful for your help.','ˈɡreɪtfʊl','A2','f3',4),
  w('Greet','Say hello to someone','Salomlashmoq; kutib olmoq','He greeted his guests at the door.','ɡriːt','A1','f3',5),
  w('Grocery','Items such as food and household supplies','Oziq-ovqat mahsulotlari; do\'kon','I need to go grocery shopping today.','ˈɡrəʊsəri','A2','f3',4),
  w('Habit','A thing regularly done','Odat; ko\'nikma; rasm','Drinking water is a healthy habit.','ˈhæbɪt','A2','f3',5),
  w('Hesitate','Pause before doing something','Ikkilanmoq; to\'xtab qolmoq','Don\'t hesitate to ask for help.','ˈhezɪteɪt','B1','f3',3),
  w('Honest','Free of deceit; truthful','Halol; samimiy; to\'g\'ri so\'z','He is an honest and trustworthy person.','ˈɒnɪst','A2','f3',4),
  w('Household','A house and its occupants','Uy xo\'jaligi; oila; xonadon','Household chores take a lot of time.','ˈhaʊshəʊld','A2','f3',4),
  w('Humour','The quality of being amusing','Hazil; kulgu; hazilchilik','He has a great sense of humour.','ˈhjuːmə','B1','f3',3),
  w('Impatient','Annoyed by waiting or delay','Sabrsiz; chidamsiz; taqatsiz','She gets impatient when people are late.','ɪmˈpeɪʃənt','B1','f3',3),
  w('Ingredient','A component in a mixture or recipe','Ingredient; tarkib; qo\'shilgan narsa','What are the main ingredients in this dish?','ɪnˈɡriːdiənt','A2','f3',4),
  w('Interrupt','Break the continuity of','To\'xtatmoq; so\'zini bo\'lmoq; xalaqit bermoq','Don\'t interrupt while someone is speaking.','ˌɪntəˈrʌpt','B1','f3',3),
  w('Invitation','A written or spoken request for presence','Taklif; chaqiruv; da\'vat','She received a wedding invitation.','ˌɪnvɪˈteɪʃən','A2','f3',4),
  w('Journey','Travel from one place to another','Sayohat; safar; yo\'l','The journey from Tashkent to London is long.','ˈdʒɜːni','A2','f3',4),
  w('Laughter','The action or sound of laughing','Kulgi; qah-qah; xushchaqchaqlik','Laughter is the best medicine.','ˈlɑːftə','A2','f3',4),
  w('Leisure','Free time when one is not working','Bo\'sh vaqt; dam olish; hordiq','What do you do in your leisure time?','ˈleʒə','B1','f3',3),
  w('Lend','Grant temporary use of something','Qarz bermoq; bermoq; topshirmoq','Can you lend me some money?','lend','A1','f3',5),
  w('Lifestyle','The way a person lives','Hayot tarzi; turmush tарзи','A healthy lifestyle includes regular exercise.','ˈlaɪfstaɪl','A2','f3',4),
  w('Lonely','Sad because without friends','Yolg\'iz; tanhasiz; mahzun','She felt lonely in the big city.','ˈləʊnli','A2','f3',4),
  w('Manage','Be in charge of; cope','Boshqarmoq; eplamoq; uddalash','How do you manage your time so well?','ˈmænɪdʒ','A2','f3',4),
  w('Mature','Fully developed; wise','Yetuk; ulg\'aygan; pishgan','She is very mature for her age.','məˈtʃʊə','B1','f3',3),
  w('Memorable','Worth remembering','Yodda qolarli; esda qoladigan','The holiday was truly memorable.','ˈmemərəbl','B1','f3',3),
  w('Mention','Refer to briefly','Tilga olmoq; eslatmoq; aytib o\'tmoq','He mentioned the meeting in passing.','ˈmenʃən','A2','f3',4),
  w('Mood','A temporary state of mind or feeling','Kayfiyat; ruhiyat; holat','She\'s in a really good mood today.','muːd','A2','f3',4),
  w('Neighbour','A person living next door','Qo\'shni; yaqin atrofdagi','We have kind and helpful neighbours.','ˈneɪbə','A1','f3',5),
  w('Occasion','A particular event or time','Munosabat; hodisa; vaqt','On special occasions, we have dinner out.','əˈkeɪʒən','A2','f3',4),
  w('Ordinary','Normal; not unusual','Oddiy; kundalik; odatiy','It was just an ordinary Tuesday morning.','ˈɔːdɪnəri','A2','f3',4),
  w('Overcome','Deal successfully with a problem','Yengmoq; o\'tib ketmoq; bartaraf etmoq','She overcame her fear of public speaking.','ˌəʊvəˈkʌm','B1','f3',3),
  w('Patience','The ability to wait calmly','Sabr; chidamlilik; toqat','Patience is a virtue.','ˈpeɪʃəns','A2','f3',4),
  w('Personality','The qualities that form a person\'s character','Shaxsiyat; xarakter; tabiat','She has a very outgoing personality.','ˌpɜːsəˈnælɪti','B1','f3',3),
  w('Polite','Having good manners and being respectful','Odobli; muloyim; nazokat bilan','Always be polite to others.','pəˈlaɪt','A1','f3',5),
  w('Postpone','Arrange for something to take place later','Kechiktirmoq; keyinga qoldirmoq','We had to postpone the meeting.','pəˈspəʊn','B1','f3',3),
  w('Priority','The most important thing to deal with','Ustuvorlik; muhimlik; birinchi o\'rin','Family is my highest priority.','praɪˈɒrɪti','B1','f3',3),
  w('Purchase','Buy something','Xarid qilmoq; sotib olmoq','I purchased a new laptop yesterday.','ˈpɜːtʃɪs','A2','f3',4),
  w('Recall','Remember clearly','Eslamoq; xotirasiga keltirmoq','I can\'t recall his name right now.','rɪˈkɔːl','B1','f3',3),
  w('Recommend','Put forward as worthy of attention','Tavsiya qilmoq; maslahat bermoq','I recommend reading this book.','ˌrekəˈmend','A2','f3',4),
  w('Refuse','Indicate unwillingness to do something','Rad etmoq; inkor qilmoq; rozi bo\'lmaslik','He refused to eat vegetables as a child.','rɪˈfjuːz','A2','f3',4),
  w('Relationship','The way in which people are connected','Munosabat; aloqa; o\'zaro bog\'liqlik','She has a good relationship with her boss.','rɪˈleɪʃənʃɪp','A2','f3',4),
  w('Relax','Rest or take a break from stress','Dam olmoq; hordiq chiqarmoq','I love to relax with a good book.','rɪˈlæks','A1','f3',5),
  w('Respect','Admire someone for their qualities','Hurmat; ehtirom; qadrlamoq','I have great respect for my teachers.','rɪˈspekt','A2','f3',4),
  w('Routine','A regular sequence of activities','Kun tartibi; odatiy ish; rejim','Morning exercise is part of my routine.','ruːˈtiːn','A2','f3',4),
  w('Satisfy','Meet the expectations of','Qanoatlantirmoq; ehtiyojni qondirmoq','The meal satisfied everyone at the table.','ˈsætɪsfaɪ','B1','f3',3),
  w('Schedule','A plan of things to do and times to do them','Jadval; reja; tartiб','What\'s on your schedule today?','ˈʃedjuːl','A2','f3',4),
  w('Shortage','A situation where something is not enough','Tanqislik; yetishmaslik; kamchilik','There is a shortage of clean water in the region.','ˈʃɔːtɪdʒ','B1','f3',3),
  w('Tidy','Keep things neat and in order','Tartibli; ozoda; yig\'ishtirmoq','Please tidy your room before dinner.','ˈtaɪdi','A1','f3',5),
  w('Tradition','A long-established custom or belief','An\'ana; odat; urf','It is a tradition to give gifts at Navro\'z.','trəˈdɪʃən','A2','f3',4),
  w('Urgent','Requiring immediate action','Shoshilinch; tezkor; muhim','I have an urgent message for you.','ˈɜːdʒənt','B1','f3',3),
  w('Volunteer','Freely offer to do something','Ixtiyoriy; ko\'ngilli; o\'z ixtiyori','She volunteers at the local hospital.','ˌvɒlənˈtɪə','B1','f3',3),
  w('Waste','Use carelessly; material not wanted','Isrof qilmoq; axlat; keraksiz','Don\'t waste food — some people are hungry.','weɪst','A2','f3',4),
  w('Worthwhile','Worth the time and effort spent','Foydali; qimmatli; arziydigan','Learning English is a very worthwhile investment.','ˌwɜːθˈwaɪl','B1','f3',3),
]

// ─────────────────────────────────────────────────────────────────────────────
//  💼 BUSINESS ENGLISH — 100 ta so'z (f4)
// ─────────────────────────────────────────────────────────────────────────────
const BUSINESS_WORDS = [
  w('Agenda','A list of items for a meeting','Kun tartibi; majlis rejasi','What\'s on the agenda for today\'s meeting?','əˈdʒendə','B1','f4',4),
  w('Acquire','Gain possession of something','Sotib olmoq; qo\'lga kiritmoq','The company acquired a smaller rival.','əˈkwaɪə','B2','f4',3),
  w('Allocate','Distribute resources for specific purposes','Ajratmoq; taqsimlamoq','Budget is allocated to each department.','ˈæləkeɪt','C1','f4',2),
  w('Analyse','Examine data in detail','Tahlil qilmoq; tekshirmoq','We need to analyse the quarterly sales data.','ˈænəlaɪz','B2','f4',3),
  w('Asset','A valuable item owned by a company','Aktiv; mulk; qimmatli narsa','The company\'s main asset is its brand.','ˈæset','B2','f4',2),
  w('Audit','An official inspection of accounts','Audit; tekshiruv; moliyaviy tahlil','The company undergoes an annual audit.','ˈɔːdɪt','C1','f4',2),
  w('Benchmark','A standard to measure against','Etalon; mezоn; standart','We use industry benchmarks to measure success.','ˈbentʃmɑːk','C1','f4',1),
  w('Board','The directors of a company','Kengash; direktorlar kengashi','The board approved the new strategy.','bɔːd','B2','f4',3),
  w('Brand','A type of product made by a company','Brend; tovar belgisi; nomi','Apple is one of the world\'s strongest brands.','brænd','B1','f4',4),
  w('Brainstorm','Produce ideas spontaneously in a group','Aqliy hujum; fikr to\'plash','Let\'s brainstorm ideas for the campaign.','ˈbreɪnstɔːm','B2','f4',3),
  w('Budget','A financial plan for a period','Byudjet; moliyaviy reja','The marketing budget was cut by 20%.','ˈbʌdʒɪt','B1','f4',4),
  w('Capital','Wealth in money or property','Kapital; moliyaviy vositalar','The startup needs more capital to grow.','ˈkæpɪtl','B2','f4',3),
  w('Cash flow','The total amount of money flowing in and out','Pul oqimi; daromad-xarajat','Managing cash flow is critical for small businesses.','kæʃ fləʊ','C1','f4',2),
  w('CEO','Chief Executive Officer of a company','Bosh ijrochi direktor','The CEO announced major restructuring.','ˌsiː iː ˈəʊ','B1','f4',4),
  w('Client','A person receiving professional services','Mijoz; buyurtmachi; xaridor','We must keep our clients satisfied.','ˈklaɪənt','B1','f4',4),
  w('Collaborate','Work jointly on a project','Hamkorlik qilmoq; birgalikda ishlash','The two departments collaborated on the project.','kəˈlæbəreɪt','B2','f4',3),
  w('Commission','A sum paid for services rendered','Komissiya; foiz; haq','Salespeople earn a commission on each sale.','kəˈmɪʃən','B2','f4',3),
  w('Compete','Strive to gain advantage over others','Raqobatlashmoq; kurashmoq','We compete with several international firms.','kəmˈpiːt','B1','f4',4),
  w('Compliance','Acting in accordance with rules','Muvofiqlik; qoidalarga rioya','All staff must ensure compliance with regulations.','kəmˈplaɪəns','C1','f4',2),
  w('Confidential','Intended to be kept secret','Maxfiy; sir; yopiq','This information is strictly confidential.','ˌkɒnfɪˈdenʃəl','B2','f4',3),
  w('Consult','Seek information or advice from','Maslahat olmoq; murojaat qilmoq','We consulted a legal expert before signing.','kənˈsʌlt','B2','f4',3),
  w('Consumer','A person who purchases goods','Iste\'molchi; xaridor; mijoz','Consumer spending drives economic growth.','kənˈsjuːmə','B1','f4',4),
  w('Contract','A legal agreement between parties','Shartnoma; kelishuv','Both parties signed the contract.','ˈkɒntrækt','B2','f4',3),
  w('Corporate','Relating to a large company','Korporativ; kompaniyaga oid','The corporate strategy focuses on growth.','ˈkɔːpərət','C1','f4',2),
  w('Cost-effective','Giving good value for money','Tejamkor; iqtisodiy samarali','Email marketing is very cost-effective.','kɒst ɪˈfektɪv','B2','f4',3),
  w('Credibility','The quality of being trusted','Ishonchlilik; e\'tibor; obro\'','A strong track record builds credibility.','ˌkredɪˈbɪlɪti','C1','f4',2),
  w('Customer','A person who buys goods or services','Mijoz; xaridor; buyurtmachi','Customer satisfaction is our top priority.','ˈkʌstəmə','A2','f4',5),
  w('Deadline','Time by which something must be done','Muddat; belgilangan vaqt','We must meet the project deadline.','ˈdedlaɪn','B1','f4',4),
  w('Deficit','Excess of liabilities over assets','Taqchillik; kamomad; yo\'qotish','The company is running a budget deficit.','ˈdefɪsɪt','C1','f4',1),
  w('Delegate','Entrust a task to another person','Vakolatni topshirmoq; yuklash','Good managers know how to delegate work.','ˈdelɪɡeɪt','C1','f4',2),
  w('Demand','Consumer need for a product','Talab; so\'rov; ehtiyoj','There is huge demand for electric cars.','dɪˈmɑːnd','B1','f4',4),
  w('Department','A section in an organisation','Bo\'lim; qism; departament','She works in the finance department.','dɪˈpɑːtmənt','A2','f4',5),
  w('Depreciation','Reduction in value of an asset over time','Amortizatsiya; qadrsizlanish','Computers have high depreciation rates.','dɪˌpriːʃɪˈeɪʃən','C1','f4',1),
  w('Dismiss','Discharge an employee from a job','Ishdan bo\'shatmoq; rad etmoq','He was dismissed for gross misconduct.','dɪsˈmɪs','B2','f4',2),
  w('Dividend','A sum of money paid to shareholders','Dividendlar; foyda ulushi','Investors received a large dividend.','ˈdɪvɪdend','C1','f4',1),
  w('Economy','The financial system of a country','Iqtisodiyot; tejamkorlik','The economy grew by 3% last year.','ɪˈkɒnəmi','B1','f4',4),
  w('Efficient','Achieving maximum productivity with minimum waste','Samarali; tejamkor; unumli','A good manager must be highly efficient.','ɪˈfɪʃənt','B2','f4',3),
  w('Employee','A person employed by an organisation','Xodim; ishchi; hodim','The company has over 5,000 employees.','ɪmˈplɔɪiː','A2','f4',5),
  w('Entrepreneur','A person who sets up a business','Tadbirkor; biznesmen','She is a successful young entrepreneur.','ˌɒntrəprəˈnɜː','C1','f4',2),
  w('Equity','The value of shares in a company','Aktsiyalar qiymati; adolatlilik','He owns 30% equity in the startup.','ˈekwɪti','C1','f4',1),
  w('Expenditure','The amount of money spent','Xarajatlar; sarf-xarajat','Government expenditure on health is rising.','ɪkˈspendɪtʃə','C1','f4',1),
  w('Export','Send goods to another country','Eksport qilmoq; sotib chiqarmoq','Uzbekistan exports cotton and gas.','ˈekspɔːt','B1','f4',4),
  w('Feasible','Possible to do easily or conveniently','Amalga oshirish mumkin; realistik','Is the project financially feasible?','ˈfiːzɪbl','C1','f4',1),
  w('Forecast','Predict future events or figures','Prognoz; bashorat; taxmin','Sales forecasts predict 20% growth.','ˈfɔːkɑːst','B2','f4',2),
  w('Franchise','A licence to run a business model','Franchayzing; savdo litsenziyasi','She opened a franchise of a fast food chain.','ˈfræntʃaɪz','C1','f4',1),
  w('Freelance','Working independently for various clients','Frilanser; erkin ijodkor','She works as a freelance graphic designer.','ˈfriːlɑːns','B1','f4',4),
  w('Gross','Total before deductions','Yalpi; umumiy; brutto','Gross profit is revenue minus cost of goods.','ɡrəʊs','C1','f4',2),
  w('HR','Human Resources — managing people at work','Inson resurslari bo\'limi','Contact HR about your contract.','eɪtʃ ɑː','B1','f4',4),
  w('Import','Bring goods from abroad','Import qilmoq; olib kirmoq','The company imports raw materials from China.','ˈɪmpɔːt','B1','f4',4),
  w('Income','Money received for work or investment','Daromad; tushum; maosh','His monthly income is quite high.','ˈɪŋkʌm','A2','f4',5),
  w('Incentive','A thing that motivates action','Rag\'bat; imtiyoz; undov','Bonuses are a great incentive for staff.','ɪnˈsentɪv','B2','f4',3),
  w('Initiative','The ability to decide what to do independently','Tashabbus; initsiatva; iroda','She showed great initiative at work.','ɪˈnɪʃətɪv','B2','f4',3),
  w('Innovation','A new method or product','Innovatsiya; yangilik; ixtiro','Innovation is the key to competitive advantage.','ˌɪnəˈveɪʃən','C1','f4',2),
  w('Interest','Money charged for borrowing','Foiz; qiziqish; manfaat','The interest rate on the loan is 5%.','ˈɪntrəst','B1','f4',4),
  w('Invest','Put money into something for profit','Investitsiya qilmoq; sarmoya kiritmoq','She invested her savings in stocks.','ɪnˈvest','B1','f4',4),
  w('Invoice','A bill for goods or services','Hisob-faktura; to\'lov talabi','Please send me the invoice by email.','ˈɪnvɔɪs','B2','f4',3),
  w('KPI','Key Performance Indicator','Asosiy samaradorlik ko\'rsatkichi','We track several KPIs to measure success.','keɪ piː ˈaɪ','C1','f4',2),
  w('Launch','Introduce a new product to market','Ishga tushirmoq; taqdim etmoq','They plan to launch the product in April.','lɔːntʃ','B1','f4',4),
  w('Liability','A legal or financial obligation','Majburiyat; burch; javobgarlik','The company has significant liabilities.','ˌlaɪəˈbɪlɪti','C1','f4',1),
  w('Logistics','The detailed management of operations','Logistika; ta\'minot tizimi','Efficient logistics cut delivery times.','ləˈdʒɪstɪks','C1','f4',2),
  w('Management','The process of dealing with people','Menejment; boshqaruv','Strong management is key to success.','ˈmænɪdʒmənt','B1','f4',4),
  w('Market','A place where trade is conducted','Bozor; sotuv maydoni','The company entered the European market.','ˈmɑːkɪt','A2','f4',5),
  w('Merge','Combine into a single entity','Qo\'shilmoq; birlashmoq; birlashtirmoq','The two banks merged last year.','mɜːdʒ','C1','f4',2),
  w('Milestone','A significant stage in development','Muhim bosqich; yirik qadam','Reaching 1 million users was a milestone.','ˈmaɪlstəʊn','B2','f4',3),
  w('Negotiate','Try to reach an agreement by discussion','Muzokaralar olib bormoq','We negotiated a better deal with suppliers.','nɪˈɡəʊʃieɪt','B2','f4',3),
  w('Networking','Interacting for professional benefits','Tarmoq qurish; professional aloqalar','Networking is essential in business.','ˈnetwɜːkɪŋ','B2','f4',3),
  w('Objective','A goal intended to be achieved','Maqsad; vazifa; niyat','Our main objective is to increase profit.','əbˈdʒektɪv','B2','f4',3),
  w('Outsource','Obtain services from an outside firm','Autsorging qilmoq; tashqariga bermoq','We outsource our IT support to a vendor.','ˌaʊtˈsɔːs','C1','f4',2),
  w('Overhead','Business costs not related to production','Qo\'shimcha xarajatlar; umumiy xarajat','We need to reduce our overhead costs.','ˈəʊvəhed','C1','f4',1),
  w('Pitch','A presentation to persuade someone','Taqdimot; taklif; prezentatsiya','He gave a great sales pitch to the investors.','pɪtʃ','B2','f4',3),
  w('Portfolio','A range of investments or work samples','Portfolio; loyihalar to\'plami','She has an impressive professional portfolio.','pɔːtˈfəʊliəʊ','B2','f4',3),
  w('Profit','Financial gain from a business activity','Foyda; daromad; yutug\'','The company made a record profit last year.','ˈprɒfɪt','A2','f4',5),
  w('Proposal','A plan or suggestion put forward','Taklif; reja; loyiha','He submitted a detailed business proposal.','prəˈpəʊzəl','B2','f4',3),
  w('Quota','A fixed share of something available','Kvota; belgilangan ulush; me\'yor','Sales teams must meet monthly quotas.','ˈkwəʊtə','C1','f4',2),
  w('Recession','A period of economic decline','Retsessiya; iqtisodiy pasayish','Many jobs were lost during the recession.','rɪˈseʃən','C1','f4',2),
  w('Revenue','Income generated by a business','Daromad; tushum; aylanma','Company revenue grew by 15% this year.','ˈrevənjuː','B2','f4',3),
  w('Risk','The possibility of loss or harm','Xavf; xatar; tavakkal','Every investment carries some risk.','rɪsk','A2','f4',4),
  w('ROI','Return On Investment','Investitsiya daromadliligi','The ROI on this campaign was excellent.','ɑːr əʊ ˈaɪ','C1','f4',2),
  w('Salary','A fixed regular payment for work','Maosh; ish haqi; oylik','She negotiated a higher starting salary.','ˈsæləri','A2','f4',5),
  w('Scale','Increase in size proportionally','Kengaytirmoq; o\'lcham; miqyos','We plan to scale the business globally.','skeɪl','B2','f4',3),
  w('Stakeholder','A person with interest in a company','Manfaatdor tomon; aksiyador','Stakeholders must approve major decisions.','ˈsteɪkhəʊldə','C1','f4',2),
  w('Strategy','A plan of action for a goal','Strategiya; reja; taktika','The new marketing strategy boosted sales.','ˈstræɪdʒi','B2','f4',3),
  w('Supply chain','The network of suppliers and manufacturers','Ta\'minot zanjiri','Covid disrupted global supply chains.','səˈplaɪ tʃeɪn','C1','f4',2),
  w('Sustainable','Able to continue without depleting resources','Barqaror; davomli; uzoq muddatli','Our goal is sustainable business growth.','səˈsteɪnəbl','B2','f4',3),
  w('Target','An objective to be achieved','Maqsad; nishon; belgilangan ko\'rsatkich','Sales targets for Q3 have been exceeded.','ˈtɑːɡɪt','B1','f4',4),
  w('Transaction','An instance of buying or selling','Tranzaksiya; bitim; operatsiya','Every transaction is recorded digitally.','trænˈzækʃən','C1','f4',2),
  w('Transparency','Operating in such a way that it is easy to see','Shaffoflik; ochiqlik; aniqlik','Financial transparency builds trust.','trænsˈpærənsi','C1','f4',2),
  w('Turnover','The amount of money taken by a business','Aylanma; kadrlar almashinuvi','Annual turnover reached $10 million.','ˈtɜːnəʊvə','C1','f4',2),
  w('Venture','A risky business undertaking','Tashabbus; sarmoya; tavakkal','He started a new tech venture.','ˈventʃə','B2','f4',3),
  w('Viability','The ability to work successfully','Hayotiylik; amalga oshirilish imkoni','We need to assess the project\'s viability.','vaɪəˈbɪlɪti','C1','f4',1),
  w('Workforce','The people available for employment','Mehnat resurslari; ishchi kuchi','Companies must train their workforce.','ˈwɜːkfɔːs','B2','f4',3),
  w('Write-off','Something acknowledged as a loss','Ko\'chirma; zarar; o\'chirish','The bad debt was treated as a write-off.','ˈraɪtɒf','C1','f4',1),
]

// ─────────────────────────────────────────────────────────────────────────────
//  🎓 SAT SO'ZLARI — 100 ta so'z (f5)
// ─────────────────────────────────────────────────────────────────────────────
const SAT_WORDS = [
  w('Abjure','Formally reject or renounce','Rad etmoq; voz kechmoq; tark etmoq','He abjured his former beliefs.','æbˈdʒʊə','C1','f5',0),
  w('Abscond','Leave hurriedly to avoid consequences','Yashirinib qochmoq; qochib ketmoq','The thief absconded with the money.','əbˈskɒnd','C1','f5',0),
  w('Acrimony','Bitterness or ill feeling','Achchiqlik; g\'azab; nafrat','The divorce was full of acrimony.','ˈækrɪməni','C1','f5',0),
  w('Adulation','Excessive admiration or flattery','Maqtov; xushomad; oshirib maqtash','The singer received adulation from fans.','ˌædjʊˈleɪʃən','C1','f5',0),
  w('Aesthetic','Concerned with beauty and art','Estetik; go\'zallik hissiyoti','The architect had a refined aesthetic sensibility.','iːsˈθetɪk','C1','f5',1),
  w('Affable','Friendly and easy to talk to','Xushmuomala; iliqso\'z; muloyim','The professor was affable and approachable.','ˈæfəbl','C1','f5',0),
  w('Alacrity','Brisk and cheerful readiness','Shaylik; zo\'r berib tayyor bo\'lish','She accepted the challenge with alacrity.','əˈlækrɪti','C1','f5',0),
  w('Alleviate','Make suffering less severe','Yengillashtirmoq; ozaytirmoq','Rest can help alleviate fatigue.','əˈliːvieɪt','C1','f5',1),
  w('Altruism','Selfless concern for others','Altruizm; boshqalar uchun qayg\'urish','Her altruism inspired the whole community.','ˈæltruɪzəm','C1','f5',0),
  w('Ambivalent','Having mixed feelings about something','Ikkilanuvchi; qarama-qarshi his','He felt ambivalent about moving abroad.','æmˈbɪvələnt','C1','f5',1),
  w('Anachronism','Something belonging to a past era','Eskirgan narsa; zamondan orqada qolish','A typewriter today feels like an anachronism.','əˈnækrənɪzəm','C1','f5',0),
  w('Antagonise','Cause to become hostile','Dushmanlashtirmoq; qarama-qarshi qo\'ymoq','His comments antagonised many listeners.','ænˈtæɡənaɪz','C1','f5',0),
  w('Apathy','Lack of interest or enthusiasm','Befarqlik; loqaydlik; g\'amxo\'rlik yo\'qligi','Voter apathy is a growing concern.','ˈæpəθi','C1','f5',1),
  w('Appease','Pacify or placate by meeting demands','Tinchlantirmoq; qondirmoq; yumshatmoq','She tried to appease the angry crowd.','əˈpiːz','C1','f5',0),
  w('Archaic','Very old-fashioned or primitive','Eskirgan; qadimgi; arxaik','The archaic laws need to be updated.','ɑːˈkeɪɪk','C1','f5',1),
  w('Arduous','Involving great effort; difficult','Og\'ir; mashaqqatli; qiyin','The mountain climb was arduous.','ˈɑːdjuəs','C1','f5',0),
  w('Articulate','Having or showing the ability to speak clearly','Aniq gapiradigan; so\'zamol; ravshan','She is an articulate and persuasive speaker.','ɑːˈtɪkjʊlɪt','C1','f5',1),
  w('Ascertain','Find out for certain','Aniqlamoq; bilib olmoq; tekshirmoq','We need to ascertain the facts first.','ˌæsəˈteɪn','C1','f5',0),
  w('Austere','Severe or strict in manner; without luxury','Qat\'iy; oddiy; hashamatdan xoli','The monk led an austere life.','ɒˈstɪə','C1','f5',0),
  w('Banal','Too ordinary and lacking originality','Oddiy; zerikarli; hayajonsiz','The film had a banal and predictable plot.','bəˈnɑːl','C1','f5',0),
  w('Belligerent','Hostile and aggressive','Tajovuzkor; urushqoq; dushmanlik bilan','He became belligerent after the argument.','bəˈlɪdʒərənt','C1','f5',0),
  w('Benevolent','Well-meaning; kind and generous','Mehribon; saxiy; yaxshi niyatli','A benevolent ruler cares for his people.','bɪˈnevələnt','C1','f5',1),
  w('Bewildered','Perplexed and confused','Hayron; dovdirab qolgan; gangigan','She was bewildered by the complex instructions.','bɪˈwɪldəd','C1','f5',1),
  w('Candid','Truthful and straightforward','Ochiq so\'z; rostgo\'y; samimiy','He gave a candid account of what happened.','ˈkændɪd','C1','f5',1),
  w('Capricious','Changing mood unpredictably','Kayfiyati o\'zgaruvchan; o\'ynoqi','The capricious weather ruined our plans.','kəˈprɪʃəs','C1','f5',0),
  w('Censure','Express severe disapproval','Tanqid; qoralash; koyish','The senator was censured for misconduct.','ˈsenʃə','C1','f5',0),
  w('Charlatan','A person falsely claiming expertise','Sharlatan; aldamchi; yolg\'onchi mutaxassis','The so-called healer was exposed as a charlatan.','ˈʃɑːlətən','C1','f5',0),
  w('Circumspect','Wary and unwilling to take risks','Ehtiyotkor; ogohlik bilan; o\'ylab-netib','She was circumspect in her response.','ˈsɜːkəmspekt','C1','f5',0),
  w('Coerce','Persuade by using force or threats','Majbur qilmoq; zo\'rlab ko\'ndirmoq','He was coerced into signing the document.','kəʊˈɜːs','C1','f5',0),
  w('Condescending','Showing a sense of superiority','Manmanlik bilan muomala qilish; takabburlik','Her condescending tone offended everyone.','ˌkɒndɪˈsendɪŋ','C1','f5',0),
  w('Contrite','Feeling very sorry about something','Pushaymon; penitent; tavbakor','He was truly contrite about his actions.','kənˈtraɪt','C1','f5',0),
  w('Copious','Abundant in supply; plentiful','Ko\'p; mo\'l-ko\'l; serob','She took copious notes during the lecture.','ˈkəʊpiəs','C1','f5',1),
  w('Credulous','Too willing to believe things','Sodda; ishonuvchan; esapo\'sh','The credulous audience believed the trick.','ˈkredjʊləs','C1','f5',0),
  w('Cursory','Hasty and done without care','Shoshilinch; yuzaki; diqqat bilan emas','He gave the report only a cursory glance.','ˈkɜːsəri','C1','f5',0),
  w('Cynical','Believing people are motivated by self-interest','Siniq; niyatga ishonmaydigan; pessimist','He was cynical about politicians\' promises.','ˈsɪnɪkəl','C1','f5',1),
  w('Daunt','Make someone feel intimidated','Qo\'rqitmoq; hayiqtirmoq; turmоq','She was not daunted by the difficulty.','dɔːnt','C1','f5',0),
  w('Deferential','Showing respect or submission','Hurmatkora; bo\'ysunuvchan; ta\'zimli','He was deferential to his superiors.','ˌdefəˈrenʃəl','C1','f5',0),
  w('Delineate','Describe or portray precisely','Aniq tasvirlamoq; belgilamoq','She delineated the plan in great detail.','dɪˈlɪnɪeɪt','C1','f5',0),
  w('Denounce','Publicly declare wrong or evil','Qoralamoq; fosh etmoq; ayblamoq','He denounced the corruption publicly.','dɪˈnaʊns','C1','f5',0),
  w('Deplete','Use up resources fully','Tugатmoq; sarflash; kamaytirmoq','We must not deplete our natural resources.','dɪˈpliːt','C1','f5',1),
  w('Derisive','Contemptuous or mocking','Masxaraboz; kulgi uchun; istehzoli','His derisive laughter upset the speaker.','dɪˈraɪsɪv','C1','f5',0),
  w('Discern','Distinguish with difficulty','Ajratmoq; anglash; payqamoq','She could discern the truth from the lies.','dɪˈsɜːn','C1','f5',1),
  w('Disdain','The feeling of not deserving respect','Nafrat; mensimaslik; hurmatsizlik','He viewed the work with obvious disdain.','dɪsˈdeɪn','C1','f5',0),
  w('Disparate','Essentially different; not comparable','Har xil; farqli; turlicha','The two studies reached disparate conclusions.','ˈdɪspərɪt','C1','f5',0),
  w('Dogmatic','Inclined to lay down principles as undeniable','Dogmatik; qat\'iy; o\'z fikrida qolib ketuvchi','He was dogmatic in his religious views.','dɒɡˈmætɪk','C1','f5',0),
  w('Duplicitous','Deceitful and two-faced','Ikki yuzli; aldamchi; munofiq','The duplicitous politician was exposed.','djuːˈplɪsɪtəs','C1','f5',0),
  w('Ebullient','Cheerful and full of energy','Hayajonli; quvnoq; jo\'shqin','She gave an ebullient performance.','ɪˈbʊliənt','C1','f5',0),
  w('Egregious','Outstandingly bad or shocking','Dahshatli; o\'ta noto\'g\'ri; yomon','This is an egregious violation of rights.','ɪˈɡriːdʒəs','C1','f5',0),
  w('Elusive','Difficult to find or achieve','Qo\'lga kiritish qiyin; topishning iloji yo\'q','Success can be elusive for many.','ɪˈluːsɪv','C1','f5',1),
  w('Emulate','Match or surpass through imitation','Taqlid qilmoq; tenglashtirmoq; raqobatlashmoq','He tried to emulate his idol\'s success.','ˈemjʊleɪt','C1','f5',0),
  w('Enigmatic','Mysterious and difficult to understand','Sirli; jumboqli; tushunilishi qiyin','The Mona Lisa\'s smile is enigmatic.','ˌenɪɡˈmætɪk','C1','f5',1),
  w('Ephemeral','Lasting for only a short time','Vaqtinchalik; o\'tkinchi; qisqa muddatli','Fame can be ephemeral.','ɪˈfemərəl','C1','f5',0),
  w('Equivocate','Use unclear language to avoid commitment','Noaniq gapirmoq; ikkilanmoq','Stop equivocating and give a direct answer.','ɪˈkwɪvəkeɪt','C1','f5',0),
  w('Erudite','Having great academic knowledge','Olim; bilimdon; ko\'p o\'qigan','She is an erudite professor of history.','ˈeruːdaɪt','C1','f5',1),
  w('Esoteric','Intended for a small specialist audience','Tor doiradagi; maxsus bilim talab qiluvchi','The lecture was too esoteric for beginners.','ˌesəˈterɪk','C1','f5',0),
  w('Euphemism','A mild expression used instead of harsh one','Evfemizm; yumshoq ifoda','Passed away is a euphemism for died.','ˈjuːfɪmɪzəm','C1','f5',1),
  w('Exonerate','Officially absolve from blame','Oqlamoq; aybsiz deb topmoq','New evidence exonerated the accused.','ɪɡˈzɒnəreɪt','C1','f5',0),
  w('Expedient','Convenient but possibly not moral','Qulay; foydali; amaldagi','The decision was politically expedient.','ɪkˈspiːdiənt','C1','f5',0),
  w('Explicit','Stated clearly and in detail','Aniq; ochiq; ravshan','The instructions were explicit and clear.','ɪkˈsplɪsɪt','C1','f5',1),
  w('Extraneous','Irrelevant to what is being considered','Keraksiz; begona; aloqasiz','Remove extraneous details from your essay.','ɪkˈstreɪniəs','C1','f5',0),
  w('Fallacious','Based on a mistaken belief','Noto\'g\'ri; yolg\'on; xato','The argument was fallacious and misleading.','fəˈleɪʃəs','C1','f5',0),
  w('Fatuous','Silly; pointless','Ahmoqona; befoyda; ma\'nosiz','His fatuous comments annoyed everyone.','ˈfætʃuəs','C1','f5',0),
  w('Fervid','Intensely enthusiastic','Ishtiyoqli; g\'ayratli; shodon','A fervid supporter of human rights.','ˈfɜːvɪd','C1','f5',0),
  w('Frugal','Sparing with money; economical','Tejamkor; iqtisodiy; ozoz harjlovchi','She was frugal with her pocket money.','ˈfruːɡəl','C1','f5',1),
  w('Garrulous','Excessively talkative','Peshqadam; ko\'p gaplashuvchi; qo\'yboshar','The garrulous professor never stopped talking.','ˈɡærʊləs','C1','f5',0),
  w('Gregarious','Fond of company; sociable','Jamoatchilik bilan bo\'lishni yaxshi ko\'ruvchi','She is a gregarious and friendly person.','ɡrɪˈɡeəriəs','C1','f5',0),
  w('Hackneyed','Overused so as to have lost its freshness','Iste\'molga tushgan; eskirgan; asl ma\'nosini yo\'qotgan','The speech was full of hackneyed phrases.','ˈhæknid','C1','f5',0),
  w('Hubris','Excessive pride or self-confidence','Kibrlilik; takabburlik; manmanlik','His hubris led to his downfall.','ˈhjuːbrɪs','C1','f5',1),
  w('Hyperbole','Exaggerated statements not meant literally','Mubolag\'a; oshirib ko\'rsatish; bo\'rttirma','Saying "I\'ve told you a million times" is hyperbole.','haɪˈpɜːbəli','C1','f5',1),
  w('Impetuous','Acting without thought; rash','Shoshqaloq; tez qaror qiluvchi; o\'ylamasdan','He made an impetuous decision.','ɪmˈpetʃuəs','C1','f5',0),
  w('Implicit','Suggested but not directly expressed','Yashirin; bildiruvchi; bilvosita','There was implicit criticism in her words.','ɪmˈplɪsɪt','C1','f5',1),
  w('Incisive','Intelligently analytical; sharp','O\'tkir; aniq; keskin fikrli','The journalist asked incisive questions.','ɪnˈsaɪsɪv','C1','f5',0),
  w('Ineffable','Too great to be expressed in words','So\'z bilan ifodalab bo\'lmaydigan','The sunset filled him with ineffable joy.','ɪnˈefəbl','C1','f5',0),
  w('Ingenuous','Innocent and unsuspecting','Sodda; samimiy; soddalik bilan','She asked an ingenuous but clever question.','ɪnˈdʒenjuəs','C1','f5',0),
  w('Inimical','Tending to obstruct or harm','Dushmanona; zararli; qarshilik ko\'rsatuvchi','The conditions were inimical to growth.','ɪˈnɪmɪkəl','C1','f5',0),
  w('Insidious','Proceeding gradually and harmfully','Yashirin xavf; sekin-asta zarar beruvchi','Social media has an insidious effect.','ɪnˈsɪdiəs','C1','f5',0),
  w('Intransigent','Refusing to change one\'s position','Qaysarona; o\'z fikridan qaytmaydigan','The parties remained intransigent in negotiations.','ɪnˈtrænsɪdʒənt','C1','f5',0),
  w('Inveterate','Having a habit or interest for a long time','Eski odat bilan; ko\'nikgan; surunkali','He is an inveterate traveller.','ɪnˈvetərɪt','C1','f5',0),
  w('Laconic','Expressing much in few words','Ixcham; qisqa va mazali; lo\'nda','He gave a laconic reply: "No."','ləˈkɒnɪk','C1','f5',1),
  w('Loquacious','Tending to talk a great deal','Ko\'p gaplashadigan; so\'zamol','My loquacious neighbour never stops talking.','ləˈkweɪʃəs','C1','f5',0),
  w('Magnanimous','Very generous or forgiving','Saxiy; keng ko\'ngilli; marhamatli','A magnanimous winner congratulated the loser.','mæɡˈnænɪməs','C1','f5',0),
  w('Malleable','Easily shaped; easily influenced','Egiluvchan; o\'zgaruvchan; ta\'sirchan','Young minds are malleable and curious.','ˈmæliəbl','C1','f5',0),
  w('Mendacious','Not telling the truth; lying','Yolg\'onchi; aldamchi; noto\'g\'ri','The mendacious politician was exposed.','menˈdeɪʃəs','C1','f5',0),
  w('Mercurial','Subject to sudden changes of mood','Kayfiyati tez o\'zgaradigan; beqaror','His mercurial temperament made him unpredictable.','mɜːˈkjʊəriəl','C1','f5',0),
  w('Meticulous','Showing great attention to detail','Puxta; aniq; e\'tiborli','He was meticulous in every detail.','mɪˈtɪkjʊləs','C1','f5',1),
  w('Mitigate','Make less severe or serious','Yumshatmoq; kamaytirmoq','Technology can help mitigate climate change.','ˈmɪtɪɡeɪt','C1','f5',1),
  w('Mundane','Lacking interest; ordinary','Oddiy; zerikarli; hayajonsiz','She found the job mundane and repetitive.','mʌnˈdeɪn','C1','f5',1),
  w('Nefarious','Wicked or criminal','Yovuz; jinoyatchilik; nopok','The nefarious plot was uncovered by police.','nɪˈfeəriəs','C1','f5',0),
  w('Obstinate','Stubbornly refusing to change','Qaysarona; o\'jar; stubborn','He was obstinate and refused to listen.','ˈɒbstɪnɪt','C1','f5',0),
  w('Opaque','Not able to be seen through; unclear','Tiniq emas; tushunilishi qiyin; noaniq','The explanation was unnecessarily opaque.','əʊˈpeɪk','C1','f5',0),
  w('Ostentatious','Designed to impress; showy','Ko\'z-ko\'z qiluvchi; maqtanchoq; ко\'rgazmali','His ostentatious lifestyle drew criticism.','ˌɒstenˈteɪʃəs','C1','f5',0),
  w('Paradox','A seemingly self-contradictory statement','Paradoks; qarama-qarshilik; ziddiyat','It\'s a paradox that technology isolates us.','ˈpærədɒks','C1','f5',1),
  w('Pedantic','Excessively concerned with rules','Mayda-chuyda narsalarga juda e\'tibor beruvchi','His pedantic corrections annoyed everyone.','pɪˈdæntɪk','C1','f5',0),
  w('Perfidious','Deceitful and untrustworthy','Ishonchsiz; sotqin; xoin','The perfidious ally betrayed the alliance.','pɜːˈfɪdiəs','C1','f5',0),
  w('Placate','Make someone less angry','Tinchlantirmoq; yumshatmoq; qondirmoq','She tried to placate the upset customer.','pləˈkeɪt','C1','f5',0),
  w('Pragmatic','Dealing sensibly with things','Amaliy; hayotiy; pragmatik','We need a pragmatic solution, not an ideal one.','præɡˈmætɪk','C1','f5',1),
  w('Prodigal','Wasteful; recklessly extravagant','Isrofgar; shoshqaloq; boyligini sarflovchi','The prodigal son spent all his inheritance.','ˈprɒdɪɡəl','C1','f5',0),
  w('Proliferate','Increase rapidly in numbers','Ko\'paymoq; jadal o\'smoq; tarqalmoq','Mobile phones have proliferated worldwide.','prəˈlɪfəreɪt','C1','f5',1),
  w('Propitious','Giving a good chance of success','Qulay; xayrli; imkoniyatli','It was a propitious moment to launch.','prəˈpɪʃəs','C1','f5',0),
  w('Pugnacious','Eager or quick to argue or fight','Urushqoq; janjalkash; tajovuzkor','He had a pugnacious personality.','pʌɡˈneɪʃəs','C1','f5',0),
  w('Rectify','Put right; correct','To\'g\'irlamoq; tuzatmoq; bartaraf etmoq','They quickly rectified the error.','ˈrektɪfaɪ','C1','f5',0),
  w('Salient','Most noticeable or important','Ajralib turuvchi; e\'tiborli; muhim','She summarised the salient points.','ˈseɪliənt','C1','f5',1),
  w('Sardonic','Grimly mocking or cynical','Kinoyali; istehzoli; achchiq kulgi bilan','He gave a sardonic smile.','sɑːˈdɒnɪk','C1','f5',0),
  w('Sycophant','A person who praises to gain advantage','Xushomadgo\'y; madihachi; yolg\'on maqtovchi','He was surrounded by sycophants.','ˈsɪkəfənt','C1','f5',0),
  w('Tenacious','Persistent; not giving up','Qat\'iyatli; tashabbus bilan; isrofgarlik','She was tenacious in pursuing her goals.','tɪˈneɪʃəs','C1','f5',1),
  w('Terse','Sparing with words; brief','Qisqa va lo\'nda; ixcham','His terse reply ended the conversation.','tɜːs','C1','f5',0),
  w('Timid','Showing a lack of courage','Uyatchan; qo\'rqoq; o\'ziga ishonchsiz','She was too timid to speak in public.','ˈtɪmɪd','B1','f5',1),
  w('Ubiquitous','Seeming to appear everywhere','Hamma joyda uchraydigan; keng tarqalgan','Smartphones have become ubiquitous.','juːˈbɪkwɪtəs','C1','f5',1),
  w('Vacuous','Having no meaning or intelligence','Ma\'nosiz; bo\'sh; kaltafahm','His vacuous remarks added nothing.','ˈvækjuəs','C1','f5',0),
  w('Verbose','Using more words than needed','Ko\'p so\'zli; keraksiz uzun','Her verbose writing style bored readers.','vɜːˈbəʊs','C1','f5',0),
  w('Vindicate','Clear of blame; justify by proof','Oqlamoq; to\'g\'riligini isbotlamoq','History vindicated his bold decision.','ˈvɪndɪkeɪt','C1','f5',0),
  w('Zealous','Having great energy for a cause','G\'ayratli; qizg\'in; ishtiyoqli','She is a zealous defender of human rights.','ˈzeləs','C1','f5',1),
]

// ─────────────────────────────────────────────────────────────────────────────
//  ALL DEFAULT WORDS
// ─────────────────────────────────────────────────────────────────────────────
const DEFAULT_WORDS = [
  ...ACADEMIC_WORDS,
  ...IELTS_WORDS,
  ...DAILY_WORDS,
  ...BUSINESS_WORDS,
  ...SAT_WORDS,
]

// ─────────────────────────────────────────────────────────────────────────────
//  SM-2 SPACED REPETITION
// ─────────────────────────────────────────────────────────────────────────────
function getNextInterval(mastery, quality) {
  if (quality === 0) return { mastery: 0, interval: 1 }
  const intervals = [1, 3, 7, 14, 30, 90]
  const nextMastery = Math.min(mastery + 1, intervals.length - 1)
  return { mastery: nextMastery, interval: intervals[nextMastery] }
}

// ─────────────────────────────────────────────────────────────────────────────
//  HOOK
// ─────────────────────────────────────────────────────────────────────────────
export function useVocabulary() {
  const [words,   setWords]   = useState(() => {
    // Seed default words if not already done
    const seeded = localStorage.getItem(SEEDED_KEY)
    if (!seeded) return load(STORAGE_KEY, DEFAULT_WORDS)
    return load(STORAGE_KEY, DEFAULT_WORDS)
  })
  const [folders, setFolders] = useState(() => load(FOLDERS_KEY, DEFAULT_FOLDERS))

  // Seed once — ensure default words exist
  useEffect(() => {
    const seeded = localStorage.getItem(SEEDED_KEY)
    if (!seeded) {
      save(STORAGE_KEY, DEFAULT_WORDS)
      save(FOLDERS_KEY, DEFAULT_FOLDERS)
      localStorage.setItem(SEEDED_KEY, '1')
      setWords(DEFAULT_WORDS)
      setFolders(DEFAULT_FOLDERS)
    }
  }, [])

  useEffect(() => { save(STORAGE_KEY, words) },   [words])
  useEffect(() => { save(FOLDERS_KEY, folders) }, [folders])

  const addWord = useCallback((wordData) => {
    const nw = {
      id: `w${Date.now()}`,
      word:         wordData.word?.trim() || '',
      definition:   wordData.definition?.trim() || '',
      example:      wordData.example?.trim() || '',
      translation:  wordData.translation?.trim() || '',
      pronunciation:wordData.pronunciation || '',
      level:        wordData.level || 'Intermediate',
      folderId:     wordData.folderId || null,
      createdAt:    Date.now(),
      mastery:      0,
      nextReview:   Date.now(),
    }
    setWords((p) => [nw, ...p])
    return nw
  }, [])

  const deleteWord = useCallback((id) => setWords((p) => p.filter((w) => w.id !== id)), [])

  const updateWord = useCallback((id, updates) =>
    setWords((p) => p.map((w) => w.id === id ? { ...w, ...updates } : w)), [])

  const reviewWord = useCallback((id, quality) =>
    setWords((p) => p.map((w) => {
      if (w.id !== id) return w
      const { mastery, interval } = getNextInterval(w.mastery, quality)
      return { ...w, mastery, nextReview: Date.now() + interval * 86400000 }
    })), [])

  const addFolder = useCallback((name, color = '#6366f1', emoji = '📁') => {
    const f = { id: `f${Date.now()}`, name, color, emoji }
    setFolders((p) => [...p, f])
    return f
  }, [])

  const deleteFolder = useCallback((id) => {
    setFolders((p) => p.filter((f) => f.id !== id))
    setWords((p) => p.map((w) => w.folderId === id ? { ...w, folderId: null } : w))
  }, [])

  const getWordsByFolder = useCallback((fid) => words.filter((w) => w.folderId === fid), [words])
  const getDueWords      = useCallback(() => words.filter((w) => w.nextReview <= Date.now()), [words])
  const speakWord        = useCallback((word) => {
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(word)
    u.lang = 'en-US'; u.rate = 0.85
    window.speechSynthesis.speak(u)
  }, [])

  return {
    words,
    folders,
    addWord, deleteWord, updateWord, reviewWord,
    addFolder, deleteFolder,
    getWordsByFolder, getDueWords, speakWord,
    totalWords:    words.length,
    masteredWords: words.filter((w) => w.mastery >= 4).length,
    dueCount:      words.filter((w) => w.nextReview <= Date.now()).length,
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  LESSON PROGRESS
// ─────────────────────────────────────────────────────────────────────────────
export function useLessonProgress() {
  const [progress, setProgress] = useState(() => load(PROGRESS_KEY, {}))
  useEffect(() => { save(PROGRESS_KEY, progress) }, [progress])

  const completeLesson = useCallback((lessonId, xp = 20) => {
    setProgress((p) => ({ ...p, [lessonId]: { completed: true, completedAt: Date.now(), xp } }))
  }, [])

  const isCompleted     = useCallback((id) => !!progress[id]?.completed, [progress])
  const getTotalXP      = useCallback(() => Object.values(progress).reduce((s, p) => s + (p.xp || 0), 0), [progress])
  const getCompletedCount = useCallback(() => Object.keys(progress).length, [progress])

  return { progress, completeLesson, isCompleted, getTotalXP, getCompletedCount }
}
