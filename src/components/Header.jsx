import React from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Home, User, Info, MessageSquare, LogIn, LogOut, Settings, UserCircle, ShieldCheck, Rss, Award as AwardIcon, Users, LayoutDashboard, Video, ListChecks, CalendarDays, ClipboardCheck, LifeBuoy, KeyRound, BookOpen as BookOpenIcon, Activity, CalendarPlus, FileText as ArticleIcon, Briefcase } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from '@/lib/utils';

const publicNavItems = [
  { name: 'HOME', path: '/', icon: <Home className="h-5 w-5" /> },
  { name: 'RODRIGO LEITE', path: '/rodrigo-leite', icon: <User className="h-5 w-5" /> },
  { name: 'SOBRE A MENTORIA', path: '/sobre-a-mentoria', icon: <Info className="h-5 w-5" /> },
  { name: 'SOBRE NÓS', path: '/sobre-nos', icon: <Users className="h-5 w-5" /> },
  { name: 'DEPOIMENTOS', path: '/depoimentos', icon: <AwardIcon className="h-5 w-5" /> },
  { name: 'BLOG', path: '/blog', icon: <Rss className="h-5 w-5" /> },
  { name: 'CONTATO', path: '/contato', icon: <MessageSquare className="h-5 w-5" /> },
];

const studentNavItems = [
  { name: 'DASHBOARD', path: '/student/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
  { name: 'CURSOS', path: '/student/courses', icon: <Video className="h-5 w-5" /> },
  { name: 'COMUNIDADE', path: '/student/community', icon: <Users className="h-5 w-5" /> },
  { name: 'EVENTOS', path: '/student/events', icon: <CalendarPlus className="h-5 w-5" /> },
  { name: 'ATIVIDADES', path: '/student/activities', icon: <ListChecks className="h-5 w-5" /> },
  { name: 'CALENDÁRIO', path: '/student/calendar', icon: <CalendarDays className="h-5 w-5" /> },
];

const adminNavItems = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: <ShieldCheck className="h-5 w-5" /> },
  { name: 'Usuários', path: '/admin/users', icon: <Users className="h-5 w-5" /> },
  { name: 'Conteúdo', path: '/admin/content', icon: <BookOpenIcon className="h-5 w-5" /> },
  { name: 'Ativ. Mentoria', path: '/admin/mentorship-activities', icon: <ClipboardCheck className="h-5 w-5" /> },
  { name: 'Ativ. Gerais', path: '/admin/general-activities', icon: <Activity className="h-5 w-5" /> },
  { name: 'Eventos', path: '/admin/events', icon: <CalendarPlus className="h-5 w-5" /> },
];

const NavItemDesktop = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== "/" && location.pathname.startsWith(to));
  return (
    <NavLink
      to={to}
      className={cn(
        "text-sm font-medium transition-colors hover:text-primary",
        isActive ? "text-primary" : "text-muted-foreground"
      )}
    >
      {children}
    </NavLink>
  );
};

const MobileNavItem = ({ to, icon, children, closeSheet }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== "/" && location.pathname.startsWith(to));
   return (
     <NavLink
      to={to}
      onClick={closeSheet}
      className={cn(
        "flex items-center space-x-2 rounded-md p-2 text-lg font-medium transition-colors hover:bg-primary/10 hover:text-primary",
        isActive ? "bg-primary/10 text-primary" : "text-muted-foreground"
      )}
    >
      {icon}
      <span>{children}</span>
    </NavLink>
  );
};

const UserAvatarButton = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const getInitials = (name) => {
    if (!name) return "U";
    const names = name.split(' ');
    if (names.length > 1) {
      return names[0][0] + (names[names.length - 1][0] || '');
    }
    return names[0][0];
  };

  const profile = user?.profile;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={profile?.avatar_url || `https://avatar.vercel.sh/${user?.email || 'user'}.png?size=40`} alt={profile?.name || "Usuário"} />
            <AvatarFallback>{getInitials(profile?.name)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{profile?.name || "Usuário"}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {profile?.role === 'student' && (
          <>
            <DropdownMenuItem onClick={() => navigate('/student/dashboard')}>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/student/profile')}>
              <UserCircle className="mr-2 h-4 w-4" />
              <span>Meu Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/contato')}>
              <LifeBuoy className="mr-2 h-4 w-4" />
              <span>Suporte</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/student/profile')}>
              <KeyRound className="mr-2 h-4 w-4" />
              <span>Alterar Senha</span>
            </DropdownMenuItem>
          </>
        )}
        {profile?.role === 'admin' && (
           <DropdownMenuItem onClick={() => navigate('/admin/dashboard')}>
            <ShieldCheck className="mr-2 h-4 w-4" />
            <span>Painel Admin</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const DesktopNavigation = () => {
  const { user } = useAuth();
  let navItemsToDisplay = publicNavItems;

  if (user) {
    if (user?.profile?.role === 'student') {
      navItemsToDisplay = studentNavItems;
    } else if (user?.profile?.role === 'admin') {
      navItemsToDisplay = adminNavItems;
    }
  }
  
  return (
    <nav className="hidden lg:flex items-center space-x-6">
      {navItemsToDisplay.map((item) => (
        <NavItemDesktop key={`desktop-${item.name}`} to={item.path}>
          {item.name}
        </NavItemDesktop>
      ))}
    </nav>
  );
};

const MobileNavigation = ({ closeSheet }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  let navItemsToDisplay = publicNavItems;
  if (user) {
    if (user?.profile?.role === 'student') {
      navItemsToDisplay = studentNavItems;
    } else if (user?.profile?.role === 'admin') {
      navItemsToDisplay = adminNavItems;
    }
  }

  return (
    <nav className="flex flex-col space-y-4 mt-8">
      {navItemsToDisplay.map((item) => (
         <MobileNavItem 
          key={`mobile-${item.name}`}
          to={item.path} 
          icon={item.icon}
          closeSheet={closeSheet}
         >
          {item.name}
        </MobileNavItem>
      ))}

      {!user && (
        <>
          <Button variant="outline" className="w-full justify-start" onClick={() => { navigate('/login'); closeSheet(); }}>
            <LogIn className="mr-2 h-5 w-5" /> Entrar
          </Button>
        </>
      )}
    </nav>
  );
};


const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <img  alt="Mentoria Rodrigo Leite Logotipo" className="h-12 md:h-16 object-contain" src="https://storage.googleapis.com/hostinger-horizons-assets-prod/7a3b58cd-89a0-4245-b9c8-ebfea02f224b/ec9b8e341aa9a0706b7a6eec18014125.png" />
        </Link>
        
        <DesktopNavigation />

        <div className="flex items-center space-x-2">
          {user ? (
            <UserAvatarButton />
          ) : (
            <div className="hidden sm:flex items-center space-x-2">
              <Button variant="outline" onClick={() => navigate('/login')}>
                <LogIn className="mr-2 h-4 w-4" /> Entrar
              </Button>
            </div>
          )}
          
          <div className="lg:hidden">
             <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Abrir menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] glassmorphism">
                <MobileNavigation closeSheet={() => setIsMobileMenuOpen(false)} />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;