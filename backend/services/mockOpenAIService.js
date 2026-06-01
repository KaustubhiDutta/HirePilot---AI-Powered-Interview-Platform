// Mock AI service for hackathon demos
export async function analyzeResume(resumeText) {
  return {
    skills: ["JavaScript", "React", "Node.js", "Python", "SQL"],
    projects: [
      { name: "E-commerce App", technologies: ["React", "Node.js", "MongoDB"] },
      { name: "Portfolio Website", technologies: ["HTML", "CSS", "JavaScript"] }
    ],
    experience: "2-3 years",
    achievements: ["Led a team of 3 developers", "Improved performance by 40%"]
  };
}

export async function analyzeJobDescription(jdText) {
  return {
    requiredSkills: ["JavaScript", "React", "Node.js", "System Design"],
    preferredSkills: ["TypeScript", "AWS"],
    responsibilities: ["Build web applications", "Write clean code"],
    experienceRequired: "2+ years"
  };
}

export async function generateQuestion(session, previousEvaluation) {
  const questions = [
    {
      type: "technical",
      question: "Explain the difference between let, const, and var in JavaScript.",
      expectedKeywords: ["block scope", "hoisting", "reassignment"]
    },
    {
      type: "technical",
      question: "How would you optimize a React component that re-renders too often?",
      expectedKeywords: ["useMemo", "useCallback", "React.memo"]
    },
    {
      type: "behavioral",
      question: "Tell me about a challenging bug you fixed and how you solved it.",
      expectedKeywords: ["debugging", "problem-solving", "testing"]
    },
    {
      type: "scenario",
      question: "How would you design a URL shortening service like TinyURL?",
      expectedKeywords: ["database", "hashing", "scalability"]
    }
  ];
  
  const index = (session.questionCount || 0) % questions.length;
  return questions[index];
}

export async function evaluateAnswer(question, answer, session) {
  // Simple keyword matching for demo
  const keywordMatch = question.expectedKeywords?.filter(k => 
    answer.toLowerCase().includes(k.toLowerCase())
  ).length || 0;
  
  const score = Math.min(100, Math.max(40, 60 + keywordMatch * 10));
  
  return {
    scores: {
      accuracy: score / 10,
      clarity: 7,
      relevance: 8,
      depth: 6,
      communication: 7,
      timeEfficiency: 7
    },
    totalScore: score,
    feedback: keywordMatch > 0 
      ? `Good answer! You mentioned ${keywordMatch} key concepts.` 
      : "Your answer could be improved by including more specific technical details.",
    missingPoints: question.expectedKeywords?.filter(k => 
      !answer.toLowerCase().includes(k.toLowerCase())
    ) || [],
    suggestedImprovement: "Try to include more specific examples from your experience."
  };
}

export async function generateFinalReport(session) {
  const avgScore = session.answers.reduce((sum, a) => sum + a.evaluation.totalScore, 0) / session.answers.length;
  
  return {
    overallScore: Math.round(avgScore),
    categoryScores: {
      technical: 72,
      communication: 68,
      problemSolving: 75,
      behavioral: 70,
      timeManagement: 65,
      confidence: 70
    },
    strengths: [
      "Good communication skills",
      "Clear explanation of concepts",
      "Structured answers"
    ],
    weaknesses: [
      "Could provide more technical depth",
      "Missing specific examples",
      "Work on concise answers"
    ],
    improvementPlan: [
      "Review core JavaScript concepts",
      "Practice STAR method for behavioral questions",
      "Build a small project using best practices"
    ],
    hiringReadiness: avgScore > 70 ? "Ready" : avgScore > 50 ? "Partially Ready" : "Not Ready",
    detailedFeedback: "You showed good understanding of core concepts. Focus on providing more specific examples from your experience."
  };
}