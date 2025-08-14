'use client';

import {
    getKeyValue,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow
} from "@heroui/table";
import {Profile} from "@/lib/types";
import {useRouter} from "next/navigation";
import {SortDescriptor} from "@heroui/react";

type Props = {
    profiles: Profile[];
}

export default function ProfilesList({profiles}: Props) {
    const router = useRouter();
    const columns = [
        {key: 'displayName', label: 'Display Name'},
        {key: 'reputation', label: 'Reputation'},
    ]

    const onSortChange = (sort: SortDescriptor) => {
        router.push(`/profiles?sortBy=${sort.column}`);
    }

    return (
        <Table
            onSortChange={(sort) => onSortChange(sort)}
            aria-label='User profiles'
            selectionMode='single'
            onRowAction={(key) => router.push(`/profiles/${key}`)}
        >
            <TableHeader columns={columns}>
                {(column) =>
                    <TableColumn
                        key={column.key}
                        allowsSorting
                    >
                        {column.label}
                    </TableColumn>}
            </TableHeader>
            <TableBody items={profiles}>
                {(item) => (
                    <TableRow key={item.userId}
                              className='hover:cursor-pointer'>
                        {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}