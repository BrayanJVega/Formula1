import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
export function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const { login, isLoading, error, clearError } = useAuthStore();
    const handleSubmit = async (e) => {
        e.preventDefault();
        clearError();
        setErrors({});
        const newErrors = {};
        if (!email)
            newErrors.email = 'El email es obligatorio';
        if (!password)
            newErrors.password = 'La contraseña es obligatoria';
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        try {
            await login(email, password);
        }
        catch {
            // Error is handled by store
        }
    };
    return (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", children: [_jsx("h2", { className: "text-2xl font-bold text-white", children: "Bienvenido de nuevo" }), _jsx("p", { className: "text-gray-400 text-sm", children: "Inicia sesi\u00F3n en tu cuenta de F1 Predictor" }), error && (_jsx("div", { className: "bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-400", children: error })), _jsx(Input, { id: "email", label: "Email", type: "email", value: email, onChange: (e) => setEmail(e.target.value), error: errors.email, placeholder: "your@email.com" }), _jsx(Input, { id: "password", label: "Contrase\u00F1a", type: "password", value: password, onChange: (e) => setPassword(e.target.value), error: errors.password, placeholder: "Enter your password" }), _jsx("div", { className: "flex items-center justify-between text-sm", children: _jsx(Link, { to: "/forgot-password", className: "text-f1-red hover:text-f1-red-dark transition-colors", children: "\u00BFOlvidaste tu contrase\u00F1a?" }) }), _jsx(Button, { type: "submit", className: "w-full", isLoading: isLoading, children: "Iniciar Sesi\u00F3n" }), _jsxs("p", { className: "text-center text-sm text-gray-400", children: ["\u00BFNo tienes cuenta?", ' ', _jsx(Link, { to: "/register", className: "text-f1-red hover:text-f1-red-dark transition-colors font-medium", children: "Reg\u00EDstrate" })] })] }));
}
//# sourceMappingURL=LoginForm.js.map