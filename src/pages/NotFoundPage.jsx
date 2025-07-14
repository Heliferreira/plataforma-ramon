import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Home } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-[calc(100vh-15rem)] text-center px-4"
    >
      <motion.div
        initial={{ scale: 0.5, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
      >
        <AlertTriangle className="h-32 w-32 text-destructive mb-8" />
      </motion.div>
      
      <h1 className="text-6xl md:text-8xl font-extrabold text-primary mb-4">404</h1>
      <h2 className="text-2xl md:text-4xl font-semibold text-foreground mb-6">Página Não Encontrada</h2>
      <p className="text-lg text-muted-foreground max-w-md mb-10">
        Oops! Parece que a página que você está procurando não existe ou foi movida.
      </p>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.3 }}
      >
        <Button asChild size="lg" className="cta-button-glow">
          <Link to="/">
            <Home className="mr-2 h-5 w-5" />
            Voltar para a Página Inicial
          </Link>
        </Button>
      </motion.div>

      <div className="mt-16">
        <img  
          alt="Ilustração de uma pessoa confusa olhando para um mapa" 
          className="w-full max-w-sm h-auto opacity-75"
         src="https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b" />
      </div>
    </motion.div>
  );
};

export default NotFoundPage;