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
import { useAuth } from '@/contexts/AuthContext';
import { useActivities } from '@/contexts/ActivitiesContext';
import { Checkbox } from '@/components/ui/checkbox';

const AdminMentorshipActivitiesPage = () => {
  const { toast } = useToast();
  const { getAllUsers } = useAuth();
  const { activities, addMentorshipActivity, updateMentorshipActivity, deleteMentorshipActivity } = useActivities();
  
  const mentorshipActivities = activities.filter(a => a.type === 'mentorship');

  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [currentActivity, setCurrentActivity] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', assignedTo: [], dueDate: '', priority: 'Média' });
  const [allStudents, setAllStudents] = useState([]);

  useEffect(() => {
    const students = getAllUsers().filter(u => u.role === 'student');
    setAllStudents(students);
  }, [getAllUsers]);

  const filteredActivities = mentorshipActivities.filter(activity =>
    activity.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStudentSelect = (studentId) => {
    setFormData(prev => {
      const newAssignedTo = prev.assignedTo.includes(studentId)
        ? prev.assignedTo.filter(id => id !== studentId)
        : [...prev.assignedTo, studentId];
      return { ...prev, assignedTo: newAssignedTo };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentActivity) {
      updateMentorshipActivity(currentActivity.id, formData);
      toast({ title: "Atividade Atualizada!", description: `A atividade "${formData.title}" foi atualizada.` });
    } else {
      addMentorshipActivity(formData);
      toast({ title: "Atividade Criada!", description: `A atividade "${formData.title}" foi criada.` });
    }
    setShowForm(false);
    setCurrentActivity(null);
    setFormData({ title: '', description: '', assignedTo: [], dueDate: '', priority: 'Média' });
  };

  const handleEdit = (activity) => {
    setCurrentActivity(activity);
    setFormData({ title: activity.title, description: activity.description, assignedTo: activity.assignedTo || [], dueDate: activity.dueDate, priority: activity.priority || 'Média' });
    setShowForm(true);
  };

  const handleDelete = (activityId) => {
    deleteMentorshipActivity(activityId);
    toast({ title: "Atividade Removida!", description: "A atividade foi removida com sucesso.", variant: "destructive" });
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    setCurrentActivity(null);
    setFormData({ title: '', description: '', assignedTo: [], dueDate: '', priority: 'Média' });
  };

  const getStudentName = (studentId) => {
    const student = allStudents.find(s => s.id === studentId);
    return student ? student.name : 'Aluno desconhecido';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="h1-seo">Atividades da Mentoria</h1>
        <Button onClick={toggleForm}>
          <PlusCircle className="mr-2 h-4 w-4" /> {showForm ? 'Cancelar' : 'Nova Atividade'}
        </Button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
          <Card className="glassmorphism">
            <CardHeader>
              <CardTitle>{currentActivity ? 'Editar Atividade' : 'Criar Nova Atividade da Mentoria'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Título da Atividade</Label>
                  <Input id="title" name="title" value={formData.title} onChange={handleInputChange} placeholder="Ex: Revisão de Projeto" required />
                </div>
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} placeholder="Detalhes da atividade..." required />
                </div>
                <div>
                  <Label>Atribuir Para</Label>
                  <div className="space-y-2 p-2 border rounded-md max-h-40 overflow-y-auto">
                    {allStudents.length > 0 ? allStudents.map(student => (
                      <div key={student.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`student-${student.id}`}
                          checked={formData.assignedTo.includes(student.id)}
                          onCheckedChange={() => handleStudentSelect(student.id)}
                        />
                        <Label htmlFor={`student-${student.id}`} className="font-normal">{student.name}</Label>
                      </div>
                    )) : <p className="text-muted-foreground text-sm">Nenhum aluno cadastrado.</p>}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dueDate">Data de Entrega</Label>
                    <Input id="dueDate" name="dueDate" type="date" value={formData.dueDate} onChange={handleInputChange} required />
                  </div>
                  <div>
                    <Label htmlFor="priority">Prioridade</Label>
                    <select id="priority" name="priority" value={formData.priority} onChange={handleInputChange} className="w-full p-2 border rounded-md bg-background">
                      <option value="Baixa">Baixa</option>
                      <option value="Média">Média</option>
                      <option value="Alta">Alta</option>
                    </select>
                  </div>
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
          <CardTitle>Lista de Atividades da Mentoria</CardTitle>
          <CardDescription>Gerencie as atividades designadas aos alunos.</CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Buscar por título..."
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
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">Atribuído Para</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Data de Entrega</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-background divide-y divide-border">
                {filteredActivities.map((activity) => (
                  <tr key={activity.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{activity.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground hidden md:table-cell">
                      {activity.assignedTo.length > 1 ? `${activity.assignedTo.length} alunos` : getStudentName(activity.assignedTo[0])}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground hidden sm:table-cell">{new Date(activity.dueDate + 'T00:00:00').toLocaleDateString('pt-BR')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Badge variant={activity.status === 'Concluída' ? 'default' : 'secondary'} className={activity.status === 'Concluída' ? 'bg-green-500/20 text-green-700 border-green-500/30' : 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30'}>
                        {activity.status}
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
            <p className="text-center text-muted-foreground py-8">Nenhuma atividade encontrada.</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AdminMentorshipActivitiesPage;