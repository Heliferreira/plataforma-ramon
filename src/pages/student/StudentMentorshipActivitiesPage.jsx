import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ClipboardList, Filter, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const StudentMentorshipActivitiesPage = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'Pendente', 'Em Andamento', 'Concluída'

  useEffect(() => {
    if (!user) return;

    const storedActivities = localStorage.getItem('mentorship_activities');
    const allActivities = storedActivities ? JSON.parse(storedActivities) : [];

    const userActivities = allActivities.filter(activity =>
      activity.assignedTo && activity.assignedTo.includes(user.id)
    );
    
    const studentProgress = JSON.parse(localStorage.getItem(`student_activity_progress_${user.id}`)) || {};
    
    const activitiesWithProgress = userActivities.map(activity => ({
      ...activity,
      status: studentProgress[activity.id] || activity.status,
    }));

    setActivities(activitiesWithProgress);
  }, [user]);

  const handleStatusChange = (activityId, newStatus) => {
    const updatedActivities = activities.map(act =>
      act.id === activityId ? { ...act, status: newStatus } : act
    );
    setActivities(updatedActivities);

    const studentProgress = JSON.parse(localStorage.getItem(`student_activity_progress_${user.id}`)) || {};
    studentProgress[activityId] = newStatus;
    localStorage.setItem(`student_activity_progress_${user.id}`, JSON.stringify(studentProgress));
  };

  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true;
    return activity.status === filter;
  });

  const getStatusBadgeVariant = (status) => {
    if (status === 'Concluída') return 'success';
    if (status === 'Em Andamento') return 'default';
    if (status === 'Pendente') return 'destructive';
    return 'secondary';
  };
  
  const getPriorityBadgeVariant = (priority) => {
    if (priority === 'Alta') return 'destructive';
    if (priority === 'Média') return 'warning';
    return 'secondary';
  };

  const statusOptions = [
    { value: 'all', label: 'Todas' },
    { value: 'Pendente', label: 'Pendentes' },
    { value: 'Em Andamento', label: 'Em Andamento' },
    { value: 'Concluída', label: 'Concluídas' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <section className="text-center py-10 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl shadow-inner">
        <motion.h1 
          initial={{ opacity:0, y: -20 }}
          animate={{ opacity:1, y: 0 }}
          className="text-4xl md:text-5xl font-bold gradient-text mb-3"
        >
          Atividades da Mentoria
        </motion.h1>
        <motion.p 
          initial={{ opacity:0, y: 20 }}
          animate={{ opacity:1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-muted-foreground max-w-2xl mx-auto"
        >
          Acompanhe e gerencie as tarefas designadas pelo seu mentor.
        </motion.p>
      </section>

      <div className="flex justify-end px-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filtrar: {statusOptions.find(opt => opt.value === filter)?.label}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Status da Atividade</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={filter} onValueChange={setFilter}>
              {statusOptions.map(opt => (
                <DropdownMenuRadioItem key={opt.value} value={opt.value}>{opt.label}</DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {filteredActivities.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <ClipboardList className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold text-foreground">Nenhuma atividade encontrada</h2>
          <p className="text-muted-foreground mt-2">
            {filter === 'all' ? "Você não tem atividades da mentoria no momento." : `Nenhuma atividade com o status "${statusOptions.find(opt => opt.value === filter)?.label}".`}
          </p>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {filteredActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glassmorphism hover:shadow-primary/10 transition-shadow">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2">
                    <CardTitle className="text-xl">{activity.title}</CardTitle>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge variant={getPriorityBadgeVariant(activity.priority)}>{activity.priority}</Badge>
                      <Badge variant={getStatusBadgeVariant(activity.status)}>{activity.status}</Badge>
                    </div>
                  </div>
                  <CardDescription className="mt-1">{activity.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm text-muted-foreground">
                    Prazo: {new Date(activity.dueDate).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                  <div className="flex items-center space-x-3 pt-2">
                    <Button 
                      size="sm" 
                      variant={activity.status === 'Pendente' ? "default" : "outline"}
                      onClick={() => handleStatusChange(activity.id, 'Pendente')}
                      disabled={activity.status === 'Pendente'}
                    >
                      <AlertTriangle className="mr-2 h-4 w-4" /> Pendente
                    </Button>
                    <Button 
                      size="sm" 
                      variant={activity.status === 'Em Andamento' ? "default" : "outline"}
                      onClick={() => handleStatusChange(activity.id, 'Em Andamento')}
                      disabled={activity.status === 'Em Andamento'}
                    >
                      <Loader2 className={`mr-2 h-4 w-4 ${activity.status === 'Em Andamento' ? 'animate-spin' : ''}`} /> Em Andamento
                    </Button>
                    <Button 
                      size="sm" 
                      variant={activity.status === 'Concluída' ? "success" : "outline"}
                      onClick={() => handleStatusChange(activity.id, 'Concluída')}
                      disabled={activity.status === 'Concluída'}
                      className={activity.status === 'Concluída' ? 'bg-green-600 hover:bg-green-700 text-white' : ''}
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" /> Concluída
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default StudentMentorshipActivitiesPage;