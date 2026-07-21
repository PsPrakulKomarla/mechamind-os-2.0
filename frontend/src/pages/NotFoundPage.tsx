import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-bg px-4">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-accent mb-4">404</h1>
        <p className="text-xl text-gray-400 mb-8">Page not found</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-accent hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-lg transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Home
        </Link>
      </div>
    </div>
  );
};
