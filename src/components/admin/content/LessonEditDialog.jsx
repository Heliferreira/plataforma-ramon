import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { ImageDown as ImageUp, Youtube, FileText as PdfIcon } from 'lucide-react';

const getYouTubeVideoId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const LessonEditDialog = ({ isOpen, onOpenChange, lesson, onSubmit }) => {
  const [formData, setFormData] = useState({ title: '', youtubeUrl: '', thumbnailUrl: '', pdfUrl: '' });
  const { toast } = useToast();
  const thumbnailInputRef = useRef(null);
  const pdfInputRef = useRef(null);

  useEffect(() => {
    if (lesson) {
      setFormData({
        title: lesson.title || '',
        youtubeUrl: lesson.youtubeUrl || '',
        thumbnailUrl: lesson.thumbnailUrl || '',
        pdfUrl: lesson.pdfUrl || ''
      });
    } else {
      setFormData({ title: '', youtubeUrl: '', thumbnailUrl: '', pdfUrl: '' });
    }
  }, [lesson, isOpen]);

  const handleYoutubeUrlChange = (e) => {
    const url = e.target.value;
    setFormData(prev => ({ ...prev, youtubeUrl: url }));
    const videoId = getYouTubeVideoId(url);
    if (videoId && !formData.thumbnailUrl) {
      const defaultThumbnail = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
      setFormData(prev => ({ ...prev, thumbnailUrl: defaultThumbnail }));
      toast({ title: 'Capa do vídeo extraída!', description: 'Usando a capa padrão do YouTube. Você pode substituí-la.' });
    }
  };

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({ title: 'Erro', description: 'O arquivo é muito grande. O limite é 5MB.', variant: 'destructive' });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (fileType === 'thumbnail') {
          setFormData(prev => ({ ...prev, thumbnailUrl: reader.result }));
        } else if (fileType === 'pdf') {
          setFormData(prev => ({ ...prev, pdfUrl: reader.result }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.title) {
      toast({ title: 'Erro', description: 'O título da aula é obrigatório.', variant: 'destructive' });
      return;
    }
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg glassmorphism">
        <DialogHeader>
          <DialogTitle>{lesson ? 'Editar Aula' : 'Nova Aula'}</DialogTitle>
          <DialogDescription>Preencha os detalhes da aula abaixo.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleFormSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="lesson-title">Título da Aula</Label>
            <Input id="lesson-title" value={formData.title} onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lesson-youtube">Link do Vídeo do YouTube</Label>
            <div className="flex items-center gap-2">
              <Youtube className="h-5 w-5 text-red-500" />
              <Input id="lesson-youtube" value={formData.youtubeUrl} onChange={handleYoutubeUrlChange} placeholder="https://www.youtube.com/watch?v=..." />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="lesson-thumbnail">Capa do Vídeo (Thumbnail)</Label>
            <div className="flex items-center gap-4">
              <div className="w-32 h-20 rounded-lg overflow-hidden border flex items-center justify-center bg-muted">
                {formData.thumbnailUrl ? (
                  <img-replace src={formData.thumbnailUrl} alt="Capa da aula" className="w-full h-full object-cover" />
                ) : (
                  <ImageUp className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <Button type="button" variant="outline" onClick={() => thumbnailInputRef.current?.click()}>
                Carregar Imagem
              </Button>
              <Input
                type="file"
                ref={thumbnailInputRef}
                className="hidden"
                accept="image/png, image/jpeg, image/webp"
                onChange={(e) => handleFileChange(e, 'thumbnail')}
              />
            </div>
            <p className="text-xs text-muted-foreground">Recomendado: 1280x720px, até 2MB.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="lesson-pdf">Material de Apoio (PDF)</Label>
            <div className="flex items-center gap-2">
              <PdfIcon className="h-5 w-5 text-blue-500" />
              <Button type="button" variant="outline" onClick={() => pdfInputRef.current?.click()}>
                {formData.pdfUrl ? 'Alterar PDF' : 'Carregar PDF'}
              </Button>
              {formData.pdfUrl && <span className="text-sm text-muted-foreground">Arquivo carregado.</span>}
              <Input
                type="file"
                ref={pdfInputRef}
                className="hidden"
                accept="application/pdf"
                onChange={(e) => handleFileChange(e, 'pdf')}
              />
            </div>
            <p className="text-xs text-muted-foreground">Opcional. Limite de 5MB.</p>
          </div>
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button type="submit" onClick={handleFormSubmit}>Salvar Aula</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LessonEditDialog;