import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useCommunity } from '@/contexts/CommunityContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Lock, Camera, Edit3, Briefcase, Building, Sparkles, MessageSquare, Linkedin, Github, Globe, Save, X } from 'lucide-react';

const StudentProfilePage = () => {
  const { user, updateUserContext, updateUserInList } = useAuth();
  const { updateProfile, getProfile } = useCommunity();
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");

  // State for forms
  const [personalData, setPersonalData] = useState({ name: '' });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');

  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });

  const [communityData, setCommunityData] = useState({
    jobTitle: '',
    company: '',
    bio: '',
    interests: [],
    whatsapp: '',
    linkedin: '',
    github: '',
    portfolio: ''
  });
  const [interestsInput, setInterestsInput] = useState('');
  
  const resetForms = useCallback(() => {
    if (user) {
      const userProfile = getProfile(user.id);
      setPersonalData({ name: user.name });
      setAvatarPreview(user.avatarUrl || `https://avatar.vercel.sh/${user.email}.png`);
      
      if (userProfile) {
        setCommunityData({
          jobTitle: userProfile.jobTitle || '',
          company: userProfile.company || '',
          bio: userProfile.bio || '',
          interests: userProfile.interests || [],
          whatsapp: userProfile.whatsapp || '',
          linkedin: userProfile.linkedin || '',
          github: userProfile.github || '',
          portfolio: userProfile.portfolio || ''
        });
      } else {
         setCommunityData({
            jobTitle: '', company: '', bio: '', interests: [],
            whatsapp: '', linkedin: '', github: '', portfolio: ''
        });
      }
    }
     setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
     setAvatarFile(null);
     setInterestsInput('');
  }, [user, getProfile]);
  
  useEffect(() => {
    if (user) {
        resetForms();
    }
  }, [user, resetForms]);

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };
  
  const handleCancelEdit = () => {
    resetForms();
    setIsEditing(false);
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    if (!isEditing) return;

    toast({ title: "Processando...", description: "Atualizando seu perfil." });
    
    const updatedUserData = { 
      ...user, 
      name: personalData.name,
      // The avatarUrl is handled by updateUserContext which will use the preview if a file is set
      ...(avatarFile && { avatarUrl: avatarPreview })
    };
    
    updateUserContext(updatedUserData, avatarFile);
    updateProfile(user.id, communityData);

    toast({ title: "Perfil Atualizado!", description: "Suas informações foram salvas com sucesso." });
    setIsEditing(false);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      toast({ title: "Erro", description: "As novas senhas não coincidem.", variant: "destructive" });
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast({ title: "Erro", description: "A nova senha deve ter pelo menos 6 caracteres.", variant: "destructive" });
      return;
    }
    
    toast({ title: "Processando...", description: "Alterando sua senha." });
    
    const allUsers = JSON.parse(localStorage.getItem('mentorship_all_users') || '[]');
    const currentUserWithPassword = allUsers.find(u => u.id === user.id);

    if (currentUserWithPassword && currentUserWithPassword.password !== passwordData.currentPassword) {
        toast({ title: "Erro", description: "A senha atual está incorreta.", variant: "destructive" });
        return;
    }

    updateUserInList({ ...user, password: passwordData.newPassword });

    toast({ title: "Senha Alterada!", description: "Sua senha foi alterada com sucesso." });
    setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  };
  
  const handleCommunityDataChange = (e) => {
    const { name, value } = e.target;
    setCommunityData(prev => ({...prev, [name]: value}));
  };
  
  const handlePersonalDataChange = (e) => {
    const { name, value } = e.target;
    setPersonalData(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePasswordDataChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleInterestsChange = (e) => {
      if ((e.key === ',' || e.key === 'Enter') && interestsInput.trim()) {
          e.preventDefault();
          const newInterest = interestsInput.trim().replace(/,$/, '');
          if (newInterest && !communityData.interests.includes(newInterest)) {
              setCommunityData(prev => ({ ...prev, interests: [...prev.interests, newInterest] }));
          }
          setInterestsInput('');
      }
  };

  const removeInterest = (interestToRemove) => {
      setCommunityData(prev => ({
          ...prev,
          interests: prev.interests.filter(interest => interest !== interestToRemove)
      }));
  };

  const getInitials = (nameStr) => {
    if (!nameStr) return "U";
    const names = nameStr.split(' ');
    if (names.length > 1) return names[0][0] + (names[names.length - 1][0] || '');
    return names[0]?.[0] || 'U';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
       <form onSubmit={handleProfileUpdate}>
        <div className="flex justify-between items-start mb-8">
            <h1 className="h1-seo">Meu Perfil</h1>
            <div className="flex gap-2">
                {isEditing ? (
                    <>
                        <Button variant="outline" type="button" onClick={handleCancelEdit}>
                            <X className="mr-2 h-4 w-4" />
                            Cancelar
                        </Button>
                        <Button type="submit">
                            <Save className="mr-2 h-4 w-4" />
                            Salvar Alterações
                        </Button>
                    </>
                ) : (
                    <Button type="button" onClick={() => setIsEditing(true)}>
                        <Edit3 className="mr-2 h-4 w-4" />
                        Editar Perfil
                    </Button>
                )}
            </div>
        </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1"
        >
          <Card className="text-center glassmorphism">
            <CardHeader>
              <div className="relative mx-auto w-32 h-32 mb-4">
                <Avatar className="w-32 h-32 text-4xl">
                  <AvatarImage src={avatarPreview} alt={personalData.name} />
                  <AvatarFallback>{getInitials(personalData.name)}</AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Label htmlFor="avatarUpload" className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors">
                    <Camera className="h-5 w-5" />
                    <input id="avatarUpload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} disabled={!isEditing} />
                  </Label>
                )}
              </div>
              <CardTitle className="text-2xl">{isEditing ? personalData.name : user?.name}</CardTitle>
              <CardDescription>{user?.email}</CardDescription>
            </CardHeader>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="personal">Pessoal e Segurança</TabsTrigger>
                <TabsTrigger value="community">Perfil da Comunidade</TabsTrigger>
            </TabsList>
            <TabsContent value="personal">
              <Card className="glassmorphism mt-4">
                  <CardHeader>
                      <CardTitle>Informações Pessoais</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <div className="space-y-6">
                           <div className="space-y-2">
                              <Label htmlFor="name"><User className="inline-block mr-2 h-4 w-4" />Nome Completo</Label>
                              <Input id="name" name="name" type="text" value={personalData.name} onChange={handlePersonalDataChange} required disabled={!isEditing} />
                          </div>
                          <div className="space-y-2">
                              <Label htmlFor="email"><Mail className="inline-block mr-2 h-4 w-4" />E-mail</Label>
                              <Input id="email" type="email" value={user?.email || ''} disabled />
                              <p className="text-xs text-muted-foreground">O e-mail não pode ser alterado.</p>
                          </div>
                      </div>
                  </CardContent>
              </Card>
              <Card className="glassmorphism mt-8">
                  <CardHeader><CardTitle>Alterar Senha</CardTitle></CardHeader>
                  <CardContent>
                      <form onSubmit={handlePasswordChange} className="space-y-6">
                          <div className="space-y-2">
                              <Label htmlFor="currentPassword"><Lock className="inline-block mr-2 h-4 w-4" />Senha Atual</Label>
                              <Input id="currentPassword" name="currentPassword" type="password" value={passwordData.currentPassword} onChange={handlePasswordDataChange} required />
                          </div>
                          <div className="space-y-2">
                              <Label htmlFor="newPassword"><Lock className="inline-block mr-2 h-4 w-4" />Nova Senha</Label>
                              <Input id="newPassword" name="newPassword" type="password" value={passwordData.newPassword} onChange={handlePasswordDataChange} required />
                          </div>
                          <div className="space-y-2">
                              <Label htmlFor="confirmNewPassword"><Lock className="inline-block mr-2 h-4 w-4" />Confirmar Nova Senha</Label>
                              <Input id="confirmNewPassword" name="confirmNewPassword" type="password" value={passwordData.confirmNewPassword} onChange={handlePasswordDataChange} required />
                          </div>
                          <Button type="submit" variant="outline" className="w-full">Alterar Senha</Button>
                      </form>
                  </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="community">
                <Card className="glassmorphism mt-4">
                    <CardHeader>
                        <CardTitle>Informações Profissionais</CardTitle>
                        <CardDescription>Estes dados serão exibidos no seu perfil na comunidade.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="jobTitle"><Briefcase className="inline-block mr-2 h-4 w-4" />Cargo/Função</Label>
                                <Input id="jobTitle" name="jobTitle" value={communityData.jobTitle} onChange={handleCommunityDataChange} placeholder="Ex: Desenvolvedor(a) Frontend" disabled={!isEditing} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="company"><Building className="inline-block mr-2 h-4 w-4" />Empresa</Label>
                                <Input id="company" name="company" value={communityData.company} onChange={handleCommunityDataChange} placeholder="Ex: Leite Corp." disabled={!isEditing} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bio"><User className="inline-block mr-2 h-4 w-4" />Mini-Bio</Label>
                            <Textarea id="bio" name="bio" value={communityData.bio} onChange={handleCommunityDataChange} placeholder="Fale um pouco sobre você, suas experiências e objetivos." disabled={!isEditing} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="interests"><Sparkles className="inline-block mr-2 h-4 w-4" />Áreas de Interesse</Label>
                            <Input id="interests" value={interestsInput} onChange={(e) => setInterestsInput(e.target.value)} onKeyDown={handleInterestsChange} placeholder="Digite um interesse e aperte Enter ou vírgula" disabled={!isEditing} />
                             <p className="text-xs text-muted-foreground">Use vírgula ou Enter para adicionar um interesse.</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {communityData.interests.map((interest, i) => (
                                    <Badge key={i} variant="secondary">
                                        {interest}
                                        {isEditing && <button type="button" onClick={() => removeInterest(interest)} className="ml-2 font-bold text-destructive hover:text-destructive/80"><X className="h-3 w-3" /></button>}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="glassmorphism mt-8">
                    <CardHeader><CardTitle>Contato e Redes</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="whatsapp"><MessageSquare className="inline-block mr-2 h-4 w-4" />WhatsApp</Label>
                            <Input id="whatsapp" name="whatsapp" value={communityData.whatsapp} onChange={handleCommunityDataChange} placeholder="Seu número com código do país (Ex: 55119...)" disabled={!isEditing} />
                             <p className="text-xs text-muted-foreground">Seu número só será visível na comunidade se você preencher este campo.</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="linkedin"><Linkedin className="inline-block mr-2 h-4 w-4" />LinkedIn</Label>
                            <Input id="linkedin" name="linkedin" value={communityData.linkedin} onChange={handleCommunityDataChange} placeholder="URL do seu perfil no LinkedIn" disabled={!isEditing} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="github"><Github className="inline-block mr-2 h-4 w-4" />GitHub</Label>
                            <Input id="github" name="github" value={communityData.github} onChange={handleCommunityDataChange} placeholder="URL do seu perfil no GitHub" disabled={!isEditing} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="portfolio"><Globe className="inline-block mr-2 h-4 w-4" />Portfólio</Label>
                            <Input id="portfolio" name="portfolio" value={communityData.portfolio} onChange={handleCommunityDataChange} placeholder="URL do seu site ou portfólio" disabled={!isEditing} />
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
     </form>
    </motion.div>
  );
};

export default StudentProfilePage;