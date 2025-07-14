import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';

const ContentContext = createContext(null);

export const ContentProvider = ({ children }) => {
  const { toast } = useToast();
  const [courses, setCourses] = useState([]);
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(() => {
    setLoading(true);
    const storedCourses = JSON.parse(localStorage.getItem('mentorship_courses') || '[]');
    const storedModules = JSON.parse(localStorage.getItem('mentorship_modules') || '[]');
    const storedLessons = JSON.parse(localStorage.getItem('mentorship_lessons') || '[]');
    const storedArticles = JSON.parse(localStorage.getItem('mentorship_articles') || '[]');
    
    setCourses(storedCourses);
    setModules(storedModules);
    setLessons(storedLessons);
    setArticles(storedArticles);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const saveData = (key, data) => {
    localStorage.setItem(`mentorship_${key}`, JSON.stringify(data));
  };
  
  const addContent = (type, data) => {
    let newItemData = { ...data };
    if (type === 'lessons') {
      newItemData = {
        youtubeUrl: '',
        thumbnailUrl: '',
        pdfUrl: '',
        likes: [],
        comments: [],
        ...newItemData
      };
    }
    const newItem = {
      id: `${type.slice(0,3).toUpperCase()}${Date.now().toString()}`,
      ...newItemData,
      status: 'draft',
      lastUpdated: new Date().toISOString().split('T')[0],
      assignedTo: []
    };
    
    switch(type) {
      case 'courses':
        const newCourses = [newItem, ...courses];
        setCourses(newCourses);
        saveData('courses', newCourses);
        break;
      case 'modules':
        const newModules = [newItem, ...modules];
        setModules(newModules);
        saveData('modules', newModules);
        break;
      case 'lessons':
        const newLessons = [newItem, ...lessons];
        setLessons(newLessons);
        saveData('lessons', newLessons);
        break;
      case 'articles':
        const newArticles = [newItem, ...articles];
        setArticles(newArticles);
        saveData('articles', newArticles);
        break;
      default:
        break;
    }
    toast({ title: `${type.slice(0, -1)} criado!`, description: `O item "${newItem.title}" foi criado.` });
    return newItem;
  };

  const updateContent = (type, id, data) => {
    let itemTitle = '';
    switch(type) {
      case 'courses':
        const updatedCourses = courses.map(c => {
          if (c.id === id) {
            itemTitle = data.title || c.title;
            return { ...c, ...data, lastUpdated: new Date().toISOString().split('T')[0] };
          }
          return c;
        });
        setCourses(updatedCourses);
        saveData('courses', updatedCourses);
        break;
      case 'modules':
        const updatedModules = modules.map(m => {
          if (m.id === id) {
            itemTitle = data.title || m.title;
            return { ...m, ...data, lastUpdated: new Date().toISOString().split('T')[0] };
          }
          return m;
        });
        setModules(updatedModules);
        saveData('modules', updatedModules);
        break;
      case 'lessons':
        const updatedLessons = lessons.map(l => {
          if (l.id === id) {
            itemTitle = data.title || l.title;
            return { ...l, ...data, lastUpdated: new Date().toISOString().split('T')[0] };
          }
          return l;
        });
        setLessons(updatedLessons);
        saveData('lessons', updatedLessons);
        break;
      case 'articles':
        const updatedArticles = articles.map(a => {
          if (a.id === id) {
            itemTitle = data.title || a.title;
            return { ...a, ...data, lastUpdated: new Date().toISOString().split('T')[0] };
          }
          return a;
        });
        setArticles(updatedArticles);
        saveData('articles', updatedArticles);
        break;
      default:
        break;
    }
    if (!data.status) { // Avoid double toast on status change
        toast({ title: `${type.slice(0, -1)} atualizado!`, description: `O item "${itemTitle}" foi atualizado.` });
    }
  };

  const deleteContent = (type, id) => {
    let itemTitle = '';
    switch(type) {
      case 'courses':
        const courseToDelete = courses.find(c => c.id === id);
        if (!courseToDelete) return;
        itemTitle = courseToDelete.title;
        const filteredCourses = courses.filter(c => c.id !== id);
        const modulesOfCourse = modules.filter(m => m.courseId === id);
        const lessonsOfCourse = lessons.filter(l => l.courseId === id);
        const remainingModules = modules.filter(m => m.courseId !== id);
        const remainingLessons = lessons.filter(l => l.courseId !== id);
        setCourses(filteredCourses);
        setModules(remainingModules);
        setLessons(remainingLessons);
        saveData('courses', filteredCourses);
        saveData('modules', remainingModules);
        saveData('lessons', remainingLessons);
        break;
      case 'modules':
        const moduleToDelete = modules.find(m => m.id === id);
        if (!moduleToDelete) return;
        itemTitle = moduleToDelete.title;
        const filteredModules = modules.filter(m => m.id !== id);
        const remainingLessonsFromModule = lessons.filter(l => l.moduleId !== id);
        setModules(filteredModules);
        setLessons(remainingLessonsFromModule);
        saveData('modules', filteredModules);
        saveData('lessons', remainingLessonsFromModule);
        break;
      case 'lessons':
        const lessonToDelete = lessons.find(l => l.id === id);
        if (!lessonToDelete) return;
        itemTitle = lessonToDelete.title;
        const filteredLessons = lessons.filter(l => l.id !== id);
        setLessons(filteredLessons);
        saveData('lessons', filteredLessons);
        break;
      case 'articles':
        const articleToDelete = articles.find(a => a.id === id);
        if (!articleToDelete) return;
        itemTitle = articleToDelete.title;
        const filteredArticles = articles.filter(a => a.id !== id);
        setArticles(filteredArticles);
        saveData('articles', filteredArticles);
        break;
      default:
        break;
    }
    toast({ title: `${type.slice(0, -1)} removido!`, description: `O item "${itemTitle}" foi removido.`, variant: "destructive" });
  };
  
  const assignContent = (type, id, studentIds) => {
     updateContent(type, id, { assignedTo: studentIds });
     toast({ title: "Conteúdo Atribuído!", description: `As atribuições foram salvas.` });
  };

  const togglePublishStatus = (type, id) => {
    const contentMap = {
      courses: [courses, setCourses],
      articles: [articles, setArticles],
    };
    
    const [content, setContent] = contentMap[type];
    if (!content) return;

    let itemTitle = '';
    let newStatus = '';

    const updatedContent = content.map(item => {
      if (item.id === id) {
        itemTitle = item.title;
        newStatus = item.status === 'published' ? 'draft' : 'published';
        return { ...item, status: newStatus, lastUpdated: new Date().toISOString().split('T')[0] };
      }
      return item;
    });

    setContent(updatedContent);
    saveData(type, updatedContent);
    toast({
      title: `Status alterado para ${newStatus === 'published' ? 'Publicado' : 'Rascunho'}`,
      description: `O item "${itemTitle}" agora está ${newStatus === 'published' ? 'visível' : 'oculto'} para os alunos.`,
    });
  };

  const toggleLessonLike = (lessonId, userId) => {
    const updatedLessons = lessons.map(lesson => {
      if (lesson.id === lessonId) {
        const likes = lesson.likes || [];
        const userHasLiked = likes.includes(userId);
        const newLikes = userHasLiked ? likes.filter(id => id !== userId) : [...likes, userId];
        return { ...lesson, likes: newLikes };
      }
      return lesson;
    });
    setLessons(updatedLessons);
    saveData('lessons', updatedLessons);
  };

  const addLessonComment = (lessonId, comment) => {
    const updatedLessons = lessons.map(lesson => {
      if (lesson.id === lessonId) {
        const comments = lesson.comments || [];
        const newComment = {
          id: `CMT${Date.now()}`,
          ...comment,
          createdAt: new Date().toISOString(),
        };
        return { ...lesson, comments: [newComment, ...comments] };
      }
      return lesson;
    });
    setLessons(updatedLessons);
    saveData('lessons', updatedLessons);
    toast({ title: "Comentário adicionado!" });
  };
  
  const value = {
    courses,
    modules,
    lessons,
    articles,
    loading,
    addContent,
    updateContent,
    deleteContent,
    assignContent,
    togglePublishStatus,
    toggleLessonLike,
    addLessonComment,
  };

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};