export default function AdminLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg p-8">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        <p className="text-body-sm text-text-secondary">Chargement...</p>
      </div>
    </div>
  )
}
