import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, Award, Zap, Target, Brain, Lightbulb } from 'lucide-react';

const teamMembers = [
  {
    name: "Rodrigo Leite",
    role: "Mentor Principal & Fundador",
    bio: "Com mais de 10 anos de experiência em desenvolvimento de software e liderança de equipes, Rodrigo é apaixonado por ajudar profissionais a alcançarem seu potencial máximo. Sua abordagem combina conhecimento técnico profundo com estratégias de desenvolvimento de carreira eficazes.",
    avatarText: "Rodrigo Leite, mentor principal, sorrindo",
    imageKey: "rodrigo-leite-mentor"
  },
  {
    name: "Equipe de Suporte",
    role: "Especialistas Dedicados",
    bio: "Nossa equipe é composta por especialistas em diversas áreas, prontos para oferecer suporte técnico, orientação pedagógica e ajudar com qualquer dúvida durante sua jornada na mentoria.",
    avatarText: "Equipe de suporte colaborando",
    imageKey: "equipe-suporte-mentoria"
  },
];

const methodologyPoints = [
  { icon: <Target className="h-8 w-8 text-primary" />, title: "Diagnóstico Inicial", description: "Entendemos seus objetivos, desafios e nível atual para traçar um plano personalizado." },
  { icon: <Brain className="h-8 w-8 text-primary" />, title: "Conteúdo Direcionado", description: "Aulas e materiais focados nas habilidades que você precisa desenvolver." },
  { icon: <Zap className="h-8 w-8 text-primary" />, title: "Desafios Práticos", description: "Aplique o conhecimento em projetos reais e construa um portfólio de impacto." },
  { icon: <Lightbulb className="h-8 w-8 text-primary" />, title: "Sessões Individuais", description: "Feedback direto e orientação estratégica do seu mentor." },
  { icon: <Users className="h-8 w-8 text-primary" />, title: "Comunidade e Networking", description: "Troque experiências e colabore com outros profissionais em crescimento." },
  { icon: <Award className="h-8 w-8 text-primary" />, title: "Avaliação Contínua", description: "Acompanhamos seu progresso e ajustamos o plano para garantir seus resultados." },
];

const AboutPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-16 md:space-y-24"
    >
      <section className="text-center">
        <h1 className="h1-seo mb-4">Sobre a Equipe e Metodologia</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Conheça o mentor, nossa equipe e a metodologia que transforma carreiras. Esta página agora é focada na equipe. Para detalhes da mentoria, visite "Sobre a Mentoria".
        </p>
      </section>

      <section>
        <h2 className="h2-seo text-center mb-12">Conheça o Mentor e a Equipe</h2>
        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
            >
              <Card className="h-full overflow-hidden glassmorphism">
                <div className="relative h-64 bg-gradient-to-br from-primary to-purple-600">
                  <img  
                    alt={member.avatarText} 
                    className="absolute inset-0 w-full h-full object-cover opacity-30"
                   src="https://images.unsplash.com/photo-1675023112817-52b789fd2ef0" />
                  <div className="absolute inset-0 flex items-center justify-center">
                     <div className="w-32 h-32 rounded-full border-4 border-background bg-secondary overflow-hidden shadow-lg">
                        <img  
                          alt={`Foto de ${member.name}`} 
                          className="w-full h-full object-cover"
                         src="https://images.unsplash.com/photo-1495310515531-b8751030bb28" />
                     </div>
                  </div>
                </div>
                <CardHeader className="text-center pt-8">
                  <CardTitle className="text-2xl">{member.name}</CardTitle>
                  <CardDescription className="text-primary">{member.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center">{member.bio}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-16 md:py-24 bg-secondary/30 rounded-xl shadow-xl">
        <h2 className="h2-seo text-center mb-12">Nossa Abordagem Pedagógica</h2>
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

      <section className="text-center">
         <img  
          alt="Gráfico abstrato simbolizando crescimento e desenvolvimento" 
          className="w-full max-w-4xl mx-auto rounded-lg shadow-xl h-auto object-cover aspect-[16/7]"
         src="https://images.unsplash.com/photo-1548230445-ca4ebd9755a8" />
        <h2 className="h2-seo mt-12 mb-6">Compromisso com Seu Desenvolvimento</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Nossa missão é fornecer as ferramentas, o conhecimento e o suporte necessários para que você não apenas alcance seus objetivos, mas os supere. Acreditamos no poder da mentoria para desbloquear potenciais e criar futuros brilhantes.
        </p>
      </section>
    </motion.div>
  );
};

export default AboutPage;