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
import { Pencil, Trash2 } from "lucide-react";
import { API_URL } from "@/config-global";

import { STORAGE_KEY } from "@/lib/contanst";
import { UKOSplashScreen } from "@/components/splash-screen";
import Link from "next/link";
import { useDebounce } from "@/hooks/use-debounce";

interface Review {
  _id: string;
  customer: string;
  productId: string;
  title: string;
  body: string;
  createdAt: string;
  rating: number;
}

export default function UsersPage() {
  const [users, setUsers] = useState<Review[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, page]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem(STORAGE_KEY);
      const res = await fetch(
        `${API_URL}/reviews?page=${page}&limit=10&search=${search}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch users");

      const data = await res.json();
      setUsers(data.data);
      setTotalPages(data.pagination.totalPages);
    } catch (err) {
      console.error(err);
      setError("Không thể tải danh sách user");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedUsers.length) return;

    try {
      setDeleteLoading(true);
      const token = sessionStorage.getItem(STORAGE_KEY);

      const res = await fetch(`${API_URL}/reviews/delete-many`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ids: selectedUsers }),
      });

      if (!res.ok) throw new Error("Failed to delete users");

      setSelectedUsers([]);
      fetchUsers();
    } catch (err) {
      console.error(err);
      setError("Xóa người dùng thất bại");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedUsers(checked ? users.map((user) => user._id) : []);
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
    setSelectedUsers((prev) =>
      checked ? [...prev, userId] : prev.filter((id) => id !== userId)
    );
  };

  return (
    <div className="p-6">
      <div className="flex h-8  justify-between space-x-2 items-center py-4">
        <Input
          placeholder="Search by username or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Link href="/admin/review/add">
          <Button>Add Review</Button>
        </Link>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {loading ? (
        <UKOSplashScreen />
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === users.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Body</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user._id)}
                      onChange={(e) =>
                        handleSelectUser(user._id, e.target.checked)
                      }
                    />
                  </TableCell>
                  <TableCell>{user.customer}</TableCell>
                  <TableCell>{user.productId}</TableCell>
                  <TableCell>{user.title}</TableCell>
                  <TableCell>{user.body}</TableCell>
                  <TableCell>{user.rating}</TableCell>

                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Link href={`/admin/review/${user._id}`}>
                      <Pencil strokeWidth={1} className="cursor-pointer" />
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex justify-between mt-4">
            <Button disabled={page === 1} onClick={() => setPage(page - 1)}>
              Prev
            </Button>
            <span>
              Page {page} of {totalPages}
            </span>
            <Button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>

          <Button
            className="mt-4"
            onClick={handleDelete}
            disabled={!selectedUsers.length || deleteLoading}
          >
            <Trash2 size={16} className="mr-2" />
            {deleteLoading ? "Deleting..." : "Delete Selected"}
          </Button>
        </>
      )}
    </div>
  );
}
