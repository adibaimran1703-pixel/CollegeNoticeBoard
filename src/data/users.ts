import { User } from '../types';

export const MOCK_USERS: User[] = [
  {
    id: 'usr_student_alex',
    name: 'Alex Chen',
    email: 'alex.chen@university.edu',
    role: 'student',
    department: 'CSE',
    year: '3rd Year',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    savedNoticeIds: ['not_hackathon_2026', 'not_google_internship'],
    upvotedNoticeIds: ['not_ai_ml_workshop', 'not_hackathon_2026'],
    createdAt: '2024-08-15T09:00:00Z',
  },
  {
    id: 'usr_admin_jenkins',
    name: 'Dr. Sarah Jenkins',
    email: 'sarah.jenkins@university.edu',
    role: 'admin',
    department: 'CSE',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    savedNoticeIds: ['not_exam_schedule'],
    upvotedNoticeIds: ['not_exam_schedule', 'not_civil_symposium'],
    createdAt: '2023-01-10T08:30:00Z',
  },
  {
    id: 'usr_faculty_diaz',
    name: 'Prof. Robert Diaz',
    email: 'robert.diaz@university.edu',
    role: 'faculty',
    department: 'ECE',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    savedNoticeIds: [],
    upvotedNoticeIds: ['not_ai_ml_workshop'],
    createdAt: '2023-06-20T10:15:00Z',
  },
  {
    id: 'usr_student_maya',
    name: 'Maya Patel',
    email: 'maya.patel@university.edu',
    role: 'student',
    department: 'Biotechnology',
    year: '2nd Year',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    savedNoticeIds: ['not_ai_ml_workshop'],
    upvotedNoticeIds: ['not_google_internship'],
    createdAt: '2025-01-12T11:45:00Z',
  },
];

export const DEFAULT_CURRENT_USER = MOCK_USERS[0]; // Alex Chen by default
export const DEFAULT_ADMIN_USER = MOCK_USERS[1]; // Dr. Sarah Jenkins
