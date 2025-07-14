import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, Users, BookOpen, FileText, Eye, EyeOff } from 'lucide-react';
import { useContent } from '@/contexts/ContentContext';

const CourseCard = ({ course, onManage, onAssign, onEdit, onDelete }) => {
  const { modules, lessons, togglePublishStatus } = useContent();
  const { title, description, status, assignedTo, id } = course;

  const moduleCount = modules.filter(m => m.courseId === id).length;
  const lessonCount = lessons.filter(l => l.courseId === id).length;
  
  return (
    <motion.div layout>
      <Card className="flex flex-col h-full glassmorphism hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-primary/20">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl pr-8">{title}</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(course)}>
                  <Edit className="mr-2 h-4 w-4" /> Editar Detalhes
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => togglePublishStatus('courses', id)}>
                  {status === 'published' ? (
                    <><EyeOff className="mr-2 h-4 w-4" /> Despublicar</>
                  ) : (
                    <><Eye className="mr-2 h-4 w-4" /> Publicar</>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAssign(course)}>
                  <Users className="mr-2 h-4 w-4" /> Atribuir (Opcional)
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onDelete(id)} className="text-destructive focus:text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" /> Remover Curso
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <CardDescription className="line-clamp-2 h-10">{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="flex flex-wrap gap-2 text-sm">
            <Badge variant="secondary" className="flex items-center gap-1"><BookOpen className="h-3 w-3"/>{moduleCount} Módulos</Badge>
            <Badge variant="secondary" className="flex items-center gap-1"><FileText className="h-3 w-3"/>{lessonCount} Aulas</Badge>
            <Badge variant="secondary" className="flex items-center gap-1"><Users className="h-3 w-3"/>{assignedTo ? assignedTo.length : 0} Atribuições</Badge>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <Badge variant={status === 'published' ? 'success' : 'outline'}>
            {status === 'published' ? 'Publicado' : 'Rascunho'}
          </Badge>
          <Button onClick={() => onManage(course)}>Gerenciar Conteúdo</Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default CourseCard;