import express from 'express';
import multer from 'multer';
import { analyzeResume, analyzeJobDescription, generateQuestion, evaluateAnswer, generateFinalReport } from '../services/openaiService.js';
import { extractTextFromPDF, extractTextFromDOCX } from '../services/fileParserService.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Interview sessions storage (in production, use database)
const sessions = new Map();

// Helper function to get interviewer details
function getInterviewerDetails(interviewerName) {
  const interviewers = {
    'Tanya': {
      name: 'Tanya',
      role: 'Senior Software Engineer',
      avatar: '👩‍💻',
      color: 'from-pink-500 to-rose-500',
      voice: 'female',
      description: 'Friendly & Detailed',
      voicePreference: 'female'
    },
    'Isha': {
      name: 'Isha',
      role: 'Technical Recruiter',
      avatar: '👩‍💼',
      color: 'from-purple-500 to-indigo-500',
      voice: 'female',
      description: 'Professional & Thorough',
      voicePreference: 'female'
    },
    'Rohan': {
      name: 'Rohan',
      role: 'Engineering Manager',
      avatar: '👨‍💻',
      color: 'from-blue-500 to-cyan-500',
      voice: 'male',
      description: 'Challenging & Insightful',
      voicePreference: 'male'
    }
  };
  return interviewers[interviewerName] || interviewers['Tanya'];
}

