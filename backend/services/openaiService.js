// backend/services/openaiService.js

// Set this to true for hackathon demos (no API key needed)
const USE_MOCK = true;

// ============ ROLE-SPECIFIC QUESTION BANK ============

const roleSpecificQuestions = {
  'Software Engineer': {
    technical: [
      "Explain the difference between object-oriented programming and functional programming. When would you use each?",
      "What are design patterns? Can you name and explain 3 commonly used design patterns?",
      "How does garbage collection work in JavaScript/Java/Python?",
      "Explain the concept of time complexity. Give examples of O(n), O(log n), and O(n²) algorithms.",
      "What is the difference between a process and a thread? How do they communicate?",
      "Explain the SOLID principles with examples for each.",
      "What is dependency injection and why is it useful?"
    ],
    behavioral: [
      "Tell me about a time you had to refactor legacy code. What was your approach?",
      "Describe a situation where you had to meet a tight deadline. How did you manage it?",
      "How do you handle technical debt in your projects?",
      "Tell me about a time you disagreed with a technical decision. What happened?",
      "Describe your experience with code reviews. How do you give and receive feedback?",
      "Tell me about a challenging bug you fixed and what you learned."
    ],
    scenario: [
      "Design a URL shortening service like TinyURL. Consider scale and performance.",
      "How would you debug a production issue that only happens once every 1000 requests?",
      "Design a system for tracking real-time stock prices.",
      "How would you optimize a slow-loading e-commerce website?",
      "Design a notification system that can handle 1 million users.",
      "How would you implement a search feature across millions of products?"
    ]
  },
  'Frontend Developer': {
    technical: [
      "Explain the virtual DOM and how React uses it for performance optimization.",
      "What are closures in JavaScript? Provide an example of where you would use them.",
      "Explain CSS Flexbox vs Grid. When would you use each?",
      "What is the difference between localStorage, sessionStorage, and cookies?",
      "Explain event delegation in JavaScript and why it's useful.",
      "What is the difference between useState and useReducer in React?",
      "Explain the concept of 'lifting state up' in React."
    ],
    behavioral: [
      "Describe a challenging UI bug you fixed. What was your debugging process?",
      "How do you ensure your web applications are accessible (WCAG compliance)?",
      "Tell me about a time you improved page load speed. What techniques did you use?",
      "How do you stay updated with rapidly changing frontend technologies?",
      "Describe your experience with responsive design for mobile devices.",
      "Tell me about a project where you used a new frontend framework."
    ],
    scenario: [
      "How would you build an infinite scroll component that loads images efficiently?",
      "Design a real-time chat widget for a website.",
      "How would you implement a drag-and-drop file uploader with preview?",
      "Design a form builder application where users can create custom forms.",
      "How would you optimize a React app that re-renders too often?",
      "Build a responsive navigation bar that works on all devices."
    ]
  },
  'Backend Developer': {
    technical: [
      "Explain the difference between SQL and NoSQL databases. When would you choose each?",
      "What are ACID properties? Why are they important for databases?",
      "Explain RESTful API design principles. What makes a good API?",
      "What is database indexing? How does it improve query performance?",
      "Explain the difference between authentication and authorization.",
      "What is the difference between synchronous and asynchronous programming?",
      "Explain the concept of idempotency in APIs."
    ],
    behavioral: [
      "Describe a time you optimized a slow database query. What was the impact?",
      "How do you handle API versioning in your projects?",
      "Tell me about a challenging integration project you worked on.",
      "How do you ensure API security? What measures do you implement?",
      "Describe your experience with microservices vs monolithic architecture.",
      "Tell me about a time you had to handle a data migration."
    ],
    scenario: [
      "Design an API rate limiter for a public API.",
      "How would you design a payment processing system?",
      "Design a system for processing millions of log entries per second.",
      "How would you implement a distributed caching system?",
      "Design a job queue system for background task processing.",
      "How would you handle database sharding for a growing application?"
    ]
  },
  'Full Stack Developer': {
    technical: [
      "Explain the complete flow from frontend request to database response.",
      "What are the differences between session-based and JWT authentication?",
      "Explain CORS and how to handle it in full-stack applications.",
      "What are web sockets and when would you use them over HTTP?",
      "Explain the concept of state management across frontend and backend.",
      "What is the difference between server-side rendering and client-side rendering?",
      "Explain the role of a reverse proxy in web applications."
    ],
    behavioral: [
      "Describe a full-stack feature you built from scratch. What was your approach?",
      "How do you decide what should be handled on client vs server?",
      "Tell me about a time you had to debug across the entire stack.",
      "How do you ensure data consistency between frontend and backend?",
      "Describe your experience with deployment and CI/CD pipelines.",
      "Tell me about a time you had to optimize a full-stack application."
    ],
    scenario: [
      "Design a real-time collaborative document editor like Google Docs.",
      "How would you build a social media feed with infinite scroll?",
      "Design an e-commerce platform with cart, checkout, and payment.",
      "How would you implement search functionality across millions of products?",
      "Design a task management app with real-time updates.",
      "How would you build a video streaming platform?"
    ]
  },
  'Data Analyst': {
    technical: [
      "Explain the difference between descriptive, predictive, and prescriptive analytics.",
      "What are SQL window functions? Provide an example use case.",
      "Explain the difference between INNER JOIN, LEFT JOIN, and FULL OUTER JOIN.",
      "What is data normalization? Explain 1NF, 2NF, and 3NF.",
      "Explain the difference between structured and unstructured data.",
      "What is the difference between correlation and causation?",
      "Explain the importance of data cleaning before analysis."
    ],
    behavioral: [
      "Describe a time you found an important insight from messy data.",
      "How do you communicate complex findings to non-technical stakeholders?",
      "Tell me about a time you had to clean and preprocess dirty data.",
      "How do you ensure data quality and accuracy in your analysis?",
      "Describe a project where you used data to drive business decisions.",
      "Tell me about a time your analysis prevented a potential issue."
    ],
    scenario: [
      "How would you analyze customer churn for a subscription business?",
      "Design a dashboard for tracking e-commerce KPIs.",
      "How would you detect anomalies in financial transaction data?",
      "Design an A/B testing framework for website changes.",
      "How would you forecast sales for the next quarter?",
      "How would you identify the most profitable customer segments?"
    ]
  },
  'AI/ML Engineer': {
    technical: [
      "Explain the difference between supervised, unsupervised, and reinforcement learning.",
      "What is overfitting and how do you prevent it?",
      "Explain the bias-variance tradeoff in machine learning.",
      "What are precision, recall, and F1 score? When would you prioritize each?",
      "Explain the difference between L1 and L2 regularization.",
      "What is gradient descent and how does it work?",
      "Explain the concept of transfer learning."
    ],
    behavioral: [
      "Describe a machine learning project you deployed to production.",
      "How do you handle imbalanced datasets?",
      "Tell me about a time your model performed poorly in production. How did you fix it?",
      "How do you choose which algorithm to use for a given problem?",
      "Describe your experience with feature engineering.",
      "Tell me about a time you had to explain ML concepts to non-technical stakeholders."
    ],
    scenario: [
      "Design a recommendation system for an e-commerce platform.",
      "How would you build a spam detection system for emails?",
      "Design a fraud detection system for credit card transactions.",
      "How would you implement image classification for product categorization?",
      "Design a sentiment analysis system for customer reviews.",
      "How would you build a chatbot for customer support?"
    ]
  },
  'DevOps Engineer': {
    technical: [
      "Explain CI/CD pipeline stages and best practices.",
      "What are containers and how do they differ from virtual machines?",
      "Explain Infrastructure as Code. What tools have you used?",
      "What is Kubernetes and how does it orchestrate containers?",
      "Explain blue-green deployment vs canary deployment.",
      "What is the difference between continuous delivery and continuous deployment?",
      "Explain the concept of immutable infrastructure."
    ],
    behavioral: [
      "Describe a time you automated a manual deployment process.",
      "How do you handle rollbacks in production?",
      "Tell me about a time you improved system reliability.",
      "How do you monitor system health and set up alerts?",
      "Describe your experience with cloud providers (AWS/Azure/GCP).",
      "Tell me about a time you handled a production outage."
    ],
    scenario: [
      "Design a scalable microservices deployment architecture.",
      "How would you set up monitoring and logging for 100+ services?",
      "Design a disaster recovery plan for a critical application.",
      "How would you handle zero-downtime database migrations?",
      "Design a multi-region deployment strategy.",
      "How would you implement auto-scaling for a web application?"
    ]
  },
  'default': {
    technical: [
      "Explain a recent technical challenge you solved and how you approached it.",
      "What programming languages are you most proficient in and why?",
      "Explain a concept from computer science that you find fascinating.",
      "How do you stay updated with new technologies?",
      "Describe your experience with version control systems like Git.",
      "What is your approach to learning new programming languages or frameworks?",
      "Explain how you would debug a complex issue in production."
    ],
    behavioral: [
      "Tell me about yourself and your professional journey.",
      "Why are you interested in this role?",
      "Describe a time you worked effectively in a team.",
      "How do you handle feedback and criticism?",
      "What are your career goals for the next 3-5 years?",
      "Tell me about a time you showed initiative at work.",
      "How do you balance multiple priorities and deadlines?"
    ],
    scenario: [
      "How would you approach learning a completely new technology?",
      "Describe how you would debug a production issue.",
      "How would you handle a missed deadline?",
      "Design a small application from requirements to deployment.",
      "How would you prioritize multiple competing tasks?",
      "How would you convince your team to adopt a new technology?",
      "Describe how you would handle a conflict with a teammate."
    ]
  }
};

