import React from 'react';
import { MENTORS } from '../constants';
import { Star, Video, Calendar, Clock, MoreHorizontal } from 'lucide-react';

const Mentorship: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Find a Mentor</h1>
          <p className="text-slate-500 mt-1">Book 1-on-1 sessions with industry experts.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MENTORS.map((mentor) => (
          <div key={mentor.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
             <div className="flex items-start justify-between mb-4">
                <img src={mentor.image} alt={mentor.name} className="h-16 w-16 rounded-full object-cover border-2 border-white shadow-sm" />
                <button className="text-slate-400 hover:text-slate-600">
                  <MoreHorizontal size={20} />
                </button>
             </div>
             
             <div className="mb-4">
               <h3 className="font-bold text-lg text-slate-900">{mentor.name}</h3>
               <p className="text-indigo-600 text-sm font-medium">{mentor.specialty}</p>
             </div>

             <div className="flex items-center gap-4 mb-6">
               <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-1 rounded-md text-xs font-bold">
                 <Star size={12} fill="currentColor" />
                 {mentor.rating}
               </div>
               <div className="text-xs text-slate-500 flex items-center gap-1">
                 <Clock size={12} />
                 200+ Sessions
               </div>
             </div>

             <div className="space-y-3">
               <div className="flex items-center gap-3 text-sm text-slate-600">
                 <Calendar size={16} className="text-slate-400" />
                 <span>{mentor.availability}</span>
               </div>
               
               <button className="w-full py-2.5 bg-slate-900 text-white rounded-lg font-medium text-sm hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                 <Video size={16} />
                 Book Session
               </button>
             </div>
          </div>
        ))}
        
        {/* Call to Action Card for becoming a mentor */}
        <div className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 p-6 flex flex-col items-center justify-center text-center">
           <div className="h-14 w-14 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4">
             <Video size={28} />
           </div>
           <h3 className="font-bold text-slate-900 mb-2">Become a Mentor</h3>
           <p className="text-sm text-slate-500 mb-6">Share your knowledge and help students succeed.</p>
           <button className="px-6 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-white transition-colors">
             Apply Now
           </button>
        </div>
      </div>
    </div>
  );
};

export default Mentorship;