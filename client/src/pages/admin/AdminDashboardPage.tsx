import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { useAuthStore } from "../../store/useAuthStore";
import { useSettingsStore } from "../../store/useSettingsStore";
import {
  Users,
  ShoppingCart,
  DollarSign,
  Package,
  Loader2,
  TrendingUp,
  Sparkles,
  Activity,
  Target,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
  Tooltip,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AggregationState {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  aov: number; // Average Order Value
  topProduct: string; // Name of best seller
  topProductVol: number; // Volume of best seller
  successRate: number; // Percentage of PAID/DELIVERED vs CANCELLED
}

type Order = {
  status: string;
  totalAmount: number;
  createdAt: string;
  orderItems?: OrderItem[];
};

type OrderItem = {
  quantity: number;
  product?: {
    name: string;
  };
};

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState<AggregationState>({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    aov: 0,
    topProduct: "N/A",
    topProductVol: 0,
    successRate: 0,
  });
  const [revenueData, setRevenueData] = useState<
    { name: string; total: number }[]
  >([]);
  const [statusData, setStatusData] = useState<
    { name: string; value: number }[]
  >([]);
  const [productData, setProductData] = useState<
    { name: string; sales: number }[]
  >([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuthStore();
  const { settings } = useSettingsStore();
  const token = user?.token || localStorage.getItem("token");
  const currencySymbol = settings?.currency?.match(/\(([^)]+)\)/)?.[1] || "$";

  useEffect(() => {
    const extractKnowledge = async () => {
      try {
        const [usersRes, ordersRes] = await Promise.all([
          axiosInstance.get("/api/users", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axiosInstance.get("/api/orders", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const rawUsers = usersRes.data.length;
        const rawOrders = ordersRes.data;
        const totalOrders = rawOrders.length;

        let totalRevenue = 0;
        let pendingOrders = 0;
        let successfulOrders = 0;

        // Deep Extractor Objects
        const monthlyRevenue: Record<string, number> = {};
        const statusCounts: Record<string, number> = {};
        const productSalesFreq: Record<string, number> = {};

        rawOrders.forEach((order: Order) => {
          // KPI
          if (order.status !== "CANCELLED") {
            totalRevenue += order.totalAmount;
          }
          if (order.status === "PENDING") {
            pendingOrders++;
          }
          if (
            order.status === "PAID" ||
            order.status === "SHIPPED" ||
            order.status === "DELIVERED"
          ) {
            successfulOrders++;
          }

          // Pie Chart Aggregation
          statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;

          // Line Chart Aggregation (Revenue Over Time)
          if (
            order.status === "PAID" ||
            order.status === "SHIPPED" ||
            order.status === "DELIVERED"
          ) {
            const date = new Date(order.createdAt);
            const month = date.toLocaleString("default", { month: "short" });
            monthlyRevenue[month] =
              (monthlyRevenue[month] || 0) + order.totalAmount;
          }

          // Top Selling Product Aggregation (BarChart)
          if (order.status !== "CANCELLED" && order.orderItems) {
            order.orderItems.forEach((item: OrderItem) => {
              const pName = item.product?.name || "Unknown Product";
              productSalesFreq[pName] =
                (productSalesFreq[pName] || 0) + item.quantity;
            });
          }
        });

        // Calculate Average Order Value
        const aov = successfulOrders > 0 ? totalRevenue / successfulOrders : 0;
        const successRate =
          totalOrders > 0 ? (successfulOrders / totalOrders) * 100 : 0;

        // Find Absolute Top Seller globally
        let topProduct = "No Sales Yet";
        let topProductVol = 0;
        Object.entries(productSalesFreq).forEach(([name, vol]) => {
          if (vol > topProductVol) {
            topProductVol = vol;
            topProduct = name;
          }
        });

        // Format for Recharts Arrays
        const formattedRevenueData = Object.keys(monthlyRevenue).map((key) => ({
          name: key,
          total: monthlyRevenue[key],
        }));

        const formattedStatusData = Object.keys(statusCounts).map((key) => ({
          name: key,
          value: statusCounts[key],
        }));

        // Sort Top 5 products for BarChart
        const sortedProducts = Object.keys(productSalesFreq)
          .map((key) => ({
            name: key.length > 15 ? key.substring(0, 15) + "..." : key,
            sales: productSalesFreq[key],
          }))
          .sort((a, b) => b.sales - a.sales)
          .slice(0, 5); // Take top 5

        setStats({
          totalUsers: rawUsers,
          totalOrders,
          totalRevenue,
          pendingOrders,
          aov,
          topProduct,
          topProductVol,
          successRate,
        });

        setRevenueData(formattedRevenueData);
        setStatusData(formattedStatusData);
        setProductData(sortedProducts);
      } catch (error) {
        console.error("Failed to extract admin intelligence", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      extractKnowledge();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="flex flex-col h-full min-h-[500px] items-center justify-center space-y-4">
        <div className="relative">
          <div className="absolute -inset-4 bg-primary/20 blur-xl rounded-full" />
          <Loader2 className="h-10 w-10 animate-spin text-primary relative z-10" />
        </div>
        <p className="text-muted-foreground font-medium animate-pulse tracking-widest uppercase text-xs">
          Synchronizing Intelligence...
        </p>
      </div>
    );
  }

  const statCards = [
    {
      title: "Gross Revenue",
      value: `${currencySymbol}${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: "text-green-500",
      bg: "bg-green-500/10",
      trend: "Lifetime",
    },
    {
      title: "Network Volume",
      value: stats.totalOrders.toString(),
      icon: ShoppingCart,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      trend: "Total Orders",
    },
    {
      title: "Processing Backlog",
      value: stats.pendingOrders.toString(),
      icon: Package,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      trend: "Requires Shipping",
    },
    {
      title: "Active Accounts",
      value: stats.totalUsers.toString(),
      icon: Users,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      trend: "Total Registerations",
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 animate-in fade-in duration-700">
      {/* Dynamic Intelligence Header */}
      <div className="bg-gradient-to-r from-card/60 to-background backdrop-blur-3xl border border-border/50 rounded-3xl p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative z-10 gap-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
              <Activity className="w-8 h-8 text-primary" />
              Business Intelligence
            </h1>
            <p className="text-muted-foreground mt-2 max-w-lg leading-relaxed">
              Real-time telemetry and extraction algorithms analyzing the
              complete size of your commercial ledger.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Badge
              variant="secondary"
              className="px-4 py-2 font-semibold shadow-sm border-border/50 text-xs tracking-wider uppercase"
            >
              <TrendingUp className="w-3.5 h-3.5 mr-1.5 text-green-500" /> AOV:{" "}
              {currencySymbol}
              {stats.aov.toFixed(2)}
            </Badge>
            <Badge
              variant="secondary"
              className="px-4 py-2 font-semibold shadow-sm border-border/50 text-xs tracking-wider uppercase"
            >
              <Target className="w-3.5 h-3.5 mr-1.5 text-blue-500" /> Conv:{" "}
              {stats.successRate.toFixed(1)}%
            </Badge>
          </div>
        </div>

        {/* The Native Insight Generator */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 flex items-start gap-4 transition-colors hover:bg-primary/10">
            <div className="p-3 bg-primary/20 rounded-full shrink-0">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h4 className="font-bold text-sm tracking-wide text-foreground mb-1">
                Algorithmic Best Seller
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your highest moving SKU globally is{" "}
                <span className="font-bold text-foreground">
                  "{stats.topProduct}"
                </span>
                , moving exactly{" "}
                <span className="font-bold text-foreground">
                  {stats.topProductVol}
                </span>{" "}
                individual units across all successful transactions.
              </p>
            </div>
          </div>
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 flex items-start gap-4 transition-colors hover:bg-primary/10">
            <div className="p-3 bg-primary/20 rounded-full shrink-0">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h4 className="font-bold text-sm tracking-wide text-foreground mb-1">
                Ledger Health Report
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Customer value yield holds strong at an arithmetic mean of{" "}
                <span className="font-bold text-foreground">
                  {currencySymbol}
                  {stats.aov.toFixed(2)}
                </span>{" "}
                per successful order. Currently{" "}
                <span className="font-bold text-foreground">
                  {stats.pendingOrders}
                </span>{" "}
                units await your physical fulfillment.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Micro-Animated Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 pt-2">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card
              key={idx}
              className="bg-card/40 backdrop-blur-xl border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 group overflow-hidden"
            >
              <CardContent className="p-6">
                <div className="flex flex-row items-center justify-between pb-4">
                  <h3 className="tracking-tight text-xs font-bold uppercase text-muted-foreground group-hover:text-foreground transition-colors">
                    {stat.title}
                  </h3>
                  <div
                    className={`p-2.5 rounded-xl ${stat.bg} group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </div>
                <div className="text-3xl font-black tracking-tight">
                  {stat.value}
                </div>
                <p className="text-xs text-muted-foreground mt-2 font-medium opacity-70">
                  {stat.trend}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Massive Data Visualizations Map */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Revenue Line Chart */}
        <Card className="lg:col-span-2 bg-card/40 backdrop-blur-xl border-border/50 shadow-sm h-[400px]">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Revenue Yield Map</CardTitle>
            <CardDescription>
              Fiscal gross generation plotted sequentially across time matrices.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] w-full mt-4">
            {revenueData.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-border/50 rounded-xl">
                <DollarSign className="w-8 h-8 opacity-20 mb-2" />
                <p className="font-medium text-sm">Insufficient data points</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={revenueData}
                  margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="currentColor"
                    opacity={0.1}
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tickMargin={12}
                    tick={{ fontSize: 12, opacity: 0.7 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => `${currencySymbol}${value}`}
                    tick={{ fontSize: 12, opacity: 0.7 }}
                  />
                  <RechartsTooltip
                    formatter={(value: unknown) => [
                      `${currencySymbol}${Number(value).toFixed(2)}`,
                      "Gross Yield",
                    ]}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid var(--border)",
                      background: "var(--background)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#8b5cf6"
                    strokeWidth={4}
                    dot={{ r: 4, strokeWidth: 2 }}
                    activeDot={{
                      r: 8,
                      stroke: "#8b5cf6",
                      strokeWidth: 2,
                      fill: "var(--background)",
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Order Status Pie Chart */}
        <Card className="bg-card/40 backdrop-blur-xl border-border/50 shadow-sm h-[400px]">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Status Distribution</CardTitle>
            <CardDescription>Logistical status partitioning.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] w-full mt-2">
            {statusData.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-border/50 rounded-xl">
                <Package className="w-8 h-8 opacity-20 mb-2" />
                <p className="font-medium text-sm">Awaiting orders</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="var(--background)"
                    strokeWidth={2}
                  >
                    {statusData.map((entry, index) => {
                      const colors: Record<string, string> = {
                        PENDING: "#f59e0b",
                        PAID: "#10b981",
                        SHIPPED: "#3b82f6",
                        DELIVERED: "#8b5cf6",
                        CANCELLED: "#ef4444",
                      };
                      return (
                        <Cell
                          key={`cell-${index}`}
                          fill={colors[entry.name] || "#94a3b8"}
                        />
                      );
                    })}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid var(--border)",
                      background: "var(--background)",
                    }}
                    itemStyle={{ fontWeight: "bold" }}
                  />
                  <Legend
                    iconType="circle"
                    wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Top Products Bar Chart */}
        <Card className="lg:col-span-3 bg-card/40 backdrop-blur-xl border-border/50 shadow-sm h-[420px]">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Volume By Commodity</CardTitle>
            <CardDescription>
              Top 5 ranking SKUs by absolute sales volume mathematically
              extracted from the ledger.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] w-full mt-6">
            {productData.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-border/50 rounded-xl">
                <ShoppingCart className="w-8 h-8 opacity-20 mb-2" />
                <p className="font-medium text-sm">
                  Insufficient commodity ledger data
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={productData}
                  margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="currentColor"
                    opacity={0.1}
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tickMargin={12}
                    tick={{ fontSize: 12, opacity: 0.8 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tickMargin={12}
                    tick={{ fontSize: 12, opacity: 0.8 }}
                  />
                  <Tooltip
                    formatter={(value: unknown) => [
                      `${value} Units`,
                      "Volume Sold",
                    ]}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid var(--border)",
                      background: "var(--background)",
                    }}
                    cursor={{ fill: "var(--primary)", opacity: 0.1 }}
                  />
                  <Bar
                    dataKey="sales"
                    fill="#3b82f6"
                    radius={[6, 6, 0, 0]}
                    barSize={40}
                  >
                    {productData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index === 0 ? "#8b5cf6" : "#3b82f6"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
