import { Request, Response } from 'express';
import { Exam } from '../models/exam.model';
import { Subject } from '../models/subject.model';
import { Topic } from '../models/topic.model';
import { sendSuccess, sendError } from '../utils/apiResponse';

const SEED_EXAMS_DATA = [
  {
    name: 'Banking (IBPS / SBI PO)',
    code: 'BANKING',
    description: 'Comprehensive preparation for SBI PO, IBPS PO, Clerk, and RRB banking exams.',
    category: 'Banking',
    icon: 'Building2',
    subjects: [
      {
        name: 'Quantitative Aptitude',
        code: 'BANK_QUANT',
        icon: 'Calculator',
        topics: [
          { name: 'Simplification & Approximation', code: 'SIMP', difficulty: 'easy', subtopics: ['BODMAS', 'Percentages', 'Square Roots'] },
          { name: 'Number Series & Quadratic Equations', code: 'SERIES', difficulty: 'medium', subtopics: ['Missing Series', 'Wrong Number', 'Roots'] },
          { name: 'Data Interpretation (DI)', code: 'DI', difficulty: 'hard', subtopics: ['Bar Graphs', 'Pie Charts', 'Caselet DI', 'Radar DI'] },
          { name: 'Arithmetic Problem Solving', code: 'ARITH', difficulty: 'medium', subtopics: ['Profit & Loss', 'Simple & Compound Interest', 'Time & Work', 'Ratio & Proportion'] }
        ]
      },
      {
        name: 'Reasoning Ability',
        code: 'BANK_REAS',
        icon: 'Compass',
        topics: [
          { name: 'Syllogism & Inequity', code: 'SYLL', difficulty: 'easy', subtopics: ['Only a few', 'Reverse Syllogism', 'Coded Inequality'] },
          { name: 'Coding-Decoding & Direction Sense', code: 'CODE_DIR', difficulty: 'medium', subtopics: ['Chinese Coding', 'Direction Distance'] },
          { name: 'Linear & Circular Seating Arrangement', code: 'SEAT', difficulty: 'hard', subtopics: ['Inside-Outside Facing', 'Unknown Number of Persons', 'Parallel Rows'] },
          { name: 'Puzzles & High-Level Reasoning', code: 'PUZZ', difficulty: 'hard', subtopics: ['Floor Puzzles', 'Box Puzzles', 'Month & Date Puzzles'] }
        ]
      },
      {
        name: 'English Language',
        code: 'BANK_ENG',
        icon: 'BookOpen',
        topics: [
          { name: 'Reading Comprehension', code: 'RC', difficulty: 'medium', subtopics: ['Theme Based', 'Inference Questions', 'Vocabulary in Context'] },
          { name: 'Error Spotting & Sentence Improvement', code: 'ERROR', difficulty: 'medium', subtopics: ['Grammar Rules', 'Subject-Verb Agreement', 'Prepositions'] },
          { name: 'Cloze Test & Para Jumbles', code: 'CLOZE', difficulty: 'medium', subtopics: ['Fillers', 'Sentence Rearrangement'] }
        ]
      },
      {
        name: 'General & Banking Awareness',
        code: 'BANK_GA',
        icon: 'Globe',
        topics: [
          { name: 'Banking & Financial Awareness', code: 'FIN_AWARE', difficulty: 'medium', subtopics: ['RBI Monetary Policy', 'NPA & Basel Norms', 'Financial Inclusion'] },
          { name: 'Current Affairs & Economic News', code: 'CURR_AFF', difficulty: 'easy', subtopics: ['National News', 'Summits & MoUs', 'Union Budget'] }
        ]
      }
    ]
  },
  {
    name: 'Staff Selection (SSC CGL / CHSL)',
    code: 'SSC',
    description: 'Targeted syllabus coverage for SSC Combined Graduate Level & Higher Secondary exams.',
    category: 'Staff Selection',
    icon: 'Briefcase',
    subjects: [
      {
        name: 'Quantitative Aptitude',
        code: 'SSC_QUANT',
        icon: 'Calculator',
        topics: [
          { name: 'Geometry & Mensuration', code: 'GEOM', difficulty: 'hard', subtopics: ['Triangles & Circles', 'Coordinate Geometry', '3D Mensuration'] },
          { name: 'Trigonometry & Algebra', code: 'TRIG_ALG', difficulty: 'hard', subtopics: ['Identities', 'Heights & Distances', 'Polynomials'] },
          { name: 'Arithmetic & Commercial Math', code: 'SSC_ARITH', difficulty: 'medium', subtopics: ['Percentage', 'Discount', 'Speed, Time & Distance'] }
        ]
      },
      {
        name: 'General Intelligence & Reasoning',
        code: 'SSC_REAS',
        icon: 'Compass',
        topics: [
          { name: 'Analogy & Classification', code: 'ANALOGY', difficulty: 'easy', subtopics: ['Semantic', 'Figural', 'Number Analogy'] },
          { name: 'Non-Verbal & Pattern Completion', code: 'NON_VERBAL', difficulty: 'medium', subtopics: ['Mirror Images', 'Paper Folding', 'Embedded Figures'] }
        ]
      },
      {
        name: 'General Awareness',
        code: 'SSC_GA',
        icon: 'Globe',
        topics: [
          { name: 'Indian Polity & Constitution', code: 'POLITY', difficulty: 'medium', subtopics: ['Fundamental Rights', 'President & Parliament', 'Articles & Amendments'] },
          { name: 'Indian History & Culture', code: 'HIST', difficulty: 'medium', subtopics: ['Ancient, Medieval & Modern Freedom Struggle'] },
          { name: 'General Science', code: 'SCI', difficulty: 'easy', subtopics: ['Physics Basics', 'Chemistry in Daily Life', 'Human Biology'] }
        ]
      },
      {
        name: 'English Comprehension',
        code: 'SSC_ENG',
        icon: 'BookOpen',
        topics: [
          { name: 'Vocabulary, Idioms & Phrases', code: 'VOCAB', difficulty: 'medium', subtopics: ['Synonyms & Antonyms', 'One Word Substitutions'] },
          { name: 'Active/Passive Voice & Narration', code: 'VOICE_NARR', difficulty: 'medium', subtopics: ['Direct to Indirect', 'Voice Conversion'] }
        ]
      }
    ]
  },
  {
    name: 'Civil Services (UPSC Prelims)',
    code: 'UPSC',
    description: 'Foundational concept building and standard question sets for UPSC CSE Prelims GS 1 & CSAT.',
    category: 'Civil Services',
    icon: 'Landmark',
    subjects: [
      {
        name: 'General Studies Paper I',
        code: 'UPSC_GS1',
        icon: 'Globe',
        topics: [
          { name: 'Indian Polity & Governance', code: 'UPSC_POLITY', difficulty: 'hard', subtopics: ['Constitutional Framework', 'Judiciary', 'Panchayati Raj'] },
          { name: 'Indian Economy & Development', code: 'UPSC_ECON', difficulty: 'hard', subtopics: ['Fiscal Policy', 'Banking System', 'Inflation & Growth'] },
          { name: 'Environment, Ecology & Biodiversity', code: 'ENV_ECO', difficulty: 'hard', subtopics: ['Protected Areas', 'Climate Change Protocols', 'Species in News'] }
        ]
      },
      {
        name: 'CSAT Paper II',
        code: 'UPSC_CSAT',
        icon: 'Calculator',
        topics: [
          { name: 'Reading Comprehension & Critical Reasoning', code: 'UPSC_RC', difficulty: 'hard', subtopics: ['Assumptions', 'Crux & Implication'] },
          { name: 'Basic Numeracy & Data Interpretation', code: 'UPSC_NUM', difficulty: 'medium', subtopics: ['Permutation & Combination', 'Number Properties'] }
        ]
      }
    ]
  },
  {
    name: 'Railways (RRB NTPC / Group D)',
    code: 'RAILWAYS',
    description: 'Preparation pack for Railway Recruitment Board Non-Technical & Technical posts.',
    category: 'Railways',
    icon: 'Train',
    subjects: [
      {
        name: 'Mathematics',
        code: 'RRB_MATH',
        icon: 'Calculator',
        topics: [
          { name: 'Number Systems, Decimals & Fractions', code: 'RRB_NUM', difficulty: 'easy', subtopics: ['LCM & HCF', 'Fractions', 'BODMAS'] },
          { name: 'Time & Work, Speed & Distance', code: 'RRB_TSD', difficulty: 'medium', subtopics: ['Pipes & Cisterns', 'Trains & Platforms'] }
        ]
      },
      {
        name: 'General Intelligence & Reasoning',
        code: 'RRB_REAS',
        icon: 'Compass',
        topics: [
          { name: 'Mathematical Operations & Venn Diagrams', code: 'RRB_VENN', difficulty: 'easy', subtopics: ['Symbol Substitution', 'Venn Sets'] },
          { name: 'Statement-Conclusions & Assumptions', code: 'RRB_CRIT', difficulty: 'medium', subtopics: ['Arguments', 'Courses of Action'] }
        ]
      },
      {
        name: 'General Science & Awareness',
        code: 'RRB_SCI',
        icon: 'Globe',
        topics: [
          { name: 'Basic Physics, Chemistry & Biology', code: 'RRB_GENSCI', difficulty: 'easy', subtopics: ['Units & Dimensions', 'Periodic Elements', 'Diseases & Nutrients'] },
          { name: 'Current Events & Indian Railways Facts', code: 'RRB_FACTS', difficulty: 'easy', subtopics: ['Rail Zones', 'National Milestones'] }
        ]
      }
    ]
  }
];

