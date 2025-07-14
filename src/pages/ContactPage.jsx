import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Send, Linkedin, Github, Instagram, Youtube, Phone } from 'lucide-react';

const socialLinks = [
  { name: "LinkedIn", icon: <Linkedin className="h-6 w-6" />, url: "#", color: "hover:text-blue-500" },
  { name: "GitHub", icon: <Github className="h-6 w-6" />, url: "#", color: "hover:text-gray-400" },
  { name: "Instagram", icon: <Instagram className="h-6 w-6" />, url: "#", color: "hover:text-pink-500" },
  { name: "YouTube", icon: <Youtube className="h-6 w-6" />, url: "#", color: "hover:text-red-500" },
];

const ContactPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("Form data submitted:", formData);
    toast({
      title: "Mensagem Enviada!",
      description: "Obrigado por entrar em contato. Responderemos em breve.",
      variant: "default",
    });
    setFormData({ name: '', email: '', subject: '', message: '' });
    setIsSubmitting(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-12"
    >
      <section className="text-center">
        <h1 className="h1-seo mb-4">Entre em Contato</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Tem alguma dúvida ou quer saber mais sobre a mentoria? Fale conosco!
        </p>
      </section>

      <div className="grid md:grid-cols-2 gap-12 items-start">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="glassmorphism">
            <CardHeader>
              <CardTitle className="text-2xl">Envie uma Mensagem</CardTitle>
              <CardDescription>Preencha o formulário abaixo e retornaremos o mais rápido possível.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input id="name" placeholder="Seu nome" value={formData.name} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" type="email" placeholder="seu@email.com" value={formData.email} onChange={handleChange} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Assunto</Label>
                  <Input id="subject" placeholder="Sobre o que gostaria de falar?" value={formData.subject} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Sua Mensagem</Label>
                  <Textarea id="message" placeholder="Digite sua mensagem aqui..." rows={5} value={formData.message} onChange={handleChange} required />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Enviando...
                    </div>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" /> Enviar Mensagem
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-8"
        >
          <Card className="glassmorphism">
            <CardHeader>
              <CardTitle className="text-2xl">Outras Formas de Contato</CardTitle>
              <CardDescription>Conecte-se conosco através de outros canais.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Redes Sociais</h3>
                <div className="flex space-x-4">
                  {socialLinks.map(link => (
                    <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.name} className={`transition-colors ${link.color}`}>
                      {link.icon}
                    </a>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">WhatsApp</h3>
                <Button variant="outline" asChild className="w-full sm:w-auto">
                  <a href="https://wa.me/55119XXXXXXXX" target="_blank" rel="noopener noreferrer">
                    <Phone className="mr-2 h-4 w-4" /> Conversar no WhatsApp
                  </a>
                </Button>
                <p className="text-xs text-muted-foreground mt-2">Substitua XXXXXXXX pelo número real.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Localização (Escritório Virtual)</h3>
                <p className="text-muted-foreground">Av. Principal, 123 - Sala 45</p>
                <p className="text-muted-foreground">Cidade Digital, Brasil</p>
                 <div className="mt-4 h-64 rounded-lg overflow-hidden border">
                  <img  alt="Mapa mostrando a localização do escritório virtual" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1629787155650-9ce3697dcb38" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ContactPage;