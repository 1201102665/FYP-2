import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumb = ({ items, className = "" }: BreadcrumbProps) => {
  return (
    <nav className={`flex items-center space-x-2 text-sm text-gray-600 ${className}`}>
      <Link to="/" className="flex items-center hover:text-aerotrav-blue transition-colors">
        <Home className="h-4 w-4" />
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <ChevronRight className="h-4 w-4 text-gray-400" />
          {item.href && !item.active ? (
            <Link 
              to={item.href} 
              className="hover:text-aerotrav-blue transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className={item.active ? "text-aerotrav-blue font-medium" : "text-gray-500"}>
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumb; 