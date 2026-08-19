'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MultiSelect, { Option } from '../../components/MultiSelect';
import Select from '../../components/Select';
import Card from '../../components/Card';
import Button from '../../components/Button';


const EXPERIENCE_OPTIONS = [
  { value: 'BEGINNER', label: 'Beginner (0–2 years)' },
  { value: 'INTERMEDIATE', label: 'Intermediate (2–5 years)' },
  { value: 'ADVANCED', label: 'Advanced (5–8 years)' },
  { value: 'EXPERT', label: 'Expert (8+ years)' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    displayName: '',
    bio: '',
    experienceLevel: 'INTERMEDIATE',
  });
  
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  
  const [skillOptions, setSkillOptions] = useState<Option[]>([]);
  const [goalOptions, setGoalOptions] = useState<Option[]>([]);

  useEffect(() => {
    fetch('/api/v1/profile/skills')
      .then(res => res.json())
      .then(categories => {
        const options: Option[] = [];
        categories.forEach((cat: any) => {
          cat.skills.forEach((s: any) => {
            options.push({ id: s.id, name: s.name, category: cat.name });
          });
        });
        setSkillOptions(options);
      })
      .catch(console.error);

    fetch('/api/v1/profile/goals')
      .then(res => res.json())
      .then(goals => {
        const options: Option[] = goals.map((g: any) => ({ id: g.id, name: g.name }));
        setGoalOptions(options);
      })
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/v1/profile/onboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        skills: selectedSkills,
        goals: selectedGoals,
      }),
    });

    if (res.ok) {
      router.push('/dashboard');
    } else {
      alert('Failed to save profile. Make sure username is unique.');
    }
  };

  const inputStyle = { width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--surface)', color: 'var(--foreground)', fontSize: '14px', outline: 'none' };
  const labelStyle = { display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '14px', color: 'var(--foreground)' };

  return (
    <div style={{ background: 'var(--background)', minHeight: 'calc(100vh - 65px)', padding: '40px 24px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--foreground)', marginBottom: '8px' }}>Build your identity</h1>
          <p style={{ color: 'var(--foreground-muted)', fontSize: '16px' }}>Complete your profile to discover developers and projects.</p>
        </div>

        <Card padding="lg">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Display Name <span style={{color: 'red'}}>*</span></label>
                <input required type="text" value={formData.displayName} onChange={e => setFormData({...formData, displayName: e.target.value})} style={inputStyle} placeholder="John Doe" />
              </div>
              <div>
                <label style={labelStyle}>Username <span style={{color: 'red'}}>*</span></label>
                <input required type="text" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} style={inputStyle} placeholder="johndoe" />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Professional Headline / Bio</label>
              <textarea value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} placeholder="Full-stack engineer passionate about open source..."></textarea>
            </div>

            <div>
              <label style={labelStyle}>Experience Level</label>
              <Select
                id="onboarding-experience"
                options={EXPERIENCE_OPTIONS}
                value={formData.experienceLevel}
                onChange={(v) => setFormData({ ...formData, experienceLevel: v })}
                fullWidth
              />
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '8px 0' }} />

            <div>
              <label style={labelStyle}>Skills</label>
              <p style={{ fontSize: '13px', color: 'var(--foreground-muted)', marginBottom: '12px' }}>Select the technologies you are proficient in.</p>
              <div style={{ color: 'black' }}>
                <MultiSelect 
                  options={skillOptions} 
                  selectedIds={selectedSkills} 
                  onChange={setSelectedSkills} 
                  placeholder="Search skills (e.g. React, Python)..." 
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Learning Goals</label>
              <p style={{ fontSize: '13px', color: 'var(--foreground-muted)', marginBottom: '12px' }}>What do you want to learn next?</p>
              <div style={{ color: 'black' }}>
                <MultiSelect 
                  options={goalOptions} 
                  selectedIds={selectedGoals} 
                  onChange={setSelectedGoals} 
                  placeholder="Search goals..." 
                />
              </div>
            </div>

            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
              <Button type="submit" size="lg" variant="primary">
                Complete Profile
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