// Helper function to extract keywords from question
function extractKeywordsFromQuestion(question) {
  const commonKeywords = {
    'explain': ['explanation', 'understanding', 'concept'],
    'difference': ['comparison', 'distinction', 'contrast'],
    'design': ['architecture', 'components', 'scalability', 'design'],
    'optimize': ['performance', 'efficiency', 'optimization'],
    'debug': ['debugging', 'troubleshooting', 'issues'],
    'implement': ['implementation', 'code', 'solution'],
    'describe': ['description', 'experience', 'example'],
    'compare': ['comparison', 'similarities', 'differences'],
    'what': ['definition', 'concept', 'understanding'],
    'how': ['process', 'steps', 'methodology']
  };
  
  const lowerQuestion = question.toLowerCase();
  const keywords = new Set();
  
  for (const [key, values] of Object.entries(commonKeywords)) {
    if (lowerQuestion.includes(key)) {
      values.forEach(v => keywords.add(v));
    }
  }
  
  // Add role-specific keywords based on question content
  if (lowerQuestion.includes('react') || lowerQuestion.includes('frontend') || lowerQuestion.includes('css')) {
    keywords.add('frontend');
    keywords.add('javascript');
  }
  if (lowerQuestion.includes('database') || lowerQuestion.includes('sql') || lowerQuestion.includes('nosql')) {
    keywords.add('database');
    keywords.add('query');
    keywords.add('data');
  }
  if (lowerQuestion.includes('api') || lowerQuestion.includes('rest') || lowerQuestion.includes('endpoint')) {
    keywords.add('api');
    keywords.add('endpoint');
    keywords.add('integration');
  }
  if (lowerQuestion.includes('system') || lowerQuestion.includes('architecture') || lowerQuestion.includes('scale')) {
    keywords.add('architecture');
    keywords.add('design');
    keywords.add('scalability');
  }
  if (lowerQuestion.includes('machine') || lowerQuestion.includes('ml') || lowerQuestion.includes('model')) {
    keywords.add('machine learning');
    keywords.add('algorithm');
    keywords.add('data science');
  }
  if (lowerQuestion.includes('devops') || lowerQuestion.includes('ci/cd') || lowerQuestion.includes('deployment')) {
    keywords.add('devops');
    keywords.add('automation');
    keywords.add('deployment');
  }
  
  return keywords.size > 0 ? Array.from(keywords) : ['relevant details', 'examples', 'clear explanation', 'structured answer'];
}

