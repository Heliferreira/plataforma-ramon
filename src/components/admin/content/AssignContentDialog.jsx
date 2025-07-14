import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useAuth } from '@/contexts/AuthContext';
import { useContent } from '@/contexts/ContentContext';

const AssignContentDialog = ({ isOpen, onOpenChange, contentItem }) => {
  const { getAllUsers } = useAuth();
  const { assignContent } = useContent();
  const [allStudents, setAllStudents] = useState([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);

  useEffect(() => {
    if (isOpen && contentItem) {
      const students = getAllUsers().filter(user => user.role === 'student');
      setAllStudents(students);
      setSelectedStudentIds(contentItem.assignedTo || []);
    }
  }, [isOpen, contentItem, getAllUsers]);

  const handleStudentSelect = (studentId) => {
    setSelectedStudentIds(prev =>
      prev.includes(studentId) ? prev.filter(id => id !== studentId) : [...prev, studentId]
    );
  };

  const handleAssign = () => {
    if (!contentItem || !contentItem.type) return;
    assignContent(contentItem.type, contentItem.id, selectedStudentIds);
    onOpenChange(false);
  };

  if (!contentItem) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] glassmorphism">
        <DialogHeader>
          <DialogTitle>Atribuir "{contentItem.title}"</DialogTitle>
          <DialogDescription>Selecione os alunos para quem este conteúdo será visível.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 max-h-60 overflow-y-auto">
          {allStudents.length === 0 && <p className="text-muted-foreground">Nenhum aluno cadastrado.</p>}
          {allStudents.map(student => (
            <div key={student.id} className="flex items-center space-x-2">
              <Checkbox
                id={`student-${student.id}`}
                checked={selectedStudentIds.includes(student.id)}
                onCheckedChange={() => handleStudentSelect(student.id)}
              />
              <Label htmlFor={`student-${student.id}`} className="font-normal">
                {student.name} ({student.email})
              </Label>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleAssign}>Salvar Atribuições</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignContentDialog;