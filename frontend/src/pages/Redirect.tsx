import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { api } from "@/api/client";

const Redirect = () => {
  const { urlPath } = useParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!urlPath) {
      setError("Invalid URL");
      return;
    }

    const fetchAndRedirect = async () => {
      try {
        const longUrl = await api.decode(urlPath);
        window.location.href = longUrl;
      } catch (err) {
        console.error("Redirect error:", err);
        setError("The requested URL was not found or has expired.");
        toast.error("URL not found", {
          description:
            "The short link you're trying to access doesn't exist or has expired.",
        });
      }
    };

    fetchAndRedirect();
  }, [urlPath]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="p-8 bg-white rounded-lg shadow-lg text-center">
        {error ? (
          <div>
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
            <p className="text-gray-700 mb-4">{error}</p>
            <a
              href="/"
              className="text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              Go back to homepage
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="animate-pulse-blue">
              <div className="h-12 w-12 mx-auto bg-indigo-600 rounded-full flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-semibold">Redirecting...</h2>
            <p className="text-gray-500">
              You are being redirected to the original URL.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Redirect;
