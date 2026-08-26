import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

const Spinner = ({ className, size = "default", ...props }) => {
  const sizeClasses = {
    default: "h-4 w-4",
    sm: "h-3 w-3", 
    lg: "h-6 w-6",
    xl: "h-8 w-8"
  }

  return (
    <Loader2 
      className={cn("animate-spin", sizeClasses[size], className)}
      {...props}
    />
  )
}

export { Spinner }
