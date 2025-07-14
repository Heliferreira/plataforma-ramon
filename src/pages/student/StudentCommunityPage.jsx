import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useCommunity } from '@/contexts/CommunityContext';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Loader2, Search, Briefcase, Building, Sparkles } from 'lucide-react';

const CommunityMemberCard = ({ member, index }) => {
  const getInitials = (name) => {
    if (!name) return "U";
    const names = name.split(' ');
    if (names.length > 1) return names[0][0] + (names[names.length - 1][0] || '');
    return names[0]?.[0] || 'U';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link to={`/student/community/${member.id}`}>
        <Card className="h-full text-center glassmorphism hover:shadow-primary/20 hover:-translate-y-1 transition-all duration-300">
          <CardContent className="p-6">
            <Avatar className="w-24 h-24 mx-auto mb-4 text-3xl border-2 border-primary/50">
              <AvatarImage src={member.avatarUrl} alt={member.name} />
              <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
            </Avatar>
            <h3 className="text-lg font-semibold text-foreground">{member.name}</h3>
            {member.jobTitle && <p className="text-sm text-primary">{member.jobTitle}</p>}
            {member.company && <p className="text-xs text-muted-foreground">{member.company}</p>}
            {member.interests && (
              <div className="mt-3 flex flex-wrap justify-center gap-1">
                {member.interests.slice(0, 3).map((interest, i) => (
                  <Badge key={i} variant="secondary">{interest}</Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};

const StudentCommunityPage = () => {
  const { profiles, loading } = useCommunity();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ jobTitle: '', company: '', interests: '' });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const filteredProfiles = useMemo(() => {
    return profiles.filter(profile => {
      const searchTermLower = searchTerm.toLowerCase();
      const nameMatch = profile.name?.toLowerCase().includes(searchTermLower);

      const jobTitleMatch = !filters.jobTitle || profile.jobTitle?.toLowerCase().includes(filters.jobTitle.toLowerCase());
      const companyMatch = !filters.company || profile.company?.toLowerCase().includes(filters.company.toLowerCase());
      const interestsMatch = !filters.interests || profile.interests?.some(interest => interest.toLowerCase().includes(filters.interests.toLowerCase()));

      return nameMatch && jobTitleMatch && companyMatch && interestsMatch;
    });
  }, [profiles, searchTerm, filters]);


  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
      <section className="text-center py-10 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl shadow-inner">
        <motion.h1
          initial={{ opacity:0, y: -20 }}
          animate={{ opacity:1, y: 0 }}
          className="text-4xl md:text-5xl font-bold gradient-text mb-3">Nossa Comunidade</motion.h1>
        <motion.p
          initial={{ opacity:0, y: 20 }}
          animate={{ opacity:1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-muted-foreground max-w-2xl mx-auto">Conecte-se, colabore e cresça com outros membros da mentoria.</motion.p>
      </section>
      
      <Card className="glassmorphism p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative lg:col-span-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input 
                      placeholder="Buscar por nome..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                  />
              </div>
              <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input name="jobTitle" placeholder="Filtrar por cargo..." className="pl-10" value={filters.jobTitle} onChange={handleFilterChange} />
              </div>
              <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input name="company" placeholder="Filtrar por empresa..." className="pl-10" value={filters.company} onChange={handleFilterChange} />
              </div>
              <div className="relative">
                  <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input name="interests" placeholder="Filtrar por interesse..." className="pl-10" value={filters.interests} onChange={handleFilterChange} />
              </div>
          </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProfiles.map((member, index) => (
          <CommunityMemberCard key={member.id} member={member} index={index} />
        ))}
      </div>

      {filteredProfiles.length === 0 && (
          <div className="text-center py-12 col-span-full">
              <Search className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-semibold">Nenhum membro encontrado</h2>
              <p className="text-muted-foreground mt-2">
                  Tente ajustar seus filtros de busca ou verifique se há membros na comunidade.
              </p>
          </div>
      )}
    </motion.div>
  );
};

export default StudentCommunityPage;