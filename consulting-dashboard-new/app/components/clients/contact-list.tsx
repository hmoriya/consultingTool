'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { ContactCreateDialog } from './contact-create-dialog'
import { ContactEditDialog } from './contact-edit-dialog'
import { 
  OrganizationContactItem, 
  deleteOrganizationContact, 
  setPrimaryContact 
} from '@/actions/organization-contacts'
import { 
  UserPlus, 
  Edit3, 
  Trash2, 
  Star, 
  Mail, 
  Phone, 
  Smartphone 
} from 'lucide-react'

interface ContactListProps {
  organizationId: string
  organizationName: string
  initialContacts: OrganizationContactItem[]
}

export function ContactList({ 
  organizationId, 
  organizationName, 
  initialContacts 
}: ContactListProps) {
  const [contacts, setContacts] = useState<OrganizationContactItem[]>(initialContacts)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingContact, setEditingContact] = useState<OrganizationContactItem | null>(null)
  const [deletingContact, setDeletingContact] = useState<OrganizationContactItem | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleContactCreated = (newContact: OrganizationContactItem) => {
    setContacts(prev => [newContact, ...prev])
  }

  const handleContactUpdated = (updatedContact: OrganizationContactItem) => {
    setContacts(prev => prev.map(contact => 
      contact.id === updatedContact.id ? updatedContact : contact
    ))
  }

  const handleDelete = async () => {
    if (!deletingContact) return

    setIsDeleting(true)
    try {
      await deleteOrganizationContact(deletingContact.id)
      setContacts(prev => prev.filter(contact => contact.id !== deletingContact.id))
      setDeletingContact(null)
    } catch (error: unknown) {
      console.error('Failed to delete contact:', error)
      alert(error.message || '担当者の削除に失敗しました')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleSetPrimary = async (contactId: string) => {
    try {
      await setPrimaryContact(contactId)
      setContacts(prev => prev.map(contact => ({
        ...contact,
        isPrimary: contact.id === contactId
      })))
    } catch (error: unknown) {
      console.error('Failed to set primary contact:', error)
      alert(error.message || '主担当者の設定に失敗しました')
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              担当者一覧
            </CardTitle>
            <Button onClick={() => setShowCreateDialog(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              担当者追加
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {contacts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              担当者が登録されていません
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>担当者名</TableHead>
                    <TableHead>役職・部署</TableHead>
                    <TableHead>連絡先</TableHead>
                    <TableHead>主担当</TableHead>
                    <TableHead className="w-[100px]">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell>
                        <div className="font-medium">{contact.name}</div>
                        {contact.notes && (
                          <div className="text-sm text-muted-foreground mt-1">
                            {contact.notes}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {contact.title && (
                            <div className="text-sm">{contact.title}</div>
                          )}
                          {contact.department && (
                            <div className="text-sm text-muted-foreground">
                              {contact.department}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {contact.email && (
                            <div className="flex items-center gap-1 text-sm">
                              <Mail className="h-3 w-3" />
                              <a 
                                href={`mailto:${contact.email}`}
                                className="text-blue-600 hover:underline"
                              >
                                {contact.email}
                              </a>
                            </div>
                          )}
                          {contact.phone && (
                            <div className="flex items-center gap-1 text-sm">
                              <Phone className="h-3 w-3" />
                              <a 
                                href={`tel:${contact.phone}`}
                                className="text-blue-600 hover:underline"
                              >
                                {contact.phone}
                              </a>
                            </div>
                          )}
                          {contact.mobile && (
                            <div className="flex items-center gap-1 text-sm">
                              <Smartphone className="h-3 w-3" />
                              <a 
                                href={`tel:${contact.mobile}`}
                                className="text-blue-600 hover:underline"
                              >
                                {contact.mobile}
                              </a>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {contact.isPrimary ? (
                            <Badge variant="default" className="bg-yellow-100 text-yellow-800">
                              <Star className="h-3 w-3 mr-1" />
                              主担当
                            </Badge>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSetPrimary(contact.id)}
                              className="text-xs"
                            >
                              主担当に設定
                            </Button>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingContact(contact)}
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeletingContact(contact)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 担当者作成ダイアログ */}
      {showCreateDialog && (
        <ContactCreateDialog
          organizationId={organizationId}
          organizationName={organizationName}
          onClose={() => setShowCreateDialog(false)}
          onContactCreated={handleContactCreated}
        />
      )}

      {/* 担当者編集ダイアログ */}
      {editingContact && (
        <ContactEditDialog
          contact={editingContact}
          organizationName={organizationName}
          onClose={() => setEditingContact(null)}
          onContactUpdated={handleContactUpdated}
        />
      )}

      {/* 削除確認ダイアログ */}
      <AlertDialog open={!!deletingContact} onOpenChange={() => setDeletingContact(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>担当者の削除</AlertDialogTitle>
            <AlertDialogDescription>
              担当者「{deletingContact?.name}」を削除しますか？
              <br />
              この操作は取り消せません。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>キャンセル</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? '削除中...' : '削除'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}