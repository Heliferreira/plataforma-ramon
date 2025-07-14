import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="border-t border-border/40 py-8 bg-background/80"
    >
      <div className="container text-center text-muted-foreground">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Mentoria Rodrigo Leite. Todos os direitos reservados.
        </p>
        <p className="text-xs mt-1">
          Desenvolvido por Marketing Direciona Soluções Empresariais.
        </p>
      </div>
    </motion.footer>
  );
};

export default Footer;