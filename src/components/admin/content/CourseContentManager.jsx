import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Accordion } from '@/components/ui/accordion';
import ModuleAccordion from '@/components/admin/content/ModuleAccordion';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import { useContent } from '@/contexts/ContentContext';
import { useToast } from '@/components/ui/use-toast';
import LessonEditDialog from '@/components/admin/content/LessonEditDialog';

const CourseContentManager = ({ course, onBack }) => {
  const { modules, lessons, addContent, updateContent, deleteContent } = useContent();
  const { toast } = useToast();
  
  const [isLessonDialogOpen, setIsLessonDialogOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [currentModuleId, setCurrentModuleId] = useState(null);

  const courseModules = modules.filter(m => m.courseId === course.id);

  const handleAddModule = () => {
    const title = prompt("Digite o título do novo módulo:");
    if (title) {
      addContent('modules', { title, courseId: course.id });
    }
  };

  const handleOpenAddLesson = (moduleId) => {
    setEditingLesson(null);
    setCurrentModuleId(moduleId);
    setIsLessonDialogOpen(true);
  };
  
  const handleOpenEditLesson = (lesson) => {
    setEditingLesson(lesson);
    setCurrentModuleId(lesson.moduleId);
    setIsLessonDialogOpen(true);
  };

  const handleLessonFormSubmit = (lessonData) => {
    if (editingLesson) {
      updateContent('lessons', editingLesson.id, lessonData);
    } else {
      addContent('lessons', { ...lessonData, moduleId: currentModuleId, courseId: course.id });
    }
    setIsLessonDialogOpen(false);
  };

  const handleEditModule = (module) => {
    const newTitle = prompt(`Digite o novo título para "${module.title}":`, module.title);
    if (newTitle && newTitle !== module.title) {
      updateContent('modules', module.id, { title: newTitle });
    }
  };

  const handleDelete = (type, id) => {
    if (window.confirm(`Tem certeza que deseja remover este ${type.slice(0, -1)}?`)) {
      deleteContent(type, id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="glassmorphism">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className='flex items-center gap-4'>
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <CardTitle className="text-2xl">{course.title}</CardTitle>
                <CardDescription>Gerencie os módulos e aulas do seu curso.</CardDescription>
              </div>
            </div>
            <Button onClick={handleAddModule}>
              <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Módulo
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {courseModules.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {courseModules.map(module => (
                <ModuleAccordion
                  key={module.id}
                  module={module}
                  lessons={lessons.filter(l => l.moduleId === module.id)}
                  onAddLesson={() => handleOpenAddLesson(module.id)}
                  onEditModule={() => handleEditModule(module)}
                  onDeleteModule={() => handleDelete('modules', module.id)}
                  onEditLesson={handleOpenEditLesson}
                  onDeleteLesson={(lessonId) => handleDelete('lessons', lessonId)}
                />
              ))}
            </Accordion>
          ) : (
            <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
              <p className="font-semibold">Este curso ainda não possui módulos.</p>
              <p className="text-sm mt-1">Clique em "Adicionar Módulo" para começar a criar o conteúdo.</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <LessonEditDialog
        isOpen={isLessonDialogOpen}
        onOpenChange={setIsLessonDialogOpen}
        lesson={editingLesson}
        onSubmit={handleLessonFormSubmit}
      />
    </motion.div>
  );
};

export default CourseContentManager;