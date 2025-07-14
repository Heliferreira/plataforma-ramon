import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Target, Brain, Zap, Lightbulb, Users, Award, CheckCircle, Video, Download, MessageCircle, TrendingUp } from 'lucide-react';

const methodologyPoints = [
  { icon: <Target className="h-8 w-8 text-primary" />, title: "Diagnóstico Detalhado", description: "Iniciamos com uma análise profunda dos seus objetivos, desafios atuais e aspirações de carreira para criar um plano de mentoria 100% personalizado." },
  { icon: <Brain className="h-8 w-8 text-primary" />, title: "Conteúdo Estratégico", description: "Acesso a módulos e aulas com conteúdo prático e direcionado, focado nas competências essenciais para o seu desenvolvimento e sucesso no mercado." },
  { icon: <Zap className="h-8 w-8 text-primary" />, title: "Desafios e Projetos Reais", description: "Aplique o conhecimento adquirido em desafios práticos e projetos que simulam o ambiente profissional, construindo um portfólio de impacto." },
  { icon: <Lightbulb className="h-8 w-8 text-primary" />, title: "Sessões de Mentoria Individuais", description: "Encontros periódicos com seu mentor para feedback personalizado, orientação estratégica e acompanhamento de perto do seu progresso." },
  { icon: <Users className="h-8 w-8 text-primary" />, title: "Comunidade Exclusiva", description: "Participe de uma comunidade vibrante de mentorados, troque experiências, faça networking e colabore em um ambiente de apoio mútuo." },
  { icon: <Award className="h-8 w-8 text-primary" />, title: "Avaliação e Certificação", description: "Acompanhamento contínuo do seu desenvolvimento e, ao final da jornada, um certificado de conclusão para validar suas novas competências." },
];

const programFeatures = [
  { icon: <Video className="h-6 w-6 text-primary" />, text: "Aulas em vídeo gravadas e ao vivo" },
  { icon: <Download className="h-6 w-6 text-primary" />, text: "Materiais didáticos para download (PDFs, planilhas, templates)" },
  { icon: <MessageCircle className="h-6 w-6 text-primary" />, text: "Canal direto para tirar dúvidas com o mentor e equipe" },
  { icon: <TrendingUp className="h-6 w-6 text-primary" />, text: "Acompanhamento de progresso individualizado" },
  { icon: <CheckCircle className="h-6 w-6 text-primary" />, text: "Certificado de conclusão ao final da mentoria" },
];

const SobreMentoriaPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-16 md:space-y-24"
    >
      <section className="text-center">
        <h1 className="h1-seo mb-4">Sobre a Mentoria</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Descubra como nossa mentoria é estruturada para impulsionar sua carreira e te levar ao próximo nível profissional.
        </p>
      </section>

      <section>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <img  
              alt="Mentor explicando um conceito para um grupo de alunos atentos" 
              className="rounded-xl shadow-2xl w-full h-auto object-cover aspect-video"
             src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            <h2 className="h2-seo">O Que é a MentoriaPRO?</h2>
            <p className="text-lg text-muted-foreground">
              A MentoriaPRO é um programa de desenvolvimento profissional e de carreira desenhado para oferecer orientação estratégica, conhecimento prático e suporte contínuo. Nosso objetivo é simples: acelerar seu crescimento e te ajudar a alcançar resultados extraordinários.
            </p>
            <p className="text-muted-foreground">
              Combinamos a experiência de mentores atuantes no mercado com uma metodologia validada, focada em aprendizado prático, desenvolvimento de habilidades comportamentais (soft skills) e técnicas (hard skills), e construção de uma mentalidade vencedora.
            </p>
            <p className="text-muted-foreground">
              Aqui, você não é apenas mais um aluno. Você é um profissional em ascensão, e nossa mentoria é o catalisador para sua transformação.
            </p>
          </motion.div>
        </div>
      </section>
      
      <section className="py-16 md:py-24 bg-secondary/30 rounded-xl shadow-xl">
        <h2 className="h2-seo text-center mb-12">Nossa Metodologia Comprovada</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
          {methodologyPoints.map((point, index) => (
            <motion.div
              key={point.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card className="h-full text-center hover:shadow-primary/20 hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="items-center">
                  {point.icon}
                  <CardTitle className="mt-4 text-xl">{point.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{point.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="h2-seo text-center mb-12">O Que Você Terá Acesso</h2>
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="space-y-6">
            {programFeatures.slice(0, Math.ceil(programFeatures.length / 2)).map((feature, i) => (
              <motion.div 
                key={i} 
                className="flex items-start space-x-4 p-4 rounded-lg bg-card glassmorphism"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                {feature.icon}
                <p className="text-muted-foreground text-lg">{feature.text}</p>
              </motion.div>
            ))}
          </div>
          <div className="space-y-6">
            {programFeatures.slice(Math.ceil(programFeatures.length / 2)).map((feature, i) => (
              <motion.div 
                key={i} 
                className="flex items-start space-x-4 p-4 rounded-lg bg-card glassmorphism"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                {feature.icon}
                <p className="text-muted-foreground text-lg">{feature.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
         <div className="mt-12 text-center">
           <img  
            alt="Dashboard da área de membros da mentoria mostrando módulos e progresso" 
            className="rounded-lg shadow-xl w-full max-w-4xl mx-auto h-auto object-cover aspect-video"
           src="https://images.unsplash.com/photo-1582996269877-6474ce12c093" />
        </div>
      </section>

      <section className="text-center py-16 bg-gradient-to-r from-primary via-purple-600 to-secondary rounded-xl shadow-2xl text-primary-foreground">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Pronto para Iniciar Sua Transformação?</h2>
        <p className="text-xl max-w-2xl mx-auto mb-8">
          Junte-se a centenas de profissionais que já aceleraram suas carreiras com a MentoriaPRO.
        </p>
        <Button size="lg" variant="outline" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 cta-button-glow border-2 border-primary-foreground hover:border-primary-foreground" asChild>
          <Link to="/register">
            <Zap className="mr-2 h-5 w-5" /> Quero me Inscrever Agora!
          </Link>
        </Button>
      </section>
    </motion.div>
  );
};

export default SobreMentoriaPage;