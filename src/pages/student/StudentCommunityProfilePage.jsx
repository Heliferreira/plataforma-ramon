import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCommunity } from '@/contexts/CommunityContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Briefcase, Building, Mail, Linkedin, Github, Globe, ArrowLeft, MessageSquare, Edit } from 'lucide-react';

const StudentCommunityProfilePage = () => {
  const { userId } = useParams();
  const { getProfile, loading } = useCommunity();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!loading) {
      const userProfile = getProfile(userId);
      setProfile(userProfile);
    }
  }, [userId, getProfile, loading]);

  const getInitials = (name) => {
    if (!name) return "U";
    const names = name.split(' ');
    if (names.length > 1) return names[0][0] + (names[names.length - 1][0] || '');
    return names[0]?.[0] || 'U';
  };

  const handleWhatsAppClick = () => {
    if (profile?.whatsapp) {
      window.open(`https://wa.me/${profile.whatsapp.replace(/\D/g, '')}`, '_blank');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }

  if (!profile) {
    return (
        <div className="text-center">
            <h1 className="text-2xl">Perfil não encontrado</h1>
            <p className="text-muted-foreground">O perfil que você está procurando não existe ou não pôde ser carregado.</p>
            <Button asChild className="mt-4"><Link to="/student/community">Voltar para a Comunidade</Link></Button>
        </div>
    );
  }

  const isOwnProfile = currentUser.id === profile.id;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
      <Link to="/student/community" className="flex items-center text-primary hover:underline">
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para a Comunidade
      </Link>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1 space-y-8">
          <Card className="text-center glassmorphism">
            <CardContent className="p-6">
              <Avatar className="w-32 h-32 mx-auto mb-4 text-4xl border-4 border-primary/50">
                <AvatarImage src={profile.avatarUrl} alt={profile.name} />
                <AvatarFallback>{getInitials(profile.name)}</AvatarFallback>
              </Avatar>
              <h1 className="text-3xl font-bold text-foreground">{profile.name}</h1>
              {profile.jobTitle && <p className="text-lg text-primary">{profile.jobTitle}</p>}
              {profile.company && <p className="text-md text-muted-foreground">{profile.company}</p>}

              <div className="mt-6 flex flex-col gap-3">
                 {isOwnProfile ? (
                     <Button asChild><Link to="/student/profile"><Edit className="mr-2 h-4 w-4" /> Editar meu perfil</Link></Button>
                 ) : (
                    <>
                    {profile.whatsapp && (
                        <Button onClick={handleWhatsAppClick}>
                            <MessageSquare className="mr-2 h-4 w-4" /> Enviar Mensagem
                        </Button>
                    )}
                    <Button variant="outline">
                        <Mail className="mr-2 h-4 w-4" /> Contatar por E-mail
                    </Button>
                    </>
                 )}
              </div>
            </CardContent>
          </Card>
          
          <Card className="glassmorphism">
              <CardHeader><CardTitle>Links Profissionais</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                  {profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-muted-foreground hover:text-primary"><Linkedin className="h-5 w-5 mr-3 text-primary/70" /> Perfil no LinkedIn</a>}
                  {profile.github && <a href={profile.github} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-muted-foreground hover:text-primary"><Github className="h-5 w-5 mr-3 text-primary/70" /> Perfil no GitHub</a>}
                  {profile.portfolio && <a href={profile.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-muted-foreground hover:text-primary"><Globe className="h-5 w-5 mr-3 text-primary/70" /> Portfólio Pessoal</a>}
                  {!profile.linkedin && !profile.github && !profile.portfolio && <p className="text-sm text-muted-foreground">Nenhum link informado.</p>}
              </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 space-y-8">
            <Card className="glassmorphism">
                <CardHeader><CardTitle>Sobre Mim</CardTitle></CardHeader>
                <CardContent>
                    <p className="text-muted-foreground whitespace-pre-wrap">{profile.bio || 'Nenhuma biografia informada.'}</p>
                </CardContent>
            </Card>

            <Card className="glassmorphism">
                <CardHeader><CardTitle>Áreas de Interesse</CardTitle></CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {profile.interests && profile.interests.length > 0 ? (
                            profile.interests.map((interest, i) => <Badge key={i} variant="default" className="text-md">{interest}</Badge>)
                        ) : (
                            <p className="text-sm text-muted-foreground">Nenhuma área de interesse informada.</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default StudentCommunityProfilePage;