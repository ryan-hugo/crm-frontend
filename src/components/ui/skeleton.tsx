import React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("animate-pulse rounded-md bg-gray-200", className)}
        {...props}
      />
    );
  }
);
Skeleton.displayName = "Skeleton";

// Skeleton components específicos para diferentes layouts
export const PageHeaderSkeleton: React.FC = () => (
  <div className="space-y-2">
    <Skeleton className="h-8 w-48" />
    <Skeleton className="h-4 w-80" />
  </div>
);

export const FiltersSkeleton: React.FC = () => (
  <div className="flex gap-4">
    <Skeleton className="h-10 flex-1 max-w-sm" />
    <Skeleton className="h-10 w-32" />
  </div>
);

export const CardListSkeleton: React.FC<{ count?: number }> = ({
  count = 6,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(count)].map((_, i) => (
      <div key={i} className="space-y-3 p-6 border rounded-lg">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <div className="flex space-x-2">
            <Skeleton className="w-8 h-8" />
            <Skeleton className="w-8 h-8" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

export const TableRowSkeleton: React.FC<{ count?: number }> = ({
  count = 5,
}) => (
  <div className="space-y-4">
    {[...Array(count)].map((_, i) => (
      <div key={i} className="p-6 border rounded-lg">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <Skeleton className="h-5 w-3/4 mb-2" />
            <div className="flex items-center space-x-4 mb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <div className="flex space-x-2">
            <Skeleton className="w-8 h-8" />
            <Skeleton className="w-8 h-8" />
          </div>
        </div>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    ))}
  </div>
);

export const PaginationSkeleton: React.FC = () => (
  <div className="flex items-center justify-between">
    <Skeleton className="h-4 w-48" />
    <div className="flex space-x-2">
      <Skeleton className="w-10 h-10" />
      <Skeleton className="w-8 h-10" />
      <Skeleton className="w-10 h-10" />
    </div>
  </div>
);

export const FormSkeleton: React.FC = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <Skeleton className="h-4 w-16 mb-2" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div>
        <Skeleton className="h-4 w-16 mb-2" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
    <div>
      <Skeleton className="h-4 w-20 mb-2" />
      <Skeleton className="h-10 w-full" />
    </div>
    <div>
      <Skeleton className="h-4 w-24 mb-2" />
      <Skeleton className="h-20 w-full" />
    </div>
    <Skeleton className="h-10 w-32" />
  </div>
);

export { Skeleton };