// Seed function (internal + exposed as endpoint)
export const seedExamsData = async () => {
  const existingCount = await Exam.countDocuments();
  if (existingCount > 0) {
    return { alreadySeeded: true, count: existingCount };
  }

  for (const examData of SEED_EXAMS_DATA) {
    const { subjects, ...examFields } = examData;
    const createdExam = await Exam.create(examFields);

    for (let sIdx = 0; sIdx < subjects.length; sIdx++) {
      const subjectData = subjects[sIdx];
      const { topics, ...subjectFields } = subjectData;

      const createdSubject = await Subject.create({
        ...subjectFields,
        examId: createdExam._id,
        order: sIdx + 1
      });

      for (let tIdx = 0; tIdx < topics.length; tIdx++) {
        const topicData = topics[tIdx];
        await Topic.create({
          ...topicData,
          subjectId: createdSubject._id,
          order: tIdx + 1
        });
      }
    }
  }

  const newCount = await Exam.countDocuments();
  return { alreadySeeded: false, count: newCount };
};

// GET /api/exams
export const getExams = async (req: Request, res: Response) => {
  try {
    const count = await Exam.countDocuments();
    if (count === 0) {
      await seedExamsData();
    }

    const exams = await Exam.find({ isActive: true }).sort({ createdAt: 1 }).lean();
    const examIds = exams.map((e) => e._id);

    // Single aggregation query to count subjects for all exams at once
    const counts = await Subject.aggregate([
      { $match: { examId: { $in: examIds } } },
      { $group: { _id: '$examId', count: { $sum: 1 } } }
    ]);
    const countMap = new Map(counts.map((c) => [c._id.toString(), c.count]));

    const examsWithMeta = exams.map((exam) => ({
      ...exam,
      subjectCount: countMap.get(exam._id.toString()) || 0
    }));

    return sendSuccess(res, 'Exams retrieved successfully', examsWithMeta);
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to fetch exams', 500);
  }
};

