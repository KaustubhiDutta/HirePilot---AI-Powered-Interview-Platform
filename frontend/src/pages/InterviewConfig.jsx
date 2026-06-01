import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Mic, Video, Clock, Briefcase, Award, Star, ChevronRight, Package, Plus, Upload, FileText, X, Sparkles, UserCheck } from 'lucide-react';

export default function InterviewConfig() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [role, setRole] = useState('');
  const [experience, setExperience] = useState('Intermediate');
  const [duration, setDuration] = useState('10');
  const [difficulty, setDifficulty] = useState('adaptive');
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [selectedInterviewer, setSelectedInterviewer] = useState('Tanya');
  const [loading, setLoading] = useState(false);
  const [practiceMode, setPracticeMode] = useState('detail');
  
  // Resume Based State
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [resumeUploaded, setResumeUploaded] = useState(false);
  
  // JD Based State
  const [jdFile, setJdFile] = useState(null);
  const [jdText, setJdText] = useState('');
  const [jdInputMethod, setJdInputMethod] = useState('upload');
  const [jdUploaded, setJdUploaded] = useState(false);

  const interviewers = [
    { name: 'Tanya', role: 'Senior Software Engineer', avatar: '👩‍💻', color: 'from-pink-500 to-rose-500', voice: 'female', description: 'Friendly & Detailed' },
    { name: 'Isha', role: 'Technical Recruiter', avatar: '👩‍💼', color: 'from-purple-500 to-indigo-500', voice: 'female', description: 'Professional & Thorough' },
    { name: 'Rohan', role: 'Engineering Manager', avatar: '👨‍💻', color: 'from-blue-500 to-cyan-500', voice: 'male', description: 'Challenging & Insightful' }
  ];

  const quickPacks = [
    { name: 'Backend Fundamentals', topics: ['APIs', 'Databases', 'Authentication', 'Caching', 'Security'], icon: '🔧' },
    { name: 'System Design Starter', topics: ['Load Balancing', 'Caching', 'Database Sharding', 'Microservices', 'Message Queues'], icon: '🏗️' },
    { name: 'Database Interview', topics: ['SQL', 'NoSQL', 'Indexing', 'Query Optimization', 'Transactions'], icon: '🗄️' },
    { name: 'Frontend Dev Pack', topics: ['React', 'State Management', 'Performance', 'Accessibility', 'Testing'], icon: '🎨' },
    { name: 'DevOps Essentials', topics: ['CI/CD', 'Docker', 'Kubernetes', 'Monitoring', 'Cloud'], icon: '⚙️' },
    { name: 'Machine Learning Pack', topics: ['ML Algorithms', 'Neural Networks', 'Data Processing', 'Model Deployment'], icon: '🤖' },
    { name: 'Cloud Computing', topics: ['AWS', 'Azure', 'GCP', 'Serverless', 'Infrastructure'], icon: '☁️' }
  ];

  const handleAddPack = (pack) => {
    const newTopics = [...selectedTopics, ...pack.topics];
    setSelectedTopics([...new Set(newTopics)]);
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeFile(file);
      setResumeUploaded(true);
      setResumeText(file.name);
    }
  };

  const handleJdUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setJdFile(file);
      setJdUploaded(true);
      setJdText(file.name);
    }
  };

  const removeResume = () => {
    setResumeFile(null);
    setResumeText('');
    setResumeUploaded(false);
  };

  const removeJd = () => {
    setJdFile(null);
    setJdText('');
    setJdUploaded(false);
  };

  const handleStartInterview = async () => {
    if (practiceMode === 'detail' && !role) {
      alert('Please enter your target role');
      return;
    }
    
    if (practiceMode === 'resume' && !resumeFile) {
      alert('Please upload your resume');
      return;
    }
    
    if (practiceMode === 'jd' && !jdFile && !jdText) {
      alert('Please upload a job description or enter JD details');
      return;
    }
    
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const formData = new FormData();
      
      formData.append('practiceMode', practiceMode);
      formData.append('role', role);
      formData.append('experience', experience);
      formData.append('duration', duration);
      formData.append('difficulty', difficulty);
      formData.append('interviewer', selectedInterviewer); // IMPORTANT: Send interviewer name
      formData.append('topics', JSON.stringify(selectedTopics));
      
      if (practiceMode === 'resume' && resumeFile) {
        formData.append('resume', resumeFile);
      }
      
      if (practiceMode === 'jd') {
        if (jdFile) {
          formData.append('jobDescription', jdFile);
        }
        if (jdText && jdInputMethod === 'text') {
          formData.append('jdText', jdText);
        }
      }
      
      console.log('Starting interview with interviewer:', selectedInterviewer);
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/interview/configure`,
        formData,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          } 
        }
      );
      navigate(`/interview/${response.data.sessionId}`);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to start interview. Please try again.');
    }
    setLoading(false);
  };

  const getSelectedInterviewerDetails = () => {
    return interviewers.find(i => i.name === selectedInterviewer) || interviewers[0];
  };

  return (
    <div className="min-h-screen bg-black py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            Interview Details
          </h1>
          <p className="text-gray-400">Your AI Interview Partner - Select topics to tailor your session</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Configuration Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Practice Mode Selector */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">Interview Mode</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'detail', label: 'Detail Based', icon: '📝', desc: 'Choose role & topics' },
                  { id: 'resume', label: 'Resume Based', icon: '📄', desc: 'Upload your resume' },
                  { id: 'jd', label: 'JD Based', icon: '🎯', desc: 'Upload or describe JD' }
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => {
                      setPracticeMode(mode.id);
                      setRole('');
                      setSelectedTopics([]);
                    }}
                    className={`py-4 rounded-xl font-medium transition text-center ${
                      practiceMode === mode.id 
                        ? 'bg-gradient-to-r from-primary to-secondary text-white' 
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    <div className="text-2xl mb-1">{mode.icon}</div>
                    <div className="font-semibold">{mode.label}</div>
                    <div className="text-xs opacity-80">{mode.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Detail Based Mode */}
            {practiceMode === 'detail' && (
              <>
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <label className="block text-gray-300 mb-2">Enter Domain *</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g., Software Engineer, Data Analyst, Product Manager"
                    className="w-full bg-black border border-white/20 rounded-xl p-3 text-white placeholder-gray-500 focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <label className="block text-gray-300 mb-2">Enter Topics (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g., React, Node.js, System Design"
                    className="w-full bg-black border border-white/20 rounded-xl p-3 text-white placeholder-gray-500 focus:border-primary focus:outline-none"
                  />
                  <p className="text-gray-500 text-xs mt-2">Select domain first or use Quick Practice Packs</p>
                </div>
              </>
            )}

            {/* Resume Based Mode */}
            {practiceMode === 'resume' && (
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <label className="block text-gray-300 mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  Upload Your Resume *
                </label>
                
                {!resumeUploaded ? (
                  <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-primary/50 transition cursor-pointer"
                       onClick={() => document.getElementById('resume-upload').click()}>
                    <Upload className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                    <p className="text-gray-400">Click to upload or drag and drop</p>
                    <p className="text-gray-500 text-xs mt-2">PDF or DOCX (Max 5MB)</p>
                    <input
                      id="resume-upload"
                      type="file"
                      accept=".pdf,.docx"
                      onChange={handleResumeUpload}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="bg-primary/10 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-8 h-8 text-primary" />
                      <div>
                        <p className="text-white text-sm font-medium">{resumeText}</p>
                        <p className="text-gray-400 text-xs">Resume uploaded successfully</p>
                      </div>
                    </div>
                    <button onClick={removeResume} className="p-1 hover:bg-white/10 rounded-lg transition">
                      <X className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* JD Based Mode */}
            {practiceMode === 'jd' && (
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <label className="block text-gray-300 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Job Description *
                </label>
                
                <div className="flex gap-3 mb-4">
                  <button
                    onClick={() => setJdInputMethod('upload')}
                    className={`flex-1 py-2 rounded-lg text-sm transition ${
                      jdInputMethod === 'upload' 
                        ? 'bg-primary text-white' 
                        : 'bg-white/10 text-gray-400 hover:bg-white/20'
                    }`}
                  >
                    📄 Upload File
                  </button>
                  <button
                    onClick={() => setJdInputMethod('text')}
                    className={`flex-1 py-2 rounded-lg text-sm transition ${
                      jdInputMethod === 'text' 
                        ? 'bg-primary text-white' 
                        : 'bg-white/10 text-gray-400 hover:bg-white/20'
                    }`}
                  >
                    ✏️ Paste Text
                  </button>
                </div>
                
                {jdInputMethod === 'upload' ? (
                  !jdUploaded ? (
                    <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-primary/50 transition cursor-pointer"
                         onClick={() => document.getElementById('jd-upload').click()}>
                      <Upload className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                      <p className="text-gray-400">Click to upload JD file</p>
                      <p className="text-gray-500 text-xs mt-2">PDF, DOCX, or TXT</p>
                      <input
                        id="jd-upload"
                        type="file"
                        accept=".pdf,.docx,.txt"
                        onChange={handleJdUpload}
                        className="hidden"
                      />
                    </div>
                  ) : (
                    <div className="bg-primary/10 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="w-8 h-8 text-primary" />
                        <div>
                          <p className="text-white text-sm font-medium">{jdText}</p>
                          <p className="text-gray-400 text-xs">JD uploaded successfully</p>
                        </div>
                      </div>
                      <button onClick={removeJd} className="p-1 hover:bg-white/10 rounded-lg transition">
                        <X className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                  )
                ) : (
                  <textarea
                    value={jdText}
                    onChange={(e) => setJdText(e.target.value)}
                    placeholder="Paste the job description here..."
                    className="w-full h-48 bg-black border border-white/20 rounded-xl p-4 text-white placeholder-gray-500 focus:border-primary focus:outline-none resize-none"
                  />
                )}
              </div>
            )}

            {/* Experience & Duration */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <label className="block text-gray-300 mb-3">Experience Level *</label>
                <div className="space-y-2">
                  {['Fresher', 'Intermediate', 'Experienced'].map((exp) => (
                    <button
                      key={exp}
                      onClick={() => setExperience(exp)}
                      className={`w-full py-2 rounded-lg text-left px-4 transition ${
                        experience === exp 
                          ? 'bg-primary/20 text-primary border border-primary/50' 
                          : 'text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      {exp}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <label className="block text-gray-300 mb-3">Interview Duration *</label>
                <div className="space-y-2">
                  {['5', '10', '15', '20'].map((dur) => (
                    <button
                      key={dur}
                      onClick={() => setDuration(dur)}
                      className={`w-full py-2 rounded-lg text-left px-4 transition ${
                        duration === dur 
                          ? 'bg-primary/20 text-primary border border-primary/50' 
                          : 'text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      {dur} minutes
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Interviewer Selection */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <label className="block text-gray-300 mb-4 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-primary" />
                Select Your AI Interviewer *
              </label>
              <div className="grid grid-cols-3 gap-4">
                {interviewers.map((interviewer) => (
                  <button
                    key={interviewer.name}
                    onClick={() => {
                      console.log('Selected interviewer:', interviewer.name);
                      setSelectedInterviewer(interviewer.name);
                    }}
                    className={`p-4 rounded-xl text-center transition-all duration-300 ${
                      selectedInterviewer === interviewer.name
                        ? `bg-gradient-to-r ${interviewer.color} text-white shadow-lg shadow-primary/20 scale-105`
                        : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:scale-102'
                    }`}
                  >
                    <div className="text-4xl mb-2">{interviewer.avatar}</div>
                    <div className="font-bold text-lg">{interviewer.name}</div>
                    <div className="text-xs mt-1 opacity-80">{interviewer.role}</div>
                    <div className="text-xs mt-1 opacity-70">
                      {interviewer.voice === 'female' ? '👩 Female Voice' : '👨 Male Voice'}
                    </div>
                    <div className="text-xs mt-1 text-primary/80">{interviewer.description}</div>
                  </button>
                ))}
              </div>
              <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                <p className="text-sm text-gray-300">
                  Selected: <span className="text-primary font-semibold">{selectedInterviewer}</span> - {getSelectedInterviewerDetails().description}
                </p>
              </div>
            </div>

            <button
              onClick={handleStartInterview}
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-lg hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Starting...' : `Start Interview with ${selectedInterviewer}`} <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Practice Packs - Sidebar */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-white">Quick Practice Packs</h3>
              </div>
              <p className="text-gray-400 text-sm mb-4">Add multiple curated topics instantly.</p>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {quickPacks.map((pack) => (
                  <div key={pack.name} className="bg-white/5 rounded-xl p-3 hover:bg-white/10 transition">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{pack.icon}</span>
                        <div>
                          <div className="text-white text-sm font-medium">{pack.name}</div>
                          <div className="text-gray-500 text-xs">{pack.topics.length} topics</div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleAddPack(pack)}
                        className="w-8 h-8 rounded-full bg-primary/20 hover:bg-primary/30 flex items-center justify-center transition"
                      >
                        <Plus className="w-4 h-4 text-primary" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Topics */}
            {selectedTopics.length > 0 && (
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-sm font-semibold text-white mb-3">Selected Topics ({selectedTopics.length})</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedTopics.map((topic, idx) => (
                    <span key={idx} className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}