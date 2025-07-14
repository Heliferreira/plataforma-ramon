import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { PlusCircle, Search, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

const AdminGeneralActivitiesPage = () => {
  const { toast } = useToast();
  const [activities, setActivities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [currentActivity, setCurrentActivity] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', date: '', type: '' });

  useEffect(() => {
    const storedActivities = localStorage.getItem('mentorship_general_activities');
    if (storedActivities) {
      setActivities(JSON.parse(storedActivities));
    }
  }, []);

  const saveData = (data) => {
    localStorage.setItem('mentorship_general_activities', JSON.stringify(data));
    setActivities(data);
  };

  const filteredActivities = activities.filter(activity =>
    activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentActivity) {
      const updatedActivities = activities.map(act => act.id === currentActivity.id ? { ...act, ...formData, status: act.status } : act);
      saveData(updatedActivities);
      toast({ title: "Atividade Atualizada!", description: `A atividade "${formData.title}" foi atualizada.` });
    } else {
      const newActivity = { id: `GA${Date.now().toString().slice(-3)}`, ...formData, status: 'scheduled' };
      saveData([newActivity, ...activities]);
      toast({ title: "Atividade Criada!", description: `A atividade "${formData.title}" foi criada.` });
    }
    setShowForm(false);
    setCurrentActivity(null);
    setFormData({ title: '', description: '', date: '', type: '' });
  };

  const handleEdit = (activity) => {
    setCurrentActivity(activity);
    setFormData({ title: activity.title, description: activity.description, date: activity.date, type: activity.type });
    setShowForm(true);
  };

  const handleDelete = (activityId) => {
    const updatedActivities = activities.filter(act => act.id !== activityId);
    saveData(updatedActivities);
    toast({ title: "Atividade Removida!", description: "A atividade foi removida com sucesso.", variant: "destructive" });
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    setCurrentActivity(null);
    setFormData({ title: '', description: '', date: '', type: '' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="h1-seo">Atividades Gerais</h1>
        <Button onClick={toggleForm}>
          <PlusCircle className="mr-2 h-4 w-4" /> {showForm ? 'Cancelar' : 'Nova Atividade Geral'}
        </Button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
          <Card className="glassmorphism">
            <CardHeader>
              <CardTitle>{currentActivity ? 'Editar Atividade Geral' : 'Criar Nova Atividade Geral'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Título da Atividade</Label>
                  <Input id="title" name="title" value={formData.title} onChange={handleInputChange} placeholder="Ex: Workshop de Marketing Digital" required />
                </div>
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} placeholder="Detalhes da atividade..." required />
                </div>
                <div>
                  <Label htmlFor="type">Tipo de Atividade</Label>
                  <Input id="type" name="type" value={formData.type} onChange={handleInputChange} placeholder="Ex: Workshop, Palestra, Desafio" required />
                </div>
                <div>
                  <Label htmlFor="date">Data</Label>
                  <Input id="date" name="date" type="date" value={formData.date} onChange={handleInputChange} required />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={toggleForm}>Cancelar</Button>
                  <Button type="submit">{currentActivity ? 'Salvar Alterações' : 'Criar Atividade'}</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle>Lista de Atividades Gerais</CardTitle>
          <CardDescription>Gerencie workshops, palestras, desafios e outras atividades.</CardDescription>
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
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Título</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">Tipo</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Data</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-background divide-y divide-border">
                {filteredActivities.map((activity) => (
                  <tr key={activity.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{activity.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground hidden md:table-cell">{activity.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground hidden sm:table-cell">{new Date(activity.date + 'T00:00:00').toLocaleDateString('pt-BR')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Badge variant={activity.status === 'scheduled' ? 'default' : (activity.status === 'ongoing' ? 'secondary' : 'outline')}
                             className={
                                activity.status === 'scheduled' ? 'bg-blue-500/20 text-blue-700 border-blue-500/30' :
                                (activity.status === 'ongoing' ? 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30' : 'bg-gray-500/20 text-gray-700 border-gray-500/30')
                              }>
                        {activity.status === 'scheduled' ? 'Agendada' : (activity.status === 'ongoing' ? 'Em Andamento' : 'Concluída')}
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
                          <DropdownMenuItem onClick={() => handleEdit(activity)}>
                            <Edit className="mr-2 h-4 w-4" /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(activity.id)} className="text-red-600 focus:text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" /> Remover
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredActivities.length === 0 && (
            <p className="text-center text-muted-foreground py-8">Nenhuma atividade geral encontrada.</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AdminGeneralActivitiesPage;