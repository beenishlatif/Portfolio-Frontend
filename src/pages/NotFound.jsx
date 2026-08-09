import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="min-h-screen bg-bg text-text flex flex-col items-center justify-center px-6 text-center">
    <p className="mono text-primary text-sm tracking-widest mb-4">404</p>
    <h1 className="font-display text-3xl font-semibold mb-3">Page Not Found</h1>
    <p className="text-textMuted mb-6">The page you're looking for doesn't exist.</p>
    <Link to="/" className="text-primary hover:underline">
      Back to homepage
    </Link>
  </div>
);

export default NotFound;
