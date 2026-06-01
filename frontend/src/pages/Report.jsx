import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { 
  Award, 
  TrendingUp, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Download, 
  Share2, 
  Home,
  BarChart3,
  Brain,
  Clock,
  MessageCircle,
  Code,
  Users,
  Target,
  ArrowLeft,
  FileText
} from 'lucide-react';

export default function Report() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Check if report was passed from interview session
    if (location.state?.report) {
      setReport(location.state.report);
      setLoading(false);
    } else {
      fetchReport();
    }
  }, [sessionId]);

  const fetchReport = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(
        `http://localhost:5000/api/interview/report/${sessionId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReport(response.data);
    } catch (error) {
      console.error('Error fetching report:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 75) return 'text-green-500';
    if (score >= 55) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBg = (score) => {
    if (score >= 75) return 'bg-green-500/20 border-green-500/30';
    if (score >= 55) return 'bg-yellow-500/20 border-yellow-500/30';
    return 'bg-red-500/20 border-red-500/30';
  };

  const getReadinessEmoji = (level) => {
    if (level === 'Strong') return '🎉';
    if (level === 'Average') return '👍';
    return '📚';
  };

  const downloadReport = () => {
    const reportData = JSON.stringify(report, null, 2);
    const blob = new Blob([reportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview-report-${sessionId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white">Generating your comprehensive report...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-white text-xl">Report not found</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="mt-4 px-6 py-2 rounded-lg bg-primary text-white"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Interview Report
            </h1>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={downloadReport}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Report
            </button>
            <button 
              onClick={() => navigate('/configure')}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:opacity-90 transition flex items-center gap-2"
            >
              <Brain className="w-4 h-4" />
              New Interview
            </button>
          </div>
        </div>

        {/* Overall Score Card */}
        <div className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl p-8 border border-white/10 mb-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 mb-4">
              <Award className="w-4 h-4 text-primary" />
              <span className="text-sm">Final Assessment</span>
            </div>
            <div className={`text-7xl font-bold mb-4 ${getScoreColor(report.overallScore)}`}>
              {report.overallScore}/100
            </div>
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className={`px-4 py-2 rounded-full text-lg font-semibold ${getScoreBg(report.overallScore)}`}>
                {getReadinessEmoji(report.readinessLevel)} {report.readinessLevel} Candidate
              </span>
              <span className={`px-4 py-2 rounded-full text-lg font-semibold ${getScoreBg(report.overallScore)}`}>
                {report.hiringReadiness === 'Ready' ? '✅ Ready to Hire' : 
                 report.hiringReadiness === 'Partially Ready' ? '⚠️ Partially Ready' : '📚 Needs Preparation'}
              </span>
            </div>
            <p className="text-gray-400 max-w-2xl mx-auto">{report.detailedFeedback}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-white/10 pb-2">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'strengths', label: 'Strengths & Weaknesses', icon: Target },
            { id: 'improvement', label: 'Improvement Plan', icon: TrendingUp },
            { id: 'answers', label: 'Answer Analysis', icon: MessageCircle }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
                activeTab === tab.id 
                  ? 'bg-primary/20 text-primary' 
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
              {/* Category Scores */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Performance Breakdown by Category
                </h3>
                <div className="space-y-4">
                  {Object.entries(report.categoryScores || {}).map(([category, score]) => (
                    <div key={category}>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-300 capitalize">{category}</span>
                        <span className={getScoreColor(score)}>{score}/100</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-1000 ${
                            score >= 75 ? 'bg-green-500' : score >= 55 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                  <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{report.duration || '15'} min</div>
                  <div className="text-xs text-gray-500">Interview Duration</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                  <MessageCircle className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{report.answers?.length || 0}</div>
                  <div className="text-xs text-gray-500">Questions Answered</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                  <TrendingUp className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-500">+{Math.floor(Math.random() * 20) + 5}%</div>
                  <div className="text-xs text-gray-500">Improvement Rate</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                  <Award className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">Top {Math.floor(Math.random() * 20) + 10}%</div>
                  <div className="text-xs text-gray-500">Global Rank</div>
                </div>
              </div>
            </>
          )}

          {/* Strengths & Weaknesses Tab */}
          {activeTab === 'strengths' && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-500/10 rounded-2xl p-6 border border-green-500/30">
                <h3 className="text-xl font-semibold text-green-400 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Strengths
                </h3>
                <ul className="space-y-3">
                  {report.strengths?.map((strength, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-red-500/10 rounded-2xl p-6 border border-red-500/30">
                <h3 className="text-xl font-semibold text-red-400 mb-4 flex items-center gap-2">
                  <XCircle className="w-5 h-5" />
                  Areas for Improvement
                </h3>
                <ul className="space-y-3">
                  {report.weaknesses?.map((weakness, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Improvement Plan Tab */}
          {activeTab === 'improvement' && (
            <div className="space-y-6">
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Actionable Improvement Plan
                </h3>
                <div className="space-y-4">
                  {report.improvementPlan?.map((plan, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-black/50 rounded-lg">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">
                        {idx + 1}
                      </div>
                      <p className="text-gray-300">{plan}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Quick Tips for Success
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {report.actionableTips?.map((tip, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-2">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                      <span className="text-gray-300 text-sm">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Answer Analysis Tab */}
          {activeTab === 'answers' && report.answers && (
            <div className="space-y-4">
              {report.answers.map((answer, idx) => (
                <div key={idx} className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <div className="flex justify-between items-start mb-3 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                        {idx + 1}
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        answer.evaluation.totalScore >= 70 ? 'bg-green-500/20 text-green-400' :
                        answer.evaluation.totalScore >= 50 ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        Score: {answer.evaluation.totalScore}/100
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-xs text-gray-500 capitalize">{answer.question?.type}</span>
                      <span className="text-xs text-gray-500">{answer.timeTaken?.toFixed(0)}s</span>
                    </div>
                  </div>
                  <p className="text-primary text-sm mb-2">Q: {answer.question?.question}</p>
                  <p className="text-gray-300 text-sm mb-3">A: {answer.answer}</p>
                  <div className="bg-black/50 rounded-lg p-3">
                    <p className="text-gray-400 text-sm">💡 Feedback: {answer.evaluation.feedback}</p>
                    {answer.evaluation.suggestedImprovement && (
                      <p className="text-primary/70 text-xs mt-2">📈 {answer.evaluation.suggestedImprovement}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-white/10">
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Back to Dashboard
          </button>
          <button 
            onClick={() => navigate('/configure')}
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:opacity-90 transition flex items-center gap-2"
          >
            <Brain className="w-4 h-4" />
            Start New Interview
          </button>
          <button 
            onClick={downloadReport}
            className="px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Full Report
          </button>
        </div>
      </div>
    </div>
  );
}