import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { clsx } from 'clsx';
import { forwardRef } from 'react';
export const Button = forwardRef(({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    return (_jsxs("button", { ref: ref, disabled: disabled || isLoading, className: clsx('inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-f1-gray-dark disabled:opacity-50 disabled:cursor-not-allowed', {
            'bg-f1-red hover:bg-f1-red-dark text-white focus:ring-f1-red': variant === 'primary',
            'bg-f1-gray hover:bg-f1-gray-light text-white focus:ring-f1-gray': variant === 'secondary',
            'hover:bg-f1-gray/50 text-gray-300 hover:text-white focus:ring-f1-gray': variant === 'ghost',
        }, {
            'px-3 py-1.5 text-sm': size === 'sm',
            'px-6 py-2.5 text-sm': size === 'md',
            'px-8 py-3 text-base': size === 'lg',
        }, className), ...props, children: [isLoading ? (_jsxs("svg", { className: "animate-spin -ml-1 mr-2 h-4 w-4", fill: "none", viewBox: "0 0 24 24", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" })] })) : null, children] }));
});
Button.displayName = 'Button';
//# sourceMappingURL=Button.js.map