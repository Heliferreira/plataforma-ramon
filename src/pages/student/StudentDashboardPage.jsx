import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Clock, BookOpen, ArrowRight, TrendingUp, Target, Users, Award, PlayCircle, CalendarPlus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useActivities } from '@/contexts/ActivitiesContext';
import { useContent } from '@/contexts/ContentContext';
import { useProgress } from '@/contexts/ProgressContext';
import { useEvents } from '@/contexts/EventsContext';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ProgressCircle = ({ percentage, size = 120, strokeWidth = 10 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="absolute top-0 left-0 w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <circle
          className="text-secondary"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <motion.circle
          className="text-primary drop-shadow-[0_2px_5px_rgba(var(--primary-rgb),0.5)]"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "circOut" }}
        />
      </svg>
      <span className="absolute text-2xl font-bold text-foreground">{percentage}%</span>
    </div>
  );
};

const StudentDashboardPage = () => {
  const { user } = useAuth();
  const { activities, loading: activitiesLoading } = useActivities();
  const { courses, lessons, loading: contentLoading } = useContent();
  const { getStudentProgressForCourse, loading: progressLoading } = useProgress();
  const { events, loading: eventsLoading } = useEvents();
  const [dashboardData, setDashboardData] = useState({
    overallProgress: 0,
    coursesInProgress: [],
    mentorshipTasks: [],
    completedLessons: 0,
    totalLessons: 0,
    nextEvent: null,
    certificates: 0,
  });

  useEffect(() => {
    if (!user || activitiesLoading || contentLoading || progressLoading || eventsLoading) return;

    const publishedCourses = courses.filter(c => c.status === 'published');
    const studentMentorshipTasks = activities.filter(a => a.type === 'mentorship');

    let totalCompletedLessons = 0;
    let totalLessonsInCourses = 0;
    let completedCoursesCount = 0;
    let coursesInProgress = [];

    publishedCourses.forEach(course => {
      const { completedCount, totalCount, percentage } = getStudentProgressForCourse(user.id, course.id);
      totalCompletedLessons += completedCount;
      totalLessonsInCourses += totalCount;
      if (percentage === 100 && totalCount > 0) {
        completedCoursesCount++;
      }
      if (percentage > 0 && percentage < 100) {
        coursesInProgress.push({ ...course, progress: percentage });
      }
    });

    const overallProgress = totalLessonsInCourses > 0 ? Math.round((totalCompletedLessons / totalLessonsInCourses) * 100) : 0;
    
    const upcomingEvents = events
      .filter(e => e.published && new Date(e.date) >= new Date())
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    setDashboardData({
      overallProgress,
      coursesInProgress,
      mentorshipTasks: studentMentorshipTasks,
      completedLessons: totalCompletedLessons,
      totalLessons: totalLessonsInCourses,
      nextEvent: upcomingEvents.length > 0 ? upcomingEvents[0] : null,
      certificates: completedCoursesCount,
    });

  }, [user, activities, activitiesLoading, courses, lessons, contentLoading, progressLoading, getStudentProgressForCourse, events, eventsLoading]);
  
  if (activitiesLoading || contentLoading || progressLoading || eventsLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin" /> Carregando seu dashboard...</div>;
  }
  
  const pendingMentorshipTasks = dashboardData.mentorshipTasks.filter(task => task.status !== 'Concluída');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <section className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Olá, {user?.name || 'Aluno(a)'}!</h1>
          <p className="text-lg text-muted-foreground mt-1">Seu progresso e próximas atividades em um só lugar.</p>
        </div>
        {dashboardData.nextEvent && (
          <Card className="bg-primary/10 border-primary/30 p-4 rounded-lg shadow-sm w-full md:w-auto">
            <div className="flex items-center gap-3">
              <CalendarPlus className="h-8 w-8 text-primary" />
              <div>
                <p className="font-semibold text-foreground">{dashboardData.nextEvent.title}</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(`${dashboardData.nextEvent.date}T00:00:00`), "EEEE, dd 'de' MMM", { locale: ptBR })} às {dashboardData.nextEvent.time}
                </p>
              </div>
            </div>
          </Card>
        )}
      </section>

      <div className="grid md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <Card className="h-full flex flex-col items-center justify-center text-center py-8 glassmorphism">
            <CardHeader>
              <CardTitle className="text-xl">Progresso Geral</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <ProgressCircle percentage={dashboardData.overallProgress} />
              <p className="mt-4 text-muted-foreground">{dashboardData.completedLessons} de {dashboardData.totalLessons} aulas concluídas</p>
              <Button variant="link" asChild className="mt-2">
                <Link to="/student/courses">Ver todos os cursos <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="md:col-span-2">
          <Card className="h-full glassmorphism">
            <CardHeader>
              <CardTitle className="text-xl flex items-center"><TrendingUp className="mr-2 h-6 w-6 text-primary" /> Cursos em Progresso</CardTitle>
              <CardDescription>Continue de onde parou e alcance seus objetivos.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {dashboardData.coursesInProgress.slice(0, 3).map(course => (
                <Link to={`/student/course/${course.id}`} key={course.id} className="block hover:bg-secondary/50 p-3 rounded-lg transition-colors border border-border/50">
                  <div className="flex items-center gap-4">
                     <div className="w-16 h-16 bg-secondary rounded-md flex items-center justify-center">
                        <img  alt={course.title} src={course.thumbnailUrl || `https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=100&h=100&fit=crop`} className="w-full h-full object-cover rounded-md opacity-70" src="https://images.unsplash.com/photo-1591206246151-e6e64ec4a5ce" />
                     </div>
                    <div className="flex-grow">
                      <h3 className="font-semibold text-foreground">{course.title}</h3>
                      <Progress value={course.progress} className="h-2 my-1" />
                      <p className="text-xs text-muted-foreground">Progresso: {course.progress}%</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </Link>
              ))}
              {dashboardData.coursesInProgress.length === 0 && <p className="text-muted-foreground text-center py-4">Nenhum curso em progresso. Ótimo trabalho!</p>}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2">
          <Card className="h-full glassmorphism">
            <CardHeader>
              <CardTitle className="text-xl flex items-center"><Target className="mr-2 h-6 w-6 text-primary" /> Atividades da Mentoria</CardTitle>
              <CardDescription>Tarefas e desafios designados pelo seu mentor.</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingMentorshipTasks.length > 0 ? (
                <ul className="space-y-3">
                  {pendingMentorshipTasks.slice(0, 4).map(task => (
                    <li key={task.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-md border border-border/50">
                      <div>
                        <p className="font-medium text-foreground">{task.title}</p>
                        <p className="text-xs text-muted-foreground">Prazo: {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <Badge variant={task.status === 'Pendente' ? 'destructive' : 'default'}>{task.status}</Badge>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground text-center py-4">Nenhuma atividade pendente.</p>
              )}
              <Button variant="outline" asChild className="mt-4 w-full">
                <Link to="/student/activities">Ver todas as atividades <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          <Card className="h-full glassmorphism">
            <CardHeader>
              <CardTitle className="text-xl flex items-center"><BookOpen className="mr-2 h-6 w-6 text-primary" /> Resumo do Aprendizado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-md">
                <p className="font-medium text-foreground">Aulas Concluídas</p>
                <Badge variant="secondary" className="text-lg">{dashboardData.completedLessons}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-md">
                <p className="font-medium text-foreground">Certificados Obtidos</p>
                <Badge variant="secondary" className="text-lg">{dashboardData.certificates}</Badge>
              </div>
               <Button variant="default" asChild className="w-full">
                <Link to="/student/certificates">
                  <Award className="mr-2 h-4 w-4" /> Ver Meus Certificados
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Card className="glassmorphism">
            <CardHeader>
                <CardTitle className="text-xl flex items-center"><Users className="mr-2 h-6 w-6 text-primary" /> Conecte-se e Evolua</CardTitle>
                <CardDescription>Aproveite ao máximo os recursos da mentoria.</CardDescription>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                <Link to="/student/calendar">
                    <Button variant="outline" className="w-full h-20 text-base flex-col items-center justify-center gap-1">
                        <Clock className="h-6 w-6 mb-1 text-primary" />
                        Meu Calendário
                    </Button>
                </Link>
                <Link to="/student/activities">
                     <Button variant="outline" className="w-full h-20 text-base flex-col items-center justify-center gap-1">
                        <Target className="h-6 w-6 mb-1 text-primary" />
                        Minhas Tarefas
                    </Button>
                </Link>
                <Link to="/contact">
                    <Button variant="outline" className="w-full h-20 text-base flex-col items-center justify-center gap-1">
                        <PlayCircle className="h-6 w-6 mb-1 text-primary" />
                        Suporte ao Aluno
                    </Button>
                </Link>
            </CardContent>
        </Card>
      </motion.div>

    </motion.div>
  );
};

export default StudentDashboardPage;