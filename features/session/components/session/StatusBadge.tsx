import { Chip } from "@heroui/react"
import { CheckCircle, Clock, Play, XCircle } from "lucide-react"

type StatusBadgeProps = {
  status: "scheduled" | "in-progress" | "completed" | "missed"
  className?: string
}

export default function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case "scheduled":
        return {
          color: "warning" as const,
          icon: <Clock size={14} />,
          label: "Scheduled",
        }
      case "in-progress":
        return {
          color: "success" as const,
          icon: <Play size={14} />,
          label: "In Progress",
        }
      case "completed":
        return {
          color: "primary" as const,
          icon: <CheckCircle size={14} />,
          label: "Completed",
        }
      case "missed":
        return {
          color: "danger" as const,
          icon: <XCircle size={14} />,
          label: "Missed",
        }
      default:
        return {
          color: "default" as const,
          icon: null,
          label: status,
        }
    }
  }

  const { color, icon, label } = getStatusConfig()

  return (
    <Chip color={color} variant="flat" startContent={icon} className={className} size="sm">
      {label}
    </Chip>
  )
}
