import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen as BookOpenIcon, BarChart2, Activity, CalendarPlus, ClipboardCheck as MentorshipIcon, UserPlus, Edit, FileImage as SendIcon, CheckCircle } from 'lucide-react';
import AdminStatsGrid from '@/components/admin/dashboard/AdminStatsGrid';
import RecentActivitiesList from '@/components/admin/dashboard/RecentActivitiesList';
import QuickActions from '@/components/admin/dashboard/QuickActions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { useActivities } from '@/contexts/ActivitiesContext';
import { Link } from 'react-router-dom';
import { useContent } from '@/contexts/ContentContext';
import { useProgress } from '@/contexts/ProgressContext';

const StudentProgressOverview = ({ students }) => {
  const { courses, lessons, loading: contentLoading } = useContent();
  const { getStudentProgressForCourse, loading: progressLoading } = useProgress();

  if (contentLoading || progressLoading) {
    return <p className="text-center text-muted-foreground py-4">Carregando progresso...</p>;
  }

  const getOverallStudentProgress = (studentId) => {
    const publishedCourses = courses.filter(c => c.status === 'published');
    if (publishedCourses.length === 0) return { progress: 0, course: 'Nenhum curso publicado' };

    let totalCompletedLessons = 0;
    let totalLessonsInCourses = 0;

    publishedCourses.forEach(course => {
        const courseLessons = lessons.filter(l => l.courseId === course.id);
        if (courseLessons.length > 0) {
            const { completedCount, totalCount } = getStudentProgressForCourse(studentId, course.id);
            totalCompletedLessons += completedCount;
            totalLessonsInCourses += totalCount;
        }
    });

    const avgProgress = totalLessonsInCourses > 0 ? Math.round((totalCompletedLessons / totalLessonsInCourses) * 100) : 0;
    
    return {
      progress: avgProgress,
      course: `${publishedCourses.length} cursos`,
    };
  };

  return (
    <Card className="glassmorphism">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-foreground">Desenvolvimento dos Alunos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {students.length > 0 ? students.slice(0, 4).map((student, index) => {
          const { progress, course } = getOverallStudentProgress(student.id);
          return (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-3 rounded-md hover:bg-secondary/20 transition-colors"
            >
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm font-medium text-foreground">{student.name} - <span className="text-xs text-muted-foreground">{course}</span></p>
                <p className="text-sm text-primary font-semibold">{progress}%</p>
              </div>
              <Progress value={progress} className="h-2" indicatorClassName="bg-primary" />
            </motion.div>
          );
        }) : (
          <p className="text-center text-muted-foreground py-4">Nenhum aluno cadastrado para exibir o progresso.</p>
        )}
        {students.length > 0 && (
          <Link to="/admin/users" className="text-sm text-primary hover:underline text-center block mt-4">Ver todos os alunos</Link>
        )}
      </CardContent>
    </Card>
  );
};

const AdminDashboardPage = () => {
  const { getAllUsers } = useAuth();
  const { activities } = useActivities();
  const { courses } = useContent();
  const [statsData, setStatsData] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [allStudents, setAllStudents] = useState([]);

  useEffect(() => {
    const students = getAllUsers().filter(u => u.role === 'student');
    setAllStudents(students);

    const getStudentName = (studentId) => students.find(s => s.id === studentId)?.name || 'Um aluno';

    const publishedCourses = courses.filter(c => c.status === 'published');
    const pendingActivitiesCount = activities.filter(a => a.type === 'mentorship' && a.status === 'Pendente').length;
    
    const newStatsData = [
      { title: "Total de Alunos", value: students.length, icon: <Users className="h-8 w-8 text-primary" />, color: "bg-blue-500/20", link: "/admin/users" },
      { title: "Cursos Publicados", value: publishedCourses.length, icon: <BookOpenIcon className="h-8 w-8 text-primary" />, color: "bg-green-500/20", link: "/admin/content" },
      { title: "Engajamento Médio", value: "0%", icon: <BarChart2 className="h-8 w-8 text-primary" />, color: "bg-yellow-500/20", link: "#" },
      { title: "Atividades Pendentes", value: pendingActivitiesCount, icon: <MentorshipIcon className="h-8 w-8 text-primary" />, color: "bg-red-500/20", link: "/admin/mentorship-activities" },
    ];
    setStatsData(newStatsData);
    
    const newRecentActivities = [];
    students.slice(0, 2).forEach((student, index) => {
      newRecentActivities.push({
        id: `student-${student.id}`,
        description: `Novo aluno cadastrado: ${student.name}`,
        time: `${index + 1} dia atrás`,
        icon: <UserPlus className="h-4 w-4 text-primary" />
      });
    });

    activities
      .filter(a => a.status === 'Concluída')
      .slice(0, 2)
      .forEach(activity => {
        const studentName = activity.studentId ? getStudentName(activity.studentId) : 'Um aluno';
         newRecentActivities.push({
            id: activity.id,
            description: `${studentName} concluiu a atividade: "${activity.title}"`,
            time: `recentemente`,
            icon: <CheckCircle className="h-4 w-4 text-green-500" />
        });
      });

    setRecentActivities(newRecentActivities.sort(() => Math.random() - 0.5));

  }, [getAllUsers, activities, courses]);

  const quickActionsData = [
    { label: "Adicionar Novo Aluno", link: "/admin/users", icon: <UserPlus className="h-5 w-5 mr-2" /> },
    { label: "Criar Novo Curso/Módulo", link: "/admin/content", icon: <BookOpenIcon className="h-5 w-5 mr-2" /> },
    { label: "Lançar Atividade Mentoria", link: "/admin/mentorship-activities", icon: <MentorshipIcon className="h-5 w-5 mr-2" /> },
    { label: "Lançar Atividade Geral", link: "/admin/general-activities", icon: <Activity className="h-5 w-5 mr-2" /> },
    { label: "Criar Evento", link: "/admin/events", icon: <CalendarPlus className="h-5 w-5 mr-2" /> },
    { label: "Enviar Comunicado", link: "#", icon: <SendIcon className="h-5 w-5 mr-2" /> },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <h1 className="h1-seo">Painel Administrativo</h1>

      <section>
        <h2 className="text-2xl font-semibold mb-6 text-foreground">Visão Geral</h2>
        <AdminStatsGrid stats={statsData} />
      </section>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <section className="lg:col-span-2 space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-foreground">Atividades Recentes</h2>
            <RecentActivitiesList activities={recentActivities} />
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-foreground">Desenvolvimento dos Alunos</h2>
            <StudentProgressOverview students={allStudents} />
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6 text-foreground">Ações Rápidas</h2>
          <QuickActions actions={quickActionsData} />
        </section>
      </div>
    </motion.div>
  );
};

export default AdminDashboardPage;