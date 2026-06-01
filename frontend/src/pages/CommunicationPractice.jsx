import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Mic, MicOff, Send, Volume2, VolumeX, CheckCircle, XCircle, AlertCircle, TrendingUp, Clock, User, Sparkles } from 'lucide-react';

export default function CommunicationPractice() {
  const { user } = useAuth();
  const [answer, setAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [practiceTopic, setPracticeTopic] = useState('general');
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [transcriptHistory, setTranscriptHistory] = useState([]);
  
  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const topics = {
    general: {
      title: "General Introduction",
      questions: [
        "Tell me about yourself and your professional background.",
        "What are your greatest strengths and weaknesses?",
        "Why did you choose your career path?",
        "Where do you see yourself in 5 years?"
      ]
    },
    behavioral: {
      title: "Behavioral Questions",
      questions: [
        "Describe a challenging situation at work and how you handled it.",
        "Tell me about a time you demonstrated leadership.",
        "How do you handle conflict with team members?",
        "Describe a time you failed and what you learned from it."
      ]
    },
    technical: {
      title: "Technical Explanation",
      questions: [
        "Explain a complex technical concept in simple terms.",
        "Describe your most challenging technical project.",
        "How do you stay updated with new technologies?",
        "Walk me through your debugging process."
      ]
    },
    leadership: {
      title: "Leadership & Management",
      questions: [
        "Describe your leadership style with an example.",
        "How do you motivate underperforming team members?",
        "Tell me about a time you had to make a difficult decision.",
        "How do you handle competing priorities?"
      ]
    }
  };

  useEffect(() => {
    // Set first question by default
    setSelectedQuestion(topics[practiceTopic].questions[0]);
  }, [practiceTopic]);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = (event) => {
        let transcript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPart = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            transcript += transcriptPart + ' ';
          } else {
            interimTranscript += transcriptPart;
          }
        }
        
        if (transcript) {
          setAnswer(prev => {
            const newAnswer = prev + ' ' + transcript;
            return newAnswer.trim();
          });
        }
        
        // Show interim results in console for debugging
        if (interimTranscript) {
          console.log('Interim:', interimTranscript);
        }
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Recognition error:', event.error);
        if (event.error === 'no-speech') {
          alert('No speech detected. Please try again.');
        }
        setIsRecording(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      synthRef.current.cancel();
    };
  }, []);

  const speakQuestion = (text) => {
    if (synthRef.current.speaking) {
      synthRef.current.cancel();
    }
    
    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    synthRef.current.speak(utterance);
  };

  const startRecording = async () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }
    
    try {
      // Clear previous answer if starting new recording
      setAnswer('');
      setTranscriptHistory([]);
      
      // Reset recognition
      recognitionRef.current.stop();
      setTimeout(() => {
        recognitionRef.current.start();
        setIsRecording(true);
      }, 100);
      
      // Also capture audio for potential analysis
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorderRef.current.start();
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    
    setIsRecording(false);
  };

  const analyzeAnswer = async () => {
    if (!answer.trim()) {
      alert('Please provide an answer first. You can type or use the microphone.');
      return;
    }
    
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      
      // Add to transcript history
      setTranscriptHistory(prev => [
        ...prev,
        { question: selectedQuestion, answer: answer, timestamp: new Date() }
      ]);
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/communication/analyze`,
        { answer, context: practiceTopic },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setAnalysis(response.data);
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Failed to analyze. Please try again.');
    }
    setLoading(false);
  };

  const nextQuestion = () => {
    const questions = topics[practiceTopic].questions;
    const currentIndex = questions.indexOf(selectedQuestion);
    const nextIndex = (currentIndex + 1) % questions.length;
    setSelectedQuestion(questions[nextIndex]);
    setAnswer('');
    setAnalysis(null);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreEmoji = (score) => {
    if (score >= 80) return '🎉 Excellent! Interview Ready';
    if (score >= 60) return '👍 Good progress! Getting There';
    return '📚 Keep practicing! Needs Improvement';
  };

  return (
    <div className="min-h-screen bg-black py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-primary text-sm">AI-Powered Communication Coach</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            Communication Practice
          </h1>
          <p className="text-gray-400">Improve your speaking skills with AI-powered real-time feedback</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Panel - Topics & Questions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Topic Selector */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <label className="block text-gray-300 mb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                Practice Topic
              </label>
              <div className="space-y-2">
                {Object.keys(topics).map((topic) => (
                  <button
                    key={topic}
                    onClick={() => {
                      setPracticeTopic(topic);
                      setSelectedQuestion(topics[topic].questions[0]);
                      setAnswer('');
                      setAnalysis(null);
                    }}
                    className={`w-full py-3 rounded-xl text-left px-4 transition ${
                      practiceTopic === topic 
                        ? 'bg-gradient-to-r from-primary/20 to-secondary/20 text-primary border border-primary/50' 
                        : 'text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <div className="font-semibold">{topics[topic].title}</div>
                    <div className="text-xs text-gray-500 mt-1">{topics[topic].questions.length} questions</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Question Display */}
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6 border border-white/10">
              <p className="text-primary text-sm mb-3 flex items-center gap-2">
                <Volume2 className="w-3 h-3" />
                Current Question
              </p>
              <p className="text-white text-lg leading-relaxed">{selectedQuestion}</p>
              <button
                onClick={() => speakQuestion(selectedQuestion)}
                className="mt-4 text-gray-400 hover:text-white transition flex items-center gap-2 text-sm"
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                {isSpeaking ? 'Speaking...' : '🔊 Listen to Question'}
              </button>
            </div>

            {/* Transcript History */}
            {transcriptHistory.length > 0 && (
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-sm font-semibold text-white mb-3">Previous Answers</h3>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {transcriptHistory.slice().reverse().map((item, idx) => (
                    <div key={idx} className="p-2 bg-black/50 rounded-lg">
                      <p className="text-gray-400 text-xs mb-1">Q: {item.question?.substring(0, 60)}...</p>
                      <p className="text-gray-500 text-xs">A: {item.answer?.substring(0, 80)}...</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Answer & Feedback */}
          <div className="lg:col-span-2 space-y-6">
            {/* Answer Input */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <label className="block text-gray-300 mb-3">Your Answer</label>
              
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here or click 'Start Recording' to speak naturally..."
                className="w-full h-40 bg-black rounded-xl p-4 text-white border border-white/10 focus:border-primary focus:outline-none resize-none"
              />
              
              <div className="flex gap-3 mt-4">
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`flex-1 py-3 rounded-xl font-medium transition flex items-center justify-center gap-2 ${
                    isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  {isRecording ? 'Stop Recording' : 'Start Recording'}
                </button>
                
                <button
                  onClick={analyzeAnswer}
                  disabled={loading || !answer.trim()}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? 'Analyzing...' : <Send className="w-5 h-5" />}
                  {loading ? 'Analyzing...' : 'Get Feedback'}
                </button>
              </div>
              
              {isRecording && (
                <div className="mt-3 flex items-center justify-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <div className="w-2 h-4 rounded-full bg-red-500 animate-pulse delay-75" />
                  <div className="w-2 h-6 rounded-full bg-red-500 animate-pulse delay-150" />
                  <span className="text-sm text-gray-400 ml-2">Recording your answer... Speak clearly!</span>
                </div>
              )}
              
              <button
                onClick={nextQuestion}
                className="w-full mt-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition text-gray-400 text-sm"
              >
                Next Question →
              </button>
            </div>

            {/* Results */}
            {analysis && (
              <div className="space-y-6 animate-in slide-in-from-bottom duration-300">
                {/* Score Card */}
                <div className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl p-6 border border-white/10">
                  <div className="text-center">
                    <div className={`text-6xl font-bold mb-2 ${getScoreColor(analysis.score)}`}>
                      {analysis.score}/100
                    </div>
                    <div className={`text-lg mb-2 ${getScoreColor(analysis.score)}`}>
                      {getScoreEmoji(analysis.score)}
                    </div>
                    <div className="text-gray-400">Readiness: {analysis.readiness}</div>
                  </div>
                </div>
                
                {/* Detailed Feedback */}
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Detailed Feedback
                  </h3>
                  <div className="space-y-3">
                    {analysis.feedback?.map((fb, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-2 bg-black/30 rounded-lg">
                        {fb.includes('✅') ? (
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        ) : fb.includes('❌') ? (
                          <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        )}
                        <p className="text-gray-300 text-sm">{fb}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Metrics */}
                {analysis.metrics && (
                  <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      Key Metrics
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-black/50 rounded-lg">
                        <div className="text-2xl font-bold text-primary">{analysis.metrics.wordCount}</div>
                        <div className="text-xs text-gray-500">Words Spoken</div>
                      </div>
                      <div className="text-center p-3 bg-black/50 rounded-lg">
                        <div className="text-2xl font-bold text-primary">{analysis.metrics.fillerWordCount}</div>
                        <div className="text-xs text-gray-500">Filler Words</div>
                      </div>
                      <div className="text-center p-3 bg-black/50 rounded-lg">
                        <div className="text-2xl font-bold text-primary">{analysis.metrics.hasStructure ? '✓' : '✗'}</div>
                        <div className="text-xs text-gray-500">Clear Structure</div>
                      </div>
                      <div className="text-center p-3 bg-black/50 rounded-lg">
                        <div className="text-2xl font-bold text-primary">{analysis.metrics.hasExamples ? '✓' : '✗'}</div>
                        <div className="text-xs text-gray-500">Used Examples</div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Improvement Roadmap */}
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-4">🎯 Your Improvement Roadmap</h3>
                  <div className="space-y-4">
                    {analysis.improvements?.map((imp, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold flex-shrink-0">
                          {idx + 1}
                        </div>
                        <p className="text-gray-300">{imp}</p>
                      </div>
                    ))}
                  </div>
                  
                  {analysis.improvementRoadmap && (
                    <div className="mt-6 pt-4 border-t border-white/10">
                      <h4 className="text-primary font-semibold mb-3 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        14-Day Practice Plan
                      </h4>
                      <div className="grid gap-2">
                        {analysis.improvementRoadmap.map((item, idx) => (
                          <div key={idx} className="p-2 bg-black/50 rounded-lg text-gray-300 text-sm">
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}