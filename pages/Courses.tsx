import React, { useState, useEffect } from 'react';
import { Search, Filter, PlayCircle, Clock, Star, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/db';
import { Course, UserRole } from '../types';

const Courses: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState('All');
  const [isEnrolling, setIsEnrolling] = useState<string | null>(null);

  const categories = ['All', 'Development', 'Design', 'Marketing', 'Data Science', 'Business'];

  useEffect(() => {
    // Load courses
    const allCourses = db.courses.getAll();
    setCourses(allCourses);

    // Load user enrollments if student
    if (user && user.role === UserRole.STUDENT) {
      const enrollments = db.enrollments.getByStudent(user.id);
      setEnrolledCourseIds(new Set(enrollments.map(e => e.courseId)));
    }
  }, [user]);

  const handleEnroll = (courseId: string) => {
    if (!user || user.role !== UserRole.STUDENT) return;
    
    setIsEnrolling(courseId);
    setTimeout(() => {
        db.enrollments.enroll(user.id, courseId);
        setEnrolledCourseIds(prev => new Set(prev).add(courseId));
        // Refresh courses to update enrollment counts
        setCourses(db.courses.getAll());
        setIsEnrolling(null);
    }, 800); // Fake API delay
  };

  const filteredCourses = filter === 'All' 
    ? courses 
    : courses.filter(c => c.category === filter);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Explore Courses</h1>
          <p className="text-slate-500 mt-1">Discover new skills and advance your career.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
             <input 
               type="text" 
               placeholder="Search..." 
               className="pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-64"
             />
           </div>
           <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600">
             <Filter size={20} />
           </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              filter === cat 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Course Grid */}
      {filteredCourses.length === 0 ? (
         <div className="text-center py-20 bg-slate-100 rounded-2xl border-2 border-dashed border-slate-200 text-slate-500">
             <p>No courses found in this category.</p>
         </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map(course => {
                const isEnrolled = enrolledCourseIds.has(course.id);
                const isOwner = user?.role === UserRole.TEACHER && user.id === course.instructorId;
                
                return (
                <div key={course.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col h-full">
                    <div className="relative h-48 overflow-hidden flex-shrink-0">
                    <img 
                        src={course.thumbnail} 
                        alt={course.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button className="bg-white/20 backdrop-blur-md text-white border border-white/50 rounded-full p-3 hover:bg-white/30 transition-colors">
                        <PlayCircle size={32} />
                        </button>
                    </div>
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-bold text-slate-800">
                        {course.category}
                    </span>
                    </div>
                    
                    <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-slate-900 text-lg mb-2 line-clamp-1">{course.title}</h3>
                    <p className="text-sm text-slate-500 mb-4 line-clamp-2">{course.description}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-slate-500 mb-4 mt-auto">
                        <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{course.lessonsCount} Lessons</span>
                        </div>
                        <div className="flex items-center gap-1 text-amber-500">
                        <Star size={14} fill="currentColor" />
                        <span className="text-slate-500">4.8 ({course.studentsEnrolled})</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                        <div className="flex items-center gap-2">
                        <img src={`https://ui-avatars.com/api/?name=${course.instructorName}&background=random`} alt={course.instructorName} className="h-6 w-6 rounded-full" />
                        <span className="text-xs font-medium text-slate-700 truncate max-w-[100px]">{course.instructorName}</span>
                        </div>
                        
                        {isOwner ? (
                             <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Your Course</span>
                        ) : isEnrolled ? (
                            <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                                <CheckCircle size={16} />
                                Enrolled
                            </div>
                        ) : user?.role === UserRole.STUDENT ? (
                            <button 
                                onClick={() => handleEnroll(course.id)}
                                disabled={isEnrolling === course.id}
                                className="text-indigo-600 text-sm font-semibold hover:text-indigo-800 disabled:opacity-50"
                            >
                                {isEnrolling === course.id ? 'Enrolling...' : 'Enroll Now'}
                            </button>
                        ) : (
                            <span className="text-xs text-slate-400">View Details</span>
                        )}
                    </div>
                    </div>
                </div>
                );
            })}
        </div>
      )}
    </div>
  );
};

export default Courses;