import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthStore } from "../../store/useAuthStore";
import { Loader2, AlertCircle, Trash2 } from "lucide-react";
import Button from "@/components/ui/button";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export const AdminUsersPage = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const token = user?.token || localStorage.getItem("token");

  const fetchUsers = async (authToken: string) => {
    try {
      const { data } = await axios.get("/api/users", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUsers(token);
    }
  }, [token]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await axios.put(
        `/api/users/${userId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setUsers(
        users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
      );
    } catch (error) {
      console.error("Failed to update user role", error);
      alert("Failed to update role");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      await axios.delete(`/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((u) => u.id !== userId));
    } catch (error) {
      console.error("Failed to delete user", error);
      alert("Failed to delete user");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage Users</h1>
        <p className="text-muted-foreground mt-2">
          View customers and manage administrative roles.
        </p>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
        {users.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No users found</h3>
          </div>
        ) : (
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b bg-muted/50">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    ID
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Name
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Email
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Joined Date
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Role
                  </th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {users.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                  >
                    <td
                      className="p-4 align-middle font-mono text-xs max-w-[100px] truncate"
                      title={u.id}
                    >
                      {u.id}
                    </td>
                    <td className="p-4 align-middle font-medium">
                      {u.name || "Unnamed"}
                    </td>
                    <td className="p-4 align-middle text-muted-foreground">
                      {u.email}
                    </td>
                    <td className="p-4 align-middle text-muted-foreground">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 align-middle">
                      <select
                        className="flex h-9 w-[120px] items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        disabled={user?.id === u.id}
                      >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                    <td className="p-4 align-middle text-right">
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteUser(u.id)}
                        disabled={user?.id === u.id}
                        title="Delete User"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
