import { useState, useEffect } from "react";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import UrlForm from "@/components/UrlForm";
import UrlList from "@/components/UrlList";
import StatsPanel from "@/components/StatsPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/api/client";
import type { UrlItem } from "@/types/url";

const Index = () => {
  const [activeTab, setActiveTab] = useState("shorten");
  const [urls, setUrls] = useState<UrlItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchUrls = async (page = 1, limit = 10, query = "") => {
    setLoading(true);
    try {
      const data = await api.fetchUrls(page, limit, query);
      setUrls(data.data || []);
      setTotalPages(data.totalPages || 1);
      setCurrentPage(page);
    } catch (err) {
      console.log(err)
      toast.error("Failed to fetch URLs");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (longUrl: string) => {
    const result = await api.shortenUrl(longUrl);
    await fetchUrls(1); // Refresh after creation
    setCurrentPage(1);
    return result; // Needed for UrlForm toast
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length >= 3) {
      fetchUrls(1, 10, query);
    } else {
      fetchUrls(1);
    }
  };

  const handlePageChange = (page: number) => {
    fetchUrls(page, 10, searchQuery);
  };

  const handleUrlSelect = (shortCode: string) => {
    setSelectedUrl(shortCode);
    setActiveTab("stats");
  };

  useEffect(() => {
    fetchUrls(currentPage);
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-4 md:py-8">
        <div className="flex flex-col items-center justify-center mb-6 md:mb-10">
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-2 md:mb-4 bg-clip-text text-transparent gradient-bg">
              ShortLink
            </h1>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl px-4">
              Transform your lengthy URLs into concise, shareable links in seconds.
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-4xl mx-auto">
          <div className="flex justify-center mb-4 md:mb-6 overflow-x-auto">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="shorten">Shorten URL</TabsTrigger>
              <TabsTrigger value="urls">My URLs</TabsTrigger>
              <TabsTrigger value="stats">Statistics</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="shorten">
            <UrlForm onSubmit={handleSubmit} />
          </TabsContent>

          <TabsContent value="urls">
            <UrlList
              urls={urls}
              loading={loading}
              onSearch={handleSearch}
              onUrlSelect={handleUrlSelect}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </TabsContent>

          <TabsContent value="stats">
            <StatsPanel urlPath={selectedUrl} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Index;
