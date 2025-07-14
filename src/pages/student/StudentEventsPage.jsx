import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useEvents } from '@/contexts/EventsContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, ExternalLink, Clock, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const StudentEventsPage = () => {
  const { events, loading } = useEvents();
  const [filter, setFilter] = useState('upcoming'); // 'upcoming' or 'past'

  const publishedEvents = events.filter(e => e.published);

  const upcomingEvents = publishedEvents
    .filter(e => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  
  const pastEvents = publishedEvents
    .filter(e => new Date(e.date) < new Date())
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const eventsToShow = filter === 'upcoming' ? upcomingEvents : pastEvents;
  
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: i => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
      },
    }),
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      <section className="text-center py-10 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl shadow-inner">
        <motion.h1 
          initial={{ opacity:0, y: -20 }}
          animate={{ opacity:1, y: 0 }}
          className="text-4xl md:text-5xl font-bold gradient-text mb-3"
        >
          Eventos da Comunidade
        </motion.h1>
        <motion.p 
          initial={{ opacity:0, y: 20 }}
          animate={{ opacity:1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-muted-foreground max-w-2xl mx-auto"
        >
          Participe de workshops, webinars e encontros exclusivos para membros.
        </motion.p>
      </section>

      <div className="flex justify-center gap-2">
        <Button onClick={() => setFilter('upcoming')} variant={filter === 'upcoming' ? 'default' : 'outline'}>Próximos Eventos</Button>
        <Button onClick={() => setFilter('past')} variant={filter === 'past' ? 'default' : 'outline'}>Eventos Passados</Button>
      </div>

      {loading ? (
        <p className="text-center text-muted-foreground">Carregando eventos...</p>
      ) : eventsToShow.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventsToShow.map((event, index) => (
            <motion.div
              key={event.id}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
            >
              <Card className="h-full flex flex-col glassmorphism hover:shadow-primary/20 transition-shadow duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-semibold mb-2">{event.title}</CardTitle>
                    <Badge variant="outline" className="capitalize flex-shrink-0">{event.type}</Badge>
                  </div>
                  <CardDescription>{event.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2 text-primary" />
                        <span>{format(new Date(`${event.date}T00:00:00`), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-2 text-primary" />
                        <span>{event.time}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2 text-primary" />
                        <span>{event.location}</span>
                    </div>
                </CardContent>
                <div className="p-4 pt-0 mt-auto">
                {event.link ? (
                    <a href={event.link} target="_blank" rel="noopener noreferrer">
                        <Button className="w-full mt-2">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Acessar Evento
                        </Button>
                    </a>
                ) : (
                    <Button className="w-full mt-2" disabled>
                        Link não disponível
                    </Button>
                )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold">Nenhum evento encontrado</h2>
          <p className="text-muted-foreground mt-2">
            Não há eventos {filter === 'upcoming' ? 'próximos' : 'passados'} no momento. Fique de olho!
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default StudentEventsPage;