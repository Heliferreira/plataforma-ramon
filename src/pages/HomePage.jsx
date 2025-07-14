import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle, Zap, Users, Award, MessageSquare } from 'lucide-react';

const featureVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
    },
  }),
};

const testimonials = [
  {
    quote: "Esta mentoria mudou minha carreira! O Rodrigo é um mentor incrível e dedicado.",
    name: "Ana Silva",
    role: "Desenvolvedora Full Stack",
    avatar: "AS"
  },
  {
    quote: "Aprendi mais em 6 meses de mentoria do que em 2 anos de cursos online. Recomendo!",
    name: "Carlos Pereira",
    role: "Engenheiro de Software",
    avatar: "CP"
  },
  {
    quote: "O suporte personalizado e os desafios práticos foram essenciais para meu crescimento.",
    name: "Juliana Costa",
    role: "UX Designer",
    avatar: "JC"
  },
];

const HomePage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-16 md:space-y-24"
    >
      <section className="text-center py-16 md:py-24 bg-gradient-to-b from-background to-transparent rounded-xl shadow-2xl overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="dotted-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="currentColor" /></pattern></defs><rect width="100%" height="100%" fill="url(#dotted-pattern)" /></svg>
        </div>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative z-10"
        >
          <h1 className="h1-seo mb-6">
            Transforme Sua Carreira com a Mentoria Exclusiva
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Alcance seus objetivos profissionais com orientação personalizada, conteúdo prático e uma comunidade de apoio.
          </p>
          <Button size="lg" asChild className="cta-button-glow">
            <Link to="/register">
              <Zap className="mr-2 h-5 w-5" /> Quero Evoluir Agora!
            </Link>
          </Button>
          <div className="mt-8 text-sm text-muted-foreground">
            Vagas limitadas. Inscreva-se e comece sua jornada!
          </div>
        </motion.div>
         <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent"></div>
      </section>

      <section>
        <h2 className="h2-seo text-center mb-12">Por que escolher nossa mentoria?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: <CheckCircle className="h-10 w-10 text-primary" />, title: "Resultados Comprovados", description: "Alunos que transformaram suas carreiras e alcançaram o sucesso." },
            { icon: <Users className="h-10 w-10 text-primary" />, title: "Mentores Experientes", description: "Profissionais atuantes no mercado, prontos para te guiar." },
            { icon: <Award className="h-10 w-10 text-primary" />, title: "Conteúdo Exclusivo", description: "Materiais didáticos atualizados e focados na prática." },
            { icon: <Zap className="h-10 w-10 text-primary" />, title: "Metodologia Inovadora", description: "Aprendizado dinâmico com desafios reais e feedback constante." },
            { icon: <MessageSquare className="h-10 w-10 text-primary" />, title: "Comunidade Ativa", description: "Networking e suporte contínuo com outros mentorados." },
            { icon: <Zap className="h-10 w-10 text-primary" />, title: "Flexibilidade Total", description: "Aprenda no seu ritmo, de onde estiver, com acesso vitalício." },
          ].map((feature, i) => (
            <motion.custom
              key={feature.title}
              custom={i}
              variants={featureVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)" }}
              className="cursor-pointer"
            >
              <Card className="h-full transform transition-all duration-300 hover:shadow-primary/20 hover:shadow-xl">
                <CardHeader className="items-center text-center">
                  {feature.icon}
                  <CardTitle className="mt-4">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.custom>
          ))}
        </div>
      </section>

      <section className="py-16 md:py-24 bg-secondary/30 rounded-xl shadow-xl">
         <h2 className="h2-seo text-center mb-12">O que nossos alunos dizem</h2>
        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8 px-4">
          {testimonials.map((testimonial, i) => (
            <motion.custom
              key={i}
              custom={i}
              variants={featureVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ y: -5 }}
            >
              <Card className="h-full flex flex-col">
                <CardContent className="pt-6 flex-grow">
                  <MessageSquare className="h-8 w-8 text-primary mb-4 opacity-50" />
                  <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
                </CardContent>
                <CardHeader className="pt-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                      <img  alt={`Avatar de ${testimonial.name}`} className="w-12 h-12 rounded-full object-cover" src="https://images.unsplash.com/photo-1460447325427-ce3901d00a6d" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{testimonial.name}</CardTitle>
                      <CardDescription>{testimonial.role}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </motion.custom>
          ))}
        </div>
      </section>

      <section className="text-center py-16 md:py-24">
        <h2 className="h2-seo mb-6">Pronto para dar o próximo passo?</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Não perca mais tempo. Invista em você e acelere sua jornada profissional com a nossa mentoria.
        </p>
        <Button size="lg" asChild className="cta-button-glow">
          <Link to="/register">
            <Zap className="mr-2 h-5 w-5" /> Começar Minha Transformação
          </Link>
        </Button>
      </section>
      
      <section className="py-16">
        <h2 className="h2-seo text-center mb-12">Diferenciais da Mentoria</h2>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <img  
              alt="Mentor orientando aluno em um ambiente moderno de escritório" 
              className="rounded-lg shadow-xl w-full h-auto object-cover aspect-video"
             src="https://images.unsplash.com/photo-1581726690015-c9861fa5057f" />
          </div>
          <ul className="space-y-6">
            {[
              { title: "Acompanhamento Individualizado", description: "Sessões personalizadas para focar nas suas necessidades e desafios específicos." },
              { title: "Projetos Práticos Reais", description: "Desenvolva um portfólio robusto com projetos que simulam o dia a dia do mercado." },
              { title: "Networking Estratégico", description: "Conecte-se com profissionais e outros mentorados, expandindo sua rede de contatos." },
              { title: "Preparação para Entrevistas", description: "Simulados e dicas para você se destacar em processos seletivos." },
            ].map((item, i) => (
              <motion.li 
                key={item.title} 
                className="flex items-start space-x-3 p-4 rounded-md hover:bg-secondary/20 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg text-foreground">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

    </motion.div>
  );
};

export default HomePage;