// ============ MOCK FUNCTIONS ============

async function mockAnalyzeResume(resumeText) {
  console.log('📄 [MOCK] Analyzing resume...');
  return {
    skills: ["JavaScript", "React", "Node.js", "Python", "SQL", "Git", "TypeScript"],
    projects: [
      { name: "E-commerce Platform", technologies: ["React", "Node.js", "MongoDB"] },
      { name: "Portfolio Website", technologies: ["HTML", "CSS", "JavaScript"] },
      { name: "Task Management App", technologies: ["React", "Firebase"] }
    ],
    workExperience: "2-3 years of full-stack development",
    achievements: [
      "Led a team of 3 developers",
      "Improved application performance by 40%",
      "Reduced bug rate by 25%"
    ],
    education: "Bachelor's in Computer Science"
  };
}

async function mockAnalyzeJobDescription(jdText) {
  console.log('📋 [MOCK] Analyzing job description...');
  return {
    requiredSkills: ["JavaScript", "React", "Node.js", "System Design", "SQL"],
    preferredSkills: ["TypeScript", "AWS", "Docker"],
    responsibilities: [
      "Build scalable web applications",
      "Write clean, maintainable code",
      "Collaborate with cross-functional teams",
      "Participate in code reviews"
    ],
    experienceRequired: "2+ years of software development",
    qualifications: "Bachelor's degree in CS or equivalent"
  };
}

