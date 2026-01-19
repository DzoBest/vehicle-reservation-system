export default function Modal({ open, onClose, children }: any) {
  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
      <div className="bg-white p-6 rounded w-96">
        {children}
        <button
          className="mt-4 text-red-600"
          onClick={onClose}
        >
          Fermer
        </button>
      </div>
    </div>
  )
}
