import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { PlusCircle, Search, Edit, Trash2, MoreHorizontal, MapPin, Users, ToggleLeft, ToggleRight, Eye, EyeOff } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';
import { useEvents } from '@/contexts/EventsContext';
import { format } from 'date-fns';

const AdminEventsPage = () => {
  const { events, addEvent, updateEvent, deleteEvent, togglePublishStatus, loading } = useEvents();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', date: '', time: '', location: '', type: '', link: '' });

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
      setShowForm(false);
      setCurrentEvent(null);
      setFormData({ title: '', description: '', date: '', time: '', location: '', type: '', link: '' });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentEvent) {
      updateEvent(currentEvent.id, formData);
    } else {
      addEvent(formData);
    }
    resetForm();
  };

  const handleEdit = (event) => {
    setCurrentEvent(event);
    setFormData({ 
      title: event.title, 
      description: event.description, 
      date: format(new Date(event.date), 'yyyy-MM-dd'), 
      time: event.time, 
      location: event.location, 
      type: event.type,
      link: event.link || ''
    });
    setShowForm(true);
  };

  const handleDelete = (eventId) => {
    deleteEvent(eventId);
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    if (showForm) {
      resetForm();
    }
  };
  
  const getEventStatus = (event) => {
    if (event.status === 'cancelled') return { text: 'Cancelado', variant: 'destructive' };
    const eventDate = new Date(`${event.date}T${event.time}`);
    if (eventDate < new Date()) return { text: 'Passado', variant: 'outline' };
    return { text: 'Próximo', variant: 'default' };
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="h1-seo">Gerenciar Eventos</h1>
        <Button onClick={toggleForm}>
          <PlusCircle className="mr-2 h-4 w-4" /> {showForm ? 'Cancelar' : 'Novo Evento'}
        </Button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
          <Card className="glassmorphism">
            <CardHeader>
              <CardTitle>{currentEvent ? 'Editar Evento' : 'Criar Novo Evento'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Título do Evento</Label>
                  <Input id="title" name="title" value={formData.title} onChange={handleInputChange} placeholder="Ex: Lançamento do Curso X" required />
                </div>
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} placeholder="Detalhes do evento..." required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Data</Label>
                    <Input id="date" name="date" type="date" value={formData.date} onChange={handleInputChange} required />
                  </div>
                  <div>
                    <Label htmlFor="time">Horário</Label>
                    <Input id="time" name="time" type="time" value={formData.time} onChange={handleInputChange} required />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Tipo de Evento</Label>
                    <Input id="type" name="type" value={formData.type} onChange={handleInputChange} placeholder="Ex: Webinar, Meetup, Workshop" required />
                  </div>
                   <div>
                    <Label htmlFor="location">Localização / Plataforma</Label>
                    <Input id="location" name="location" value={formData.location} onChange={handleInputChange} placeholder="Ex: Online (Zoom) ou Endereço" required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="link">Link de Participação</Label>
                  <Input id="link" name="link" value={formData.link} onChange={handleInputChange} placeholder="https://zoom.us/j/123456" />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={toggleForm}>Cancelar</Button>
                  <Button type="submit">{currentEvent ? 'Salvar Alterações' : 'Criar Evento'}</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle>Lista de Eventos</CardTitle>
          <CardDescription>Gerencie todos os eventos da plataforma.</CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Buscar por título ou tipo..."
              className="pl-10 w-full sm:w-1/2 lg:w-1/3"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Evento</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Data e Hora</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Tipo</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Visibilidade</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-background divide-y divide-border">
                {filteredEvents.map((event) => {
                  const status = getEventStatus(event);
                  return (
                  <tr key={event.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-foreground">{event.title}</div>
                      <div className="text-xs text-muted-foreground flex items-center mt-1">
                         <MapPin className="h-3 w-3 mr-1 text-primary" />{event.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground hidden lg:table-cell">
                      {format(new Date(`${event.date}T${event.time}`), "dd/MM/yyyy 'às' HH:mm")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground hidden sm:table-cell">{event.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Badge variant={event.published ? 'default' : 'secondary'} className={event.published ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}>
                        <div className="flex items-center gap-1">
                         {event.published ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                         {event.published ? 'Publicado' : 'Rascunho'}
                        </div>
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                       <Badge variant={status.variant}>
                        {status.text}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                           <DropdownMenuItem onClick={() => togglePublishStatus(event.id)}>
                            {event.published ? <ToggleLeft className="mr-2 h-4 w-4" /> : <ToggleRight className="mr-2 h-4 w-4" />}
                            {event.published ? 'Despublicar' : 'Publicar'}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleEdit(event)}>
                            <Edit className="mr-2 h-4 w-4" /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(event.id)} className="text-red-600 focus:text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" /> Remover
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
          {filteredEvents.length === 0 && !loading && (
            <p className="text-center text-muted-foreground py-8">Nenhum evento encontrado.</p>
          )}
          {loading && <p className="text-center text-muted-foreground py-8">Carregando eventos...</p>}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AdminEventsPage;