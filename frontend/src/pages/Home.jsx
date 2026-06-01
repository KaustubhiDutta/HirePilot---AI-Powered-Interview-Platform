import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Mic, FileText, BarChart3, Brain, Target, Zap, Clock, Shield, Star, TrendingUp, Award, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from '../components/AuthModal';

export default function Home() {
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const openLogin = () => {
    setAuthMode('login');
    setShowAuth(true);
  };

  const openSignup = () => {
    setAuthMode('signup');
    setShowAuth(true);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition">
              <Brain className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                HirePilot
              </span>
            </Link>
            
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-300 hover:text-white transition">Home</Link>
              <button onClick={openLogin} className="text-gray-300 hover:text-white transition">AI Interview Practice</button>
              <button onClick={openLogin} className="text-gray-300 hover:text-white transition">Communication Practice</button>
              <a href="#pricing" className="text-gray-300 hover:text-white transition">Pricing</a>
            </div>
            
            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              <button
                onClick={openLogin}
                className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition font-medium flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </button>
              <button
                onClick={openSignup}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-medium hover:opacity-90 transition flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-primary to-secondary bg-clip-text text-transparent">
              AI Powered<br />Interviews
            </h1>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              Practice realistic AI interviews, improve communication skills,<br />
              and receive personalized feedback to become interview ready.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={openSignup}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:opacity-90 transition-all transform hover:scale-105 inline-flex items-center gap-2"
              >
                Start Practicing Free <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={openLogin}
                className="px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 transition font-semibold backdrop-blur-sm"
              >
                Communication Practice
              </button>
            </div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-1/2 left-10 animate-pulse">
          <Mic className="w-12 h-12 text-primary/30" />
        </div>
        <div className="absolute bottom-20 right-10 animate-pulse" style={{ animationDelay: '2s' }}>
          <FileText className="w-16 h-16 text-secondary/30" />
        </div>
      </section>

      {/* 3-Step Journey */}
      <section className="py-20 px-6 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Your 3-Step Interview Journey
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Configure Interview",
                features: ["Choose Your Role", "Select Topics", "Set Difficulty & Duration", "Pick AI Interviewer"],
                icon: FileText,
                color: "from-blue-500 to-cyan-500"
              },
              {
                step: "02",
                title: "AI Interview",
                features: ["Voice Interviewer", "Adaptive Questions", "Role-Specific Questions", "Real-time Feedback"],
                icon: Mic,
                color: "from-purple-500 to-pink-500"
              },
              {
                step: "03",
                title: "Detailed Feedback",
                features: ["Readiness Score", "Role-Based Evaluation", "Actionable Plan", "Progress Tracking"],
                icon: BarChart3,
                color: "from-green-500 to-emerald-500"
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.2 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-xl" style={{ background: `linear-gradient(135deg, ${item.color})` }} />
                <div className="relative bg-white/5 rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all">
                  <div className="text-5xl font-bold bg-gradient-to-r bg-clip-text text-transparent mb-4" style={{ backgroundImage: `linear-gradient(135deg, ${item.color})` }}>
                    {item.step}
                  </div>
                  <item.icon className="w-12 h-12 mb-4 text-primary" />
                  <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                  <ul className="space-y-2">
                    {item.features.map((feature, i) => (
                      <li key={i} className="text-gray-400 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                Role-Specific AI Interviewer That<br />Actually Understands Your Domain
              </h2>
              <p className="text-gray-400 mb-8">
                Our AI asks role-specific questions tailored to your domain - whether you're a Frontend Developer, 
                Backend Engineer, Data Analyst, or ML Engineer.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Target, text: "Role-based questions for 10+ domains" },
                  { icon: Zap, text: "Real-time difficulty adaptation" },
                  { icon: Clock, text: "Time management tracking" },
                  { icon: Shield, text: "Comprehensive evaluation on 6 metrics" }
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <feature.icon className="w-5 h-5 text-primary" />
                    <span className="text-gray-300">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-2xl blur-2xl opacity-30" />
              <div className="relative bg-white/5 rounded-2xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-sm text-gray-500 ml-2">AI Interview Session</span>
                </div>
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-primary text-sm mb-2">AI Interviewer (Tanya):</p>
                    <p className="text-white">As a Frontend Developer, explain the virtual DOM and how React uses it for performance optimization.</p>
                  </div>
                  <div className="bg-primary/10 rounded-lg p-4 ml-8">
                    <p className="text-gray-400 text-sm mb-2">You:</p>
                    <p className="text-white">The virtual DOM is an in-memory representation of the real DOM. React uses it to track changes and batch updates...</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-green-400 text-sm mb-2">Feedback:</p>
                    <p className="text-gray-300">Great explanation! You covered the key concepts well. Score: 85/100</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Simple Pricing</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="rounded-2xl p-8 bg-white/5 border border-white/10 text-center hover:border-primary/50 transition">
              <h3 className="text-2xl font-bold mb-2">Free</h3>
              <div className="text-4xl font-bold text-primary mb-4">$0</div>
              <p className="text-gray-400 mb-6">Perfect for beginners</p>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>✓ 5 Mock Interviews</li>
                <li>✓ Basic Analytics</li>
                <li>✓ Communication Practice</li>
                <li>✓ 3 Role Categories</li>
              </ul>
              <button onClick={openSignup} className="mt-6 px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition">Get Started</button>
            </div>
            <div className="rounded-2xl p-8 bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/50 text-center transform scale-105">
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <div className="text-4xl font-bold text-primary mb-4">$19<span className="text-sm">/mo</span></div>
              <p className="text-gray-400 mb-6">For serious job seekers</p>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>✓ Unlimited Interviews</li>
                <li>✓ Advanced Analytics</li>
                <li>✓ Resume & JD Analysis</li>
                <li>✓ 10+ Role Categories</li>
                <li>✓ Custom Question Topics</li>
              </ul>
              <button onClick={openSignup} className="mt-6 px-6 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:opacity-90 transition">Upgrade</button>
            </div>
            <div className="rounded-2xl p-8 bg-white/5 border border-white/10 text-center hover:border-primary/50 transition">
              <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
              <div className="text-4xl font-bold text-primary mb-4">Custom</div>
              <p className="text-gray-400 mb-6">For teams & companies</p>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>✓ Everything in Pro</li>
                <li>✓ Team Management</li>
                <li>✓ Custom Questions</li>
                <li>✓ Priority Support</li>
                <li>✓ API Access</li>
              </ul>
              <button className="mt-6 px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition">Contact Sales</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
          <p>&copy; 2024 HirePilot. All rights reserved. Ace your next interview with AI.</p>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} initialMode={authMode} />
    </div>
  );
}