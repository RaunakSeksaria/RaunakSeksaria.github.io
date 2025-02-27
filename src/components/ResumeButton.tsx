import { FiDownload } from 'react-icons/fi';

interface ResumeButtonProps {
  className?: string;
  variant?: 'primary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

const ResumeButton = ({ 
  className = '', 
  variant = 'primary',
  size = 'md' 
}: ResumeButtonProps) => {
  const baseClasses = "flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--accentColorLight)]";
  
  const variantClasses = {
    primary: "bg-[var(--accentColor)] text-white hover:bg-[var(--accentColorDark)] shadow-md hover:shadow-lg",
    outline: "border-2 border-[var(--accentColor)] text-[var(--accentColor)] hover:bg-[var(--accentColor)] hover:text-white"
  };
  
  const sizeClasses = {
    sm: "px-4 py-1.5 text-sm",
    md: "px-6 py-2.5",
    lg: "px-8 py-3 text-lg"
  };
  
  return (
    <a 
      href="/Raunak_Seksaria_CV.pdf" 
      target="_blank" 
      rel="noopener noreferrer"
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      download="Raunak_Seksaria_CV.pdf"
    >
      <FiDownload className="w-5 h-5" />
      <span>Download Resume</span>
    </a>
  );
};

export default ResumeButton;
