import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useContent } from '@/contexts/ContentContext';
import { useAuth } from '@/contexts/AuthContext';
import { useProgress } from '@/contexts/ProgressContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Lock, PlayCircle, ArrowLeft, BookOpen, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

const StudentCourseDetailPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { courses, modules, lessons, loading: contentLoading } = useContent();
  const { getStudentProgressForCourse, isLessonCompleted, loading: progressLoading } = useProgress();
  
  const [course, setCourse] = useState(null);
  const [courseModules, setCourseModules] = useState([]);
  const [progress, setProgress] = useState({ percentage: 0, completedCount: 0, totalCount: 0 });

  useEffect(() => {
    if (!contentLoading) {
      const currentCourse = courses.find(c => c.id === courseId);
      if (currentCourse) {
        setCourse(currentCourse);
        const modulesForCourse = modules
          .filter(m => m.courseId === courseId)
          .map(module => ({
            ...module,
            lessons: lessons.filter(l => l.moduleId === module.id)
          }));
        setCourseModules(modulesForCourse);
      }
    }
  }, [courseId, courses, modules, lessons, contentLoading]);

  useEffect(() => {
    if (user && course && !progressLoading) {
      const progressData = getStudentProgressForCourse(user.id, course.id);
      setProgress(progressData);
    }
  }, [user, course, progressLoading, getStudentProgressForCourse]);


  if (contentLoading || progressLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin" /> Carregando detalhes do curso...</div>;
  }

  if (!course) {
    return <div className="text-center py-10">Curso não encontrado.</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate('/student/courses')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">{course.title}</h1>
          <p className="text-lg text-muted-foreground mt-1">{course.description}</p>
        </div>
      </div>

      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle>Progresso do Curso</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Progress value={progress.percentage} className="h-3" />
            <span className="font-bold text-primary">{progress.percentage}%</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {progress.completedCount} de {progress.totalCount} aulas concluídas.
          </p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <BookOpen className="text-primary" />
          Conteúdo do Curso
        </h2>
        <Accordion type="single" collapsible className="w-full" defaultValue={courseModules[0]?.id}>
          {courseModules.map(module => (
            <AccordionItem key={module.id} value={module.id} className="border-b-0 mb-3">
              <div className="border rounded-lg overflow-hidden glassmorphism-item">
                <AccordionTrigger className="hover:no-underline bg-secondary/10 px-4 py-3">
                  <span className="font-semibold text-lg text-foreground">{module.title}</span>
                </AccordionTrigger>
                <AccordionContent className="p-0">
                  <ul className="divide-y divide-border/50">
                    {module.lessons.map(lesson => (
                      <li key={lesson.id}>
                        <Link
                          to={`/student/course/${courseId}/lesson/${lesson.id}`}
                          className="flex items-center justify-between p-4 hover:bg-primary/10 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            {isLessonCompleted(user.id, courseId, lesson.id) ? (
                              <CheckCircle className="h-6 w-6 text-green-500" />
                            ) : (
                              <PlayCircle className="h-6 w-6 text-primary" />
                            )}
                            <span className="font-medium">{lesson.title}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {lesson.pdfUrl && <FileText className="h-5 w-5 text-muted-foreground" title="Material de apoio disponível" />}
                            <Badge variant="outline">Assistir</Badge>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </div>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </motion.div>
  );
};

export default StudentCourseDetailPage;