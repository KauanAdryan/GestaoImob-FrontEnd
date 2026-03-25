import { Card, CardContent } from '../ui/card';
import { Avatar } from '../ui/avatar';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Paperclip, User } from 'lucide-react';
import { Comment } from '../../types/property-flow';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState } from 'react';

interface CommentFeedProps {
  comments: Comment[];
  onAddComment?: (text: string) => void;
  readOnly?: boolean;
}

export function CommentFeed({ comments, onAddComment, readOnly = false }: CommentFeedProps) {
  const [newComment, setNewComment] = useState('');

  const handleSubmit = () => {
    if (newComment.trim() && onAddComment) {
      onAddComment(newComment);
      setNewComment('');
    }
  };

  return (
    <div className="space-y-4">
      {/* Novo comentário */}
      {!readOnly && onAddComment && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <Textarea
                placeholder="Adicione um comentário sobre o andamento..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                className="resize-none"
              />
              <div className="flex items-center justify-between">
                <Button variant="outline" size="sm">
                  <Paperclip className="h-4 w-4 mr-2" />
                  Anexar Arquivo
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={!newComment.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Publicar Comentário
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de comentários */}
      <div className="space-y-3">
        {comments.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">Nenhum comentário ainda</p>
            </CardContent>
          </Card>
        ) : (
          comments.map((comment) => (
            <Card key={comment.id} className="bg-gray-50">
              <CardContent className="pt-4">
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8 bg-blue-100 flex items-center justify-center">
                    <User className="h-4 w-4 text-blue-600" />
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm text-gray-900">{comment.autor}</span>
                      <span className="text-xs text-gray-500">
                        {format(comment.data, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.texto}</p>
                    {comment.anexos && comment.anexos.length > 0 && (
                      <div className="mt-2 flex items-center gap-2">
                        <Paperclip className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-600">
                          {comment.anexos.length} anexo(s)
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
