export enum UserRole {
  STUDENT = 'Student',
  TEACHER = 'Teacher',
  ADMIN = 'Admin'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
  email: string;
  password?: string; // Added for auth simulation
  bio?: string;
  streak: number;
  points: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructorId: string;
  instructorName: string;
  thumbnail: string;
  category: string;
  lessonsCount: number;
  createdAt: string;
  studentsEnrolled: number;
}

export interface Enrollment {
  id: string;
  courseId: string;
  studentId: string;
  progress: number; // 0 to 100
  enrolledAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Mentor {
  id: string;
  name: string;
  specialty: string;
  availability: string;
  rating: number;
  image: string;
}