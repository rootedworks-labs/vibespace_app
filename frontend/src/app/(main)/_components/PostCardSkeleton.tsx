import { Skeleton } from "@/src/app/components/ui/Skeleton";
import { Card, CardContent, CardHeader } from "@/src/app/components/ui/Card";

export function PostCardSkeleton() {
  return (
    <Card className="rounded-none border-x-0 border-t-0 border-b">
      <CardHeader className="p-4">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="h-4 w-[100px]" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[80%]" />
      </CardContent>
    </Card>
  );
}