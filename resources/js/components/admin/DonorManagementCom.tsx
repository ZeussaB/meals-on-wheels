import { Link } from '@inertiajs/react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { Search, Filter, Download, Mail, Heart, DollarSign, Calendar, Users } from 'lucide-react';

export default function DonorManagementCom({ donors = [], stats = {} }) {
    const [donorId, setDonorId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterType, setFilterType] = useState('all');

    // Filter donors based on search and filters
    const filteredDonors = donors.filter(donor => {
        const matchesSearch = donor.donor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             donor.donor_email.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = filterStatus === 'all' || donor.status === filterStatus;
        const matchesType = filterType === 'all' || donor.donation_type === filterType;
        
        return matchesSearch && matchesStatus && matchesType;
    });

    // Get recurring donors
    const recurringDonors = donors.filter(donor => donor.donation_type === 'recurring');

    // Get recent donors (last 30 days)
    const recentDonors = donors.filter(donor => {
        const donationDate = new Date(donor.created_at);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return donationDate >= thirtyDaysAgo;
    });

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusBadge = (status) => {
        const statusColors = {
            'completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
            'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
            'failed': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
            'cancelled': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
        };
        
        return (
            <Badge className={`${statusColors[status] || statusColors.pending} border-0`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        );
    };

    const getTypeBadge = (type) => {
        return type === 'recurring' ? (
            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-0">
                <Heart className="w-3 h-3 mr-1" />
                Recurring
            </Badge>
        ) : (
            <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 border-0">
                One-time
            </Badge>
        );
    };

    return (
        <div>
            {/* Header with Stats */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Donor Management</h1>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Donors</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{donors.length}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                                <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Raised</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {formatCurrency(donors.reduce((sum, donor) => sum + parseFloat(donor.amount || 0), 0))}
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                                <Heart className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Recurring Donors</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{recurringDonors.length}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                                <Calendar className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">This Month</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{recentDonors.length}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Tabs defaultValue="all">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="all">All Donors</TabsTrigger>
                    <TabsTrigger value="recent">Recent (30 days)</TabsTrigger>
                    <TabsTrigger value="recurring">Recurring Donors</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                    {/* Search and Filters */}
                    <div className="mb-6 flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Search donors by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                            <SelectTrigger className="w-full sm:w-48">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="failed">Failed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={filterType} onValueChange={setFilterType}>
                            <SelectTrigger className="w-full sm:w-48">
                                <SelectValue placeholder="Filter by type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="one_time">One-time</SelectItem>
                                <SelectItem value="recurring">Recurring</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Export
                        </Button>
                    </div>

                    <div className="border rounded-xl">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">ID</TableHead>
                                    <TableHead>Donor Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <Dialog>
                                    {filteredDonors.map(donor => (
                                        <TableRow key={donor.id}>
                                            <TableCell className="font-medium">#{donor.id}</TableCell>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">{donor.donor_name}</div>
                                                    {donor.is_anonymous && (
                                                        <div className="text-xs text-gray-500">Anonymous</div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>{donor.donor_email}</TableCell>
                                            <TableCell className="font-medium">{formatCurrency(donor.amount)}</TableCell>
                                            <TableCell>
                                                {getTypeBadge(donor.donation_type)}
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(donor.status)}
                                            </TableCell>
                                            <TableCell>{formatDate(donor.created_at)}</TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <Button size="sm" variant="outline">
                                                        <Mail className="w-4 h-4 mr-1" />
                                                        Email
                                                    </Button>
                                                    <Button size="sm" variant="outline">
                                                        View
                                                    </Button>
                                                    <DialogTrigger asChild>
                                                        <Button 
                                                            size="sm" 
                                                            variant="destructive" 
                                                            onClick={() => setDonorId(donor.id)}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </DialogTrigger>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Are you absolutely sure?</DialogTitle>
                                            <DialogDescription>
                                                This action cannot be undone. This will permanently delete this donor record and all associated data.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="flex gap-2 justify-end">
                                            <Button variant="outline">Cancel</Button>
                                            <Button variant="destructive" asChild>
                                                <Link href={`/donors/${donorId}`} method="delete">
                                                    Confirm Delete
                                                </Link>
                                            </Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>

                <TabsContent value="recent">
                    <div className="border rounded-xl">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Donor Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentDonors.map(donor => (
                                    <TableRow key={donor.id}>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">{donor.donor_name}</div>
                                                {donor.is_anonymous && (
                                                    <div className="text-xs text-gray-500">Anonymous</div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>{donor.donor_email}</TableCell>
                                        <TableCell className="font-medium">{formatCurrency(donor.amount)}</TableCell>
                                        <TableCell>
                                            {getTypeBadge(donor.donation_type)}
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(donor.status)}
                                        </TableCell>
                                        <TableCell>{formatDate(donor.created_at)}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="outline">
                                                    <Mail className="w-4 h-4 mr-1" />
                                                    Thank
                                                </Button>
                                                <Button size="sm" variant="outline">
                                                    View
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>

                <TabsContent value="recurring">
                    <div className="border rounded-xl">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Donor Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Frequency</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Next Payment</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recurringDonors.map(donor => (
                                    <TableRow key={donor.id}>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">{donor.donor_name}</div>
                                                {donor.is_anonymous && (
                                                    <div className="text-xs text-gray-500">Anonymous</div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>{donor.donor_email}</TableCell>
                                        <TableCell className="font-medium">{formatCurrency(donor.amount)}</TableCell>
                                        <TableCell>
                                            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-0">
                                                {donor.frequency}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(donor.status)}
                                        </TableCell>
                                        <TableCell>
                                            {donor.next_payment_date ? formatDate(donor.next_payment_date) : 'N/A'}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="outline">
                                                    Pause
                                                </Button>
                                                <Button size="sm" variant="outline">
                                                    Edit
                                                </Button>
                                                <Button size="sm" variant="destructive">
                                                    Cancel
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>

                <TabsContent value="analytics">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold mb-4">Donation Summary</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span>Total Donations:</span>
                                    <span className="font-semibold">{donors.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Total Amount:</span>
                                    <span className="font-semibold">
                                        {formatCurrency(donors.reduce((sum, donor) => sum + parseFloat(donor.amount || 0), 0))}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Average Donation:</span>
                                    <span className="font-semibold">
                                        {donors.length > 0 ? formatCurrency(donors.reduce((sum, donor) => sum + parseFloat(donor.amount || 0), 0) / donors.length) : '$0.00'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Recurring Donors:</span>
                                    <span className="font-semibold">{recurringDonors.length}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                            <div className="space-y-3">
                                {recentDonors.slice(0, 5).map(donor => (
                                    <div key={donor.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <div>
                                            <div className="font-medium">{donor.donor_name}</div>
                                            <div className="text-sm text-gray-500">{formatDate(donor.created_at)}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-semibold">{formatCurrency(donor.amount)}</div>
                                            <div className="text-sm">{getStatusBadge(donor.status)}</div>
                                        </div>
                                    </div>
                                ))}
                                {recentDonors.length === 0 && (
                                    <div className="text-center text-gray-500 py-8">
                                        No recent donations found
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}