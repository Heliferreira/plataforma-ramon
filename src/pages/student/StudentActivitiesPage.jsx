import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { PlusCircle, Trash2, Edit3, ListChecks, CalendarDays, AlertTriangle, User, Briefcase } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useActivities } from '@/contexts/ActivitiesContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

const StudentActivitiesPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { activities, addPersonalActivity, updatePersonalActivity, deletePersonalActivity, updateActivityStatus, loading } = useActivities();
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'inProgress', 'completed'
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    dueDate: '',
    status: 'Pendente',
    notes: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openForm = (activity = null) => {
    if (activity) {
      setEditingActivity(activity);
      setFormData({
        title: activity.title,
        description: activity.description,
        startDate: activity.startDate || '',
        dueDate: activity.dueDate,
        status: activity.status,
        notes: activity.notes || '',
      });
    } else {
      setEditingActivity(null);
      setFormData({
        title: '',
        description: '',
        startDate: '',
        dueDate: '',
        status: 'Pendente',
        notes: '',
      });
    }
    setIsFormOpen(true);
  };

  const handleSubmit = () => {
    if (formData.title.trim() === '' || formData.dueDate === '') {
      toast({ title: "Erro", description: "Título e Data de Conclusão são obrigatórios.", variant: "destructive" });
      return;
    }

    if (editingActivity) {
      updatePersonalActivity(editingActivity.id, formData);
      toast({ title: "Sucesso!", description: "Atividade atualizada." });
    } else {
      addPersonalActivity(formData);
      toast({ title: "Sucesso!", description: "Nova atividade pessoal adicionada." });
    }
    setIsFormOpen(false);
  };

  const handleDelete = (activityId) => {
    deletePersonalActivity(activityId);
    toast({ title: "Atividade Removida", description: "A atividade foi excluída com sucesso." });
  };
  
  const handleStatusChange = (activityId, newStatus) => {
    updateActivityStatus(activityId, newStatus, user.id);
  };

  const filteredActivities = activities.filter(act => {
    if (filter === 'all') return true;
    if (filter === 'pending') return act.status === 'Pendente';
    if (filter === 'inProgress') return act.status === 'Em Andamento';
    if (filter === 'completed') return act.status === 'Concluída';
    return true;
  }).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  const today = new Date().toISOString().split('T')[0];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <section className="text-center">
        <h1 className="h1-seo mb-4">Minhas Atividades</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Organize suas tarefas de estudo, projetos e compromissos da mentoria.
        </p>
      </section>

      <Card className="glassmorphism">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center"><ListChecks className="mr-3 h-6 w-6 text-primary" /> Planejador de Atividades</CardTitle>
            <Button onClick={() => openForm()}>
              <PlusCircle className="mr-2 h-5 w-5" /> Adicionar Atividade
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground">Filtre suas atividades para manter o foco.</p>
            <div className="flex gap-2">
              <Button variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')}>Todas</Button>
              <Button variant={filter === 'pending' ? 'default' : 'outline'} onClick={() => setFilter('pending')}>Pendentes</Button>
              <Button variant={filter === 'inProgress' ? 'default' : 'outline'} onClick={() => setFilter('inProgress')}>Em Andamento</Button>
              <Button variant={filter === 'completed' ? 'default' : 'outline'} onClick={() => setFilter('completed')}>Concluídas</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingActivity ? 'Editar Atividade' : 'Adicionar Nova Atividade'}</DialogTitle>
            <DialogDescription>
              Preencha os detalhes da sua atividade pessoal.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">Título</Label>
              <Input id="title" name="title" value={formData.title} onChange={handleInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Descrição</Label>
              <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startDate" className="text-right">Início</Label>
              <Input id="startDate" name="startDate" type="date" value={formData.startDate} onChange={handleInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dueDate" className="text-right">Conclusão</Label>
              <Input id="dueDate" name="dueDate" type="date" value={formData.dueDate} onChange={handleInputChange} className="col-span-3" min={today} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">Notas</Label>
              <Textarea id="notes" name="notes" value={formData.notes} onChange={handleInputChange} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">Cancelar</Button>
            </DialogClose>
            <Button type="button" onClick={handleSubmit}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="space-y-4">
        {loading ? (
           <p className="text-muted-foreground text-center py-8">Carregando atividades...</p>
        ) : filteredActivities.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">Nenhuma atividade encontrada para este filtro.</p>
        ) : (
          filteredActivities.map(activity => (
            <motion.div
              key={activity.id}
              layout
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className={`${activity.status === 'Concluída' ? 'bg-green-500/10 border-green-500/30' : 'bg-card'}`}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{activity.title}</CardTitle>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        {activity.type === 'personal' ? (
                          <Badge variant="secondary" className="flex items-center"><User className="h-3 w-3 mr-1" /> Pessoal</Badge>
                        ) : (
                          <Badge variant="default" className="flex items-center"><Briefcase className="h-3 w-3 mr-1" /> Mentoria</Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {activity.type === 'personal' && (
                        <>
                          <Button variant="ghost" size="icon" onClick={() => openForm(activity)} className="h-8 w-8">
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir a atividade "{activity.title}"? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(activity.id)} className="bg-destructive hover:bg-destructive/90">Excluir</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className={`text-sm text-muted-foreground ${activity.status === 'Concluída' ? 'line-through' : ''}`}>
                    {activity.description}
                  </p>
                  {activity.notes && <p className="text-xs mt-2 p-2 bg-secondary/50 rounded-md"><strong>Notas:</strong> {activity.notes}</p>}
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CalendarDays className="mr-2 h-4 w-4" />
                    <span>
                      {activity.startDate ? `${new Date(activity.startDate).toLocaleDateString('pt-BR')} - ` : ''}
                      {new Date(activity.dueDate).toLocaleDateString('pt-BR')}
                    </span>
                    {activity.status !== 'Concluída' && new Date(activity.dueDate) < new Date(today) && <AlertTriangle className="ml-2 h-4 w-4 text-red-500" title="Atividade Atrasada" />}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant={activity.status === 'Pendente' ? 'destructive' : 'outline'} onClick={() => handleStatusChange(activity.id, 'Pendente')}>Pendente</Button>
                    <Button size="sm" variant={activity.status === 'Em Andamento' ? 'default' : 'outline'} onClick={() => handleStatusChange(activity.id, 'Em Andamento')}>Em Andamento</Button>
                    <Button size="sm" variant={activity.status === 'Concluída' ? 'success' : 'outline'} onClick={() => handleStatusChange(activity.id, 'Concluída')}>Concluída</Button>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default StudentActivitiesPage;