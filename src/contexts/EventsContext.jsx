import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';

const EventsContext = createContext(null);

export const EventsProvider = ({ children }) => {
  const { toast } = useToast();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadEvents = useCallback(() => {
    setLoading(true);
    const storedEvents = JSON.parse(localStorage.getItem('mentorship_events') || '[]');
    setEvents(storedEvents);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const saveData = (data) => {
    localStorage.setItem('mentorship_events', JSON.stringify(data));
    setEvents(data);
  };
  
  const addEvent = (eventData) => {
    const newEvent = { 
        id: `EVT${Date.now()}`, 
        ...eventData, 
        published: false,
        attendees: 0 
    };
    const updatedEvents = [newEvent, ...events];
    saveData(updatedEvents);
    toast({ title: "Evento Criado!", description: `O evento "${newEvent.title}" foi criado como rascunho.` });
    return newEvent;
  };

  const updateEvent = (eventId, eventData) => {
    const updatedEvents = events.map(evt => (evt.id === eventId ? { ...evt, ...eventData } : evt));
    saveData(updatedEvents);
    toast({ title: "Evento Atualizado!", description: `O evento "${eventData.title}" foi atualizado.` });
  };
  
  const deleteEvent = (eventId) => {
    const eventToDelete = events.find(e => e.id === eventId);
    if (eventToDelete) {
        const updatedEvents = events.filter(evt => evt.id !== eventId);
        saveData(updatedEvents);
        toast({ title: "Evento Removido!", description: `O evento "${eventToDelete.title}" foi removido.`, variant: "destructive" });
    }
  };

  const togglePublishStatus = (eventId) => {
    let eventTitle = '';
    let newStatus = false;
    const updatedEvents = events.map(evt => {
      if (evt.id === eventId) {
        eventTitle = evt.title;
        newStatus = !evt.published;
        return { ...evt, published: newStatus };
      }
      return evt;
    });
    saveData(updatedEvents);
    toast({
      title: `Evento ${newStatus ? 'Publicado' : 'Despublicado'}!`,
      description: `O evento "${eventTitle}" agora está ${newStatus ? 'visível' : 'oculto'} para os alunos.`,
    });
  };

  const value = {
    events,
    loading,
    addEvent,
    updateEvent,
    deleteEvent,
    togglePublishStatus,
  };

  return (
    <EventsContext.Provider value={value}>
      {children}
    </EventsContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventsProvider');
  }
  return context;
};