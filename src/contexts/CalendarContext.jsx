import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useEvents } from '@/contexts/EventsContext';
import { useActivities } from '@/contexts/ActivitiesContext';
import { useToast } from '@/components/ui/use-toast';

const CalendarContext = createContext(null);

export const CalendarProvider = ({ children }) => {
  const { user } = useAuth();
  const { events, loading: eventsLoading } = useEvents();
  const { activities, loading: activitiesLoading } = useActivities();
  const [generalActivities, setGeneralActivities] = useState([]);
  const [generalActivitiesLoading, setGeneralActivitiesLoading] = useState(true);
  
  const [calendarItems, setCalendarItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadGeneralActivities = useCallback(() => {
    setGeneralActivitiesLoading(true);
    const storedActivities = JSON.parse(localStorage.getItem('mentorship_general_activities') || '[]');
    setGeneralActivities(storedActivities);
    setGeneralActivitiesLoading(false);
  }, []);

  useEffect(() => {
    loadGeneralActivities();
  }, [loadGeneralActivities]);

  useEffect(() => {
    setLoading(eventsLoading || activitiesLoading || generalActivitiesLoading);

    if (!eventsLoading && !activitiesLoading && !generalActivitiesLoading) {
        const platformEvents = events
            .filter(e => e.published)
            .map(e => ({
                id: `evt-${e.id}`,
                title: e.title,
                start: `${e.date}T${e.time}`,
                allDay: false,
                backgroundColor: '#22c55e', // green
                borderColor: '#16a34a',
                extendedProps: {
                    type: 'event',
                    typeLabel: 'Evento',
                    description: e.description,
                    location: e.location,
                    link: e.link,
                }
            }));

        const mentorshipActivityDeadlines = activities
            .filter(a => a.type === 'mentorship' && a.dueDate)
            .map(a => ({
                id: `m-act-${a.id}`,
                title: `Prazo: ${a.title}`,
                start: a.dueDate,
                allDay: true,
                backgroundColor: '#8b5cf6', // purple
                borderColor: '#7c3aed',
                extendedProps: {
                    type: 'mentorshipActivity',
                    typeLabel: 'Atividade da Mentoria',
                    description: a.description,
                }
            }));

        const personalActivityDeadlines = activities
            .filter(a => a.type === 'personal' && a.dueDate)
            .map(a => ({
                id: `p-act-${a.id}`,
                title: `Prazo: ${a.title}`,
                start: a.dueDate,
                allDay: true,
                backgroundColor: '#3b82f6', // blue
                borderColor: '#2563eb',
                extendedProps: {
                    type: 'personalActivity',
                    typeLabel: 'Atividade Pessoal',
                    description: a.description,
                }
            }));
        
        const generalPlatformActivities = generalActivities.map(a => ({
          id: `g-act-${a.id}`,
          title: a.title,
          start: a.date,
          allDay: true,
          backgroundColor: '#f97316', // orange
          borderColor: '#ea580c',
          extendedProps: {
            type: 'generalActivity',
            typeLabel: 'Atividade Geral',
            description: a.description
          }
        }));
            
        setCalendarItems([
          ...platformEvents, 
          ...mentorshipActivityDeadlines, 
          ...personalActivityDeadlines,
          ...generalPlatformActivities,
        ]);
    }
  }, [events, activities, generalActivities, eventsLoading, activitiesLoading, generalActivitiesLoading]);

  const value = {
    calendarItems,
    loading,
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
};