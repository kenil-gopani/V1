import { User, UserRole, Course, Mentor } from './types';
import { 
  LayoutDashboard, 
  BookOpen, 
  Bot, 
  Wand2, 
  Video, 
  Trophy 
} from 'lucide-react';

export const CURRENT_USER: User = {
  id: 'u1',
  name: 'Alex Johnson',
  role: UserRole.STUDENT,
  avatar: 'https://picsum.photos/id/64/200/200',
  email: 'alex.johnson@example.com',
  streak: 12,
  points: 2450
};

export const MOCK_COURSES: Course[] = [
  {
    id: 'c1',
    title: 'Advanced React Patterns',
    description: 'Master higher-order components, render props, and custom hooks.',
    instructorId: 'i1',
    instructorName: 'Dr. Sarah Smith',
    thumbnail: 'https://picsum.photos/id/1/400/250',
    lessonsCount: 20,
    category: 'Development',
    studentsEnrolled: 120,
    createdAt: new Date().toISOString()
  },
  {
    id: 'c2',
    title: 'Introduction to AI & ML',
    description: 'Understand the basics of neural networks and machine learning.',
    instructorId: 'i2',
    instructorName: 'Prof. David Lee',
    thumbnail: 'https://picsum.photos/id/2/400/250',
    lessonsCount: 12,
    category: 'Data Science',
    studentsEnrolled: 250,
    createdAt: new Date().toISOString()
  },
  {
    id: 'c3',
    title: 'UX Design Fundamentals',
    description: 'Learn how to design user-friendly interfaces and experiences.',
    instructorId: 'i3',
    instructorName: 'Emily Chen',
    thumbnail: 'https://picsum.photos/id/3/400/250',
    lessonsCount: 15,
    category: 'Design',
    studentsEnrolled: 80,
    createdAt: new Date().toISOString()
  },
  {
    id: 'c4',
    title: 'Digital Marketing 101',
    description: 'Strategies for SEO, SEM, and social media growth.',
    instructorId: 'i4',
    instructorName: 'Mark Wilson',
    thumbnail: 'https://picsum.photos/id/4/400/250',
    lessonsCount: 8,
    category: 'Marketing',
    studentsEnrolled: 150,
    createdAt: new Date().toISOString()
  }
];

export const MENTORS: Mentor[] = [
  {
    id: 'm1',
    name: 'Dr. Alice Roberts',
    specialty: 'Computer Science',
    availability: 'Mon-Wed, 10 AM - 2 PM',
    rating: 4.9,
    image: 'https://picsum.photos/id/65/200/200'
  },
  {
    id: 'm2',
    name: 'James Carter',
    specialty: 'Mathematics',
    availability: 'Tue-Thu, 1 PM - 5 PM',
    rating: 4.7,
    image: 'https://picsum.photos/id/91/200/200'
  },
  {
    id: 'm3',
    name: 'Sophia Martinez',
    specialty: 'Literature',
    availability: 'Fri, 9 AM - 12 PM',
    rating: 5.0,
    image: 'https://picsum.photos/id/64/200/200'
  }
];

export const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Courses', path: '/courses', icon: BookOpen },
  { label: 'AI Tutor', path: '/ai-tutor', icon: Bot },
  { label: 'Smart Gen', path: '/smart-gen', icon: Wand2 },
  { label: 'Mentorship', path: '/mentorship', icon: Video },
];

export const MOCK_WEEKLY_ACTIVITY = [
  { day: 'Mon', hours: 2.5 },
  { day: 'Tue', hours: 3.0 },
  { day: 'Wed', hours: 1.5 },
  { day: 'Thu', hours: 4.0 },
  { day: 'Fri', hours: 2.0 },
  { day: 'Sat', hours: 5.0 },
  { day: 'Sun', hours: 3.5 },
];