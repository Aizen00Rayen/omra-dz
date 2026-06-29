import { useState, useEffect, useRef } from 'react';

// ─── Button ───────────────────────────────────────────────────────────────────
const variantClasses = {
  primary: 'bg-green-700 text-white hover:bg-green-800 active:bg-green-900',
  secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  warning: 'bg-amber-500 text-white hover:bg-amber-600',
  ghost: 'text-gray-600 hover:bg-gray-100',
  outline: 'border border-current text-green-700 hover:bg-green-50',
  light: 'text-green-700 hover:bg-green-50',
  'outline-white': 'border border-white/40 text-white hover:bg-white/10',
  'danger-flat': 'text-red-600 bg-red-50 hover:bg-red-100',
  'warning-flat': 'text-amber-600 bg-amber-50 hover:bg-amber-100',
  'success-flat': 'text-green-700 bg-green-50 hover:bg-green-100',
  flat: 'text-green-700 bg-green-50 hover:bg-green-100',
  amber: 'bg-amber-500 text-white hover:bg-amber-600',
  dark: 'bg-gray-900 text-white hover:bg-gray-800',
};

const sizeClasses = {
  xs: 'text-xs px-2 py-1 rounded-lg',
  sm: 'text-sm px-3 py-1.5 rounded-lg',
  md: 'text-sm px-4 py-2 rounded-xl',
  lg: 'text-base px-6 py-2.5 rounded-xl',
  xl: 'text-lg px-8 py-3 rounded-xl',
};

export function Button({
  children, onClick, onPress, variant = 'primary', size = 'md',
  className = '', disabled, isDisabled, isLoading, type = 'button',
  as: Tag = 'button', href, to, ...props
}) {
  const handleClick = onPress || onClick;
  const isDisabledFinal = disabled || isDisabled || isLoading;

  const classes = [
    'inline-flex items-center justify-center gap-2 font-medium transition-colors cursor-pointer',
    variantClasses[variant] || variantClasses.primary,
    sizeClasses[size] || sizeClasses.md,
    isDisabledFinal ? 'opacity-50 cursor-not-allowed pointer-events-none' : '',
    className,
  ].join(' ');

  if (Tag !== 'button') {
    return <Tag href={href || to} className={classes} onClick={handleClick} {...props}>{children}</Tag>;
  }

  return (
    <button type={type} className={classes} onClick={handleClick} disabled={isDisabledFinal} {...props}>
      {isLoading && <span className="animate-spin text-base">⟳</span>}
      {children}
    </button>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────
export function Card({ children, className = '', shadow = true, ...props }) {
  return (
    <div
      className={`bg-white rounded-2xl overflow-hidden ${shadow ? 'shadow-sm' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardBody({ children, className = '', ...props }) {
  return (
    <div className={`p-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '', ...props }) {
  return (
    <div className={`px-4 pb-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

// ─── Chip / Badge ─────────────────────────────────────────────────────────────
const chipColors = {
  default: 'bg-gray-100 text-gray-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-red-100 text-red-700',
  primary: 'bg-blue-100 text-blue-700',
  secondary: 'bg-purple-100 text-purple-700',
  accent: 'bg-amber-100 text-amber-700',
};

export function Chip({ children, color = 'default', size = 'md', className = '', variant, ...props }) {
  const colorClass = chipColors[color] || chipColors.default;
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : size === 'lg' ? 'text-sm px-3 py-1' : 'text-xs px-2.5 py-0.5';
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${colorClass} ${sizeClass} ${className}`} {...props}>
      {children}
    </span>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
const avatarSizes = { sm: 'w-8 h-8 text-sm', md: 'w-10 h-10 text-base', lg: 'w-14 h-14 text-xl', xl: 'w-20 h-20 text-3xl' };

export function Avatar({ src, name, size = 'md', className = '', ...props }) {
  const [error, setError] = useState(false);
  const sizeClass = avatarSizes[size] || avatarSizes.md;
  const initials = name ? name.split(' ').map(n => n[0]).join('').slice(0, 2) : '?';

  return (
    <div className={`${sizeClass} rounded-full overflow-hidden flex-shrink-0 ${className}`} {...props}>
      {src && !error ? (
        <img src={src} alt={name || ''} className="w-full h-full object-cover" onError={() => setError(true)} />
      ) : (
        <div className="w-full h-full bg-green-100 text-green-700 flex items-center justify-center font-semibold">
          {initials}
        </div>
      )}
    </div>
  );
}

// ─── Input ────────────────────────────────────────────────────────────────────
export function Input({
  label, placeholder, value, onChange, type = 'text', className = '',
  startContent, endContent, isRequired, size = 'md', variant, name, min, max,
  disabled, readOnly, isDisabled,
  ...props
}) {
  const sizeClass = size === 'sm' ? 'py-1.5 text-sm' : size === 'lg' ? 'py-3 text-base' : 'py-2 text-sm';
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}{isRequired && <span className="text-red-500 ms-1">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {startContent && <span className="absolute start-3 text-gray-400 pointer-events-none">{startContent}</span>}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          name={name}
          min={min}
          max={max}
          disabled={disabled || isDisabled}
          readOnly={readOnly}
          className={`w-full border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-colors ${sizeClass} ${startContent ? 'ps-10' : 'ps-3'} ${endContent ? 'pe-10' : 'pe-3'}`}
          {...props}
        />
        {endContent && <span className="absolute end-3 text-gray-400">{endContent}</span>}
      </div>
    </div>
  );
}

// ─── Textarea ─────────────────────────────────────────────────────────────────
export function Textarea({ label, placeholder, value, onChange, rows = 4, className = '', isRequired, ...props }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}{isRequired && <span className="text-red-500 ms-1">*</span>}
        </label>
      )}
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="w-full border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-colors px-3 py-2 text-sm resize-none"
        {...props}
      />
    </div>
  );
}

