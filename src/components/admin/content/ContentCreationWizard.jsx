import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle, Circle, ArrowRight, PlusCircle } from 'lucide-react';
import { useContent } from '@/contexts/ContentContext';

const STEPS = {
  COURSE: 'course',
  MODULE: 'module',
  LESSON: 'lesson',
};

const ContentCreationWizard = ({ isOpen, onOpenChange, editCourse, onFinish }) => {
  const { addContent, updateContent } = useContent();
  const [step, setStep] = useState(STEPS.COURSE);
  const [courseData, setCourseData] = useState({ title: '', description: '' });
  const [moduleData, setModuleData] = useState({ title: '' });
  const [lessonData, setLessonData] = useState({ title: '', type: 'video', content: '' });
  
  const [createdCourse, setCreatedCourse] = useState(null);
  const [createdModule, setCreatedModule] = useState(null);
  
  useEffect(() => {
    if (isOpen) {
      if (editCourse) {
        setCourseData({ title: editCourse.title, description: editCourse.description });
        setCreatedCourse(editCourse);
        setStep(STEPS.MODULE); // Skip to module creation if editing
      } else {
        setStep(STEPS.COURSE);
        setCourseData({ title: '', description: '' });
        setCreatedCourse(null);
      }
    }
  }, [isOpen, editCourse]);

  const resetAndClose = () => {
    setStep(STEPS.COURSE);
    setCourseData({ title: '', description: '' });
    setModuleData({ title: '' });
    setLessonData({ title: '', type: 'video', content: '' });
    setCreatedCourse(null);
    setCreatedModule(null);
    onOpenChange(false);
  };

  const handleFinish = () => {
    if(onFinish) onFinish(createdCourse);
    resetAndClose();
  };

  const handleNext = async () => {
    switch (step) {
      case STEPS.COURSE:
        if (courseData.title) {
          if (editCourse) {
            await updateContent('courses', editCourse.id, courseData);
            setCreatedCourse(editCourse);
          } else {
            const newCourse = await addContent('courses', courseData);
            setCreatedCourse(newCourse);
          }
          setStep(STEPS.MODULE);
        }
        break;
      case STEPS.MODULE:
        if (moduleData.title && createdCourse) {
          const newModule = await addContent('modules', { ...moduleData, courseId: createdCourse.id });
          setCreatedModule(newModule);
          setStep(STEPS.LESSON);
        }
        break;
      case STEPS.LESSON:
        if (lessonData.title && createdModule) {
          await addContent('lessons', { ...lessonData, courseId: createdCourse.id, moduleId: createdModule.id });
          setLessonData({ title: '', type: 'video', content: '' }); // Reset for next lesson
        }
        break;
    }
  };
  
  const handleAddAnotherModule = () => {
    setStep(STEPS.MODULE);
    setModuleData({ title: '' });
    setCreatedModule(null);
    setLessonData({ title: '', type: 'video', content: '' });
  };

  const renderStepContent = () => {
    switch (step) {
      case STEPS.COURSE:
        return (
          <div className="space-y-4">
            <Label htmlFor="courseTitle">Título do Curso</Label>
            <Input id="courseTitle" value={courseData.title} onChange={(e) => setCourseData({ ...courseData, title: e.target.value })} placeholder="Ex: Fundamentos de React" />
            <Label htmlFor="courseDesc">Descrição</Label>
            <Textarea id="courseDesc" value={courseData.description} onChange={(e) => setCourseData({ ...courseData, description: e.target.value })} placeholder="O que os alunos aprenderão?" />
          </div>
        );
      case STEPS.MODULE:
        return (
          <div className="space-y-4">
             <h4 className="font-semibold text-lg">Curso: <span className="text-primary">{courseData.title}</span></h4>
            <Label htmlFor="moduleTitle">Título do Módulo</Label>
            <Input id="moduleTitle" value={moduleData.title} onChange={(e) => setModuleData({ ...moduleData, title: e.target.value })} placeholder="Ex: Introdução e Configuração" />
          </div>
        );
      case STEPS.LESSON:
        return (
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Módulo: <span className="text-primary">{moduleData.title}</span></h4>
            <Label htmlFor="lessonTitle">Título da Aula</Label>
            <Input id="lessonTitle" value={lessonData.title} onChange={(e) => setLessonData({ ...lessonData, title: e.target.value })} placeholder="Ex: O que é JSX?" />
            <Label htmlFor="lessonContent">URL do Vídeo (ou conteúdo)</Label>
            <Input id="lessonContent" value={lessonData.content} onChange={(e) => setLessonData({ ...lessonData, content: e.target.value })} placeholder="https://youtube.com/..." />
          </div>
        );
      default: return null;
    }
  };

  const stepsFlow = [
    { id: STEPS.COURSE, label: 'Criar Curso' },
    { id: STEPS.MODULE, label: 'Adicionar Módulo' },
    { id: STEPS.LESSON, label: 'Adicionar Aulas' },
  ];

  const currentStepIndex = stepsFlow.findIndex(s => s.id === step);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) resetAndClose(); else onOpenChange(open); }}>
      <DialogContent className="sm:max-w-md md:max-w-2xl glassmorphism">
        <DialogHeader>
          <DialogTitle>{editCourse ? 'Editar Curso e Adicionar Conteúdo' : 'Assistente de Criação de Curso'}</DialogTitle>
          <DialogDescription>Siga os passos para criar um curso completo.</DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center space-x-4 my-4">
          {stepsFlow.map((s, index) => (
            <React.Fragment key={s.id}>
              <div className="flex items-center">
                {index < currentStepIndex ? <CheckCircle className="h-6 w-6 text-green-500"/> : <Circle className={`h-6 w-6 ${index === currentStepIndex ? 'text-primary' : 'text-muted-foreground'}`}/>}
                <span className={`ml-2 ${index <= currentStepIndex ? 'text-foreground' : 'text-muted-foreground'}`}>{s.label}</span>
              </div>
              {index < stepsFlow.length - 1 && <div className="flex-1 h-px bg-border"/>}
            </React.Fragment>
          ))}
        </div>

        <div className="py-6 min-h-[200px]">{renderStepContent()}</div>

        <DialogFooter className="flex-col sm:flex-row sm:justify-between">
          <div>
            {step === STEPS.LESSON && <Button variant="outline" onClick={handleAddAnotherModule}><PlusCircle className="mr-2 h-4 w-4" /> Adicionar outro módulo</Button>}
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={handleFinish}>
              {step === STEPS.COURSE ? 'Cancelar' : 'Concluir e Fechar'}
            </Button>
            {step !== STEPS.LESSON ?
              <Button onClick={handleNext} disabled={!courseData.title || (step===STEPS.MODULE && !moduleData.title)}>Próximo <ArrowRight className="ml-2 h-4 w-4"/></Button> :
              <Button onClick={handleNext} disabled={!lessonData.title}>Adicionar Aula e Continuar</Button>
            }
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContentCreationWizard;