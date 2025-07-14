import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Star, MessageSquare, User, Linkedin } from 'lucide-react';

const testimonials = [
  {
    quote: "A mentoria com o Rodrigo foi um divisor de águas na minha carreira. Consegui uma promoção em 6 meses e me sinto muito mais confiante para liderar projetos complexos. Recomendo de olhos fechados!",
    name: "Ana Silva",
    role: "Desenvolvedora Full Stack Sênior",
    avatarText: "Ana Silva, desenvolvedora sorrindo",
    imageKey: "ana-silva-depoimento",
    stars: 5,
    linkedin: "#"
  },
  {
    quote: "O que mais me impressionou foi a capacidade do Rodrigo de entender minhas dificuldades e traçar um plano de ação prático. Aprendi não só tecnicamente, mas também sobre como me posicionar no mercado.",
    name: "Carlos Pereira",
    role: "Engenheiro de Software Pleno",
    avatarText: "Carlos Pereira, engenheiro de software pensativo",
    imageKey: "carlos-pereira-depoimento",
    stars: 5,
    linkedin: "#"
  },
  {
    quote: "Eu estava estagnada na minha carreira e a mentoria me deu o empurrão que eu precisava. O conteúdo é excelente, mas o acompanhamento individualizado fez toda a diferença. Gratidão!",
    name: "Juliana Costa",
    role: "UX Designer Especialista",
    avatarText: "Juliana Costa, UX designer com tablet",
    imageKey: "juliana-costa-depoimento",
    stars: 5,
    linkedin: "#"
  },
  {
    quote: "Participei de outras mentorias antes, mas nenhuma se compara à profundidade e ao cuidado que o Rodrigo e sua equipe oferecem. A comunidade também é um bônus incrível. Vale cada centavo!",
    name: "Marcos Lima",
    role: "Líder Técnico",
    avatarText: "Marcos Lima, líder técnico em reunião",
    imageKey: "marcos-lima-depoimento",
    stars: 4,
    linkedin: "#"
  },
  {
    quote: "Em pouco tempo, vi resultados práticos no meu dia a dia. As ferramentas e técnicas ensinadas são aplicáveis imediatamente. Consegui melhorar minha produtividade e comunicação com a equipe.",
    name: "Beatriz Santos",
    role: "Product Owner",
    avatarText: "Beatriz Santos, product owner organizando post-its",
    imageKey: "beatriz-santos-depoimento",
    stars: 5,
    linkedin: "#"
  },
  {
    quote: "Se você busca crescimento real e orientação de quem realmente entende do mercado, esta é a mentoria certa. O Rodrigo é um profissional exemplar e um mentor nato.",
    name: "Fernando Oliveira",
    role: "Arquiteto de Soluções",
    avatarText: "Fernando Oliveira, arquiteto de soluções em frente a um diagrama",
    imageKey: "fernando-oliveira-depoimento",
    stars: 5,
    linkedin: "#"
  }
];

const DepoimentosPage = () => {
  const renderStars = (count) => {
    return Array(count).fill(null).map((_, i) => (
      <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
    ));
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
        <h1 className="h1-seo mb-4">Depoimentos de Quem Já Passou por Aqui</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Veja o que nossos mentorados dizem sobre a experiência e os resultados alcançados com a MentoriaPRO.
        </p>
      </section>

      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="flex"
          >
            <Card className="w-full flex flex-col glassmorphism hover:shadow-primary/20 hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                     <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-2xl overflow-hidden">
                       <img  alt={`Foto de ${testimonial.name}`} className="w-full h-full object-cover" src={`https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?ixid=M3w1MDc0MDJ8MHwxfGFsbHx8fHx8fHx8fDE3MTc2NjM2MDh8&ixlib=rb-4.0.3&w=200&h=200&fit=crop&crop=faces&q=80`} />
                     </div>
                    <div>
                      <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                      <CardDescription className="text-sm">{testimonial.role}</CardDescription>
                    </div>
                  </div>
                   {testimonial.linkedin && (
                    <a href={testimonial.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                      <Linkedin size={20} />
                    </a>
                  )}
                </div>
                <div className="flex mt-3">{renderStars(testimonial.stars)}</div>
              </CardHeader>
              <CardContent className="flex-grow">
                <MessageSquare className="h-6 w-6 text-primary mb-2 opacity-70" />
                <p className="text-muted-foreground italic leading-relaxed">"{testimonial.quote}"</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </section>

      <section className="text-center py-16 bg-secondary/30 rounded-xl shadow-lg">
        <h2 className="h2-seo mb-6">Faça Parte Deste Time de Sucesso!</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Assim como eles, você também pode transformar sua carreira e alcançar seus objetivos mais ambiciosos.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold text-lg shadow-lg hover:bg-primary/90 transition-colors cta-button-glow"
          onClick={() => window.location.href = '/register'}
        >
          Quero Ser o Próximo Caso de Sucesso
        </motion.button>
      </section>
    </motion.div>
  );
};

export default DepoimentosPage;