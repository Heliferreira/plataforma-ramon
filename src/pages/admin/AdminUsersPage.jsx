import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { UserPlus, Search, Edit, Trash2, MoreHorizontal, Eye, EyeOff } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const UserForm = ({ user, onSave, onCancel, allUsers }) => {
  const [formData, setFormData] = useState(user || { name: '', email: '', password: '', role: 'student', status: 'active' });
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      setFormData({ ...user, password: '' });
    } else {
      setFormData({ name: '', email: '', password: '', role: 'student', status: 'active' });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email.includes('@')) {
      toast({ title: "Erro de Validação", description: "Por favor, insira um e-mail válido.", variant: "destructive" });
      return;
    }
    if (!user) { // Creating new user
      if (!formData.password || formData.password.length < 6) {
        toast({ title: "Erro de Validação", description: "A senha deve ter pelo menos 6 caracteres.", variant: "destructive" });
        return;
      }
      const existingUser = allUsers.find(u => u.email === formData.email);
      if (existingUser) {
        toast({ title: "Erro", description: "Este e-mail já está cadastrado.", variant: "destructive" });
        return;
      }
    }
    if (user && formData.password && formData.password.length > 0 && formData.password.length < 6) {
      toast({ title: "Erro de Validação", description: "A nova senha deve ter pelo menos 6 caracteres.", variant: "destructive" });
      return;
    }
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nome Completo</Label>
        <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required disabled={!!user} />
      </div>
      <div>
        <Label htmlFor="password">{user ? 'Nova Senha (deixe em branco para não alterar)' : 'Senha'}</Label>
        <div className="relative">
          <Input id="password" name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} required={!user} />
          <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      <div>
        <Label htmlFor="role">Função</Label>
        <select id="role" name="role" value={formData.role} onChange={handleChange} className="w-full p-2 border rounded-md bg-background">
          <option value="student">Aluno</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <select id="status" name="status" value={formData.status} onChange={handleChange} className="w-full p-2 border rounded-md bg-background">
          <option value="active">Ativo</option>
          <option value="inactive">Inativo</option>
        </select>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button type="submit">{user ? 'Salvar Alterações' : 'Adicionar Aluno'}</Button>
      </DialogFooter>
    </form>
  );
};

const AdminUsersPage = () => {
  const { getAllUsers, registerStudent, updateUserInList, deleteUserFromList, user: currentUser } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const refreshUsers = useCallback(() => {
    setUsers(getAllUsers());
  }, [getAllUsers]);

  useEffect(() => {
    refreshUsers();
  }, [refreshUsers]);

  const filteredUsers = users.filter(user =>
    (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddUser = () => {
    setEditingUser(null);
    setIsFormOpen(true);
  };

  const handleEditUser = (userToEdit) => {
    setEditingUser(userToEdit);
    setIsFormOpen(true);
  };

  const handleDeleteUser = (userId) => {
    if (userId === currentUser.id) {
      toast({ title: "Ação não permitida", description: "Você não pode remover sua própria conta.", variant: "destructive" });
      return;
    }
    deleteUserFromList(userId);
    refreshUsers();
    toast({ title: "Usuário Removido", description: "O usuário foi removido com sucesso.", variant: "default" });
  };

  const handleSaveUser = (userData) => {
    if (editingUser) {
      updateUserInList(userData);
      toast({ title: "Usuário Atualizado", description: "As informações do usuário foram atualizadas.", variant: "default" });
    } else {
      registerStudent(userData);
      toast({ title: "Aluno Adicionado", description: `${userData.name} foi adicionado com sucesso.`, variant: "default" });
    }
    refreshUsers();
    setIsFormOpen(false);
    setEditingUser(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="h1-seo">Gerenciar Usuários</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddUser}>
              <UserPlus className="mr-2 h-4 w-4" /> Adicionar Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] glassmorphism">
            <DialogHeader>
              <DialogTitle>{editingUser ? 'Editar Usuário' : 'Adicionar Novo Usuário'}</DialogTitle>
              <DialogDescription>
                {editingUser ? 'Modifique as informações do usuário abaixo.' : 'Preencha os dados para cadastrar um novo usuário.'}
              </DialogDescription>
            </DialogHeader>
            <UserForm
              user={editingUser}
              onSave={handleSaveUser}
              onCancel={() => { setIsFormOpen(false); setEditingUser(null); }}
              allUsers={users}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle>Lista de Usuários</CardTitle>
          <CardDescription>Visualize, edite ou remova usuários da plataforma.</CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou e-mail..."
              className="pl-10 w-full sm:w-1/2 lg:w-1/3"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableCaption className="py-4">Uma lista dos usuários cadastrados na plataforma.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead className="hidden md:table-cell">E-mail</TableHead>
                  <TableHead>Função</TableHead>
                  <TableHead className="hidden sm:table-cell">Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Data de Cadastro</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="hidden md:table-cell">{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'}>
                        {user.role === 'admin' ? 'Admin' : 'Aluno'}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant={user.status === 'active' ? 'default' : 'outline'} className={user.status === 'active' ? 'bg-green-500/20 text-green-700 border-green-500/30' : 'bg-red-500/20 text-red-700 border-red-500/30'}>
                        {user.status === 'active' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">{user.joinedDate ? new Date(user.joinedDate).toLocaleDateString('pt-BR') : 'N/A'}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEditUser(user)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 focus:text-red-600 focus:bg-red-100 dark:focus:bg-red-800/30"
                            disabled={user.id === currentUser.id}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remover
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filteredUsers.length === 0 && (
            <p className="text-center text-muted-foreground py-8">Nenhum usuário encontrado.</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AdminUsersPage;