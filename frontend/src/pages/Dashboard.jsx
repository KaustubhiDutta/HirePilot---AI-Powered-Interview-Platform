import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, Navigate } from 'react-router-dom';
import { 
  Mic, 
  Brain, 
  History, 
  User, 
  Play, 
  TrendingUp, 
  Award, 
  Clock, 
  FileText, 
  LogOut,
  BarChart3,
  Target,
  Zap,
  ChevronRight,
  Calendar,
  Star
} from 'lucide-react';

export default function Dashboard() {
  const { user, loading, isTransitioning, logout } = useAuth();
  const [stats, setStats] = useState({
    interviewsCompleted: 3,
    averageScore: 78,
    improvementRate: "+12%",
    practiceMinutes: 45
  });
  const [recentReports, setRecentReports] = useState([
    { id: 1, date: '2024-06-01', role: 'Frontend Developer', score: 82 },
    { id: 2, date: '2024-05-28', role: 'Full Stack Developer', score: 68 },
    { id: 3, date: '2024-05-25', role: 'Software Engineer', score: 45 }
  ]);

  // Show loading while checking auth or during transition
  if (loading || isTransitioning) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            {/* Outer ring */}
            <div className="w-24 h-24 rounded-full border-4 border-primary/20 animate-pulse"></div>
            {/* Spinning loader */}
            <div className="absolute top-0 left-0 w-24 h-24 rounded-full border-4 border-t-primary border-r-secondary border-b-primary border-l-transparent animate-spin"></div>
            {/* Inner icon */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Brain className="w-8 h-8 text-primary animate-pulse" />
            </div>
          </div>
          <p className="text-white text-lg font-semibold mt-6 animate-pulse">Loading your dashboard...</p>
          <p className="text-gray-400 text-sm mt-2">Please wait</p>
          {/* Progress dots */}
          <div className="flex justify-center gap-2 mt-4">
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  const getScoreColor = (score) => {
    if (score >= 75) return 'text-green-500';
    if (score >= 55) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome back, {user?.displayName || user?.email?.split('@')[0] || 'Candidate'}! 👋
              </h1>
              <p className="text-gray-400">Ready to ace your next interview? Let's practice!</p>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-primary/50 transition">
            <div className="flex items-center gap-2 text-primary mb-2">
              <Play className="w-4 h-4" />
              <span className="text-xs">Completed</span>
            </div>
            <div className="text-2xl font-bold text-white">{stats.interviewsCompleted}</div>
            <div className="text-xs text-gray-500">Mock Interviews</div>
          </div>
          
          <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-primary/50 transition">
            <div className="flex items-center gap-2 text-primary mb-2">
              <Award className="w-4 h-4" />
              <span className="text-xs">Avg. Score</span>
            </div>
            <div className="text-2xl font-bold text-white">{stats.averageScore}</div>
            <div className="text-xs text-gray-500">Out of 100</div>
          </div>
          
          <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-primary/50 transition">
            <div className="flex items-center gap-2 text-primary mb-2">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs">Improvement</span>
            </div>
            <div className="text-2xl font-bold text-green-500">{stats.improvementRate}</div>
            <div className="text-xs text-gray-500">Last 30 days</div>
          </div>
          
          <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-primary/50 transition">
            <div className="flex items-center gap-2 text-primary mb-2">
              <Clock className="w-4 h-4" />
              <span className="text-xs">Practice Time</span>
            </div>
            <div className="text-2xl font-bold text-white">{stats.practiceMinutes}</div>
            <div className="text-xs text-gray-500">Minutes this week</div>
          </div>
        </div>

        {/* Main Action Cards */}
        <h2 className="text-xl font-semibold text-white mb-4">Practice Modules</h2>
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Link to="/configure" className="group bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl p-6 border border-white/10 hover:border-primary/50 transition-all hover:scale-[1.02]">
            <div className="flex items-start justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Start New Interview</h3>
                <p className="text-gray-400 text-sm">Practice with AI interviewer</p>
              </div>
              <Play className="w-8 h-8 text-primary opacity-0 group-hover:opacity-100 transition" />
            </div>
            <div className="mt-4 flex gap-2">
              <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-gray-300">Technical</span>
              <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-gray-300">Behavioral</span>
              <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-gray-300">Scenario</span>
            </div>
          </Link>

          <Link to="/communication" className="group bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-primary/50 transition-all hover:scale-[1.02]">
            <div className="flex items-start justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                  <Mic className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Communication Practice</h3>
                <p className="text-gray-400 text-sm">Improve speaking skills with AI feedback</p>
              </div>
              <Mic className="w-8 h-8 text-primary opacity-0 group-hover:opacity-100 transition" />
            </div>
            <div className="mt-4 flex gap-2">
              <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-gray-300">Voice Analysis</span>
              <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-gray-300">Filler Words</span>
              <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-gray-300">STAR Method</span>
            </div>
          </Link>
        </div>

        {/* Recent Reports Section */}
        <h2 className="text-xl font-semibold text-white mb-4">Recent Reports</h2>
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <History className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-white">Previous Interviews</h3>
            </div>
            <div className="space-y-3">
              {recentReports.map((report) => (
                <Link 
                  key={report.id}
                  to={`/report/${report.id}`}
                  className="flex justify-between items-center p-3 bg-white/5 rounded-lg hover:bg-white/10 transition group"
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-white">{report.role}</p>
                      <p className="text-xs text-gray-500">{report.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold ${getScoreColor(report.score)}`}>
                      {report.score}/100
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-primary transition" />
                  </div>
                </Link>
              ))}
            </div>
            <Link 
              to="/reports"
              className="mt-4 text-primary text-sm flex items-center gap-1 hover:gap-2 transition-all"
            >
              View All Reports →
            </Link>
          </div>

          {/* Profile Card */}
          <Link to="/profile" className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-primary/50 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-white">Profile</h3>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Email</span>
                <span className="text-white text-sm">{user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Member Since</span>
                <span className="text-white text-sm">
                  {new Date(user?.metadata?.creationTime).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Interviews Taken</span>
                <span className="text-white text-sm">{stats.interviewsCompleted}</span>
              </div>
            </div>
            <div className="text-primary text-sm flex items-center gap-1">
              Edit Profile →
            </div>
          </Link>
        </div>

        {/* Skill Progress Section */}
        <h2 className="text-xl font-semibold text-white mb-4">Skill Progress</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-white">Technical Skills</h3>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">JavaScript/React</span>
                  <span className="text-primary">78%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">System Design</span>
                  <span className="text-yellow-500">45%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Algorithms</span>
                  <span className="text-green-500">82%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '82%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-white">Soft Skills</h3>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Communication</span>
                  <span className="text-green-500">85%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Problem Solving</span>
                  <span className="text-primary">72%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '72%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Leadership</span>
                  <span className="text-yellow-500">58%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '58%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-white">Next Milestone</h3>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">5</div>
              <p className="text-gray-400 text-sm">more interviews to reach</p>
              <div className="text-xl font-bold text-white mt-2">Expert Level</div>
              <div className="mt-4 w-full bg-white/10 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
              <p className="text-gray-500 text-xs mt-2">3/8 interviews completed</p>
            </div>
          </div>
        </div>

        {/* Areas to Improve Section */}
        <div className="mt-8 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-2xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-3">📊 Focus Areas for Improvement</h3>
          <div className="flex flex-wrap gap-3">
            <span className="px-3 py-1.5 rounded-full bg-white/10 text-gray-300 text-sm">System Design</span>
            <span className="px-3 py-1.5 rounded-full bg-white/10 text-gray-300 text-sm">Database Optimization</span>
            <span className="px-3 py-1.5 rounded-full bg-white/10 text-gray-300 text-sm">STAR Method Responses</span>
            <span className="px-3 py-1.5 rounded-full bg-white/10 text-gray-300 text-sm">Communication Clarity</span>
          </div>
          <p className="text-gray-500 text-xs mt-3">Based on your previous mock interviews</p>
        </div>
      </div>
    </div>
  );
}