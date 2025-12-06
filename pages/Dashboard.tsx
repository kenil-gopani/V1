import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { MOCK_WEEKLY_ACTIVITY } from '../constants';
import { Clock, Book, Trophy, ArrowRight, Users, Plus, Layout } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/db';
import { UserRole, Course, Enrollment } from '../types';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<{ course: Course, progress: number }[]>([]);
  const [createdCourses, setCreatedCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setIsLoading(true);

    if (user.role === UserRole.STUDENT) {
      const enrollments = db.enrollments.getByStudent(user.id);
      setEnrolledCourses(enrollments.map(e => ({ course: e.course!, progress: e.progress })));
    } else if (user.role === UserRole.TEACHER) {
      const courses = db.courses.getByInstructor(user.id);
      setCreatedCourses(courses);
    }
    setIsLoading(false);
  }, [user]);

  if (!user) return null;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome back, {user.name}! 👋</h1>
          <p className="text-slate-500 mt-1">
            {user.role === UserRole.STUDENT 
              ? "You've completed 75% of your weekly goals. Keep it up!" 
              : "Here is an overview of your teaching impact today."}
          </p>
        </div>
        
        {user.role === UserRole.TEACHER ? (
           <Link 
           to="/create-course"
           className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-200"
         >
           <Plus size={18} />
           Create New Course
         </Link>
        ) : (
          <Link 
          to="/courses"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-200"
        >
          Explore Courses
          <ArrowRight size={18} />
        </Link>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            {user.role === UserRole.STUDENT ? <Book size={24} /> : <Layout size={24} />}
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">
              {user.role === UserRole.STUDENT ? 'Courses in Progress' : 'Active Courses'}
            </p>
            <h3 className="text-2xl font-bold text-slate-900">
              {user.role === UserRole.STUDENT ? enrolledCourses.length : createdCourses.length}
            </h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
            {user.role === UserRole.STUDENT ? <Clock size={24} /> : <Users size={24} />}
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">
              {user.role === UserRole.STUDENT ? 'Hours Spent' : 'Total Students'}
            </p>
            <h3 className="text-2xl font-bold text-slate-900">
               {user.role === UserRole.STUDENT ? '26.5h' : createdCourses.reduce((acc, c) => acc + c.studentsEnrolled, 0)}
            </h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Trophy size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Points</p>
            <h3 className="text-2xl font-bold text-slate-900">{user.points}</h3>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - 2/3 */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Activity Chart */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Activity Overview</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MOCK_WEEKLY_ACTIVITY}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12 }} 
                  />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="hours" radius={[6, 6, 0, 0]} barSize={32}>
                    {MOCK_WEEKLY_ACTIVITY.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.hours > 3.5 ? '#4f46e5' : '#cbd5e1'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Dynamic Content List */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900">
                {user.role === UserRole.STUDENT ? 'Continue Learning' : 'Your Courses'}
              </h3>
              <Link to="/courses" className="text-sm text-indigo-600 font-medium hover:text-indigo-700">View All</Link>
            </div>
            <div className="space-y-4">
              {user.role === UserRole.STUDENT ? (
                // Student View
                enrolledCourses.length > 0 ? (
                  enrolledCourses.map(({ course, progress }) => (
                    <div key={course.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                      <img src={course.thumbnail} alt={course.title} className="h-16 w-24 rounded-lg object-cover" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900">{course.title}</h4>
                        <p className="text-xs text-slate-500 mb-2">Instructor: {course.instructorName}</p>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${progress}%` }}></div>
                        </div>
                      </div>
                      <button className="h-8 w-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-all">
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <p>You haven't enrolled in any courses yet.</p>
                    <Link to="/courses" className="text-indigo-600 font-medium text-sm mt-2 block">Browse Courses</Link>
                  </div>
                )
              ) : (
                // Teacher View
                createdCourses.length > 0 ? (
                   createdCourses.map(course => (
                    <div key={course.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                      <img src={course.thumbnail} alt={course.title} className="h-16 w-24 rounded-lg object-cover" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900">{course.title}</h4>
                        <p className="text-xs text-slate-500">{course.category} • {course.lessonsCount} Lessons</p>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                        <Users size={14} />
                        <span className="text-xs font-bold">{course.studentsEnrolled}</span>
                      </div>
                    </div>
                   ))
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <p>You haven't created any courses yet.</p>
                    <Link to="/create-course" className="text-indigo-600 font-medium text-sm mt-2 block">Create your first course</Link>
                  </div>
                )
              )}
            </div>
          </div>

        </div>

        {/* Right Column - 1/3 */}
        <div className="space-y-8">
           {/* Daily Challenge */}
           <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200">
             <div className="flex items-start justify-between mb-4">
               <div>
                 <p className="text-indigo-100 text-sm font-medium mb-1">Daily Challenge</p>
                 <h3 className="text-xl font-bold">Complete 1 Quiz</h3>
               </div>
               <div className="bg-white/20 p-2 rounded-lg">
                 <Trophy size={20} className="text-white" />
               </div>
             </div>
             <p className="text-sm text-indigo-100 opacity-90 mb-4">Earn 50 bonus points and keep your streak alive!</p>
             <Link to="/smart-gen" className="w-full block text-center py-2 bg-white text-indigo-600 rounded-lg font-semibold text-sm hover:bg-indigo-50 transition-colors">
               Start Quiz
             </Link>
           </div>

           {/* Top Mentors */}
           <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Recommended Mentors</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="relative">
                    <img src={`https://picsum.photos/id/${60 + i}/100/100`} alt="Mentor" className="h-10 w-10 rounded-full object-cover" />
                    <div className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <h5 className="text-sm font-semibold text-slate-900">Dr. Sarah Smith</h5>
                    <p className="text-xs text-slate-500">Computer Science</p>
                  </div>
                  <button className="text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors">
                    Book
                  </button>
                </div>
              ))}
            </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;