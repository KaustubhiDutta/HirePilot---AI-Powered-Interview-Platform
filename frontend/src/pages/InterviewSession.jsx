import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Mic, 
  MicOff, 
  Send, 
  Clock, 
  Volume2, 
  VolumeX, 
  Loader2, 
  AlertCircle,
  CheckCircle,
  XCircle,
  LogOut,
  AlertTriangle
} from 'lucide-react';

export default function InterviewSession() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [answer, setAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [evaluation, setEvaluation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [interviewer, setInterviewer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [transcriptHistory, setTranscriptHistory] = useState([]);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  
  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const timerRef = useRef(null);
  const videoRef = useRef(null);

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = synthRef.current.getVoices();
      console.log('Available voices:', voices.map(v => ({ name: v.name, lang: v.lang })));
      setVoicesLoaded(true);
    };
    
    synthRef.current.onvoiceschanged = loadVoices;
    loadVoices();
    
    setTimeout(loadVoices, 500);
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (recognitionRef.current) recognitionRef.current.stop();
      synthRef.current.cancel();
    };
  }, []);

  // Get voice based on interviewer gender
  const getVoiceForInterviewer = () => {
    const voices = synthRef.current.getVoices();
    
    if (!interviewer) return null;
    
    console.log(`Getting voice for ${interviewer.name} (${interviewer.voice})`);
    
    if (interviewer.voice === 'female') {
      const femaleVoiceNames = [
        'Google UK English Female',
        'Samantha',
        'Microsoft Zira',
        'Google US English Female',
        'Karen',
        'Moira',
        'Rishi'
      ];
      
      for (const voiceName of femaleVoiceNames) {
        const voice = voices.find(v => v.name === voiceName);
        if (voice) {
          console.log(`Found female voice: ${voice.name}`);
          return voice;
        }
      }
      
      const femaleVoice = voices.find(v => 
        v.name.toLowerCase().includes('female') || 
        v.name.toLowerCase().includes('samantha') ||
        v.name.toLowerCase().includes('zira')
      );
      if (femaleVoice) {
        console.log(`Found female voice (partial): ${femaleVoice.name}`);
        return femaleVoice;
      }
    } else {
      const maleVoiceNames = [
        'Google UK English Male',
        'Microsoft David',
        'Microsoft Mark',
        'Google US English Male',
        'Daniel',
        'Fred'
      ];
      
      for (const voiceName of maleVoiceNames) {
        const voice = voices.find(v => v.name === voiceName);
        if (voice) {
          console.log(`Found male voice: ${voice.name}`);
          return voice;
        }
      }
      
      const maleVoice = voices.find(v => 
        v.name.toLowerCase().includes('male') ||
        v.name.toLowerCase().includes('david') ||
        v.name.toLowerCase().includes('mark')
      );
      if (maleVoice) {
        console.log(`Found male voice (partial): ${maleVoice.name}`);
        return maleVoice;
      }
    }
    
    console.log('Using default English voice');
    return voices.find(v => v.lang === 'en-US');
  };

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.maxAlternatives = 1;
      
      recognitionRef.current.onresult = (event) => {
        let transcript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPart = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            transcript += transcriptPart + ' ';
          }
        }
        
        if (transcript) {
          setAnswer(prev => {
            const newAnswer = prev + ' ' + transcript;
            return newAnswer.trim();
          });
        }
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Recognition error:', event.error);
        if (event.error === 'no-speech') {
          setIsRecording(false);
        }
      };
      
      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
    
    startInterview();
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (recognitionRef.current) recognitionRef.current.stop();
      synthRef.current.cancel();
    };
  }, []);

  const startInterview = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(
        `http://localhost:5000/api/interview/start/${sessionId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log('Interview started:', response.data);
      
      setCurrentQuestion(response.data.question);
      setQuestionNumber(response.data.questionNumber);
      
      if (response.data.interviewer) {
        setInterviewer(response.data.interviewer);
        console.log('🎤 Interviewer set to:', response.data.interviewer.name);
        console.log('🎙️ Voice type:', response.data.interviewer.voice);
      } else {
        setInterviewer({
          name: 'Tanya',
          role: 'Senior Software Engineer',
          avatar: '👩‍💻',
          voice: 'female',
          description: 'Friendly & Detailed'
        });
      }
      
      setTimeLeft(response.data.duration * 60);
      setIsLoading(false);
      
      setTimeout(() => {
        if (response.data.question) {
          speakQuestion(response.data.question.question);
        }
      }, 1000);
      startTimer();
    } catch (error) {
      console.error('Error starting interview:', error);
      setIsLoading(false);
      alert('Failed to start interview. Please try again.');
    }
  };

  const speakQuestion = (text) => {
    if (synthRef.current.speaking) {
      synthRef.current.cancel();
    }
    
    setIsSpeaking(true);
    
    if (videoRef.current) {
      videoRef.current.classList.add('speaking-avatar');
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.classList.remove('speaking-avatar');
        }
      }, 1000);
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    if (voicesLoaded) {
      const voice = getVoiceForInterviewer();
      if (voice) {
        utterance.voice = voice;
      }
    }
    
    if (interviewer?.voice === 'female') {
      utterance.pitch = 1.2;
      utterance.rate = 0.95;
    } else {
      utterance.pitch = 0.85;
      utterance.rate = 0.95;
    }
    
    utterance.volume = 1;
    utterance.lang = 'en-US';
    
    utterance.onstart = () => {
      console.log(`${interviewer?.name} is speaking...`);
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    
    utterance.onerror = (event) => {
      console.error('Speech error:', event);
      setIsSpeaking(false);
    };
    
    synthRef.current.speak(utterance);
  };

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          if (!isSubmitting) {
            submitAnswer();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startRecording = async () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }
    
    try {
      setAnswer('');
      recognitionRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  const submitAnswer = async () => {
    if (isSubmitting) return;
    
    if (timerRef.current) clearInterval(timerRef.current);
    stopRecording();
    
    const finalAnswer = answer.trim() || "I don't have an answer for this question right now.";
    
    setTranscriptHistory(prev => [
      ...prev,
      { question: currentQuestion?.question, answer: finalAnswer, timestamp: new Date() }
    ]);
    
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(
        `http://localhost:5000/api/interview/answer/${sessionId}`,
        { answer: finalAnswer, timeSpent: 60 - timeLeft },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.interviewComplete) {
        navigate(`/report/${sessionId}`, { 
          state: { 
            report: response.data.report,
            earlyTermination: response.data.earlyTermination || false
          } 
        });
      } else {
        if (response.data.evaluation) {
          setEvaluation(response.data.evaluation);
          setShowFeedback(true);
          setTimeout(() => {
            setShowFeedback(false);
          }, 4000);
        }
        
        setCurrentQuestion(response.data.question);
        setQuestionNumber(response.data.questionNumber);
        setAnswer('');
        setTimeLeft(60);
        
        setTimeout(() => speakQuestion(response.data.question.question), 500);
        startTimer();
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      alert('Failed to submit answer. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const skipQuestion = () => {
    if (window.confirm('Are you sure you want to skip this question?')) {
      submitAnswer();
    }
  };

  const leaveInterview = () => {
    if (window.confirm('⚠️ Are you sure you want to leave this interview?\n\nYour progress will be saved and you can view the report later.')) {
      setIsLeaving(true);
      if (timerRef.current) clearInterval(timerRef.current);
      if (recognitionRef.current) recognitionRef.current.stop();
      synthRef.current.cancel();
      navigate('/dashboard');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (timeLeft < 10) return 'text-red-500 animate-pulse';
    if (timeLeft < 30) return 'text-yellow-500';
    return 'text-green-500';
  };

  if (isLoading || isLeaving) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <Loader2 className="w-20 h-20 text-primary animate-spin mx-auto mb-6" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-primary/20 animate-pulse"></div>
            </div>
          </div>
          <p className="text-white text-xl font-semibold mb-2">
            {isLeaving ? 'Leaving interview...' : 'Your AI Interviewer is getting ready...'}
          </p>
          <p className="text-gray-500">{isLeaving ? 'Redirecting to dashboard' : `${interviewer?.name || 'Tanya'} will be with you shortly`}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-b border-white/10 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm text-gray-400">AI Interview Active</span>
              </div>
              <div className="h-4 w-px bg-white/20" />
              <div className="text-primary font-semibold">
                Question {questionNumber}/15
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Clock className={`w-4 h-4 ${getTimerColor()}`} />
                <span className={`font-mono font-bold ${getTimerColor()}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
              
              {/* Leave Interview Button */}
              <button
                onClick={leaveInterview}
                className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition flex items-center gap-2 text-red-400 text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Leave</span>
              </button>
              
              <button
                onClick={() => currentQuestion && speakQuestion(currentQuestion.question)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
                disabled={isSpeaking}
              >
                {isSpeaking ? <VolumeX className="w-5 h-5 text-gray-400" /> : <Volume2 className="w-5 h-5 text-white" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-24 pb-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - AI Interviewer Avatar */}
            <div className="space-y-6">
              <div 
                ref={videoRef}
                className={`relative bg-gradient-to-br ${interviewer?.color || 'from-primary/20 to-secondary/20'} rounded-2xl p-8 border border-white/10 transition-all duration-300 ${
                  isSpeaking ? 'ring-2 ring-primary ring-opacity-50 shadow-lg shadow-primary/20' : ''
                }`}
              >
                {isSpeaking && (
                  <>
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                      <div className="voice-wave"></div>
                      <div className="voice-wave"></div>
                      <div className="voice-wave"></div>
                      <div className="voice-wave"></div>
                      <div className="voice-wave"></div>
                    </div>
                    <div className="absolute inset-0 rounded-2xl bg-primary/5 animate-pulse"></div>
                  </>
                )}
                
                <div className="text-center relative z-10">
                  <div className={`text-9xl mb-4 transition-transform duration-200 ${isSpeaking ? 'animate-bounce-slow' : ''}`}>
                    {interviewer?.avatar || '👩‍💻'}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">{interviewer?.name || 'AI Interviewer'}</h3>
                  <p className="text-gray-400 text-sm">{interviewer?.role || 'Senior Software Engineer'}</p>
                  
                  <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 text-xs">
                    {interviewer?.voice === 'female' ? '👩 Female Voice' : '👨 Male Voice'}
                  </div>
                  
                  <div className="mt-2 text-xs text-primary/70">
                    {interviewer?.description || 'Your AI Interview Partner'}
                  </div>
                  
                  <div className="mt-4 flex justify-center gap-2">
                    {isSpeaking ? (
                      <>
                        <span className="text-primary text-sm">Speaking...</span>
                        <div className="flex gap-0.5">
                          <span className="w-1 h-3 bg-primary rounded-full animate-pulse"></span>
                          <span className="w-1 h-4 bg-primary rounded-full animate-pulse delay-75"></span>
                          <span className="w-1 h-5 bg-primary rounded-full animate-pulse delay-150"></span>
                          <span className="w-1 h-4 bg-primary rounded-full animate-pulse delay-75"></span>
                          <span className="w-1 h-3 bg-primary rounded-full animate-pulse"></span>
                        </div>
                      </>
                    ) : (
                      <span className="text-gray-500 text-sm">Listening for your response...</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Current Question Display */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary text-sm font-bold">Q</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-primary text-sm mb-2">Current Question</p>
                    <p className="text-white text-lg leading-relaxed">{currentQuestion?.question}</p>
                    <button
                      onClick={() => currentQuestion && speakQuestion(currentQuestion.question)}
                      className="mt-4 text-gray-400 hover:text-white transition flex items-center gap-2 text-sm"
                    >
                      {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      {isSpeaking ? 'Speaking...' : '🔊 Replay Question'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Transcript History */}
              {transcriptHistory.length > 0 && (
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <h4 className="text-sm font-semibold text-white mb-3">Previous Answers</h4>
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {transcriptHistory.slice().reverse().slice(0, 3).map((item, idx) => (
                      <div key={idx} className="p-2 bg-black/50 rounded-lg">
                        <p className="text-gray-500 text-xs">Q{transcriptHistory.length - idx}: {item.question?.substring(0, 80)}...</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Answer Section */}
            <div className="space-y-6">
              {showFeedback && evaluation && (
                <div className="animate-slide-in-top">
                  <div className={`rounded-xl p-4 border ${
                    evaluation.totalScore >= 70 ? 'bg-green-500/10 border-green-500/30' :
                    evaluation.totalScore >= 50 ? 'bg-yellow-500/10 border-yellow-500/30' :
                    'bg-red-500/10 border-red-500/30'
                  }`}>
                    <div className="flex items-start gap-3">
                      {evaluation.totalScore >= 70 ? (
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      ) : evaluation.totalScore >= 50 ? (
                        <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                          <h4 className="font-semibold text-white">Answer Evaluation</h4>
                          <span className={`text-lg font-bold ${
                            evaluation.totalScore >= 70 ? 'text-green-500' :
                            evaluation.totalScore >= 50 ? 'text-yellow-500' : 'text-red-500'
                          }`}>
                            {Math.round(evaluation.totalScore)}/100
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm">{evaluation.feedback}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Answer Input Area */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <label className="block text-sm font-medium text-gray-400 mb-3">
                  Your Answer
                </label>
                
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type your answer here or use the microphone button to speak naturally..."
                  className="w-full h-40 bg-black rounded-xl p-4 text-white placeholder-gray-500 border border-white/10 focus:border-primary focus:outline-none resize-none"
                  disabled={isSubmitting}
                />
                
                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={isSubmitting}
                    className={`flex-1 py-3 rounded-xl font-medium transition flex items-center justify-center gap-2 ${
                      isRecording 
                        ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    {isRecording ? (
                      <>
                        <MicOff className="w-5 h-5" />
                        Stop Recording
                      </>
                    ) : (
                      <>
                        <Mic className="w-5 h-5" />
                        Start Recording
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={skipQuestion}
                    disabled={isSubmitting}
                    className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 transition font-medium"
                  >
                    Skip
                  </button>
                  
                  <button
                    onClick={submitAnswer}
                    disabled={isSubmitting || (!answer.trim() && !isRecording)}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Submit Answer
                      </>
                    )}
                  </button>
                </div>
                
                {isRecording && (
                  <div className="mt-4 flex items-center justify-center gap-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <div className="w-2 h-4 rounded-full bg-red-500 animate-pulse delay-75" />
                      <div className="w-2 h-6 rounded-full bg-red-500 animate-pulse delay-150" />
                      <div className="w-2 h-4 rounded-full bg-red-500 animate-pulse delay-75" />
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    </div>
                    <span className="text-sm text-gray-400">Recording your answer... Speak clearly!</span>
                  </div>
                )}
              </div>

              {/* Tips Card */}
              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-4 border border-white/10">
                <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-primary" />
                  Interview Tips
                </h4>
                <ul className="text-xs text-gray-400 space-y-1">
                  <li>• Be specific and provide examples from your experience</li>
                  <li>• Structure your answers using the STAR method</li>
                  <li>• Keep your answers concise but detailed - aim for 45-60 seconds</li>
                  <li>• If you don't know something, be honest and explain your approach</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Warning for unsupported browsers */}
      {!('webkitSpeechRecognition' in window) && (
        <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-3 backdrop-blur-sm z-50">
          <p className="text-yellow-300 text-xs text-center">
            ⚠️ Speech recognition is not fully supported in this browser. For the best experience, please use Chrome or Edge.
          </p>
        </div>
      )}
    </div>
  );
}