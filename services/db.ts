import { User, Course, Enrollment, UserRole } from '../types';

// Initial Seed Data to populate the "Database" if empty
const SEED_USERS: User[] = [
  {
    id: 'student-1',
    name: 'Alex Johnson',
    email: 'alex@eduverse.com',
    password: 'password',
    role: UserRole.STUDENT,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    streak: 12,
    points: 2450
  },
  {
    id: 'teacher-1',
    name: 'Dr. Sarah Smith',
    email: 'sarah@eduverse.com',
    password: 'password',
    role: UserRole.TEACHER,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    streak: 45,
    points: 10500,
    bio: 'Senior Lecturer in Computer Science with 10 years of experience.'
  }
];

const SEED_COURSES: Course[] = [
  {
    id: 'c1',
    title: 'Advanced React Patterns',
    description: 'Master higher-order components, render props, and custom hooks.',
    instructorId: 'teacher-1',
    instructorName: 'Dr. Sarah Smith',
    thumbnail: 'https://picsum.photos/id/1/400/250',
    category: 'Development',
    lessonsCount: 20,
    studentsEnrolled: 154,
    createdAt: new Date().toISOString()
  },
  {
    id: 'c2',
    title: 'Introduction to AI & ML',
    description: 'Understand the basics of neural networks and machine learning.',
    instructorId: 'teacher-1',
    instructorName: 'Dr. Sarah Smith',
    thumbnail: 'https://picsum.photos/id/2/400/250',
    category: 'Data Science',
    lessonsCount: 12,
    studentsEnrolled: 89,
    createdAt: new Date().toISOString()
  }
];

// Helper to access LocalStorage
const getCollection = <T>(key: string, seed: T[] = []): T[] => {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(seed));
    return seed;
  }
  return JSON.parse(data);
};

const setCollection = <T>(key: string, data: T[]) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// --- DB Operations ---

export const db = {
  users: {
    getAll: () => getCollection<User>('users', SEED_USERS),
    getById: (id: string) => getCollection<User>('users', SEED_USERS).find(u => u.id === id),
    findByEmail: (email: string) => getCollection<User>('users', SEED_USERS).find(u => u.email === email),
    create: (user: Omit<User, 'id' | 'streak' | 'points' | 'avatar'>) => {
       const users = getCollection<User>('users', SEED_USERS);
       const newUser: User = {
         ...user,
         id: `u-${Date.now()}`,
         streak: 0,
         points: 0,
         avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name.replace(' ', '')}`
       };
       users.push(newUser);
       setCollection('users', users);
       return newUser;
    },
    verifyCredentials: (email: string, password: string) => {
      const user = getCollection<User>('users', SEED_USERS).find(u => u.email === email && u.password === password);
      return user || null;
    }
  },
  courses: {
    getAll: () => getCollection<Course>('courses', SEED_COURSES),
    create: (course: Omit<Course, 'id' | 'studentsEnrolled' | 'createdAt'>) => {
      const courses = getCollection<Course>('courses', SEED_COURSES);
      const newCourse: Course = {
        ...course,
        id: `c-${Date.now()}`,
        studentsEnrolled: 0,
        createdAt: new Date().toISOString()
      };
      courses.push(newCourse);
      setCollection('courses', courses);
      return newCourse;
    },
    getByInstructor: (instructorId: string) => {
      return getCollection<Course>('courses', SEED_COURSES).filter(c => c.instructorId === instructorId);
    }
  },
  enrollments: {
    getAll: () => getCollection<Enrollment>('enrollments', []),
    enroll: (studentId: string, courseId: string) => {
      const enrollments = getCollection<Enrollment>('enrollments', []);
      if (enrollments.some(e => e.studentId === studentId && e.courseId === courseId)) {
        return null; // Already enrolled
      }
      
      const newEnrollment: Enrollment = {
        id: `e-${Date.now()}`,
        studentId,
        courseId,
        progress: 0,
        enrolledAt: new Date().toISOString()
      };
      enrollments.push(newEnrollment);
      setCollection('enrollments', enrollments);

      // Update course student count
      const courses = getCollection<Course>('courses', SEED_COURSES);
      const courseIndex = courses.findIndex(c => c.id === courseId);
      if (courseIndex > -1) {
        courses[courseIndex].studentsEnrolled += 1;
        setCollection('courses', courses);
      }
      
      return newEnrollment;
    },
    getByStudent: (studentId: string) => {
      const enrollments = getCollection<Enrollment>('enrollments', []);
      const courses = getCollection<Course>('courses', SEED_COURSES);
      
      // Join Enrollment with Course data
      return enrollments
        .filter(e => e.studentId === studentId)
        .map(e => {
          const course = courses.find(c => c.id === e.courseId);
          return {
            ...e,
            course // Attach full course details
          };
        })
        .filter(item => item.course !== undefined);
    }
  }
};