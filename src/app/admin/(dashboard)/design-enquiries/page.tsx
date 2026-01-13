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
import { Input } from "@/components/ui/input";
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
import { toast } from "sonner";
import {
    Eye,
    Trash2,
    Loader2,
    Phone,
    Mail,
    Building,
    User,
    Palette,
    Download,
    Image as ImageIcon,
    FileDown,
    Calendar,
    Search,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react";


interface DesignEnquiry {
    id: string;
    designImageUrl: string;
    backDesignImageUrl: string | null;
    sideDesignImageUrl: string | null;
    originalLogoUrl: string | null;
    designJson: any;
    fabricName: string | null;
    printType: string | null;
    quantity: number;
    sizeRange: string | null;
    phoneNumber: string;
    email: string | null;
    companyName: string | null;
    contactPerson: string | null;
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

const printTypeLabels: Record<string, string> = {
    screen_printed: "Screen Printed",
    embroidered: "Embroidered",
    dtg: "DTG",
    heat_transfer: "Heat Transfer",
};

export default function DesignEnquiriesPage() {
    const [data, setData] = useState<DesignEnquiry[]>([]);
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
    const [selectedEnquiry, setSelectedEnquiry] = useState<DesignEnquiry | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [adminNotes, setAdminNotes] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);

    // Export State
    const [exportStartDate, setExportStartDate] = useState("");
    const [exportEndDate, setExportEndDate] = useState("");

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

            const response = await fetch(`/api/design-enquiries?${params}`);
            const result = await response.json();
            if (result.success) {
                setData(result.data);
                setTotalRows(result.pagination.total);
            }
        } catch (error) {
            console.error("Failed to fetch design enquiries:", error);
            toast.error("Failed to load design enquiries");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEnquiries();
    }, [pagination.pageIndex, pagination.pageSize, statusFilter, priorityFilter, debouncedGlobalFilter]);

    const handleUpdate = async (id: string, updates: Partial<DesignEnquiry>) => {
        setIsUpdating(true);
        try {
            const response = await fetch(`/api/design-enquiries/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updates),
            });

            const result = await response.json();

            if (result.success) {
                toast.success("Design enquiry updated");
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
        if (!confirm("Are you sure you want to delete this design enquiry?")) return;

        try {
            const response = await fetch(`/api/design-enquiries/${id}`, {
                method: "DELETE",
            });

            const result = await response.json();

            if (result.success) {
                toast.success("Design enquiry deleted");
                setIsDetailOpen(false);
                fetchEnquiries();
            } else {
                toast.error(result.error || "Failed to delete");
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    };

    const handleBulkDelete = async () => {
        if (!confirm("Are you sure you want to delete ALL design enquiries? This action cannot be undone.")) return;
        if (!confirm("Really? This will wipe all design enquiry data.")) return;

        try {
            const response = await fetch("/api/design-enquiries", {
                method: "DELETE",
            });

            const result = await response.json();

            if (result.success) {
                toast.success("All design enquiries deleted");
                fetchEnquiries();
            } else {
                toast.error(result.error || "Failed to delete design enquiries");
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
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const downloadDesignImage = (imageUrl: string, id: string) => {
        const link = document.createElement("a");
        link.href = imageUrl;
        link.download = `design-${id}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const exportToCSV = async () => {
        try {
            const params = new URLSearchParams({
                page: "1",
                limit: "10000", // Fetch a large number for export
                ...(statusFilter !== "all" && { status: statusFilter }),
                ...(priorityFilter !== "all" && { priority: priorityFilter }),
                ...(debouncedGlobalFilter && { search: debouncedGlobalFilter }),
            });

            const response = await fetch(`/api/design-enquiries?${params}`);
            const result = await response.json();

            if (!result.success || !result.data.length) {
                toast.error("No data to export");
                return;
            }

            const dataToExport = result.data;

            // Define CSV headers (no URLs)
            const headers = [
                "ID",
                "Date",
                "Phone Number",
                "Email",
                "Company Name",
                "Contact Person",
                "Fabric",
                "Print Type",
                "Quantity",
                "Size Range",
                "Status",
                "Priority",
                "Deadline",
                "Customer Notes",
                "Admin Notes",
            ];

            // Convert enquiries to CSV rows (no URLs)
            const rows = dataToExport.map((enquiry: DesignEnquiry) => [
                enquiry.id,
                enquiry.createdAt ? new Date(enquiry.createdAt).toLocaleDateString("en-IN") : "",
                enquiry.phoneNumber || "",
                enquiry.email || "",
                enquiry.companyName || "",
                enquiry.contactPerson || "",
                enquiry.fabricName || "",
                enquiry.printType || "",
                enquiry.quantity?.toString() || "",
                enquiry.sizeRange || "",
                enquiry.status || "pending",
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
            link.setAttribute("download", `design_enquiries_export_${new Date().toISOString().split('T')[0]}.csv`);
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

    const columns = useMemo<ColumnDef<DesignEnquiry>[]>(
        () => [
            {
                accessorKey: "designImageUrl",
                header: "Preview",
                cell: ({ row }) => (
                    <div className="w-12 h-12 relative rounded overflow-hidden border border-border">
                        <img
                            src={row.original.designImageUrl}
                            alt="Design preview"
                            className="object-cover w-full h-full"
                        />
                    </div>
                ),
            },
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
                accessorKey: "details",
                header: "Details",
                cell: ({ row }) => (
                    <div>
                        <p className="font-medium">{row.original.fabricName}</p>
                        <p className="text-sm text-muted-foreground">
                            {printTypeLabels[row.original.printType || ""] || row.original.printType}
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

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Design Enquiries</h1>
                    <p className="text-muted-foreground">
                        Manage custom T-shirt design requests
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
                                    suppressHydrationWarning
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
                <DialogContent className="sm:max-w-[90vw] w-full max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Design Enquiry Details</DialogTitle>
                    </DialogHeader>
                    {selectedEnquiry && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Left Column - Design Previews */}
                            <div className="space-y-4">
                                {/* Front Design */}
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2 font-medium">Front Design</p>
                                    <div className="aspect-square relative rounded-lg overflow-hidden border border-border bg-muted">
                                        <img
                                            src={selectedEnquiry.designImageUrl}
                                            alt="Front Design"
                                            className="object-contain w-full h-full"
                                        />
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="w-full mt-2"
                                        onClick={() => downloadDesignImage(selectedEnquiry.designImageUrl, `${selectedEnquiry.id}-front`)}
                                    >
                                        <Download className="mr-2 h-4 w-4" />
                                        Download Front
                                    </Button>
                                </div>

                                {/* Back Design */}
                                {selectedEnquiry.backDesignImageUrl && (
                                    <div>
                                        <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2 font-medium">Back Design</p>
                                        <div className="aspect-square relative rounded-lg overflow-hidden border border-border bg-muted">
                                            <img
                                                src={selectedEnquiry.backDesignImageUrl}
                                                alt="Back Design"
                                                className="object-contain w-full h-full"
                                            />
                                        </div>
                                        <Button
                                            variant="outline"
                                            className="w-full mt-2"
                                            onClick={() => downloadDesignImage(selectedEnquiry.backDesignImageUrl!, `${selectedEnquiry.id}-back`)}
                                        >
                                            <Download className="mr-2 h-4 w-4" />
                                            Download Back
                                        </Button>
                                    </div>
                                )}

                                {/* Side Design */}
                                {selectedEnquiry.sideDesignImageUrl && (
                                    <div>
                                        <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2 font-medium">Side Design</p>
                                        <div className="aspect-square relative rounded-lg overflow-hidden border border-border bg-muted">
                                            <img
                                                src={selectedEnquiry.sideDesignImageUrl}
                                                alt="Side Design"
                                                className="object-contain w-full h-full"
                                            />
                                        </div>
                                        <Button
                                            variant="outline"
                                            className="w-full mt-2"
                                            onClick={() => downloadDesignImage(selectedEnquiry.sideDesignImageUrl!, `${selectedEnquiry.id}-side`)}
                                        >
                                            <Download className="mr-2 h-4 w-4" />
                                            Download Side
                                        </Button>
                                    </div>
                                )}

                                {/* Original Logos/Images */}
                                {selectedEnquiry.originalLogoUrl && (() => {
                                    // Try to parse as JSON array, fallback to single URL
                                    let logoUrls: string[] = [];
                                    try {
                                        const parsed = JSON.parse(selectedEnquiry.originalLogoUrl);
                                        logoUrls = Array.isArray(parsed) ? parsed : [selectedEnquiry.originalLogoUrl];
                                    } catch {
                                        logoUrls = [selectedEnquiry.originalLogoUrl];
                                    }

                                    return logoUrls.length > 0 && (
                                        <div className="space-y-2">
                                            <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
                                                Uploaded Logos ({logoUrls.length})
                                            </p>
                                            <div className="grid grid-cols-3 gap-2">
                                                {logoUrls.map((url, index) => (
                                                    <div key={index} className="relative group">
                                                        <div className="aspect-square relative rounded-lg overflow-hidden border border-border bg-muted">
                                                            <img
                                                                src={url}
                                                                alt={`Logo ${index + 1}`}
                                                                className="object-contain w-full h-full"
                                                            />
                                                        </div>
                                                        <Button
                                                            variant="secondary"
                                                            size="sm"
                                                            className="w-full mt-1 h-7 text-xs"
                                                            onClick={() => downloadDesignImage(url, `${selectedEnquiry.id}-logo-${index + 1}`)}
                                                        >
                                                            <Download className="mr-1 h-3 w-3" />
                                                            Logo {index + 1}
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                            {logoUrls.length > 1 && (
                                                <Button
                                                    className="w-full"
                                                    onClick={() => {
                                                        logoUrls.forEach((url, index) => {
                                                            setTimeout(() => {
                                                                downloadDesignImage(url, `${selectedEnquiry.id}-logo-${index + 1}`);
                                                            }, index * 200);
                                                        });
                                                    }}
                                                >
                                                    <ImageIcon className="mr-2 h-4 w-4" />
                                                    Download All Logos ({logoUrls.length})
                                                </Button>
                                            )}
                                        </div>
                                    );
                                })()}
                            </div>

                            {/* Right Column - Details */}
                            <div className="space-y-4">
                                {/* Header Info */}
                                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase">Enquiry ID</p>
                                        <p className="font-mono text-xs">{selectedEnquiry.id.slice(0, 8)}...</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase">Date</p>
                                        <p className="text-sm">{formatDate(selectedEnquiry.createdAt)}</p>
                                    </div>
                                </div>

                                {/* Customer Info */}
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-sm uppercase text-muted-foreground">Customer</h4>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Phone className="h-3 w-3 text-muted-foreground" />
                                            <span>{selectedEnquiry.phoneNumber}</span>
                                        </div>
                                        {selectedEnquiry.email && (
                                            <div className="flex items-center gap-2">
                                                <Mail className="h-3 w-3 text-muted-foreground shrink-0" />
                                                <span className="break-all">{selectedEnquiry.email}</span>
                                            </div>
                                        )}
                                        {selectedEnquiry.companyName && (
                                            <div className="flex items-center gap-2">
                                                <Building className="h-3 w-3 text-muted-foreground" />
                                                <span>{selectedEnquiry.companyName}</span>
                                            </div>
                                        )}
                                        {selectedEnquiry.contactPerson && (
                                            <div className="flex items-center gap-2">
                                                <User className="h-3 w-3 text-muted-foreground" />
                                                <span>{selectedEnquiry.contactPerson}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Order Details */}
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-sm uppercase text-muted-foreground">Order Details</h4>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-muted-foreground">Fabric</p>
                                            <p className="font-medium">{selectedEnquiry.fabricName}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Print Type</p>
                                            <p className="font-medium">
                                                {printTypeLabels[selectedEnquiry.printType || ""] || selectedEnquiry.printType}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Quantity</p>
                                            <p className="font-medium">{selectedEnquiry.quantity.toLocaleString()} units</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Size Range</p>
                                            <p className="font-medium">{selectedEnquiry.sizeRange}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Notes */}
                                {selectedEnquiry.notes && (
                                    <div className="space-y-2">
                                        <h4 className="font-semibold text-sm uppercase text-muted-foreground">Customer Notes</h4>
                                        <p className="text-sm bg-muted p-3 rounded">{selectedEnquiry.notes}</p>
                                    </div>
                                )}

                                {/* Admin Controls */}
                                <div className="space-y-3 pt-4 border-t">
                                    <h4 className="font-semibold text-sm uppercase text-muted-foreground">Admin Controls</h4>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Status</label>
                                        <Select
                                            value={selectedEnquiry.status || "pending"}
                                            onValueChange={(value) =>
                                                setSelectedEnquiry({ ...selectedEnquiry, status: value })
                                            }
                                            disabled={isUpdating}
                                        >
                                            <SelectTrigger>
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
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Admin Notes</label>
                                        <Textarea
                                            value={adminNotes}
                                            onChange={(e) => setAdminNotes(e.target.value)}
                                            placeholder="Internal notes..."
                                            rows={3}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 gap-4">
                                        <div>
                                            <label className="text-sm font-medium mb-1.5 block">Deadline (Priority is auto-calculated)</label>
                                            <Input
                                                type="date"
                                                value={selectedEnquiry.deadline ? new Date(selectedEnquiry.deadline).toISOString().split('T')[0] : ""}
                                                onChange={(e) =>
                                                    setSelectedEnquiry({
                                                        ...selectedEnquiry,
                                                        deadline: e.target.value ? new Date(e.target.value).toISOString() : null
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        onClick={() =>
                                            handleUpdate(selectedEnquiry.id, {
                                                status: selectedEnquiry.status || "pending",
                                                adminNotes,
                                                deadline: selectedEnquiry.deadline
                                            })
                                        }
                                        disabled={isUpdating}
                                        className="w-full"
                                    >
                                        {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Update Record
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div >
    );
}
