import { toast }            from 'react-toastify';
import { AlertOctagon }     from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';

export const notify = {
  success: (msg, opts = {}) => 
    toast.success(msg, opts),

  error: (msg, opts = {}) => 
    toast.error(msg, opts),

  critical: (msg, opts = {}) => 
    toast.error(msg, { 
      icon: <AlertOctagon className="text-red-600" size={20} />,
      className: 'bg-red-100 border-l-4 border-red-600',
      bodyClassName: 'text-red-800',
      autoClose: false,
      closeOnClick: true,
      ...opts,
    }),
};
