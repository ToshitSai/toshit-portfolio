import RouteMetadata from "@/components/RouteMetadata";

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <RouteMetadata
        title="Page Not Found | Toshit Sai Galam"
        description="The requested Toshit Sai Galam portfolio page could not be found."
        canonicalPath="/404"
        noindex
      />
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
        <a href="/" className="text-primary underline hover:text-primary/90">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
