import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { Search, Copy, ExternalLink, BarChart, Info } from "lucide-react";
import { toast } from "sonner";
import type { UrlItem } from "@/types/url";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type UrlListProps = {
  urls: UrlItem[];
  loading: boolean;
  onSearch: (query: string) => void;
  onUrlSelect: (urlPath: string) => void;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
};

const UrlList = ({
  urls,
  loading,
  onSearch,
  onUrlSelect,
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
}: UrlListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      onSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, onSearch]);

  const handleCopyClick = (shortUrl: string) => {
    navigator.clipboard.writeText(shortUrl)
      .then(() => toast.success("URL copied to clipboard!"))
      .catch(() => toast.error("Failed to copy URL"));
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy h:mm a");
    } catch {
      return dateString;
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else {
      pageNumbers.push(1);
      if (currentPage > 3) pageNumbers.push(null);
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);
      if (currentPage < totalPages - 2) pageNumbers.push(null);
      pageNumbers.push(totalPages);
    }
    return pageNumbers;
  };

  return (
    <TransitionGroup component={null}>
  {urls.map((url) => (
    <CSSTransition key={url.id || url.shortCode} timeout={300} classNames="fade">
      <div className="p-4 border rounded-lg bg-white link-card hover:shadow-md transition-shadow">
       

    <Card className="shadow-lg">
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Your shortened URLs</h2>
          <div className="relative">
            <Input
              type="text"
              placeholder="Search by original URL (min 3 chars)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div className="space-y-4">
          {loading ? (
            Array(3).fill(0).map((_, index) => (
              <div key={index} className="p-4 border rounded-lg bg-white">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-4 w-3/4 mt-2" />
              </div>
            ))
          ) : urls.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-500">
                {debouncedQuery.length >= 3
                  ? "No results found for your search."
                  : "No shortened URLs yet. Create one to get started!"}
              </p>
            </div>
          ) : (
            <>
              {urls.map((url) => {
                const shortUrl = `${window.location.origin}/${url.shortCode}`;
                return (
                  <div key={url.id} className="p-4 border rounded-lg bg-white link-card hover:shadow-md transition-shadow">
                    <div className="flex flex-col space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-blue-600 truncate max-w-sm" title={url.longUrl}>
                            {url.longUrl}
                          </h3>
                          <a
                            href={shortUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-gray-600 hover:text-gray-900 flex items-center"
                          >
                            {shortUrl}
                            <ExternalLink size={14} className="ml-1" />
                          </a>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => handleCopyClick(shortUrl)}>
                            <Copy size={16} />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => onUrlSelect(url.shortCode)}>
                            <BarChart size={16} />
                          </Button>
                          <Link to={`/details/${url.shortCode}`}>
                            <Button size="sm" variant="outline">
                              <Info size={16} />
                            </Button>
                          </Link>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Created: {formatDate(url.createdAt)}</span>
                        <span>{url.clicks || 0} clicks</span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {totalPages > 1 && (
                <Pagination className="mt-6">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    {getPageNumbers().map((page, idx) => (
                      <PaginationItem key={idx}>
                        {page === null ? (
                          <PaginationEllipsis />
                        ) : (
                          <PaginationLink
                            isActive={page === currentPage}
                            onClick={() => onPageChange(page)}
                          >
                            {page}
                          </PaginationLink>
                        )}
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>

     </div>
    </CSSTransition>
  ))}
</TransitionGroup>
  );
};

export default UrlList;
