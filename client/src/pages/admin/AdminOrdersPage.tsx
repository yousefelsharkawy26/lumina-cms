import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { useAuthStore } from "../../store/useAuthStore";
import { Loader2, AlertCircle } from "lucide-react";

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  user?: { name: string; email: string };
  orderItems: {
    id: string;
    productId: string;
    quantity: number;
    price: number;
  }[];
}

export const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const token = user?.token || localStorage.getItem("token");

  const fetchOrders = async (authToken: string) => {
    try {
      const { data } = await axiosInstance.get("/api/orders", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders(token);
    }
  }, [token]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await axiosInstance.put(
        `/api/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      // Refresh local state
      setOrders(
        orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
      );
    } catch (error) {
      console.error("Failed to update order status", error);
      alert("Failed to update status");
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
        <h1 className="text-3xl font-bold tracking-tight">Manage Orders</h1>
        <p className="text-muted-foreground mt-2">
          View and update customer order fulfillment status.
        </p>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No orders found</h3>
          </div>
        ) : (
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b bg-muted/50">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Order ID
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Customer
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Date
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Total
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                  >
                    <td className="p-4 align-middle font-mono text-xs">
                      {order.id}
                    </td>
                    <td className="p-4 align-middle">
                      <div className="font-medium">
                        {order.user?.name || "Unknown"}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {order.user?.email}
                      </div>
                    </td>
                    <td className="p-4 align-middle text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 align-middle font-medium">
                      ${Number(order.totalAmount).toFixed(2)}
                    </td>
                    <td className="p-4 align-middle">
                      <select
                        className="flex h-9 w-[140px] items-center justify-between rounded-md border border-input bg-transparent text-foreground px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value)
                        }
                      >
                        <option
                          value="PENDING"
                          className="bg-background text-foreground"
                        >
                          PENDING
                        </option>
                        <option
                          value="PAID"
                          className="bg-background text-foreground"
                        >
                          PAID
                        </option>
                        <option
                          value="SHIPPED"
                          className="bg-background text-foreground"
                        >
                          SHIPPED
                        </option>
                        <option
                          value="DELIVERED"
                          className="bg-background text-foreground"
                        >
                          DELIVERED
                        </option>
                        <option
                          value="CANCELLED"
                          className="bg-background text-foreground"
                        >
                          CANCELLED
                        </option>
                      </select>
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
