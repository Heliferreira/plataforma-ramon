import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useContent } from '@/contexts/ContentContext';
import CourseCard from '@/components/admin/content/CourseCard';
import CourseContentManager from '@/components/admin/content/CourseContentManager';
import ContentCreationWizard from '@/components/admin/content/ContentCreationWizard';
import AssignContentDialog from '@/components/admin/content/AssignContentDialog';
import ContentTable from '@/components/admin/content/ContentTable';
import ContentForm from '@/components/admin/content/ContentForm';

const AdminContentPage = () => {
  const { toast } = useToast();
  const { courses, articles, addContent, updateContent, deleteContent } = useContent();
  
  const [view, setView] = useState('dashboard'); // 'dashboard' or 'manage_course'
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [assigningItem, setAssigningItem] = useState(null);

  const [showArticleForm, setShowArticleForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);

  const handleManageCourse = (course) => {
    setSelectedCourse(course);
    setView('manage_course');
  };

  const handleBackToDashboard = () => {
    setSelectedCourse(null);
    setView('dashboard');
  };

  const handleOpenWizardForNew = () => {
    setEditingCourse(null);
    setIsWizardOpen(true);
  };

  const handleOpenWizardForEdit = (course) => {
    setEditingCourse(course);
    setIsWizardOpen(true);
  };
  
  const handleOpenAssignDialog = (item, type) => {
    setAssigningItem({ ...item, type });
    setIsAssignDialogOpen(true);
  };

  const handleDeleteCourse = (courseId) => {
    if (window.confirm("Tem certeza que deseja remover este curso e todos os seus módulos e aulas?")) {
      deleteContent('courses', courseId);
      toast({ title: "Curso removido!", description: "O curso foi removido com sucesso.", variant: "destructive" });
    }
  };

  const handleArticleSubmit = (formData) => {
    if (editingArticle) {
      updateContent('articles', editingArticle.id, formData);
      toast({ title: "Artigo atualizado!", description: `O artigo "${formData.title}" foi salvo.` });
    } else {
      addContent('articles', formData);
      toast({ title: "Artigo criado!", description: `O artigo "${formData.title}" foi criado com sucesso.` });
    }
    setShowArticleForm(false);
    setEditingArticle(null);
  };

  const handleEditArticle = (article) => {
    setEditingArticle(article);
    setShowArticleForm(true);
  };

  const handleDeleteArticle = (articleId) => {
     if (window.confirm("Tem certeza que deseja remover este artigo?")) {
      deleteContent('articles', articleId);
      toast({ title: "Artigo removido!", variant: "destructive" });
    }
  };

  const renderDashboardView = () => (
    <motion.div
      key="dashboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Tabs defaultValue="courses">
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="courses">Cursos</TabsTrigger>
            <TabsTrigger value="articles">Artigos</TabsTrigger>
          </TabsList>
          <AnimatePresence>
          {/* This is a placeholder for a button that might change based on the selected tab */}
          </AnimatePresence>
        </div>
        <TabsContent value="courses">
          <div className="flex justify-end mb-4">
            <Button onClick={handleOpenWizardForNew}>
              <PlusCircle className="mr-2 h-4 w-4" /> Criar Novo Curso
            </Button>
          </div>
          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map(course => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onManage={handleManageCourse}
                  onAssign={() => handleOpenAssignDialog(course, 'courses')}
                  onEdit={handleOpenWizardForEdit}
                  onDelete={handleDeleteCourse}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border-2 border-dashed rounded-lg">
              <h3 className="text-xl font-semibold">Nenhum curso criado ainda</h3>
              <p className="text-muted-foreground mt-2 mb-4">Comece a criar seu primeiro curso para seus alunos.</p>
              <Button onClick={handleOpenWizardForNew}>
                <PlusCircle className="mr-2 h-4 w-4" /> Criar Primeiro Curso
              </Button>
            </div>
          )}
        </TabsContent>
        <TabsContent value="articles">
           <div className="flex justify-end mb-4">
              <Button onClick={() => { setEditingArticle(null); setShowArticleForm(true); }}>
                <PlusCircle className="mr-2 h-4 w-4" /> Novo Artigo
              </Button>
            </div>
            <AnimatePresence>
            {showArticleForm && (
              <ContentForm
                type="articles"
                currentItem={editingArticle}
                onSubmit={handleArticleSubmit}
                onCancel={() => { setShowArticleForm(false); setEditingArticle(null); }}
              />
            )}
            </AnimatePresence>
           <ContentTable
              data={articles}
              type="articles"
              onEdit={handleEditArticle}
              onDelete={handleDeleteArticle}
              onAssign={(item) => handleOpenAssignDialog(item, 'articles')}
            />
        </TabsContent>
      </Tabs>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="h1-seo">Gerenciar Conteúdo</h1>
      </div>

      <AnimatePresence mode="wait">
        {view === 'dashboard' ? renderDashboardView() : (
          <motion.div
            key="manager"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CourseContentManager course={selectedCourse} onBack={handleBackToDashboard} />
          </motion.div>
        )}
      </AnimatePresence>

      <ContentCreationWizard
        isOpen={isWizardOpen}
        onOpenChange={setIsWizardOpen}
        editCourse={editingCourse}
        onFinish={(createdCourse) => {
          setIsWizardOpen(false);
          if (createdCourse) {
            handleManageCourse(createdCourse);
          }
        }}
      />
      
      <AssignContentDialog
        isOpen={isAssignDialogOpen}
        onOpenChange={setIsAssignDialogOpen}
        contentItem={assigningItem}
      />
    </div>
  );
};

export default AdminContentPage;