// Updated generate question function with role-specific questions
async function mockGenerateQuestion(session, previousEvaluation) {
  const questionCount = session.questionCount || 0;
  const role = session.role || 'default';
  
  console.log(`❓ [MOCK] Generating ${role} question #${questionCount + 1}...`);
  
  // Get questions for the specific role, fallback to default
  const roleQuestions = roleSpecificQuestions[role] || roleSpecificQuestions['default'];
  
  // Determine question type based on count (cycle through technical, behavioral, scenario)
  const types = ['technical', 'behavioral', 'scenario'];
  const currentType = types[questionCount % types.length];
  
  // Get questions of the current type
  const questionsOfType = roleQuestions[currentType] || roleQuestions.technical;
  
  // Select question based on count within that type
  const questionIndex = (Math.floor(questionCount / types.length)) % questionsOfType.length;
  const selectedQuestion = questionsOfType[questionIndex];
  
  // Extract keywords from the question for evaluation
  const keywords = extractKeywordsFromQuestion(selectedQuestion);
  
  // Adjust difficulty based on performance
  let difficulty = session.currentDifficulty || 'medium';
  if (previousEvaluation && session.difficulty === 'adaptive') {
    const prevScore = previousEvaluation.totalScore;
    if (prevScore > 75 && difficulty === 'medium') {
      difficulty = 'hard';
      session.currentDifficulty = 'hard';
      console.log('📈 Increasing difficulty to HARD');
    } else if (prevScore < 45 && difficulty === 'medium') {
      difficulty = 'easy';
      session.currentDifficulty = 'easy';
      console.log('📉 Decreasing difficulty to EASY');
    } else if (prevScore < 45 && difficulty === 'hard') {
      difficulty = 'medium';
      session.currentDifficulty = 'medium';
      console.log('📊 Adjusting difficulty to MEDIUM');
    }
  }
  
  return {
    type: currentType,
    question: selectedQuestion,
    expectedKeywords: keywords,
    difficulty: difficulty
  };
}

async function mockEvaluateAnswer(question, answer, session) {
  console.log('📊 [MOCK] Evaluating answer...');
  
  const keywords = question.expectedKeywords || [];
  const matchedKeywords = keywords.filter(kw => 
    answer.toLowerCase().includes(kw.toLowerCase())
  );
  
  const matchCount = matchedKeywords.length;
  const totalKeywords = keywords.length;
  const matchPercentage = totalKeywords > 0 ? (matchCount / totalKeywords) * 100 : 50;
  
  const wordCount = answer.split(' ').length;
  const isTooShort = wordCount < 20;
  const isTooLong = wordCount > 150;
  const hasStructure = answer.includes('first') || answer.includes('second') || 
                       answer.includes('finally') || answer.includes('steps') ||
                       answer.includes('lastly');
  
  let accuracy = Math.min(10, Math.max(0, Math.floor(matchPercentage / 10)));
  let clarity = hasStructure ? 8 : 6;
  let relevance = matchPercentage > 60 ? 9 : matchPercentage > 30 ? 6 : 4;
  let depth = wordCount > 50 ? 8 : wordCount > 25 ? 6 : 4;
  let communication = clarity;
  let timeEfficiency = isTooShort ? 4 : isTooLong ? 5 : 8;
  
  // Adjust based on question type
  if (question.type === 'technical') {
    accuracy = Math.min(10, accuracy + 1);
    depth = Math.min(10, depth + 1);
  } else if (question.type === 'behavioral') {
    clarity = Math.min(10, clarity + 1);
    communication = Math.min(10, communication + 1);
  }
  
  const totalScore = (accuracy + clarity + relevance + depth + communication + timeEfficiency) / 6;
  
  let feedback = '';
  let missingPoints = [];
  let suggestedImprovement = '';
  
  if (totalScore >= 8) {
    feedback = "Excellent answer! You demonstrated strong understanding and clear communication. Great job!";
    suggestedImprovement = "Keep up the great work! Consider adding more real-world examples from your experience.";
  } else if (totalScore >= 6) {
    feedback = "Good answer! You covered the main points well.";
    if (matchCount < totalKeywords) {
      missingPoints = keywords.filter(k => !answer.toLowerCase().includes(k.toLowerCase()));
      feedback += ` Consider mentioning: ${missingPoints.slice(0, 3).join(', ')}.`;
    }
    suggestedImprovement = "Structure your answers with clear examples using the STAR method.";
  } else if (totalScore >= 4) {
    feedback = "Decent attempt, but needs improvement.";
    missingPoints = keywords;
    feedback += ` Focus on including key concepts like: ${keywords.slice(0, 3).join(', ')}.`;
    suggestedImprovement = "Take time to understand the fundamentals first before answering.";
  } else {
    feedback = "Your answer needs significant improvement. Review the core concepts.";
    missingPoints = keywords;
    suggestedImprovement = "Review the topic from scratch and practice with sample answers.";
  }
  
  if (question.type === 'communication' && !hasStructure) {
    feedback += " Use a clear structure (introduction, body, conclusion) for better communication.";
  }
  
  return {
    scores: { accuracy, clarity, relevance, depth, communication, timeEfficiency },
    totalScore: Math.round(totalScore * 10),
    feedback: feedback,
    missingPoints: missingPoints,
    suggestedImprovement: suggestedImprovement,
    wordCount: wordCount,
    hasStructure: hasStructure,
    matchedKeywords: matchedKeywords
  };
}

async function mockGenerateFinalReport(session) {
  console.log('📈 [MOCK] Generating final report...');
  
  const answers = session.answers || [];
  const scores = answers.map(a => a.evaluation.totalScore);
  const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 65;
  
  const technicalScores = answers
    .filter(a => a.question?.type === 'technical')
    .map(a => a.evaluation.scores.accuracy);
  const behavioralScores = answers
    .filter(a => a.question?.type === 'behavioral')
    .map(a => a.evaluation.scores.communication);
  
  const categoryScores = {
    technical: technicalScores.length ? Math.round(technicalScores.reduce((a,b)=>a+b,0)/technicalScores.length * 10) : 65,
    communication: Math.round(avgScore),
    problemSolving: Math.round(avgScore + 5),
    behavioral: behavioralScores.length ? Math.round(behavioralScores.reduce((a,b)=>a+b,0)/behavioralScores.length * 10) : 65,
    timeManagement: 70,
    confidence: Math.round(avgScore - 5)
  };
  
  let readinessLevel = "Needs Improvement";
  let hiringReadiness = "Not Ready";
  
  if (avgScore >= 75) {
    readinessLevel = "Strong";
    hiringReadiness = "Ready";
  } else if (avgScore >= 55) {
    readinessLevel = "Average";
    hiringReadiness = "Partially Ready";
  }
  
  const weakAreas = [];
  if (categoryScores.technical < 60) weakAreas.push("Technical Fundamentals");
  if (categoryScores.communication < 60) weakAreas.push("Communication Skills");
  if (categoryScores.problemSolving < 60) weakAreas.push("Problem Solving");
  if (categoryScores.behavioral < 60) weakAreas.push("Behavioral Responses");
  
  return {
    overallScore: Math.round(avgScore),
    readinessScore: Math.round(avgScore),
    readinessLevel: readinessLevel,
    hiringReadiness: hiringReadiness,
    categoryScores: categoryScores,
    strengths: [
      answers.some(a => a.evaluation.totalScore > 70) ? "Good technical answers on key questions" : "Shows willingness to learn",
      "Completes interview questions thoroughly",
      "Basic understanding of core concepts"
    ],
    weaknesses: weakAreas.length ? weakAreas : ["Need more specific examples", "Work on answer structure", "Add more technical depth"],
    improvementPlan: weakAreas.map(area => `Improve ${area} through targeted practice and study`),
    actionableTips: [
      "Practice answering questions out loud daily for 15 minutes",
      "Use the STAR method for behavioral questions",
      "Review missed concepts from this interview",
      "Take our communication practice module to improve clarity",
      "Record yourself answering questions to identify areas for improvement"
    ],
    detailedFeedback: `You scored ${Math.round(avgScore)}/100 on this ${session.role || 'technical'} interview. ${readinessLevel} candidate. Focus on ${weakAreas.join(', ')} to improve your readiness for ${session.role || 'technical'} roles.`
  };
}

// ============ COMMUNICATION PRACTICE FUNCTION ============

