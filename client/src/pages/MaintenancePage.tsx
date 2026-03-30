import { AlertTriangle } from "lucide-react";

export const MaintenancePage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground animate-in fade-in duration-700 p-8">
      <div className="max-w-md text-center space-y-6">
        <div className="w-24 h-24 bg-amber-500/10 text-amber-500 mx-auto rounded-full flex items-center justify-center animate-pulse">
          <AlertTriangle className="w-12 h-12" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight">System Under Maintenance</h1>
        <p className="text-muted-foreground text-lg">
          We are currently upgrading our platform's backend architecture. The store storefront will be back online shortly. Thank you for your patience!
        </p>
      </div>
    </div>
  );
};
