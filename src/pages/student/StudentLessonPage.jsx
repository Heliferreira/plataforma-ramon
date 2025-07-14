import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import YouTube from 'react-youtube';
import { useContent } from '@/contexts/ContentContext';
import { useAuth } from '@/contexts/AuthContext';
import { useProgress } from '@/contexts/ProgressContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Heart, MessageSquare, Download, CheckCircle, PlayCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const getYouTubeVideoId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const StudentLessonPage = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { lessons, courses, toggleLessonLike, addLessonComment, loading: contentLoading } = useContent();
  const { markLessonAsCompleted, isLessonCompleted, loading: progressLoading } = useProgress();
  const { toast } = useToast();

  const [lesson, setLesson] = useState(null);
  const [course, setCourse] = useState(null);
  const [comment, setComment] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!contentLoading) {
      const currentLesson = lessons.find(l => l.id === lessonId);
      const currentCourse = courses.find(c => c.id === courseId);
      setLesson(currentLesson);
      setCourse(currentCourse);
    }
  }, [lessonId, courseId, lessons, courses, contentLoading]);

  const handleMarkAsComplete = () => {
    markLessonAsCompleted(courseId, lessonId);
    toast({ title: "Aula concluída!", description: "Seu progresso foi salvo." });
  };
  
  const handleVideoEnd = () => {
    if (!isLessonCompleted(user.id, courseId, lessonId)) {
        handleMarkAsComplete();
    }
  }

  const handleLike = () => {
    toggleLessonLike(lessonId, user.id);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      addLessonComment(lessonId, {
        userId: user.id,
        userName: user.name,
        avatarUrl: user.avatarUrl,
        text: comment,
      });
      setComment('');
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const names = name.split(' ');
    return names.length > 1 ? `${names[0][0]}${names[names.length - 1][0]}` : names[0][0];
  };

  if (contentLoading || progressLoading || !lesson || !course) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin" /> Carregando aula...</div>;
  }

  const videoId = getYouTubeVideoId(lesson.youtubeUrl);
  const userHasLiked = lesson.likes?.includes(user.id);
  const completed = isLessonCompleted(user.id, courseId, lessonId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate(`/student/course/${courseId}`)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <Link to={`/student/course/${courseId}`} className="text-sm text-primary hover:underline">{course.title}</Link>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">{lesson.title}</h1>
        </div>
      </div>

      <div className="aspect-video w-full bg-black rounded-lg overflow-hidden relative glassmorphism-item">
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center cursor-pointer" onClick={() => setIsPlaying(true)}>
            <img src={lesson.thumbnailUrl} alt={lesson.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40" />
            <PlayCircle className="h-20 w-20 text-white/80 hover:text-white transition-transform hover:scale-110" />
          </div>
        )}
        {videoId && isPlaying && (
          <YouTube
            videoId={videoId}
            opts={{ width: '100%', height: '100%', playerVars: { autoplay: 1, modestbranding: 1, rel: 0 } }}
            className="w-full h-full"
            onEnd={handleVideoEnd}
          />
        )}
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <Button onClick={handleLike} variant={userHasLiked ? "default" : "outline"} className="transition-all duration-300">
            <Heart className={`mr-2 h-5 w-5 ${userHasLiked ? 'fill-current' : ''}`} />
            {userHasLiked ? 'Curtido' : 'Curtir'} ({lesson.likes?.length || 0})
          </Button>
          {lesson.pdfUrl && (
            <a href={lesson.pdfUrl} download={`${lesson.title}_material.pdf`}>
              <Button variant="outline">
                <Download className="mr-2 h-5 w-5" />
                Baixar Material
              </Button>
            </a>
          )}
        </div>
        <Button onClick={handleMarkAsComplete} disabled={completed} variant={completed ? "success" : "default"}>
          <CheckCircle className="mr-2 h-5 w-5" />
          {completed ? 'Aula Concluída' : 'Marcar como Concluída'}
        </Button>
      </div>

      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="text-primary" />
            Dúvidas e Comentários
          </CardTitle>
          <CardDescription>Participe da discussão e tire suas dúvidas sobre esta aula.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCommentSubmit} className="flex flex-col md:flex-row items-start gap-4 mb-8">
            <Avatar>
              <AvatarImage src={user.avatarUrl} />
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div className="w-full space-y-2">
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Digite sua dúvida ou comentário aqui..."
                className="w-full"
                rows={3}
              />
              <Button type="submit" className="self-end">Enviar Comentário</Button>
            </div>
          </form>

          <div className="space-y-6">
            {lesson.comments?.length > 0 ? (
              lesson.comments.map(c => (
                <div key={c.id} className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage src={c.avatarUrl} />
                    <AvatarFallback>{getInitials(c.userName)}</AvatarFallback>
                  </Avatar>
                  <div className="w-full bg-secondary/30 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold">{c.userName}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true, locale: ptBR })}
                      </p>
                    </div>
                    <p className="mt-2 text-foreground/90">{c.text}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-4">Seja o primeiro a comentar!</p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StudentLessonPage;