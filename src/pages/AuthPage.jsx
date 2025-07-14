import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { LogIn, Eye, EyeOff } from 'lucide-react';

const AuthPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(user?.role === 'admin' ? '/admin/dashboard' : '/student/profile');
    }
  }, [isAuthenticated, navigate, user]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      const loggedInUser = login({ email, password });

      if (loggedInUser) {
         toast({ 
           title: "Login bem-sucedido!", 
           description: `Bem-vindo(a) de volta, ${loggedInUser.name}!`, 
           variant: "default" 
         });
      } else {
         toast({ 
           title: "Erro de Login", 
           description: "E-mail ou senha inválidos.", 
           variant: "destructive" 
         });
      }
    } catch (error) {
      toast({ 
        title: "Erro", 
        description: error.message || "Ocorreu um erro. Tente novamente.", 
        variant: "destructive" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-center min-h-[calc(100vh-15rem)] py-12"
    >
      <Card className="w-full max-w-md glassmorphism shadow-2xl">
        <CardHeader className="text-center">
            <Link to="/" className="flex justify-center items-center space-x-2 mb-4">
              <img  alt="Mentoria Rodrigo Leite Logotipo" className="h-16 md:h-20 object-contain" src="https://storage.googleapis.com/hostinger-horizons-assets-prod/7a3b58cd-89a0-4245-b9c8-ebfea02f224b/ec9b8e341aa9a0706b7a6eec18014125.png" />
            </Link>
          <CardTitle className="text-3xl font-bold gradient-text">Entrar na Plataforma</CardTitle>
          <CardDescription>Acesse sua conta para continuar sua jornada.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="Sua senha" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span className="sr-only">{showPassword ? "Esconder senha" : "Mostrar senha"}</span>
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full text-lg py-6" disabled={isSubmitting}>
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processando...
                </div>
              ) : 'Entrar'
              }
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-3">
          <Button variant="link" size="sm" className="text-muted-foreground">
            Esqueceu sua senha?
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default AuthPage;