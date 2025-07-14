import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, Users } from 'lucide-react';

const ContentTable = ({ data, type, onEdit, onDelete, onAssign }) => {
    if (!data || data.length === 0) {
        return <p className="text-center text-muted-foreground py-8">Nenhum item encontrado.</p>;
    }

    const columns = {
        courses: ['Título', 'Status', 'Última Atualização'],
        modules: ['Título', 'Status', 'Última Atualização'],
        lessons: ['Título', 'Tipo', 'Última Atualização'],
        articles: ['Título', 'Status', 'Última Atualização'],
    };

    const currentColumns = columns[type] || [];

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        {currentColumns.map(col => <TableHead key={col}>{col}</TableHead>)}
                        <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map(item => (
                        <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.title}</TableCell>
                            
                            {type !== 'lessons' &&
                                <TableCell>
                                    <Badge variant={item.status === 'published' ? 'success' : 'outline'}>
                                        {item.status}
                                    </Badge>
                                </TableCell>
                            }
                            {type === 'lessons' && <TableCell>{item.type || 'N/A'}</TableCell>}
                            
                            <TableCell>{item.lastUpdated}</TableCell>

                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Abrir menu</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => onEdit(item)}>
                                            <Edit className="mr-2 h-4 w-4" /> Editar
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => onAssign(item)}>
                                            <Users className="mr-2 h-4 w-4" /> Atribuir
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => onDelete(item.id)} className="text-destructive">
                                            <Trash2 className="mr-2 h-4 w-4" /> Remover
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default ContentTable;