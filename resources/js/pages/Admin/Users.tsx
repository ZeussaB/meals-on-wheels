import AdminLayout from '@/layouts/AdminLayout';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Head, Link } from '@inertiajs/react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { set } from 'date-fns';

export default function Users({ users }) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [userId, setUserId] = useState(null);
    const [toVerify, setToVerify] = useState(0);
    const [proofPath, setProofPath] = useState('');
    const [conditionPath, setConditionPath] = useState('');

    const members = users.filter(user => user.userable_type === 'member');
    const unverified = members.filter(member => member.userable.verified == false);

    return (
        <AdminLayout>
            <Head title="Users" />
            <div>
                <h1 className="font-semibold mb-4 text-2xl">Users</h1>
                <Tabs defaultValue="all">
                    <TabsList>
                        <TabsTrigger value="all">All Users</TabsTrigger>
                        <TabsTrigger value="unverified">Needs Verification</TabsTrigger>
                    </TabsList>
                    <TabsContent value="all">
                        <div className="border rounded-xl">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>User ID</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <Dialog>
                                    {users.map(user => (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium">{user.id}</TableCell>
                                                {user.userable_type !== 'kitchen partner' ? (
                                                    <TableCell>{user.userable.first_name} {user.userable.last_name}</TableCell>
                                                ) : (
                                                        <TableCell>{user.userable.org_name}</TableCell>
                                                    )}
                                            <TableCell>{user.userable_type}</TableCell>
                                            <TableCell className="flex gap-2">
                                                <Button>Edit</Button>
                                                <DialogTrigger asChild>
                                                    <Button variant="destructive" onClick={()=>setUserId(user.id)}>Delete</Button>
                                                </DialogTrigger>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Are you absolutely sure?</DialogTitle>
                                                <DialogDescription>
                                                    This action cannot be undone. This will permanently delete this user.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <Button variant="destructive" asChild>
                                                <Link href={`/users/${userId}`} method="delete">
                                                    Confirm Delete
                                                </Link>
                                            </Button>
                                        </DialogContent>
                                    </Dialog>
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>
                    <TabsContent value="unverified">
                        <div className="border rounded-xl">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Member ID</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Birthdate</TableHead>
                                        <TableHead>Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                                        {unverified.map(unverified => (
                                            <TableRow key={unverified.userable.id}>
                                                <TableCell className="font-medium">{unverified.userable.id}</TableCell>
                                                <TableCell>{unverified.userable.first_name} {unverified.userable.last_name}</TableCell>
                                                <TableCell>{unverified.userable.birth_date}</TableCell>
                                                <TableCell className="flex gap-2">
                                                    <DialogTrigger asChild>
                                                        <Button variant="outline" onClick={() => {
                                                            setToVerify(unverified.userable.id);
                                                            setProofPath(unverified.userable.proof_of_identity);
                                                            setConditionPath(unverified.userable.medical_condition);
                                                        }}>Check</Button>
                                                    </DialogTrigger>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Verify User?</DialogTitle>
                                                <DialogDescription>Please confirm that the submitted files are legit</DialogDescription>
                                                <div>
                                                    <Accordion type="single" collapsible>
                                                        <AccordionItem value="identity">
                                                            <AccordionTrigger>Proof of Identity</AccordionTrigger>
                                                            <AccordionContent>
                                                                <img src={"/api/images/"+proofPath}/>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                        {conditionPath && (
                                                            <AccordionItem value="condition">
                                                                <AccordionTrigger>Medical Condition</AccordionTrigger>
                                                                <AccordionContent>
                                                                    <img src={"/api/images/"+conditionPath} />
                                                                </AccordionContent>
                                                            </AccordionItem>
                                                        )}
                                                    </Accordion>
                                                </div>
                                                <Button asChild onClick={()=>setDialogOpen(false)}>
                                                    <Link href={route('members.verify', toVerify)} method="patch">Verify</Link>
                                                </Button>
                                            </DialogHeader>
                                        </DialogContent>
                                    </Dialog>
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </AdminLayout>
    );
}
