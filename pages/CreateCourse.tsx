import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/db';
import { UserRole } from '../types';
import { Upload, Layout, Type, List, Loader2, Save } from 'lucide-react';

const CreateCourse: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Development',
    lessonsCount: 5,
    thumbnail: 'https://picsum.photos/400/250?random=10' // Default random image
  });

  if (!user || user.role !== UserRole.TEACHER) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Access Denied</h2>
        <p className="text-slate-500">Only teachers can access this page.</p>
        <button 
          onClick={() => navigate('/dashboard')}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
        db.courses.create({
            title: formData.title,
            description: formData.description,
            category: formData.category,
            lessonsCount: formData.lessonsCount,
            thumbnail: formData.thumbnail,
            instructorId: user.id,
            instructorName: user.name
        });
        setIsLoading(false);
        navigate('/courses');
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-2xl font-bold text-slate-900">Create New Course</h1>
           <p className="text-slate-500 mt-1">Share your knowledge with the world.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="space-y-4">
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Course Title</label>
               <div className="relative">
                 <Type className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                 <input 
                   type="text" 
                   name="title"
                   required
                   value={formData.title}
                   onChange={handleChange}
                   placeholder="e.g. Advanced JavaScript Mastery"
                   className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                 />
               </div>
             </div>

             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
               <div className="relative">
                 <textarea 
                   name="description"
                   required
                   value={formData.description}
                   onChange={handleChange}
                   rows={4}
                   placeholder="What will students learn in this course?"
                   className="w-full p-4 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
                 />
               </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <div className="relative">
                    <Layout className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
                    >
                      <option value="Development">Development</option>
                      <option value="Design">Design</option>
                      <option value="Business">Business</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Data Science">Data Science</option>
                    </select>
                  </div>
               </div>

               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Number of Lessons</label>
                  <div className="relative">
                    <List className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="number" 
                      name="lessonsCount"
                      min="1"
                      value={formData.lessonsCount}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    />
                  </div>
               </div>
             </div>

             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Thumbnail URL</label>
                <div className="relative">
                  <Upload className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="url" 
                    name="thumbnail"
                    value={formData.thumbnail}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1">Paste a link to an image (e.g. from Unsplash)</p>
             </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
             <button
               type="button"
               onClick={() => navigate('/dashboard')}
               className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
             >
               Cancel
             </button>
             <button
               type="submit"
               disabled={isLoading}
               className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed"
             >
               {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
               Publish Course
             </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateCourse;