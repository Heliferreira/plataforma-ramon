import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useContent } from './ContentContext';
import { supabase } from '@/lib/customSupabaseClient';

const ProgressContext = createContext(null);

export const ProgressProvider = ({ children }) => {
  const { user } = useAuth();
  const { lessons } = useContent();
  const [progressData, setProgressData] = useState({});
  const [loading, setLoading] = useState(true);

  const loadProgress = useCallback(async () => {
    setLoading(true);
    let allProgress = {};

    if (user?.profile?.role === 'admin') {
      const { data: students, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'student');

      if (error) {
        console.error('Error fetching students:', error);
      } else {
        students.forEach(student => {
          const studentProgress = JSON.parse(localStorage.getItem(`student_progress_${student.id}`) || '{}');
          allProgress[student.id] = studentProgress;
        });
      }
    } else if (user) {
      const studentProgress = JSON.parse(localStorage.getItem(`student_progress_${user.id}`) || '{}');
      allProgress[user.id] = studentProgress;
    }
    
    setProgressData(allProgress);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  const getStudentProgressForCourse = (studentId, courseId) => {
    const studentProgress = progressData[studentId] || {};
    const courseProgress = studentProgress[courseId] || { completedLessons: [] };
    const courseLessons = lessons.filter(l => l.courseId === courseId);

    if (courseLessons.length === 0) {
      return { completedCount: 0, totalCount: 0, percentage: 0, completedLessons: [] };
    }
    
    const completedCount = courseProgress.completedLessons.length;
    const totalCount = courseLessons.length;
    const percentage = Math.round((completedCount / totalCount) * 100);

    return {
      completedCount,
      totalCount,
      percentage,
      completedLessons: courseProgress.completedLessons,
    };
  };

  const markLessonAsCompleted = (courseId, lessonId) => {
    if (!user) return;

    const studentId = user.id;
    const newProgressData = { ...progressData };
    
    if (!newProgressData[studentId]) {
      newProgressData[studentId] = {};
    }
    if (!newProgressData[studentId][courseId]) {
      newProgressData[studentId][courseId] = { completedLessons: [] };
    }
    
    const completedLessons = newProgressData[studentId][courseId].completedLessons;
    if (!completedLessons.includes(lessonId)) {
      newProgressData[studentId][courseId].completedLessons.push(lessonId);
      setProgressData(newProgressData);
      localStorage.setItem(`student_progress_${studentId}`, JSON.stringify(newProgressData[studentId]));
    }
  };

  const isLessonCompleted = (studentId, courseId, lessonId) => {
    const studentProgress = progressData[studentId] || {};
    const courseProgress = studentProgress[courseId] || { completedLessons: [] };
    return courseProgress.completedLessons.includes(lessonId);
  };
  
  const value = {
    progressData,
    loading,
    getStudentProgressForCourse,
    markLessonAsCompleted,
    isLessonCompleted,
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};