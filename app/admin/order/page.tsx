"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { API_URL } from "@/config-global";

import { STORAGE_KEY } from "@/lib/contanst";
import UserFormDialog from "./order-form-dialog";

interface IOrder {
  _id: string;
  total: string;
  paymentMethod: string;
  status: string;
  email: string;
  createdAt: string;
}
const ORDER_API = `${API_URL}/orders`;
export default function OrdersPage() {
  const [users, setUsers] = useState<IOrder[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchData();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [search, page]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = sessionStorage.getItem(STORAGE_KEY);
      if (!token) throw new Error("Unauthorized: No token found");

      const res = await fetch(
        `${ORDER_API}?page=${page}&limit=10&search=${search}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch users");

      const data = await res.json();
      setUsers(data.data);
      setTotalPages(data.pagination.totalPages);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const token = sessionStorage.getItem(STORAGE_KEY);
      if (!token) throw new Error("Unauthorized: No token found");

      const res = await fetch(`${ORDER_API}/delete-many`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ids: selected }),
      });

      if (!res.ok) throw new Error("Failed to delete users");

      setSelected([]);
      fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="p-6">
      <div className="flex h-10 py-3 justify-between space-x-1 items-center">
        <Input
          placeholder="Search by username or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button
          onClick={() => {
            setEditing(null);
            setDialogOpen(true);
          }}
        >
          Add User
        </Button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Checkbox
                    checked={selected.length === users.length}
                    onCheckedChange={(checked) =>
                      setSelected(checked ? users.map((u) => u._id) : [])
                    }
                  />
                </TableHead>

                <TableHead>Email</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>
                    <Checkbox
                      checked={selected.includes(user._id)}
                      onCheckedChange={(checked) =>
                        setSelected((prev) =>
                          checked
                            ? [...prev, user._id]
                            : prev.filter((id) => id !== user._id)
                        )
                      }
                    />
                  </TableCell>

                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.total}</TableCell>
                  <TableCell>{user.paymentMethod}</TableCell>
                  <TableCell>{user.status}</TableCell>
                  <TableCell>{user.createdAt}</TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Pencil
                      strokeWidth={1}
                      className="cursor-pointer"
                      onClick={() => {
                        setEditing(user);
                        setDialogOpen(true);
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-between mt-4">
            <Button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              Prev
            </Button>
            <span>
              Page {page} of {totalPages}
            </span>
            <Button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
          <Button
            className="mt-4"
            onClick={handleDelete}
            disabled={!selected.length}
          >
            Delete Selected
          </Button>
        </>
      )}
      <UserFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        user={null}
        onSuccess={fetchData}
      />
    </div>
  );
}
