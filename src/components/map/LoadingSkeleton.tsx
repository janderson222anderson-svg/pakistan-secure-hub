import { motion } from "framer-motion";

interface LoadingSkeletonProps {
  type?: "route" | "poi" | "weather" | "search";
}

const LoadingSkeleton = ({ type = "route" }: LoadingSkeletonProps) => {
  if (type === "route") {
    return (
      <div className="space-y-3 p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
            <div className="h-2 bg-gray-200 rounded animate-pulse w-1/2" />
          </div>
        </div>
        <div className="h-px bg-gray-200" />
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
            <div className="h-2 bg-gray-200 rounded animate-pulse w-1/2" />
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="h-16 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-16 bg-gray-200 rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  if (type === "poi") {
    return (
      <div className="space-y-2 p-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-3 p-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
            <div className="flex-1 h-4 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (type === "weather") {
    return (
      <div className="space-y-3 p-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "search") {
    return (
      <div className="space-y-2 p-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-start gap-3 p-3"
          >
            <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return null;
};

export default LoadingSkeleton;
