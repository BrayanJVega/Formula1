import { jsx as _jsx } from "react/jsx-runtime";
import { clsx } from 'clsx';
export function Card({ className, hover, children, ...props }) {
    return (_jsx("div", { className: clsx('bg-f1-gray rounded-xl p-6 border border-f1-gray-light/20', hover && 'card-hover', className), ...props, children: children }));
}
//# sourceMappingURL=Card.js.map