import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { PlayCircle, Search, ArrowRight, BookOpen, CheckCircle, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
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
import { useContent } from '@/contexts/ContentContext';
import { useProgress } from '@/contexts/ProgressContext';
import { Loader2 } from 'lucide-react';


const StudentCoursesPage = () => {
  const { user } = useAuth();
  const { courses, lessons, loading: contentLoading } = useContent();
  const { getStudentProgressForCourse, loading: progressLoading } = useProgress();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'inProgress', 'completed'
  const [studentCourses, setStudentCourses] = useState([]);
  

  useEffect(() => {
    if (user && !contentLoading) {
      const availableCourses = courses
        .filter(course => course.status === 'published')
        .map(course => {
          const courseLessons = lessons.filter(l => l.courseId === course.id);
          const modules = [...new Set(courseLessons.map(l => l.moduleId))];
          return {
            ...course,
            lessonsCount: courseLessons.length,
            modulesCount: modules.length,
          }
        });
      setStudentCourses(availableCourses);
    }
  }, [user, courses, lessons, contentLoading]);
  
  if (contentLoading || progressLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin" /> Carregando cursos...</div>;
  }

  const filteredCourses = studentCourses
    .filter(course => course.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(course => {
      if (filter === 'all') return true;
      const { percentage } = getStudentProgressForCourse(user.id, course.id);
      if (filter === 'inProgress') return percentage > 0 && percentage < 100;
      if (filter === 'completed') return percentage === 100;
      return true;
    });

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: i => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
      },
    }),
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <section className="text-center py-10 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl shadow-inner">
        <motion.h1 
          initial={{ opacity:0, y: -20 }}
          animate={{ opacity:1, y: 0 }}
          className="text-4xl md:text-5xl font-bold gradient-text mb-3"
        >
          Meus Cursos
        </motion.h1>
        <motion.p 
          initial={{ opacity:0, y: 20 }}
          animate={{ opacity:1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-muted-foreground max-w-2xl mx-auto"
        >
          Explore seus cursos, continue aprendendo e conquiste seus objetivos.
        </motion.p>
      </section>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-1">
        <div className="relative w-full sm:w-auto sm:flex-grow max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Buscar cursos..."
            className="pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              <Filter className="mr-2 h-4 w-4" />
              Filtrar por: {filter === 'all' ? 'Todos' : filter === 'inProgress' ? 'Em Progresso' : 'Concluídos'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Status do Curso</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={filter} onValueChange={setFilter}>
              <DropdownMenuRadioItem value="all">Todos</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="inProgress">Em Progresso</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="completed">Concluídos</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {filteredCourses.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <BookOpen className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold text-foreground">Nenhum curso encontrado</h2>
          <p className="text-muted-foreground mt-2">
            {searchTerm ? "Tente refinar sua busca ou " : "Parece que ainda não há cursos publicados ou que correspondam ao filtro. "}
            <Link to="/student/dashboard" className="text-primary hover:underline">volte para o seu painel</Link>.
          </p>
        </motion.div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, index) => {
            const { percentage } = getStudentProgressForCourse(user.id, course.id);
            const thumbnail = course.thumbnail || `https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixid=M3w1MDc0MDJ8MHwxfGFsbHx8fHx8fHx8fDE3MTc2NjM2MDh8&ixlib=rb-4.0.3&w=400&h=200&fit=crop&q=80`;
            return (
              <motion.div key={course.id} custom={index} initial="hidden" animate="visible" variants={cardVariants}>
                <Card className="h-full flex flex-col overflow-hidden glassmorphism hover:shadow-primary/20 transition-shadow duration-300">
                  <div className="relative h-48 w-full">
                    <img  alt={course.title} src={thumbnail} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <Link to={`/student/course/${course.id}`}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <PlayCircle className="h-12 w-12 text-white/70 hover:text-white transition-colors" />
                      </div>
                    </Link>
                  </div>
                  <CardHeader className="flex-grow">
                    <CardTitle className="text-xl font-semibold hover:text-primary transition-colors">
                      <Link to={`/student/course/${course.id}`}>{course.title}</Link>
                    </CardTitle>
                    <CardDescription className="text-sm line-clamp-2">{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-xs text-muted-foreground">
                      <span>{course.modulesCount || 0} Módulos</span> &bull; <span>{course.lessonsCount || 0} Aulas</span>
                    </div>
                    {percentage > 0 && (
                      <div>
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>Progresso</span>
                          <span>{percentage}%</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    )}
                    {percentage === 100 && (
                      <div className="flex items-center text-green-500">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">Curso Concluído!</span>
                      </div>
                    )}
                  </CardContent>
                  <div className="p-4 pt-0 border-t border-border/50 mt-auto">
                    <Button asChild className="w-full mt-2" variant={percentage === 100 ? "outline" : "default"}>
                      <Link to={`/student/course/${course.id}`}>
                        {percentage === 0 && "Iniciar Curso"}
                        {percentage > 0 && percentage < 100 && "Continuar Curso"}
                        {percentage === 100 && "Revisar Curso"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default StudentCoursesPage;