// GET /api/exams/:id
export const getExamDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [exam, subjects] = await Promise.all([
      Exam.findById(id).lean(),
      Subject.find({ examId: id }).sort({ order: 1 }).lean()
    ]);

    if (!exam) {
      return sendError(res, 'Exam not found', 404);
    }

    // Single batch query for all topics across all subjects
    const subjectIds = subjects.map((s) => s._id);
    const topics = await Topic.find({ subjectId: { $in: subjectIds } }).sort({ order: 1 }).lean();

    const topicMap = new Map<string, any[]>();
    for (const t of topics) {
      const sId = t.subjectId.toString();
      if (!topicMap.has(sId)) topicMap.set(sId, []);
      topicMap.get(sId)!.push(t);
    }

    const subjectsWithTopics = subjects.map((subject) => ({
      ...subject,
      topics: topicMap.get(subject._id.toString()) || []
    }));

    return sendSuccess(res, 'Exam details retrieved', {
      exam,
      subjects: subjectsWithTopics
    });
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to fetch exam details', 500);
  }
};

// POST /api/exams/seed (manual trigger if needed)
export const seedExams = async (req: Request, res: Response) => {
  try {
    const result = await seedExamsData();
    return sendSuccess(res, 'Exams seeded successfully', result);
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to seed exams', 500);
  }
};

