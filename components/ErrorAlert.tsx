export default function ErrorAlert({ message }: { message: string }) {
  return (
    <div className="bg-red-100 text-red-800 px-4 py-2 rounded mb-2 border border-red-200">
      {message}
    </div>
  );
}

