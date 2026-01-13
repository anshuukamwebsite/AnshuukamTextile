"use client";

import { useState, useEffect, useMemo } from "react";
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    ColumnDef,
    PaginationState,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
    Eye,
    Trash2,
    Loader2,
    Search,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Download,
} from "lucide-react";

interface Enquiry {
    id: string;
    phoneNumber: string;
    email: string | null;
    companyName: string | null;
    contactPerson: string | null;
    clothingTypeName: string | null;
    fabricName: string | null;
    quantity: number;
    sizeRange: string | null;
    notes: string | null;
    status: string | null;
    adminNotes: string | null;
    createdAt: string | null;
    priority: "low" | "medium" | "high" | null;
    deadline: string | null;
}

const priorityOptions = [
    { value: "low", label: "Low", color: "bg-green-100 text-green-800 border-green-200" },
    { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
    { value: "high", label: "High", color: "bg-red-100 text-red-800 border-red-200" },
];

const statusOptions = [
    { value: "pending", label: "Pending", color: "default" },
    { value: "contacted", label: "Contacted", color: "secondary" },
    { value: "quoted", label: "Quoted", color: "outline" },
    { value: "closed", label: "Closed", color: "secondary" },
];

export default function EnquiriesPage() {
    const [data, setData] = useState<Enquiry[]>([]);
    const [totalRows, setTotalRows] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [globalFilter, setGlobalFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [priorityFilter, setPriorityFilter] = useState("all");

    // Detail Modal State
    const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [adminNotes, setAdminNotes] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);

    // Debounce hook implementation
    function useDebounce<T>(value: T, delay: number): T {
        const [debouncedValue, setDebouncedValue] = useState<T>(value);

        useEffect(() => {
            const handler = setTimeout(() => {
                setDebouncedValue(value);
            }, delay);

            return () => {
                clearTimeout(handler);
            };
        }, [value, delay]);

        return debouncedValue;
    }

    const debouncedGlobalFilter = useDebounce(globalFilter, 500);

    const fetchEnquiries = async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams({
                page: (pagination.pageIndex + 1).toString(),
                limit: pagination.pageSize.toString(),
                ...(statusFilter !== "all" && { status: statusFilter }),
                ...(priorityFilter !== "all" && { priority: priorityFilter }),
                ...(debouncedGlobalFilter && { search: debouncedGlobalFilter }),
            });

            const response = await fetch(`/api/enquiries?${params}`);
            const result = await response.json();
            if (result.success) {
                setData(result.data);
                setTotalRows(result.pagination.total);
            }
        } catch (error) {
            console.error("Failed to fetch enquiries:", error);
            toast.error("Failed to load enquiries");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEnquiries();
    }, [pagination.pageIndex, pagination.pageSize, statusFilter, priorityFilter, debouncedGlobalFilter]);

    const handleUpdate = async (id: string, updates: Partial<Enquiry>) => {
        setIsUpdating(true);
        try {
            const response = await fetch(`/api/enquiries/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updates),
            });

            const result = await response.json();

            if (result.success) {
                toast.success("Enquiry updated");
                fetchEnquiries();
                if (selectedEnquiry?.id === id) {
                    setSelectedEnquiry({ ...selectedEnquiry, ...updates });
                }
            } else {
                toast.error(result.error || "Failed to update");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this enquiry?")) return;

        try {
            const response = await fetch(`/api/enquiries/${id}`, {
                method: "DELETE",
            });

            const result = await response.json();

            if (result.success) {
                toast.success("Enquiry deleted");
                setIsDetailOpen(false);
                fetchEnquiries();
            } else {
                toast.error(result.error || "Failed to delete");
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const columns = useMemo<ColumnDef<Enquiry>[]>(
        () => [
            {
                accessorKey: "createdAt",
                header: "Date",
                cell: ({ row }) => {
                    const deadline = row.original.deadline;
                    const isOverdue = deadline && new Date(deadline) < new Date();
                    const isDueSoon = deadline && new Date(deadline) < new Date(new Date().setDate(new Date().getDate() + 2));

                    return (
                        <div className="flex flex-col gap-1">
                            <span>{formatDate(row.original.createdAt)}</span>
                            {deadline && (
                                <span className={`text-xs px-1.5 py-0.5 rounded border w-fit ${isOverdue
                                    ? "bg-red-100 text-red-800 border-red-200 font-bold"
                                    : isDueSoon
                                        ? "bg-orange-50 text-orange-700 border-orange-200 font-medium"
                                        : "bg-muted text-muted-foreground border-border"
                                    }`}>
                                    Due: {new Date(deadline).toLocaleDateString()}
                                </span>
                            )}
                        </div>
                    );
                },
            },
            {
                accessorKey: "priority",
                header: "Priority",
                cell: ({ row }) => {
                    const priority = row.original.priority;
                    if (!priority) return <span className="text-muted-foreground">-</span>;
                    const option = priorityOptions.find(p => p.value === priority);
                    return (
                        <Badge variant="outline" className={option?.color}>
                            {option?.label}
                        </Badge>
                    );
                }
            },
            {
                accessorKey: "contact",
                header: "Contact",
                cell: ({ row }) => (
                    <div>
                        <p className="font-medium">
                            {row.original.companyName || row.original.contactPerson || "N/A"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {row.original.phoneNumber}
                        </p>
                    </div>
                ),
            },
            {
                accessorKey: "product",
                header: "Product",
                cell: ({ row }) => (
                    <div>
                        <p className="font-medium">{row.original.clothingTypeName}</p>
                        <p className="text-sm text-muted-foreground">
                            {row.original.fabricName}
                        </p>
                    </div>
                ),
            },
            {
                accessorKey: "quantity",
                header: "Quantity",
                cell: ({ row }) => `${row.original.quantity.toLocaleString()} units`,
            },
            {
                accessorKey: "status",
                header: "Status",
                cell: ({ row }) => {
                    const status = row.original.status;
                    const option = statusOptions.find((o) => o.value === status) || statusOptions[0];
                    return <Badge variant={option.color as any}>{option.label}</Badge>;
                },
            },
            {
                id: "actions",
                header: () => <div className="text-right">Actions</div>,
                cell: ({ row }) => (
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                                setSelectedEnquiry(row.original);
                                setAdminNotes(row.original.adminNotes || "");
                                setIsDetailOpen(true);
                            }}
                        >
                            <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(row.original.id)}
                        >
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                    </div>
                ),
            },
        ],
        []
    );

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        rowCount: totalRows,
        state: {
            pagination,
        },
        onPaginationChange: setPagination,
    });

    const handleBulkDelete = async () => {
        if (!confirm("Are you sure you want to delete ALL enquiries? This action cannot be undone.")) return;
        if (!confirm("Really? This will wipe all enquiry data.")) return;

        try {
            const response = await fetch("/api/enquiries", {
                method: "DELETE",
            });

            const result = await response.json();

            if (result.success) {
                toast.success("All enquiries deleted");
                fetchEnquiries();
            } else {
                toast.error(result.error || "Failed to delete enquiries");
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    };

    const exportToCSV = async () => {
        try {
            // Fetch all matching data for export (ignoring pagination)
            const params = new URLSearchParams({
                page: "1",
                limit: "10000", // Fetch a large number for export
                ...(statusFilter !== "all" && { status: statusFilter }),
                ...(priorityFilter !== "all" && { priority: priorityFilter }),
                ...(globalFilter && { search: globalFilter }),
            });

            const response = await fetch(`/api/enquiries?${params}`);
            const result = await response.json();

            if (!result.success || !result.data.length) {
                toast.error("No data to export");
                return;
            }

            const dataToExport = result.data;

            // CSV headers
            const headers = [
                "Date",
                "Phone",
                "Email",
                "Company",
                "Contact Person",
                "Product",
                "Fabric",
                "Quantity",
                "Size Range",
                "Status",
                "Priority",
                "Deadline",
                "Notes",
                "Admin Notes"
            ];

            // CSV rows
            const rows = dataToExport.map((enquiry: Enquiry) => [
                enquiry.createdAt ? new Date(enquiry.createdAt).toLocaleDateString() : "",
                enquiry.phoneNumber || "",
                enquiry.email || "",
                enquiry.companyName || "",
                enquiry.contactPerson || "",
                enquiry.clothingTypeName || "",
                enquiry.fabricName || "",
                enquiry.quantity?.toString() || "",
                enquiry.sizeRange || "",
                enquiry.status || "",
                enquiry.priority || "",
                enquiry.deadline ? new Date(enquiry.deadline).toLocaleDateString() : "",
                (enquiry.notes || "").replace(/"/g, '""'),
                (enquiry.adminNotes || "").replace(/"/g, '""'),
            ]);

            // Build CSV content
            const csvContent = [
                headers.join(","),
                ...rows.map((row: any[]) => row.map(cell => `"${cell}"`).join(","))
            ].join("\n");

            // Create and download file
            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.setAttribute("href", url);
            link.setAttribute("download", `enquiries_export_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast.success(`Exported ${dataToExport.length} enquiries`);
        } catch (error) {
            console.error("Export failed:", error);
            toast.error("Failed to export enquiries");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Enquiries</h1>
                    <p className="text-muted-foreground">
                        Manage customer enquiries and quote requests
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={exportToCSV}>
                        <Download className="mr-2 h-4 w-4" />
                        Export CSV
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleBulkDelete}
                        disabled={totalRows === 0}
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete All
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row gap-4 justify-between">
                        <div className="flex items-center gap-2 flex-1">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search company, contact, email, phone..."
                                    value={globalFilter}
                                    onChange={(e) => setGlobalFilter(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    {statusOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Priorities</SelectItem>
                                    {priorityOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="h-24 text-center">
                                            <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                                        </TableCell>
                                    </TableRow>
                                ) : table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            data-state={row.getIsSelected() && "selected"}
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id}>
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="h-24 text-center">
                                            No results.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="flex items-center justify-end space-x-2 py-4">
                        <div className="flex-1 text-sm text-muted-foreground">
                            Page {table.getState().pagination.pageIndex + 1} of{" "}
                            {table.getPageCount()}
                        </div>
                        <div className="space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.setPageIndex(0)}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <ChevronsLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                disabled={!table.getCanNextPage()}
                            >
                                <ChevronsRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Detail Dialog */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Enquiry Details</DialogTitle>
                    </DialogHeader>
                    {selectedEnquiry && (
                        <div className="space-y-0 text-sm">
                            {/* Header Info */}
                            <div className="grid grid-cols-2 border-b border-border bg-muted/30">
                                <div className="p-3 border-r border-border">
                                    <span className="text-muted-foreground text-xs uppercase tracking-wider font-semibold block mb-1">Enquiry ID</span>
                                    <span className="font-mono text-xs">{selectedEnquiry.id}</span>
                                </div>
                                <div className="p-3">
                                    <span className="text-muted-foreground text-xs uppercase tracking-wider font-semibold block mb-1">Date Received</span>
                                    <span>{formatDate(selectedEnquiry.createdAt)}</span>
                                </div>
                            </div>

                            {/* Customer Information Section */}
                            <div className="bg-muted/10 p-2 border-b border-border font-semibold text-xs uppercase tracking-wider text-primary">
                                Customer Information
                            </div>
                            <div className="grid grid-cols-2 border-b border-border">
                                <div className="p-3 border-r border-border">
                                    <span className="text-muted-foreground text-xs block mb-1">Company Name</span>
                                    <span className="font-medium">{selectedEnquiry.companyName || "-"}</span>
                                </div>
                                <div className="p-3">
                                    <span className="text-muted-foreground text-xs block mb-1">Contact Person</span>
                                    <span className="font-medium">{selectedEnquiry.contactPerson || "-"}</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 border-b border-border">
                                <div className="p-3 border-r border-border">
                                    <span className="text-muted-foreground text-xs block mb-1">Phone Number</span>
                                    <span className="font-medium">{selectedEnquiry.phoneNumber}</span>
                                </div>
                                <div className="p-3">
                                    <span className="text-muted-foreground text-xs block mb-1">Email Address</span>
                                    <span className="font-medium">{selectedEnquiry.email || "-"}</span>
                                </div>
                            </div>

                            {/* Order Details Section */}
                            <div className="bg-muted/10 p-2 border-b border-border font-semibold text-xs uppercase tracking-wider text-primary">
                                Order Specifications
                            </div>
                            <div className="grid grid-cols-2 border-b border-border">
                                <div className="p-3 border-r border-border">
                                    <span className="text-muted-foreground text-xs block mb-1">Product Type</span>
                                    <span className="font-medium">{selectedEnquiry.clothingTypeName}</span>
                                </div>
                                <div className="p-3">
                                    <span className="text-muted-foreground text-xs block mb-1">Fabric Selection</span>
                                    <span className="font-medium">{selectedEnquiry.fabricName}</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 border-b border-border">
                                <div className="p-3 border-r border-border">
                                    <span className="text-muted-foreground text-xs block mb-1">Quantity Required</span>
                                    <span className="font-medium">{selectedEnquiry.quantity.toLocaleString()} units</span>
                                </div>
                                <div className="p-3">
                                    <span className="text-muted-foreground text-xs block mb-1">Size Range</span>
                                    <span className="font-medium">{selectedEnquiry.sizeRange}</span>
                                </div>
                            </div>

                            {/* Notes Section */}
                            <div className="grid grid-cols-1 border-b border-border">
                                <div className="p-3">
                                    <span className="text-muted-foreground text-xs block mb-1">Customer Notes</span>
                                    <p className="text-sm whitespace-pre-wrap bg-muted/20 p-2 border border-border min-h-[60px]">
                                        {selectedEnquiry.notes || "No notes provided."}
                                    </p>
                                </div>
                            </div>

                            {/* Admin Management Section */}
                            <div className="bg-muted/10 p-2 border-b border-border font-semibold text-xs uppercase tracking-wider text-primary">
                                Internal Management
                            </div>
                            <div className="p-4 bg-muted/5 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-medium mb-1.5 block">Current Status</label>
                                        <Select
                                            value={selectedEnquiry.status || "pending"}
                                            onValueChange={(value) =>
                                                setSelectedEnquiry({ ...selectedEnquiry, status: value })
                                            }
                                            disabled={isUpdating}
                                        >
                                            <SelectTrigger className="bg-background">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {statusOptions.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex items-end justify-end">
                                        <Button
                                            onClick={() =>
                                                handleUpdate(selectedEnquiry.id, {
                                                    status: selectedEnquiry.status || "pending",
                                                    adminNotes,
                                                    deadline: selectedEnquiry.deadline
                                                })
                                            }
                                            disabled={isUpdating}
                                            className="btn-industrial w-full"
                                        >
                                            {isUpdating && (
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            )}
                                            Update Record
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="text-xs font-medium mb-1.5 block">Deadline (Priority is auto-calculated)</label>
                                        <Input
                                            type="date"
                                            value={selectedEnquiry.deadline ? new Date(selectedEnquiry.deadline).toISOString().split('T')[0] : ""}
                                            onChange={(e) =>
                                                setSelectedEnquiry({
                                                    ...selectedEnquiry,
                                                    deadline: e.target.value ? new Date(e.target.value).toISOString() : null
                                                })
                                            }
                                            className="bg-background"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-medium mb-1.5 block">Admin Internal Notes</label>
                                    <Textarea
                                        value={adminNotes}
                                        onChange={(e) => setAdminNotes(e.target.value)}
                                        placeholder="Add internal notes regarding this enquiry..."
                                        rows={3}
                                        className="bg-background resize-none"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
