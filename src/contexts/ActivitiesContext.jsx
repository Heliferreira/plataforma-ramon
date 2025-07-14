import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const ActivitiesContext = createContext(null);

export const ActivitiesProvider = ({ children }) => {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllUsers = useCallback(async () => {
    // This is a placeholder. In a real Supabase app, you'd fetch users
    // with appropriate RLS policies. For now, we assume this is handled elsewhere
    // or we only operate on the current user's data.
    return [];
  }, []);

  const refreshActivities = useCallback(() => {
    if (!user) {
      setLoading(false);
      setActivities([]);
      return;
    }

    setLoading(true);
    // Mentorship activities (global)
    const mentorshipActivities = JSON.parse(localStorage.getItem('mentorship_activities') || '[]');
    
    // Personal activities and progress depend on the user role
    let allCombinedActivities = [];

    if (user?.profile?.role === 'admin') {
      // Admin sees all mentorship activities. We'll need a proper way to fetch all users later.
      const mentorshipWithStatus = mentorshipActivities.map(act => ({
        ...act,
        type: 'mentorship',
      }));
      allCombinedActivities = mentorshipWithStatus;

    } else { // For student
      const personalActivities = JSON.parse(localStorage.getItem(`student_personal_activities_${user.id}`) || '[]').map(act => ({ ...act, type: 'personal' }));
      const userMentorshipActivities = mentorshipActivities
        .filter(act => act.assignedTo && act.assignedTo.includes(user.id))
        .map(act => ({ ...act, type: 'mentorship' }));

      const studentProgress = JSON.parse(localStorage.getItem(`student_activity_progress_${user.id}`) || '{}');

      allCombinedActivities = [...personalActivities, ...userMentorshipActivities].map(act => ({
        ...act,
        status: studentProgress[act.id] || act.status
      }));
    }
    
    setActivities(allCombinedActivities);
    setLoading(false);

  }, [user]);

  useEffect(() => {
    refreshActivities();
  }, [refreshActivities]);
  
  const addPersonalActivity = (activityData) => {
    if (!user || user?.profile?.role !== 'student') return;

    const newActivity = {
      id: `personal_${Date.now()}`,
      ...activityData,
      type: 'personal',
    };
    
    const currentPersonalActivities = JSON.parse(localStorage.getItem(`student_personal_activities_${user.id}`) || '[]');
    const updatedPersonalActivities = [newActivity, ...currentPersonalActivities];
    localStorage.setItem(`student_personal_activities_${user.id}`, JSON.stringify(updatedPersonalActivities));
    refreshActivities();
    return newActivity;
  };

  const updatePersonalActivity = (activityId, activityData) => {
     if (!user || user?.profile?.role !== 'student') return;
     
     const currentPersonalActivities = JSON.parse(localStorage.getItem(`student_personal_activities_${user.id}`) || '[]');
     const updatedPersonalActivities = currentPersonalActivities.map(act => act.id === activityId ? {...act, ...activityData} : act);
     localStorage.setItem(`student_personal_activities_${user.id}`, JSON.stringify(updatedPersonalActivities));
     refreshActivities();
  };

  const deletePersonalActivity = (activityId) => {
    if (!user || user?.profile?.role !== 'student') return;

    const currentPersonalActivities = JSON.parse(localStorage.getItem(`student_personal_activities_${user.id}`) || '[]');
    const updatedPersonalActivities = currentPersonalActivities.filter(act => act.id !== activityId);
    localStorage.setItem(`student_personal_activities_${user.id}`, JSON.stringify(updatedPersonalActivities));
    refreshActivities();
  };

  const updateActivityStatus = (activityId, newStatus, studentId) => {
    const targetStudentId = user?.profile?.role === 'admin' ? studentId : user.id;
    if (!targetStudentId) return;

    const studentProgress = JSON.parse(localStorage.getItem(`student_activity_progress_${targetStudentId}`) || '{}');
    studentProgress[activityId] = newStatus;
    localStorage.setItem(`student_activity_progress_${targetStudentId}`, JSON.stringify(studentProgress));
    
    refreshActivities();
  };

  const addMentorshipActivity = (activityData) => {
    const newActivity = { id: `MA${Date.now().toString().slice(-3)}`, ...activityData, status: 'Pendente', type: 'mentorship' };
    const currentMentorshipActivities = JSON.parse(localStorage.getItem('mentorship_activities') || '[]');
    const updatedActivities = [newActivity, ...currentMentorshipActivities];
    localStorage.setItem('mentorship_activities', JSON.stringify(updatedActivities));
    refreshActivities();
  };
  
  const updateMentorshipActivity = (activityId, activityData) => {
    const currentMentorshipActivities = JSON.parse(localStorage.getItem('mentorship_activities') || '[]');
    const updatedActivities = currentMentorshipActivities.map(act => act.id === activityId ? {...act, ...activityData} : act);
    localStorage.setItem('mentorship_activities', JSON.stringify(updatedActivities));
    refreshActivities();
  };

  const deleteMentorshipActivity = (activityId) => {
    const currentMentorshipActivities = JSON.parse(localStorage.getItem('mentorship_activities') || '[]');
    const updatedActivities = currentMentorshipActivities.filter(act => act.id !== activityId);
    localStorage.setItem('mentorship_activities', JSON.stringify(updatedActivities));
    refreshActivities();
  };

  return (
    <ActivitiesContext.Provider value={{
      activities,
      loading,
      refreshActivities,
      // Personal activity handlers (for students)
      addPersonalActivity,
      updatePersonalActivity,
      deletePersonalActivity,
      // Status handler (for students)
      updateActivityStatus,
      // Mentorship activity handlers (for admin)
      addMentorshipActivity,
      updateMentorshipActivity,
      deleteMentorshipActivity,
    }}>
      {children}
    </ActivitiesContext.Provider>
  );
};

export const useActivities = () => {
  const context = useContext(ActivitiesContext);
  if (!context) {
    throw new Error('useActivities must be used within an ActivitiesProvider');
  }
  return context;
};