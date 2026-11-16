// Reference content the engine draws from. This is knowledge-base content, not user data:
// everything a student sees is selected and phrased from their own answers (see src/logic/engine.js).
// `[DATE]` and `[KB RANGE]` are placeholders until the public-data import is wired up.

export const AREAS = [
  { id: 'bio', label: 'Biology', hint: 'Cells, animals, the human body' },
  { id: 'art', label: 'Art and design', hint: 'Drawing, posters, making things look good' },
  { id: 'math', label: 'Math', hint: 'Algebra, statistics, timed tests' },
  { id: 'econ', label: 'Economics', hint: 'How money, prices and businesses work' },
  { id: 'code', label: 'Coding', hint: 'Writing programs, building apps or games' },
  { id: 'eng', label: 'Engineering', hint: 'Designing and building machines or structures' },
  { id: 'write', label: 'Writing', hint: 'Essays, stories, journalism' },
];

export const ANSWERS = {
  like: 'Like it',
  dislike: 'Not for me',
  not_tried: 'Haven’t tried',
  not_sure: 'Not sure',
};

export const PRIORITIES = [
  { id: 'nature', label: 'Working with animals or nature' },
  { id: 'creative', label: 'Being creative' },
  { id: 'cost', label: 'Not too expensive' },
  { id: 'people', label: 'Helping people' },
  { id: 'puzzles', label: 'Solving puzzles' },
  { id: 'pay', label: 'Earning well' },
  { id: 'outdoors', label: 'Working outdoors' },
];

export const CONFIDENCE = [
  { id: 'not', label: 'Not sure at all' },
  { id: 'kind', label: 'Kind of sure' },
  { id: 'pretty', label: 'Pretty sure' },
  { id: 'very', label: 'Very sure' },
];

// Words in free text that point at an area, used to quote the student back to themselves.
export const AREA_KEYWORDS = {
  bio: ['animal', 'dog', 'cat', 'pet', 'shelter', 'biology', 'cell', 'body', 'plant', 'vet', 'nature', 'science'],
  art: ['poster', 'draw', 'paint', 'design', 'art', 'sketch', 'photo', 'color', 'make things look'],
  math: ['math', 'number', 'statistic', 'algebra', 'calculus'],
  econ: ['money', 'business', 'price', 'sell', 'store', 'budget', 'econ'],
  code: ['code', 'coding', 'program', 'app', 'game', 'computer', 'website'],
  eng: ['build', 'robot', 'machine', 'fix', 'engine', 'bridge', 'lego'],
  write: ['write', 'writing', 'story', 'stories', 'essay', 'newspaper', 'journal', 'blog', 'read'],
};

