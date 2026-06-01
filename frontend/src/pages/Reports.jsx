import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, TrendingUp, Award, Calendar, ArrowRight, Star } from 'lucide-react';

export default function Reports() {
  const [reports, setReports] = useState([
    {
      id: 1,
      date: '2024-06-01',
      role: 'Frontend Developer',
      score: 82,
      readiness: 'Ready',
      strengths: ['React', 'JavaScript'],
      weaknesses: ['System Design']
    },
    {
      id: 2,
      date: '2024-05-28',
      role: 'Full Stack Developer',
      score: 68,
      readiness: 'Partially Ready',
      strengths: ['Node.js', 'MongoDB'],
      weaknesses: ['CSS', 'Algorithms']
    },
    {
      id: 3,
      date: '2024-05-25',
      role: 'Software Engineer',
      score: 45,
      readiness: 'Needs Improvement',
      strengths: ['Communication'],
      weaknesses: ['Data Structures', 'System Design']
    }
  ]);

  const getScoreColor = (score) => {
    if (score >= 75) return 'text-green-500';
    if (score >= 55) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getReadinessBadge = (readiness) => {
    const colors = {
      'Ready': 'bg-green-500/20 text-green-500',
      'Partially Ready': 'bg-yellow-500/20 text-yellow-500',
      'Needs Improvement': 'bg-red-500/20 text-red-500'
    };
    return colors[readiness] || 'bg-gray-500/20 text-gray-500';
  };

  const averageScore = reports.reduce((sum, r) => sum + r.score, 0) / reports.length;
  const bestScore = Math.max(...reports.map(r => r.score));
  const improvement = reports.length >= 2 ? reports[0].score - reports[reports.length - 1].score : 0;

  return (
    <div className="min-h-screen bg-black py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Your Interview Reports</h1>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-2 text-primary mb-2">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm">Average Score</span>
            </div>
            <div className="text-3xl font-bold text-white">{Math.round(averageScore)}/100</div>
          </div>
          
          <div className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-2 text-primary mb-2">
              <Award className="w-5 h-5" />
              <span className="text-sm">Best Score</span>
            </div>
            <div className="text-3xl font-bold text-white">{bestScore}/100</div>
          </div>
          
          <div className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-2 text-primary mb-2">
              <FileText className="w-5 h-5" />
              <span className="text-sm">Total Interviews</span>
            </div>
            <div className="text-3xl font-bold text-white">{reports.length}</div>
          </div>
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          {reports.map((report) => (
            <Link
              key={report.id}
              to={`/report/${report.id}`}
              className="block bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-primary/50 transition-all hover:scale-[1.01]"
            >
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="text-xl font-semibold text-white">{report.role}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${getReadinessBadge(report.readiness)}`}>
                      {report.readiness}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(report.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {report.strengths.slice(0, 2).map((strength, i) => (
                      <span key={i} className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">
                        ✓ {strength}
                      </span>
                    ))}
                    {report.weaknesses.slice(0, 2).map((weakness, i) => (
                      <span key={i} className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-400">
                        ! {weakness}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-center">
                  <div className={`text-4xl font-bold ${getScoreColor(report.score)}`}>
                    {report.score}
                  </div>
                  <div className="text-xs text-gray-500">out of 100</div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-500 self-center" />
              </div>
            </Link>
          ))}
        </div>

        {reports.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No reports yet. Start your first interview!</p>
            <Link to="/configure" className="inline-block mt-4 px-6 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-white">
              Start Interview
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}