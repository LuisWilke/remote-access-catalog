'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Monitor, Settings, Star, History, QrCode, Plus } from 'lucide-react';
import { Contact, AccessLog, AccessType } from '@/lib/database';

export default function RemoteAccessApp() {
  const [clientId, setClientId] = useState('');
  const [password, setPassword] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showContacts, setShowContacts] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContact, setNewContact] = useState<Partial<Contact>>({});

  useEffect(() => {
    fetchContacts();
    fetchAccessLogs();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/contacts');
      const data = await response.json();
      setContacts(data);
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
    }
  };

  const fetchAccessLogs = async () => {
    try {
      const response = await fetch('/api/access-logs');
      const data = await response.json();
      setAccessLogs(data);
    } catch (error) {
      console.error('Failed to fetch access logs:', error);
    }
  };

  const handleRemoteAccess = async (type: AccessType) => {
    if (!clientId) {
      alert('Por favor, digite o ID do cliente');
      return;
    }

    // Log the access
    try {
      await fetch('/api/access-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: clientId, type, password }),
      });
      fetchAccessLogs();
    } catch (error) {
      console.error('Failed to log access:', error);
    }

    // Generate the appropriate connection URL/command
    let connectionUrl = '';
    switch (type) {
      case 'TeamViewer':
        connectionUrl = `teamviewer10://control?device=${clientId}&password=${password}`;
        break;
      case 'AnyDesk':
        connectionUrl = `anydesk:${clientId}`;
        break;
      case 'RDP':
        connectionUrl = `rdp://${clientId}`;
        break;
      case 'RustDesk':
        connectionUrl = `rustdesk://${clientId}`;
        break;
    }

    // Try to open the URL or show instructions
    try {
      window.open(connectionUrl, '_blank');
    } catch (error) {
      alert(`Para conectar via ${type}, use:\nID: ${clientId}\nSenha: ${password}`);
    }
  };

  const handleSaveContact = async () => {
    if (!newContact.name || !newContact.id) {
      alert('Nome e ID são obrigatórios');
      return;
    }

    try {
      await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newContact.name,
          id: newContact.id,
          type: newContact.type || 'TeamViewer',
          password: newContact.password || '',
        }),
      });
      setNewContact({});
      setShowAddContact(false);
      fetchContacts();
    } catch (error) {
      console.error('Failed to save contact:', error);
    }
  };

  const handleSelectContact = (contact: Contact) => {
    setClientId(contact.id);
    setPassword(contact.password);
    setSelectedContact(contact);
    setShowContacts(false);
  };

  const handleDeleteContact = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este contato?')) return;

    try {
      await fetch(`/api/contacts?id=${id}`, { method: 'DELETE' });
      fetchContacts();
    } catch (error) {
      console.error('Failed to delete contact:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Monitor className="h-6 w-6" />
            Access Remote Helper
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Remote Access Icons */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Monitor className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-xs text-gray-600">TeamViewer</span>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Monitor className="h-6 w-6 text-red-600" />
              </div>
              <span className="text-xs text-gray-600">AnyDesk</span>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Monitor className="h-6 w-6 text-gray-600" />
              </div>
              <span className="text-xs text-gray-600">RDP</span>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Monitor className="h-6 w-6 text-purple-600" />
              </div>
              <span className="text-xs text-gray-600">RustDesk</span>
            </div>
          </div>

          {/* Action Icons */}
          <div className="flex justify-end gap-2 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowLogs(true)}
              className="text-gray-500"
            >
              <History className="h-4 w-4" />
            </Button>
            <Dialog open={showContacts} onOpenChange={setShowContacts}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-gray-500">
                  <Settings className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Contatos Salvos</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Button
                    onClick={() => setShowAddContact(true)}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Contato
                  </Button>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>ID</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contacts.map((contact) => (
                        <TableRow key={contact.id}>
                          <TableCell>{contact.name}</TableCell>
                          <TableCell>{contact.id}</TableCell>
                          <TableCell>{contact.type}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleSelectContact(contact)}
                              >
                                Usar
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteContact(contact.id)}
                              >
                                Excluir
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </DialogContent>
            </Dialog>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (clientId && !contacts.find(c => c.id === clientId)) {
                  setNewContact({ id: clientId, password });
                  setShowAddContact(true);
                }
              }}
              className="text-yellow-500"
            >
              <Star className="h-4 w-4" />
            </Button>
          </div>

          {/* Client ID Input */}
          <div className="space-y-2">
            <Label htmlFor="clientId">ID do cliente</Label>
            <Input
              id="clientId"
              placeholder="Digite o ID do parceiro"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="text-center text-lg"
            />
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-center text-lg"
            />
          </div>

          {/* Connection Buttons */}
          <div className="grid grid-cols-4 gap-2">
            <Button
              onClick={() => handleRemoteAccess('TeamViewer')}
              className="bg-blue-500 hover:bg-blue-600"
            >
              TV
            </Button>
            <Button
              onClick={() => handleRemoteAccess('RustDesk')}
              className="bg-purple-500 hover:bg-purple-600"
            >
              Rust
            </Button>
            <Button
              onClick={() => handleRemoteAccess('AnyDesk')}
              className="bg-red-500 hover:bg-red-600"
            >
              Any
            </Button>
            <Button
              onClick={() => handleRemoteAccess('RDP')}
              className="bg-gray-500 hover:bg-gray-600"
            >
              RDP
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Add Contact Dialog */}
      <Dialog open={showAddContact} onOpenChange={setShowAddContact}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Contato</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="contactName">Nome</Label>
              <Input
                id="contactName"
                value={newContact.name || ''}
                onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="contactId">ID</Label>
              <Input
                id="contactId"
                value={newContact.id || ''}
                onChange={(e) => setNewContact({ ...newContact, id: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="contactType">Tipo</Label>
              <select
                id="contactType"
                value={newContact.type || 'TeamViewer'}
                onChange={(e) => setNewContact({ ...newContact, type: e.target.value })}
                className="w-full p-2 border rounded"
              >
                <option value="TeamViewer">TeamViewer</option>
                <option value="AnyDesk">AnyDesk</option>
                <option value="RDP">RDP</option>
                <option value="RustDesk">RustDesk</option>
              </select>
            </div>
            <div>
              <Label htmlFor="contactPassword">Senha</Label>
              <Input
                id="contactPassword"
                type="password"
                value={newContact.password || ''}
                onChange={(e) => setNewContact({ ...newContact, password: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSaveContact} className="flex-1">
                Salvar
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setNewContact({});
                  setShowAddContact(false);
                }}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Access Logs Dialog */}
      <Dialog open={showLogs} onOpenChange={setShowLogs}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Histórico de Acessos</DialogTitle>
          </DialogHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Tipo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accessLogs.map((log, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {new Date(log.date).toLocaleString('pt-BR')}
                  </TableCell>
                  <TableCell>{log.name || '-'}</TableCell>
                  <TableCell>{log.id}</TableCell>
                  <TableCell>{log.type}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
    </div>
  );
}

