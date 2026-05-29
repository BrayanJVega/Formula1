import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet } from 'react-router-dom';
export function AuthLayout() {
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-f1-gray-dark px-4", children: _jsxs("div", { className: "w-full max-w-md", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("h1", { className: "text-3xl font-bold text-f1-red font-display", children: "F1 Predictor" }), _jsx("p", { className: "text-gray-400 mt-2", children: "Simulador de Carreras y Liga Fant\u00E1stica" })] }), _jsx("div", { className: "card animate-fade-in", children: _jsx(Outlet, {}) })] }) }));
}
//# sourceMappingURL=AuthLayout.js.map