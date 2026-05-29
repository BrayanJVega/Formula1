import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
export default function NotFoundPage() {
    return (_jsx("div", { className: "min-h-[calc(100vh-4rem)] flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("h1", { className: "text-8xl font-bold text-f1-red font-display mb-4", children: "404" }), _jsx("p", { className: "text-xl text-gray-400 mb-8", children: "P\u00E1gina no encontrada" }), _jsx(Link, { to: "/", children: _jsx(Button, { children: "Ir al Inicio" }) })] }) }));
}
//# sourceMappingURL=NotFoundPage.js.map