import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { User, Zap, Award, Mic, Linkedin, Twitter, Youtube } from 'lucide-react';

const RodrigoLeitePage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-12"
    >
      <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-br from-primary/80 via-secondary/70 to-purple-600/80 text-center text-primary-foreground">
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
        <div className="container relative z-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2, type: "spring", stiffness: 100 }}
            className="inline-block mb-8"
          >
            <img  
              alt="Foto de Rodrigo Leite, mentor principal" 
              className="w-40 h-40 md:w-48 md:h-48 rounded-full object-cover border-4 border-background shadow-xl mx-auto"
             src="https://images.unsplash.com/photo-1495310515531-b8751030bb28" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Rodrigo Leite</h1>
          <p className="text-xl md:text-2xl font-medium max-w-3xl mx-auto">
            Mentor Estratégico | Especialista em Desenvolvimento de Carreira | Fundador da MentoriaPRO
          </p>
          <div className="mt-8 flex justify-center space-x-4">
            <a href="#" target="_blank" rel="noopener noreferrer" className="text-primary-foreground hover:text-background transition-colors"><Linkedin size={28} /></a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="text-primary-foreground hover:text-background transition-colors"><Twitter size={28} /></a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="text-primary-foreground hover:text-background transition-colors"><Youtube size={28} /></a>
          </div>
        </div>
      </section>

      <section className="container space-y-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
             <img  
              alt="Rodrigo Leite em uma palestra ou workshop" 
              className="rounded-xl shadow-2xl w-full h-auto object-cover aspect-[4/3]"
             src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            <h2 className="h2-seo">Minha Trajetória e Paixão por Mentoria</h2>
            <p className="text-lg text-muted-foreground">
              Com mais de uma década imerso no universo da tecnologia e liderança, minha jornada foi marcada por aprendizados constantes, superação de desafios e, acima de tudo, pela paixão em ver pessoas crescendo e atingindo seu pleno potencial.
            </p>
            <p className="text-muted-foreground">
              Acredito que a mentoria é uma das ferramentas mais poderosas para acelerar o desenvolvimento profissional e pessoal. Minha missão é compartilhar o conhecimento e as estratégias que adquiri, guiando você por um caminho mais claro e eficiente rumo aos seus objetivos.
            </p>
            <p className="text-muted-foreground">
              Seja para impulsionar sua carreira, desenvolver novas habilidades ou superar bloqueios, estou aqui para ser seu parceiro estratégico nessa transformação.
            </p>
          </motion.div>
        </div>

        <div>
          <h2 className="h2-seo text-center mb-12">Especialidades e Áreas de Foco</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <User className="h-10 w-10 text-primary" />, title: "Desenvolvimento de Liderança", description: "Capacitando líderes inspiradores e eficazes." },
              { icon: <Zap className="h-10 w-10 text-primary" />, title: "Transição de Carreira", description: "Suporte estratégico para mudanças profissionais." },
              { icon: <Award className="h-10 w-10 text-primary" />, title: "Alta Performance", description: "Desbloqueando seu potencial máximo." },
              { icon: <Mic className="h-10 w-10 text-primary" />, title: "Comunicação e Oratória", description: "Aprimorando suas habilidades de apresentação." },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
              >
                <Card className="h-full text-center hover:shadow-primary/20 hover:shadow-xl transition-shadow duration-300 glassmorphism">
                  <CardHeader className="items-center">
                    {item.icon}
                    <CardTitle className="mt-4 text-xl">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="text-center py-12 bg-secondary/30 rounded-xl shadow-lg">
          <h2 className="h2-seo mb-6">Vamos Construir Seu Futuro Juntos?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Estou comprometido com o seu sucesso. Se você está pronto para levar sua carreira ao próximo nível, entre em contato e vamos conversar sobre como a mentoria pode te ajudar.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold text-lg shadow-lg hover:bg-primary/90 transition-colors cta-button-glow"
            onClick={() => window.location.href = '/contato'}
          >
            Agendar uma Conversa
          </motion.button>
        </div>
      </section>
    </motion.div>
  );
};

export default RodrigoLeitePage;