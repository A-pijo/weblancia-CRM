interface EmptyStateProps {
  icon: React.ReactNode
  title: string
  description: string
  action?: React.ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-12 h-12 rounded-xl bg-admin-surface/50 flex items-center justify-center text-admin-text-secondary mb-4">
        {icon}
      </div>
      <h3 className="text-sm font-medium text-admin-text-primary mb-1">{title}</h3>
      <p className="text-sm text-admin-text-secondary max-w-xs mb-4">{description}</p>
      {action}
    </div>
  )
}
