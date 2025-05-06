import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Copy, ExternalLink, Calendar, Clock, Info } from "lucide-react";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
import type { UrlStats } from "@/types/url";
import { api } from "@/api/client";

const UrlDetails = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const [urlDetails, setUrlDetails] = useState<UrlStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUrlDetails = async () => {
      if (!shortCode) {
        toast.error("URL code not provided");
        return;
      }

      setLoading(true);
      try {
        const data = await api.getStats(shortCode);
        setUrlDetails(data);
      } catch (error) {
        console.error("Error fetching URL details:", error);
        toast.error("Failed to load URL information");
      } finally {
        setLoading(false);
      }
    };

    fetchUrlDetails();
  }, [shortCode]);

  const handleCopyShortUrl = () => {
    const shortUrl = `${window.location.origin}/${shortCode}`;
    navigator.clipboard.writeText(shortUrl)
      .then(() => toast.success("Short URL copied to clipboard"))
      .catch(() => toast.error("Failed to copy URL"));
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    try {
      return format(new Date(dateString), "MMM d, yyyy h:mm a");
    } catch (e) {
      console.log(e);
      return dateString;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link to="/">
              <Button variant="outline" className="mb-4">
                <ArrowLeft size={16} className="mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">URL Details</h1>
          </div>

          {loading ? (
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-3/4" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-2/3" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </CardContent>
            </Card>
          ) : urlDetails ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Shortened URL</span>
                    <div className="flex space-x-2">
                      <Button
                        onClick={handleCopyShortUrl}
                        size="sm"
                        variant="outline"
                        title="Copy short URL"
                      >
                        <Copy size={16} className="mr-2" />
                        Copy
                      </Button>
                      <a
                        href={`${window.location.origin}/${shortCode}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 h-9 px-3 rounded-md text-sm font-medium ring-offset-background transition-colors bg-background border border-input hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                      >
                        <ExternalLink size={16} className="mr-2" />
                        Visit
                      </a>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-gray-50 rounded-md font-mono text-sm break-all">
                    {`${window.location.origin}/${shortCode}`}
                  </div>

                  <Table className="mt-6">
                    <TableBody>
                      <TableRow>
                        <TableHead className="w-1/3">Original URL</TableHead>
                        <TableCell>
                          <a
                            href={urlDetails.longUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline break-all"
                          >
                            {urlDetails.longUrl}
                          </a>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableHead className="flex items-center">
                          <Calendar size={16} className="mr-2" />
                          Created
                        </TableHead>
                        <TableCell>{formatDate(urlDetails.createdAt)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableHead className="flex items-center">
                          <Clock size={16} className="mr-2" />
                          Last Visited
                        </TableHead>
                        <TableCell>
                          {urlDetails.lastVisitedAt ? formatDate(urlDetails.lastVisitedAt) : "Never"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableHead className="flex items-center">
                          <Info size={16} className="mr-2" />
                          Total Clicks
                        </TableHead>
                        <TableCell>
                          <span className="font-bold text-xl">{urlDetails.clicks || 0}</span>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-gray-500 mb-4">URL not found or has been deleted.</p>
                <Link to="/">
                  <Button>Return to Home</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default UrlDetails;
