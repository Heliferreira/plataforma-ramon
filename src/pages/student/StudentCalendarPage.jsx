import React from 'react';
import { motion } from 'framer-motion';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useCalendar } from '@/contexts/CalendarContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

const StudentCalendarPage = () => {
  const { calendarItems, loading } = useCalendar();
  const [selectedEvent, setSelectedEvent] = React.useState(null);

  const handleEventClick = (clickInfo) => {
    setSelectedEvent(clickInfo.event);
  };
  
  const generateGoogleCalendarUrl = (event) => {
    if (!event) return '';
  
    const { title } = event;
    const { description, location, link } = event.extendedProps;
  
    const startTime = event.start.toISOString().replace(/-|:|\.\d\d\d/g, "");
    // Google Calendar 'dates' format requires end time. We'll default to one hour after start.
    const endTime = new Date(event.start.getTime() + 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, "");
    
    let details = description || '';
    if (link) {
      details += `\n\nLink para o evento: ${link}`;
    }
  
    const url = new URL('https://calendar.google.com/calendar/render');
    url.searchParams.append('action', 'TEMPLATE');
    url.searchParams.append('text', title);
    url.searchParams.append('dates', `${startTime}/${endTime}`);
    url.searchParams.append('details', details);
    url.searchParams.append('location', location || '');
  
    return url.toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <section className="text-center">
        <h1 className="h1-seo mb-4">Meu Calendário</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Visualize seus eventos, atividades e sessões de mentoria.
        </p>
      </section>

      <Card className="glassmorphism p-2 sm:p-4 md:p-6">
        <CardContent className="p-0">
          {loading ? (
             <div className="flex justify-center items-center h-96">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
             </div>
          ) : (
            <div className="calendar-container">
              <style>{`
                .fc-button { 
                  background-color: hsl(var(--primary)) !important; 
                  border-color: hsl(var(--primary)) !important;
                  color: hsl(var(--primary-foreground)) !important;
                  opacity: 1 !important;
                }
                .fc-button:hover {
                  background-color: hsl(var(--primary) / 0.9) !important;
                }
                .fc-button-primary:disabled {
                  background-color: hsl(var(--primary) / 0.5) !important;
                }
                .fc-daygrid-day.fc-day-today {
                  background-color: hsl(var(--primary) / 0.1) !important;
                }
                .fc-event {
                  cursor: pointer;
                  border: 1px solid hsla(var(--background-hsl), 0.5) !important;
                }
                .fc-h-event {
                  background-color: var(--event-color) !important;
                }
                .fc-v-event {
                  background-color: var(--event-color) !important;
                }
              `}</style>
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                events={calendarItems}
                eventClick={handleEventClick}
                editable={false}
                selectable={true}
                dayMaxEvents={true}
                locale="pt-br"
                buttonText={{
                  today: 'Hoje',
                  month: 'Mês',
                  week: 'Semana',
                  day: 'Dia',
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent>
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle style={{color: selectedEvent.backgroundColor}}>{selectedEvent.title}</DialogTitle>
                <DialogDescription>
                  {new Date(selectedEvent.start).toLocaleString('pt-BR', { dateStyle: 'full', timeStyle: 'short' })}
                </DialogDescription>
              </DialogHeader>
              <div>
                <p><strong>Tipo:</strong> {selectedEvent.extendedProps.typeLabel}</p>
                {selectedEvent.extendedProps.description && <p><strong>Descrição:</strong> {selectedEvent.extendedProps.description}</p>}
                {selectedEvent.extendedProps.location && <p><strong>Local:</strong> {selectedEvent.extendedProps.location}</p>}
                {selectedEvent.extendedProps.link && <p><strong>Link:</strong> <a href={selectedEvent.extendedProps.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{selectedEvent.extendedProps.link}</a></p>}
              </div>
              <DialogFooter>
                 <Button variant="ghost" onClick={() => setSelectedEvent(null)}>Fechar</Button>
                 <a href={generateGoogleCalendarUrl(selectedEvent)} target="_blank" rel="noopener noreferrer">
                   <Button>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Adicionar ao Google Calendar
                   </Button>
                 </a>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default StudentCalendarPage;