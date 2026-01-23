import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

 return (
  <div className="flex min-h-screen items-center justify-center bg-green-100 p-4 transition-colors duration-500 ease-in-out">
    <div className="text-center bg-green-500 p-8 rounded-lg shadow-lg
                    transform transition-all duration-500 ease-out
                    hover:scale-[1.02] hover:shadow-xl">
      <h1 className="mb-4 text-4xl font-bold text-white transition-opacity duration-500">
        404
      </h1>

      <p className="mb-4 text-xl text-green-50 transition-opacity duration-500">
        Oops! Page not found
      </p>

      <a
        href="/"
        className="inline-block text-white underline underline-offset-4
                   transition-all duration-300 ease-in-out
                   hover:text-green-200 hover:tracking-wide"
      >
        Return to Home
      </a>
    </div>
  </div>
);

};

export default NotFound;
