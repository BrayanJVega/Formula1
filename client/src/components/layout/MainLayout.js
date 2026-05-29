import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
export function MainLayout() {
    return (_jsxs("div", { className: "min-h-screen flex flex-col", children: [_jsx(Navbar, {}), _jsx("main", { className: "flex-1", children: _jsx(Outlet, {}) }), _jsx("footer", { className: "bg-f1-gray border-t border-f1-gray-light/20 py-4", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 text-center text-sm text-gray-500", children: ["F1 Predictor y Simulador de Carreras \u00A9 ", new Date().getFullYear()] }) })] }));
}
//# sourceMappingURL=MainLayout.js.map