// Configure interview route
router.post('/configure', upload.fields([
  { name: 'resume', maxCount: 1 },
  { name: 'jobDescription', maxCount: 1 }
]), async (req, res) => {
  try {
    console.log('📋 Configure request received');
    console.log('Body:', req.body);
    
    const { 
      role, experience, duration, difficulty, 
      practiceMode, interviewer, topics 
    } = req.body;
    
    console.log(`🎯 Selected interviewer: ${interviewer}`);
    console.log(`📝 Role: ${role}, Experience: ${experience}, Duration: ${duration}`);
    
    // Parse topics if provided
    let parsedTopics = [];
    if (topics) {
      try {
        parsedTopics = JSON.parse(topics);
        console.log(`📚 Topics: ${parsedTopics.length} topics selected`);
      } catch(e) { console.log('Topics parse error:', e); }
    }
    
    let resumeText = '';
    let jdText = '';
    
    // Parse resume if uploaded
    if (req.files && req.files['resume']) {
      const file = req.files['resume'][0];
      console.log(`📄 Resume uploaded: ${file.originalname}`);
      if (file.mimetype === 'application/pdf') {
        resumeText = await extractTextFromPDF(file.buffer);
      } else if (file.mimetype.includes('word')) {
        resumeText = await extractTextFromDOCX(file.buffer);
      }
    }
    
    // Parse job description if uploaded
    if (req.files && req.files['jobDescription']) {
      const file = req.files['jobDescription'][0];
      console.log(`📋 JD uploaded: ${file.originalname}`);
      if (file.mimetype === 'application/pdf') {
        jdText = await extractTextFromPDF(file.buffer);
      } else if (file.mimetype.includes('word') || file.mimetype === 'text/plain') {
        jdText = file.buffer.toString();
      }
    }
    
    // If JD text was provided directly
    if (req.body.jdText) {
      jdText = req.body.jdText;
      console.log('📝 JD text provided directly');
    }
    
    // Analyze resume and JD
    const [resumeAnalysis, jdAnalysis] = await Promise.all([
      resumeText ? analyzeResume(resumeText) : null,
      jdText ? analyzeJobDescription(jdText) : null
    ]);
    
    const sessionId = Date.now().toString();
    console.log(`🆕 Creating session with ID: ${sessionId}`);
    
    // Get interviewer details
    const interviewerDetails = getInterviewerDetails(interviewer || 'Tanya');
    
    const session = {
      id: sessionId,
      role: role || 'Software Engineer',
      experience: experience || 'Intermediate',
      duration: parseInt(duration) || 10,
      difficulty: difficulty || 'adaptive',
      currentDifficulty: difficulty === 'adaptive' ? 'medium' : (difficulty || 'medium'),
      practiceMode: practiceMode || 'detail',
      interviewer: interviewer || 'Tanya',
      interviewerDetails: interviewerDetails,
      topics: parsedTopics,
      resumeText,
      jdText,
      resumeAnalysis,
      jdAnalysis,
      questions: [],
      answers: [],
      startTime: null,
      endTime: null,
      questionCount: 0,
      currentQuestion: null,
      currentQuestionStart: null,
      performanceHistory: [],
      finalReport: null,
      status: 'configured'
    };
    
    sessions.set(sessionId, session);
    console.log(`✅ Session stored: ${sessionId}`);
    console.log(`📊 Total sessions in memory: ${sessions.size}`);
    
    res.json({ 
      sessionId, 
      interviewer: session.interviewer,
      interviewerDetails: interviewerDetails
    });
  } catch (error) {
    console.error('❌ Configure error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start interview route
router.post('/start/:sessionId', async (req, res) => {
  const sessionId = req.params.sessionId;
  console.log(`🔍 Looking for session: ${sessionId}`);
  console.log(`📊 Available sessions: ${Array.from(sessions.keys()).join(', ')}`);
  
  const session = sessions.get(sessionId);
  
  if (!session) {
    console.log(`❌ Session not found: ${sessionId}`);
    return res.status(404).json({ error: 'Session not found. Please configure your interview first.' });
  }
  
  console.log(`✅ Session found for ${sessionId}`);
  console.log(`🎬 Starting interview for session ${session.id}`);
  console.log(`👤 Interviewer: ${session.interviewer}`);
  console.log(`📋 Role: ${session.role}, Difficulty: ${session.currentDifficulty}`);
  
  session.status = 'active';
  session.startTime = new Date();
  session.questionCount = 0;
  session.performanceHistory = [];
  
  // Get fresh interviewer details
  const interviewerDetails = getInterviewerDetails(session.interviewer);
  
  try {
    // Generate first question
    const firstQuestion = await generateQuestion(session, null);
    session.currentQuestion = firstQuestion;
    session.currentQuestionStart = new Date();
    
    console.log(`❓ First question generated: ${firstQuestion.type}`);
    
    res.json({ 
      question: firstQuestion,
      questionNumber: 1,
      duration: session.duration,
      interviewer: interviewerDetails,
      role: session.role
    });
  } catch (error) {
    console.error('Error generating question:', error);
    res.status(500).json({ error: 'Failed to generate interview question' });
  }
});

// Submit answer route
router.post('/answer/:sessionId', async (req, res) => {
  const { answer, timeSpent } = req.body;
  const sessionId = req.params.sessionId;
  const session = sessions.get(sessionId);
  
  if (!session) {
    console.log(`❌ Session not found for answer: ${sessionId}`);
    return res.status(404).json({ error: 'Session not found' });
  }
  
  console.log(`📝 Answer received for session ${session.id}, Question ${session.questionCount + 1}`);
  console.log(`⏱️ Time spent: ${timeSpent || 'unknown'} seconds`);
  console.log(`📝 Answer length: ${answer.length} characters`);
  
  const timeTaken = timeSpent || (new Date() - session.currentQuestionStart) / 1000;
  
  // Evaluate the answer
  const evaluation = await evaluateAnswer(session.currentQuestion, answer, session);
  console.log(`📊 Evaluation score: ${evaluation.totalScore}/100`);
  
  // Store answer and evaluation
  session.answers.push({
    question: session.currentQuestion,
    answer: answer,
    evaluation: evaluation,
    timeTaken: timeTaken,
    timestamp: new Date()
  });
  
  session.performanceHistory.push(evaluation.totalScore);
  
  // Check for early termination (3 consecutive very poor answers)
  const recentPerformance = session.performanceHistory.slice(-3);
  if (recentPerformance.length === 3 && 
      recentPerformance.every(score => score < 30)) {
    console.log(`⚠️ Early termination triggered - performance below threshold`);
    session.status = 'terminated_early';
    session.endTime = new Date();
    const finalReport = await generateFinalReport(session);
    session.finalReport = finalReport;
    return res.json({ 
      interviewComplete: true, 
      earlyTermination: true,
      report: finalReport 
    });
  }
  
  // Adapt difficulty based on performance
  if (session.difficulty === 'adaptive') {
    const avgScore = evaluation.totalScore;
    const oldDifficulty = session.currentDifficulty;
    
    if (avgScore >= 75 && session.currentDifficulty === 'easy') {
      session.currentDifficulty = 'medium';
      console.log(`📈 Difficulty: Easy → Medium`);
    } else if (avgScore >= 80 && session.currentDifficulty === 'medium') {
      session.currentDifficulty = 'hard';
      console.log(`📈 Difficulty: Medium → Hard`);
    } else if (avgScore < 45 && session.currentDifficulty === 'hard') {
      session.currentDifficulty = 'medium';
      console.log(`📉 Difficulty: Hard → Medium`);
    } else if (avgScore < 35 && session.currentDifficulty === 'medium') {
      session.currentDifficulty = 'easy';
      console.log(`📉 Difficulty: Medium → Easy`);
    }
    
    if (oldDifficulty !== session.currentDifficulty) {
      console.log(`🎯 Difficulty changed from ${oldDifficulty} to ${session.currentDifficulty}`);
    }
  }
  
  session.questionCount++;
  
  // Check if interview should end (duration reached or max questions)
  const elapsedMinutes = (new Date() - session.startTime) / 60000;
  if (elapsedMinutes >= session.duration || session.questionCount >= 15) {
    console.log(`✅ Interview completed - ${session.questionCount} questions answered in ${elapsedMinutes.toFixed(1)} minutes`);
    session.status = 'completed';
    session.endTime = new Date();
    const finalReport = await generateFinalReport(session);
    session.finalReport = finalReport;
    return res.json({ 
      interviewComplete: true, 
      earlyTermination: false,
      report: finalReport 
    });
  }
  
  // Generate next question
  const nextQuestion = await generateQuestion(session, evaluation);
  session.currentQuestion = nextQuestion;
  session.currentQuestionStart = new Date();
  
  console.log(`❓ Next question #${session.questionCount + 1}: ${nextQuestion.type}`);
  
  res.json({
    question: nextQuestion,
    questionNumber: session.questionCount + 1,
    evaluation: {
      totalScore: evaluation.totalScore,
      feedback: evaluation.feedback,
      scores: evaluation.scores
    },
    adaptedDifficulty: session.currentDifficulty
  });
});

// Get session status route (for debugging)
router.get('/status/:sessionId', async (req, res) => {
  const sessionId = req.params.sessionId;
  const session = sessions.get(sessionId);
  
  if (!session) {
    return res.status(404).json({ error: 'Session not found', sessionId });
  }
  
  res.json({
    id: session.id,
    status: session.status,
    questionCount: session.questionCount,
    role: session.role,
    interviewer: session.interviewer,
    difficulty: session.currentDifficulty,
    totalAnswers: session.answers.length,
    startTime: session.startTime,
    totalSessions: sessions.size
  });
});

// Get all sessions (for debugging)
router.get('/sessions', async (req, res) => {
  const allSessions = Array.from(sessions.keys()).map(id => {
    const session = sessions.get(id);
    return {
      id: id,
      status: session.status,
      interviewer: session.interviewer,
      role: session.role,
      questionCount: session.questionCount
    };
  });
  res.json({ sessions: allSessions, count: sessions.size });
});

// Get session report route
router.get('/report/:sessionId', async (req, res) => {
  const sessionId = req.params.sessionId;
  console.log(`📊 Fetching report for session: ${sessionId}`);
  
  const session = sessions.get(sessionId);
  
  if (!session) {
    console.log(`❌ Session not found for report: ${sessionId}`);
    return res.status(404).json({ error: 'Session not found' });
  }
  
  // If report already generated, return it
  if (session.finalReport) {
    console.log(`✅ Returning cached report for session ${sessionId}`);
    return res.json(session.finalReport);
  }
  
  // If no answers, return error
  if (!session.answers || session.answers.length === 0) {
    console.log(`⚠️ No answers found for session ${sessionId}`);
    return res.status(400).json({ error: 'No answers recorded for this session' });
  }
  
  // Generate final report
  console.log(`📝 Generating new report for session ${sessionId} with ${session.answers.length} answers`);
  const report = await generateFinalReport(session);
  session.finalReport = report;
  res.json(report);
});

// Clean up old sessions (optional - runs every hour)
setInterval(() => {
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;
  let deletedCount = 0;
  
  for (const [id, session] of sessions.entries()) {
    // Delete sessions older than 1 hour that are completed or terminated
    if (session.endTime && (now - new Date(session.endTime).getTime() > oneHour)) {
      sessions.delete(id);
      deletedCount++;
    }
  }
  
  if (deletedCount > 0) {
    console.log(`🧹 Cleaned up ${deletedCount} old sessions. Remaining: ${sessions.size}`);
  }
}, 60 * 60 * 1000); // Run every hour

export default router;