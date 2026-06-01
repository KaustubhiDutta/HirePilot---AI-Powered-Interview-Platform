import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Briefcase, GraduationCap, MapPin, Save, Edit2 } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.displayName || '',
    email: user?.email || '',
    role: 'Software Engineer',
    experience: '2-3 years',
    education: "Bachelor's in Computer Science",
    location: 'Remote',
    bio: 'Passionate developer looking for opportunities in full-stack development.'
  });

  const handleSave = () => {
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  return (
    <div className="min-h-screen bg-black py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
          <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:opacity-90 transition flex items-center gap-2"
          >
            {isEditing ? <Save className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </button>
        </div>

        <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-white/10">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-3xl font-bold text-white">
              {profile.name.charAt(0) || user?.email?.charAt(0)}
            </div>
            <div>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  className="text-2xl font-bold text-white bg-white/10 rounded-lg px-3 py-1"
                />
              ) : (
                <h2 className="text-2xl font-bold text-white">{profile.name || 'User'}</h2>
              )}
              <p className="text-gray-400">{profile.role}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <Mail className="w-5 h-5 text-primary mt-1" />
              <div className="flex-1">
                <p className="text-gray-400 text-sm">Email</p>
                <p className="text-white">{profile.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Briefcase className="w-5 h-5 text-primary mt-1" />
              <div className="flex-1">
                <p className="text-gray-400 text-sm">Current Role</p>
                {isEditing ? (
                  <select
                    value={profile.role}
                    onChange={(e) => setProfile({...profile, role: e.target.value})}
                    className="w-full bg-black border border-white/20 rounded-lg p-2 text-white"
                  >
                    <option>Software Engineer</option>
                    <option>Frontend Developer</option>
                    <option>Backend Developer</option>
                    <option>Full Stack Developer</option>
                    <option>Data Scientist</option>
                    <option>DevOps Engineer</option>
                  </select>
                ) : (
                  <p className="text-white">{profile.role}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4">
              <GraduationCap className="w-5 h-5 text-primary mt-1" />
              <div className="flex-1">
                <p className="text-gray-400 text-sm">Experience</p>
                {isEditing ? (
                  <select
                    value={profile.experience}
                    onChange={(e) => setProfile({...profile, experience: e.target.value})}
                    className="w-full bg-black border border-white/20 rounded-lg p-2 text-white"
                  >
                    <option>Fresher (0-1 years)</option>
                    <option>Junior (1-3 years)</option>
                    <option>Mid-Level (3-5 years)</option>
                    <option>Senior (5-8 years)</option>
                    <option>Lead (8+ years)</option>
                  </select>
                ) : (
                  <p className="text-white">{profile.experience}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4">
              <MapPin className="w-5 h-5 text-primary mt-1" />
              <div className="flex-1">
                <p className="text-gray-400 text-sm">Location</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.location}
                    onChange={(e) => setProfile({...profile, location: e.target.value})}
                    className="w-full bg-black border border-white/20 rounded-lg p-2 text-white"
                  />
                ) : (
                  <p className="text-white">{profile.location}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4">
              <User className="w-5 h-5 text-primary mt-1" />
              <div className="flex-1">
                <p className="text-gray-400 text-sm">Bio</p>
                {isEditing ? (
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile({...profile, bio: e.target.value})}
                    className="w-full bg-black border border-white/20 rounded-lg p-2 text-white h-24"
                  />
                ) : (
                  <p className="text-white">{profile.bio}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}