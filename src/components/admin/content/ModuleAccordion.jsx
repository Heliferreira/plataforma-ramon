import React from 'react';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { FileText, Video, Edit, Trash2, PlusCircle, Image as ImageIcon } from 'lucide-react';

const ModuleAccordion = ({ module, lessons, onAddLesson, onEditModule, onDeleteModule, onEditLesson, onDeleteLesson }) => {
  return (
    <AccordionItem value={module.id} className="border-b-0">
      <div className="border rounded-lg mb-2 overflow-hidden">
        <AccordionTrigger className="hover:no-underline bg-secondary/10 px-4 py-3">
          <div className="flex justify-between items-center w-full">
            <span className="font-semibold text-lg text-foreground">{module.title}</span>
            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" onClick={onEditModule} className="h-8 w-8">
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={onDeleteModule} className="h-8 w-8 hover:bg-destructive/20 hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pl-4 pt-2 bg-background/30">
          <div className="space-y-2 p-2">
            {lessons.length > 0 ? lessons.map(lesson => (
              <div key={lesson.id} className="flex justify-between items-center p-2 rounded-md hover:bg-secondary/20">
                <div className="flex items-center gap-3">
                  {lesson.thumbnailUrl ? (
                    <img-replace src={lesson.thumbnailUrl} alt={lesson.title} className="w-16 h-9 object-cover rounded-md" />
                  ) : (
                    <div className="w-16 h-9 bg-muted rounded-md flex items-center justify-center">
                      <ImageIcon className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                  <span>{lesson.title}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => onEditLesson(lesson)} className="h-7 w-7">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDeleteLesson(lesson.id)} className="h-7 w-7 hover:bg-destructive/20 hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )) : <p className="text-muted-foreground text-sm pl-2 py-2">Nenhuma aula neste módulo.</p>}
            <div className="pt-2">
              <Button variant="outline" size="sm" onClick={onAddLesson} className="ml-2 mt-2">
                <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Aula
              </Button>
            </div>
          </div>
        </AccordionContent>
      </div>
    </AccordionItem>
  );
};

export default ModuleAccordion;