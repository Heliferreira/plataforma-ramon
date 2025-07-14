import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Tag, CalendarDays, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const mockPosts = [
  {
    id: 1,
    title: "5 Estratégias Comprovadas para Impulsionar Sua Carreira em Tecnologia",
    slug: "5-estrategias-carreira-tecnologia",
    category: "Carreira",
    date: "2025-05-15",
    excerpt: "Descubra táticas eficazes para se destacar no mercado de tecnologia, desde aprimorar habilidades até networking estratégico.",
    imageAlt: "Profissional de tecnologia trabalhando em um laptop com gráficos de crescimento",
    imageKey: "carreira-tech-blog",
    tags: ["Desenvolvimento Profissional", "Mercado de TI", "Liderança"]
  },
  {
    id: 2,
    title: "O Poder do Feedback Construtivo na Mentoria",
    slug: "poder-feedback-mentoria",
    category: "Mentoria",
    date: "2025-05-10",
    excerpt: "Entenda como o feedback bem estruturado pode acelerar o aprendizado e o desenvolvimento do mentorado.",
    imageAlt: "Duas pessoas conversando em uma sessão de mentoria",
    imageKey: "feedback-mentoria-blog",
    tags: ["Comunicação", "Desenvolvimento Pessoal", "Mentoria Eficaz"]
  },
  {
    id: 3,
    title: "Como Vencer a Síndrome do Impostor e Ganhar Confiança",
    slug: "vencer-sindrome-impostor",
    category: "Desenvolvimento Pessoal",
    date: "2025-05-01",
    excerpt: "Dicas práticas para identificar e superar a síndrome do impostor, fortalecendo sua autoconfiança.",
    imageAlt: "Pessoa olhando confiantemente para um espelho",
    imageKey: "sindrome-impostor-blog",
    tags: ["Autoconfiança", "Mindset", "Bem-estar"]
  },
  {
    id: 4,
    title: "Networking Inteligente: Construindo Conexões que Geram Oportunidades",
    slug: "networking-inteligente",
    category: "Carreira",
    date: "2025-04-25",
    excerpt: "Aprenda a construir e manter uma rede de contatos valiosa que pode abrir portas para novas oportunidades.",
    imageAlt: "Grupo de pessoas em um evento de networking",
    imageKey: "networking-blog",
    tags: ["Networking", "Desenvolvimento Profissional", "Oportunidades"]
  },
   {
    id: 5,
    title: "Definindo Metas SMART para Sua Carreira",
    slug: "metas-smart-carreira",
    category: "Planejamento",
    date: "2025-04-18",
    excerpt: "Utilize a metodologia SMART para definir metas claras, alcançáveis e relevantes para o seu crescimento profissional.",
    imageAlt: "Pessoa escrevendo metas em um caderno com um alvo ao fundo",
    imageKey: "metas-smart-blog",
    tags: ["Produtividade", "Planejamento de Carreira", "Objetivos"]
  },
  {
    id: 6,
    title: "A Importância da Inteligência Emocional no Ambiente de Trabalho",
    slug: "inteligencia-emocional-trabalho",
    category: "Desenvolvimento Pessoal",
    date: "2025-04-10",
    excerpt: "Explore como a inteligência emocional pode melhorar relacionamentos, liderança e tomada de decisões no trabalho.",
    imageAlt: "Cérebro com engrenagens e um coração, simbolizando inteligência emocional",
    imageKey: "inteligencia-emocional-blog",
    tags: ["Soft Skills", "Liderança", "Bem-estar Emocional"]
  }
];


const BlogPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = [...new Set(mockPosts.map(post => post.category))];

  const filteredPosts = mockPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? post.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-12"
    >
      <section className="text-center">
        <h1 className="h1-seo mb-4">Nosso Blog</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Artigos, dicas e insights sobre carreira, desenvolvimento pessoal e mentoria.
        </p>
      </section>

      <section className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Buscar artigos..." 
              className="pl-10 w-full text-lg py-6"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <Button 
              variant={!selectedCategory ? "default" : "outline"} 
              onClick={() => setSelectedCategory(null)}
              className="transition-all"
            >
              Todas
            </Button>
            {categories.map(category => (
              <Button 
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="transition-all"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {filteredPosts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="flex"
              >
                <Card className="w-full flex flex-col overflow-hidden glassmorphism hover:shadow-primary/20 hover:shadow-xl transition-shadow duration-300">
                  <div className="relative h-56 bg-gradient-to-br from-primary to-purple-600">
                    <img  
                      alt={post.imageAlt} 
                      className="absolute inset-0 w-full h-full object-cover opacity-40"
                     src={`https://images.unsplash.com/photo-1502945015378-d929333a5975?ixid=M3w1MDc0MDJ8MHwxfGFsbHx8fHx8fHx8fDE3MTc2NjM2MDh8&ixlib=rb-4.0.3&w=400&h=300&fit=crop&q=80`} />
                    <Badge variant="secondary" className="absolute top-3 right-3">{post.category}</Badge>
                  </div>
                  <CardHeader className="flex-grow">
                    <CardTitle className="text-xl hover:text-primary transition-colors">
                      <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground flex items-center mt-1">
                      <CalendarDays size={14} className="mr-2" /> {new Date(post.date).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </CardDescription>
                    <p className="mt-3 text-muted-foreground text-sm leading-relaxed">{post.excerpt}</p>
                  </CardHeader>
                  <CardFooter className="flex justify-between items-center pt-4">
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          <Tag size={12} className="mr-1" /> {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button variant="link" asChild className="text-primary hover:text-primary/80 p-0 h-auto">
                      <Link to={`/blog/${post.slug}`}>
                        Leia mais <ArrowRight size={16} className="ml-1" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Search size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Nenhum artigo encontrado</h3>
            <p className="text-muted-foreground">
              Tente ajustar sua busca ou explore outras categorias.
            </p>
          </div>
        )}
      </section>

      {/* Placeholder for a full blog post page (not implemented in this step) */}
      {/* <Route path="/blog/:slug" element={<FullBlogPostPage />} /> */}

    </motion.div>
  );
};

export default BlogPage;