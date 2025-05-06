import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Link2 } from "lucide-react";
import { toast } from "sonner";

type UrlFormProps = {
  onSubmit: (url: string) => Promise<{ shortUrl: string }>;
};

const UrlForm = ({ onSubmit }: UrlFormProps) => {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isValidUrl, setIsValidUrl] = useState(true);

  const validateUrl = (value: string) => {
    if (!value) return true;
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateUrl(url)) {
      setIsValidUrl(false);
      return;
    }

    setIsValidUrl(true);
    setIsLoading(true);

    try {
      const result = await onSubmit(url);
      setUrl("");

      toast.success("URL shortened!", {
        description: (
          <div className="flex items-center justify-between space-x-2">
            <a
              href={result.shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline truncate"
            >
              {result.shortUrl}
            </a>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(result.shortUrl);
                toast.success("Copied to clipboard!");
              }}
            >
              Copy
            </Button>
          </div>
        ),
        duration: 7000,
      });
    } catch (error) {
      console.error("Error shortening URL:", error);
      toast.error("Failed to shorten URL", {
        description: "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-lg w-full max-w-md mx-auto">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-xl md:text-2xl font-semibold text-center">Shorten your URL</h2>
            <p className="text-sm md:text-base text-gray-500 text-center">
              Paste your long URL below to create a shorter, more manageable link.
            </p>
          </div>

          <div className="relative">
            <Input
              type="text"
              placeholder="https://example.com/long/url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setIsValidUrl(validateUrl(e.target.value));
              }}
              className={`pr-12 ${!isValidUrl ? "border-red-500" : ""}`}
              disabled={isLoading}
              required
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Link2 size={18} />
            </span>
          </div>

          {!isValidUrl && (
            <p className="text-red-500 text-sm">Please enter a valid URL including http:// or https://</p>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Shortening..." : "Shorten URL"}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            By using our service, you agree to our Terms of Service and Privacy Policy.
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default UrlForm;

     