export const MAJORS = [
  {
    id: 'bio',
    name: 'Biology',
    area: 'bio',
    needs: ['math'],
    priorities: ['nature', 'people'],
    keywords: ['animal', 'lab', 'body', 'cell', 'vet'],
    setting: 'in a lab or outdoors',
    headsUp: 'Most programs include chemistry and statistics.',
    findOut: 'Do you like lab work, or mainly learning about living things?',
    bridges: {},
    facts: {
      classes: 'Cells, genetics, ecosystems. Labs every week, plus chemistry and stats.',
      workday: 'Collecting samples in a lab or outdoors, recording data, writing up results. Some jobs include caring for animals.',
      jobs: 'Wildlife biologist, lab technician, veterinarian, science teacher',
      school: { verdict: 'Often, yes', more: true, text: 'Vets and many researchers need extra years of school. Some lab and field jobs don’t.' },
      money: { gap: false },
    },
    activities: [
      { title: 'Take a free online lesson on animal behavior', tags: ['About 1 hour', 'Free', 'Online'], watch: 'did you want to keep going when it ended?', caveat: 'Just a taste. Real biology classes also include chemistry and labs.' },
      { title: 'Join a local nature walk or park volunteer day', tags: ['Half a day', 'Free', 'Outdoors'], watch: 'did you enjoy noticing living things up close?', caveat: 'Just a taste. Field biology also means careful note-taking.' },
    ],
  },
  {
    id: 'gd',
    name: 'Graphic Design',
    area: 'art',
    needs: [],
    priorities: ['creative'],
    keywords: ['poster', 'design', 'draw', 'art'],
    setting: 'at a computer, often with clients',
    headsUp: 'Most design jobs are about what a client wants, not your own ideas.',
    findOut: 'Would you enjoy getting feedback and redoing your work?',
    bridges: { code: 'designers often build websites and apps' },
    facts: {
      classes: 'Layout, type and color. Studio classes where classmates give feedback. You build a portfolio.',
      workday: 'Meeting clients, designing on a computer, making changes after feedback, hitting deadlines.',
      jobs: 'Graphic designer, web designer, marketing designer, later art director',
      school: { verdict: 'Usually not', more: false, text: 'A four-year degree is typical. Your portfolio matters most.' },
      money: { gap: true },
    },
    activities: [
      { title: 'Ask your art teacher or club adviser 3 questions', tags: ['20 minutes', 'At school'], watch: 'which answer surprised you?', caveat: 'Just one person’s view. No adviser? Tap “Another idea” for a free online lesson.', questions: ['How is designing for a client different from making art?', 'What’s a design class critique like?', 'What goes in a beginner portfolio?'] },
      { title: 'Redesign a flyer for a real school event', tags: ['1–2 hours', 'Free', 'At home'], watch: 'how did it feel when someone asked for changes?', caveat: 'Just a taste. Design classes add type and layout theory.' },
    ],
  },
  {
    id: 'cs',
    name: 'Computer Science',
    area: 'code',
    needs: ['math'],
    priorities: ['puzzles', 'pay'],
    keywords: ['puzzle', 'code', 'app', 'game', 'computer'],
    setting: 'mostly at a computer',
    headsUp: 'There’s math involved, including calculus.',
    findOut: 'Does solving a puzzle step by step feel fun or boring?',
    bridges: {
      bio: 'scientists use code to study animals and ecosystems',
      art: 'designers and game artists use code to make interactive work',
      math: 'it puts math to work on real problems',
      econ: 'businesses run on software and data',
      eng: 'most machines today run on code',
      write: 'writing clear code is a lot like writing clear sentences',
    },
    facts: {
      classes: 'Writing programs and solving problems with code, plus calculus and other math.',
      workday: 'Writing and testing code, fixing bugs, working with a team. Mostly at a computer.',
      jobs: 'Software developer, web developer, data analyst, coding for science',
      school: { verdict: 'Usually not', more: false, text: 'A four-year degree is typical. More school is mostly for research jobs.' },
      money: { gap: false },
    },
    activities: [
      { title: 'Write your first tiny program in a free beginner lesson', tags: ['About 1 hour', 'Free', 'No experience needed'], watch: 'when you got stuck, was fixing it annoying or kind of fun?', caveat: 'Just a taste. College classes are harder and include more math.' },
      { title: 'Do a second coding lesson that uses real data', tags: ['About 1 hour', 'Free', 'Online'], watch: 'did finding a pattern in data feel satisfying?', caveat: 'Just a taste. Real projects take many sessions.' },
    ],
  },
  {
    id: 'env',
    name: 'Environmental Science',
    area: 'bio',
    needs: ['math'],
    priorities: ['nature', 'outdoors'],
    keywords: ['outdoor', 'outside', 'nature', 'field', 'climate', 'park'],
    setting: 'outdoors, in a lab, or at a computer',
    headsUp: 'Expect chemistry and some statistics.',
    findOut: 'Would you enjoy fieldwork in all kinds of weather?',
    bridges: { code: 'scientists model climate and ecosystems with code', math: 'it uses stats to understand nature' },
    facts: {
      classes: 'Ecology, earth science, chemistry and field methods. Often includes trips outside.',
      workday: 'Collecting samples outside, testing them in a lab, and writing reports for agencies or companies.',
      jobs: 'Environmental scientist, conservation technician, park ranger, sustainability analyst',
      school: { verdict: 'Sometimes', more: false, text: 'Many jobs start with a four-year degree. Research roles often need more.' },
      money: { gap: false },
    },
    activities: [
      { title: 'Join a school or local outdoor volunteer day', tags: ['Half a day', 'Free', 'Outdoors'], watch: 'did being outside for hours feel good or tiring?', caveat: 'Just a taste. The degree also includes chemistry and lab work.' },
      { title: 'Track the weather or a local stream for a week', tags: ['10 minutes a day', 'Free'], watch: 'did you look forward to checking?', caveat: 'Just a taste. Real studies run for months.' },
    ],
  },
  {
    id: 'econ',
    name: 'Economics',
    area: 'econ',
    needs: ['math'],
    priorities: ['pay', 'puzzles'],
    keywords: ['money', 'business', 'price'],
    setting: 'mostly in an office or at a computer',
    headsUp: 'It uses a lot of math and statistics.',
    findOut: 'Do you enjoy explaining why people make the choices they do?',
    bridges: { math: 'it’s math about how people make choices', write: 'economists write a lot to explain their findings' },
    facts: {
      classes: 'Supply and demand, how markets and governments work, statistics and graphs.',
      workday: 'Reading data, building spreadsheets or models, writing reports and presenting findings.',
      jobs: 'Financial analyst, market researcher, policy analyst, economist',
      school: { verdict: 'Sometimes', more: false, text: 'Many jobs start with a four-year degree. Economist roles often need more.' },
      money: { gap: false },
    },
    activities: [
      { title: 'Watch a free intro lesson on supply and demand', tags: ['About 1 hour', 'Free', 'Online'], watch: 'did the examples make you see prices differently?', caveat: 'Just a taste. College classes add a lot of math.' },
      { title: 'Plan a real budget for a school club event', tags: ['1 hour', 'Free', 'At school'], watch: 'was balancing the numbers satisfying?', caveat: 'Just a taste. Economics is broader than budgeting.' },
    ],
  },
  {
    id: 'me',
    name: 'Mechanical Engineering',
    area: 'eng',
    needs: ['math'],
    priorities: ['puzzles', 'pay'],
    keywords: ['build', 'robot', 'machine', 'fix'],
    setting: 'in labs, workshops and offices',
    headsUp: 'Expect a lot of math and physics.',
    findOut: 'Do you like figuring out how things work by taking them apart?',
    bridges: { art: 'engineers design how products look and feel', code: 'robots need both code and hardware', math: 'it turns math into real machines' },
    facts: {
      classes: 'Physics, calculus, materials, design projects where you build things that work.',
      workday: 'Designing parts on a computer, testing prototypes, working with a team to fix problems.',
      jobs: 'Mechanical engineer, product designer, robotics engineer, manufacturing engineer',
      school: { verdict: 'Usually not', more: false, text: 'A four-year engineering degree is typical. A license helps for some jobs.' },
      money: { gap: false },
    },
    activities: [
      { title: 'Build a simple machine from a free online guide', tags: ['1–2 hours', 'Free', 'At home'], watch: 'did fixing what didn’t work keep you hooked?', caveat: 'Just a taste. Engineering classes are heavy on math.' },
      { title: 'Join a robotics club meeting as a guest', tags: ['1 hour', 'At school'], watch: 'which part of the build interested you most?', caveat: 'Just a taste. Clubs vary a lot.' },
    ],
  },
  {
    id: 'jour',
    name: 'Journalism',
    area: 'write',
    needs: [],
    priorities: ['people', 'creative'],
    keywords: ['story', 'write', 'news', 'interview'],
    setting: 'out reporting and at a desk',
    headsUp: 'Deadlines are tight and the job market is competitive.',
    findOut: 'Do you enjoy asking strangers questions?',
    bridges: { code: 'data journalists use code to find stories', art: 'visual storytelling is a big part of news', bio: 'science writers explain research to the public' },
    facts: {
      classes: 'Reporting, interviewing, writing on deadline, media law and ethics.',
      workday: 'Finding stories, interviewing people, writing and editing on deadline.',
      jobs: 'Reporter, editor, science writer, communications specialist',
      school: { verdict: 'Usually not', more: false, text: 'A four-year degree is typical. Your published work matters most.' },
      money: { gap: false },
    },
    activities: [
      { title: 'Interview someone and write a short profile', tags: ['1 hour', 'Free'], watch: 'did asking questions feel natural?', caveat: 'Just a taste. Real reporting means checking every fact.' },
      { title: 'Write one article for your school paper or blog', tags: ['2 hours', 'Free'], watch: 'did you enjoy the editing part?', caveat: 'Just a taste. Newsrooms move much faster.' },
    ],
  },
  {
    id: 'stats',
    name: 'Statistics and Data Science',
    area: 'math',
    needs: ['code'],
    priorities: ['puzzles', 'pay'],
    keywords: ['data', 'pattern', 'number'],
    setting: 'mostly at a computer',
    headsUp: 'It’s math every day, plus coding.',
    findOut: 'Do you enjoy finding patterns in numbers?',
    bridges: { bio: 'statisticians help test new medicines and study wildlife', econ: 'businesses decide using data', code: 'data science is coding with numbers' },
    facts: {
      classes: 'Probability, statistics, coding for data, and lots of real data sets.',
      workday: 'Cleaning data, running analyses, making charts and explaining what they show.',
      jobs: 'Data analyst, statistician, data scientist, research analyst',
      school: { verdict: 'Sometimes', more: false, text: 'Many analyst jobs start with a four-year degree. Statistician roles often need more.' },
      money: { gap: false },
    },
    activities: [
      { title: 'Make a chart from a free public data set', tags: ['1 hour', 'Free', 'Online'], watch: 'did you want to dig into the data more?', caveat: 'Just a taste. College classes go deeper into probability.' },
      { title: 'Survey your friends and chart the results', tags: ['1 hour', 'Free'], watch: 'was it fun to see what the numbers said?', caveat: 'Just a taste. Real surveys need careful design.' },
    ],
  },
];

export const majorById = Object.fromEntries(MAJORS.map((m) => [m.id, m]));
export const areaById = Object.fromEntries(AREAS.map((a) => [a.id, a]));
