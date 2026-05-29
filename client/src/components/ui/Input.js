import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef } from 'react';
import { clsx } from 'clsx';
export const Input = forwardRef(({ className, label, error, id, ...props }, ref) => {
    return (_jsxs("div", { className: "w-full", children: [label && (_jsx("label", { htmlFor: id, className: "block text-sm font-medium text-gray-300 mb-1.5", children: label })), _jsx("input", { ref: ref, id: id, className: clsx('w-full bg-f1-gray-dark border rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none transition-colors duration-200', error
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-f1-gray-light/30 focus:border-f1-red', className), ...props }), error && _jsx("p", { className: "mt-1 text-sm text-red-400", children: error })] }));
});
Input.displayName = 'Input';
//# sourceMappingURL=Input.js.map