// ─── Select ───────────────────────────────────────────────────────────────────
export function Select({ label, children, value, onChange, className = '', selectedKeys, isRequired, size = 'md', ...props }) {
  const actualValue = selectedKeys ? [...selectedKeys][0] : value;
  const sizeClass = size === 'sm' ? 'py-1.5 text-sm' : 'py-2 text-sm';
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}{isRequired && <span className="text-red-500 ms-1">*</span>}
        </label>
      )}
      <select
        value={actualValue || ''}
        onChange={onChange}
        className={`w-full border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-colors ps-3 pe-8 ${sizeClass} appearance-none cursor-pointer`}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}

export function SelectItem({ value, key: k, children }) {
  return <option value={k || value}>{children}</option>;
}

// ─── Modal ────────────────────────────────────────────────────────────────────
export function Modal({ isOpen, onClose, children, size = 'md' }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidths = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-3xl', '2xl': 'max-w-3xl', '3xl': 'max-w-4xl' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div
        ref={ref}
        className={`relative bg-white rounded-2xl shadow-2xl w-full ${maxWidths[size] || 'max-w-lg'} max-h-[90vh] flex flex-col`}
      >
        {children}
      </div>
    </div>
  );
}

export function ModalContent({ children }) {
  return <>{children}</>;
}

export function ModalHeader({ children, className = '' }) {
  return (
    <div className={`px-6 py-4 border-b border-gray-100 shrink-0 ${className}`}>
      {typeof children === 'string' ? <h3 className="text-lg font-bold text-gray-900 font-arabic">{children}</h3> : children}
    </div>
  );
}

export function ModalBody({ children, className = '' }) {
  return (
    <div className={`px-6 py-4 overflow-y-auto flex-1 ${className}`}>
      {children}
    </div>
  );
}

export function ModalFooter({ children, className = '' }) {
  return (
    <div className={`px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 shrink-0 ${className}`}>
      {children}
    </div>
  );
}

// ─── Divider ──────────────────────────────────────────────────────────────────
export function Divider({ className = '' }) {
  return <hr className={`border-gray-100 ${className}`} />;
}

// ─── Dropdown ─────────────────────────────────────────────────────────────────
export function Dropdown({ children, placement = 'bottom-end' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const handleClick = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);
  return (
    <div ref={ref} className="relative inline-block">
      {typeof children === 'function' ? children({ isOpen: open, setOpen }) :
        Array.isArray(children)
          ? children.map((child, i) => {
            if (child?.type === DropdownTrigger) return <div key={i} onClick={() => setOpen(!open)}>{child.props.children}</div>;
            if (child?.type === DropdownMenu) return open ? <div key={i} className={`absolute ${placement === 'bottom-start' ? 'start-0' : 'end-0'} mt-2 z-50 bg-white rounded-xl shadow-xl border border-gray-100 py-1 min-w-40`}>{child.props.children}</div> : null;
            return child;
          })
          : children}
    </div>
  );
}

export function DropdownTrigger({ children }) { return <>{children}</>; }

export function DropdownMenu({ children, 'aria-label': label }) {
  return <>{children}</>;
}

export function DropdownItem({ children, onPress, key, color }) {
  return (
    <button
      onClick={onPress}
      className={`w-full text-start px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${color === 'danger' ? 'text-red-600 hover:bg-red-50' : 'text-gray-700'}`}
    >
      {children}
    </button>
  );
}

// ─── Slider (simplified) ──────────────────────────────────────────────────────
export function Slider({ label, value, onChange, min = 0, max = 100, step = 1, className = '' }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(e.target.value)}
        className="w-full accent-green-700" />
    </div>
  );
}