export async function analyzeCommunication(answer, context = "general") {
  console.log('🎙️ [MOCK] Analyzing communication...');
  
  const wordCount = answer.split(' ').length;
  const sentenceCount = answer.split(/[.!?]+/).length;
  const avgWordsPerSentence = sentenceCount > 0 ? wordCount / sentenceCount : 0;
  
  const fillerWords = ['um', 'uh', 'like', 'you know', 'actually', 'basically', 'sort of', 'kind of', 'well', 'so'];
  const foundFillers = fillerWords.filter(fw => answer.toLowerCase().includes(fw));
  
  const hasStructure = /first|second|third|finally|in conclusion|to summarize|on the other hand|lastly/i.test(answer);
  const hasExamples = /for example|for instance|such as|like|specifically|to illustrate/i.test(answer);
  
  let score = 70;
  let feedback = [];
  let improvements = [];
  
  if (wordCount < 30) {
    score -= 15;
    feedback.push("❌ Your answer is too short. Aim for 45-90 seconds of speaking.");
    improvements.push("Practice expanding your answers with more details and examples.");
  } else if (wordCount > 200) {
    score -= 5;
    feedback.push("⚠️ Your answer is quite long. Try to be more concise.");
    improvements.push("Focus on key points and avoid rambling.");
  } else {
    feedback.push("✅ Good answer length! Keep it between 45-90 seconds.");
  }
  
  if (foundFillers.length > 0) {
    score -= foundFillers.length * 3;
    feedback.push(`❌ You used filler words: ${foundFillers.slice(0,3).join(', ')}. This can reduce confidence perception.`);
    improvements.push("Practice pausing instead of using filler words. Take a breath to think.");
  } else {
    feedback.push("✅ Excellent! No filler words detected - very professional.");
  }
  
  if (!hasStructure) {
    score -= 10;
    feedback.push("⚠️ Your answer lacks clear structure. Use frameworks like STAR or PREP.");
    improvements.push("Learn the STAR method: Situation, Task, Action, Result.");
  } else {
    feedback.push("✅ Good structure! Your answer is well-organized.");
  }
  
  if (!hasExamples) {
    score -= 10;
    feedback.push("⚠️ Add specific examples to make your answers more compelling.");
    improvements.push("Prepare 3-4 success stories from your experience before interviews.");
  } else {
    feedback.push("✅ Great use of examples! This makes your answer memorable.");
  }
  
  if (avgWordsPerSentence > 20) {
    score -= 5;
    feedback.push("⚠️ Your sentences are quite long. Shorter sentences are easier to follow.");
    improvements.push("Break complex ideas into multiple shorter sentences.");
  }
  
  const finalScore = Math.max(0, Math.min(100, score));
  
  let readiness = "Needs Practice";
  if (finalScore >= 80) readiness = "Interview Ready";
  else if (finalScore >= 60) readiness = "Getting There";
  
  return {
    score: finalScore,
    readiness: readiness,
    feedback: feedback,
    improvements: improvements,
    metrics: {
      wordCount: wordCount,
      fillerWordCount: foundFillers.length,
      hasStructure: hasStructure,
      hasExamples: hasExamples,
      avgWordsPerSentence: Math.round(avgWordsPerSentence)
    },
    improvementRoadmap: [
      "Day 1-3: Record yourself answering common questions",
      "Day 4-6: Practice eliminating filler words",
      "Day 7-10: Master the STAR method",
      "Day 11-14: Full mock interviews with feedback"
    ]
  };
}

// ============ REAL OPENAI FUNCTIONS (Placeholders - using mock for now) ============

async function realAnalyzeResume(resumeText) {
  return mockAnalyzeResume(resumeText);
}

async function realAnalyzeJobDescription(jdText) {
  return mockAnalyzeJobDescription(jdText);
}

async function realGenerateQuestion(session, previousEvaluation) {
  return mockGenerateQuestion(session, previousEvaluation);
}

async function realEvaluateAnswer(question, answer, session) {
  return mockEvaluateAnswer(question, answer, session);
}

async function realGenerateFinalReport(session) {
  return mockGenerateFinalReport(session);
}

// ============ EXPORTS ============

export const analyzeResume = USE_MOCK ? mockAnalyzeResume : realAnalyzeResume;
export const analyzeJobDescription = USE_MOCK ? mockAnalyzeJobDescription : realAnalyzeJobDescription;
export const generateQuestion = USE_MOCK ? mockGenerateQuestion : realGenerateQuestion;
export const evaluateAnswer = USE_MOCK ? mockEvaluateAnswer : realEvaluateAnswer;
export const generateFinalReport = USE_MOCK ? mockGenerateFinalReport : realGenerateFinalReport;