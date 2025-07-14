import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';

const ContentForm = ({ type, currentItem, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (currentItem) {
      setFormData(currentItem);
    } else {
      const defaultData = { title: '', description: '' };
      if (type === 'lessons') defaultData.content = '';
      if (type === 'modules') defaultData.courseId = '';
      setFormData(defaultData);
    }
  }, [currentItem, type]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const typeName = type ? type.slice(0, -1) : 'item';

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, height: 0 }}
      animate={{ opacity: 1, y: 0, height: 'auto' }}
      exit={{ opacity: 0, y: -20, height: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="glassmorphism mb-8">
        <CardHeader>
          <CardTitle>{currentItem ? `Editar` : 'Novo'} {typeName}</CardTitle>
          <CardDescription>Preencha os detalhes abaixo para {currentItem ? 'atualizar' : 'criar'} o {typeName}.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                name="title"
                value={formData.title || ''}
                onChange={handleChange}
                placeholder={`Título do ${typeName}`}
                required
              />
            </div>

            {type !== 'articles' && (
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description || ''}
                  onChange={handleChange}
                  placeholder={`Descrição do ${typeName}`}
                />
              </div>
            )}
            
            {type === 'articles' && (
                <div>
                    <Label htmlFor="content">Conteúdo do Artigo</Label>
                    <Textarea 
                        id="content" 
                        name="content"
                        value={formData.content || ''}
                        onChange={handleChange}
                        rows={10}
                        placeholder="Escreva seu artigo aqui..."
                    />
                </div>
            )}

            {type === 'lessons' && (
              <div>
                <Label htmlFor="content">Conteúdo (URL do vídeo, etc.)</Label>
                <Input
                  id="content"
                  name="content"
                  value={formData.content || ''}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button type="submit">{currentItem ? 'Salvar Alterações' : `Criar ${typeName}`}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ContentForm;