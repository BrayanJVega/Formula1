import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
export function RegisterForm() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    const { register, isLoading, error, clearError } = useAuthStore();
    const handleSubmit = async (e) => {
        e.preventDefault();
        clearError();
        setErrors({});
        const newErrors = {};
        if (!email)
            newErrors.email = 'El email es obligatorio';
        if (!username)
            newErrors.username = 'El usuario es obligatorio';
        if (username.length < 3)
            newErrors.username = 'El usuario debe tener al menos 3 caracteres';
        if (!password)
            newErrors.password = 'La contraseña es obligatoria';
        if (password.length < 8)
            newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
        if (password !== confirmPassword)
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        try {
            await register(email, username, password);
        }
        catch {
            // Error is handled by store
        }
    };
    return (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", children: [_jsx("h2", { className: "text-2xl font-bold text-white", children: "Crear Cuenta" }), _jsx("p", { className: "text-gray-400 text-sm", children: "\u00DAnete a F1 Predictor y empieza a competir" }), error && (_jsx("div", { className: "bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-400", children: error })), _jsx(Input, { id: "email", label: "Email", type: "email", value: email, onChange: (e) => setEmail(e.target.value), error: errors.email, placeholder: "your@email.com" }), _jsx(Input, { id: "username", label: "Usuario", type: "text", value: username, onChange: (e) => setUsername(e.target.value), error: errors.username, placeholder: "Elige un usuario" }), _jsx(Input, { id: "password", label: "Contrase\u00F1a", type: "password", value: password, onChange: (e) => setPassword(e.target.value), error: errors.password, placeholder: "Crea una contrase\u00F1a segura" }), _jsx(Input, { id: "confirmPassword", label: "Confirmar Contrase\u00F1a", type: "password", value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value), error: errors.confirmPassword, placeholder: "Confirma tu contrase\u00F1a" }), _jsx(Button, { type: "submit", className: "w-full", isLoading: isLoading, children: "Crear Cuenta" }), _jsxs("p", { className: "text-center text-sm text-gray-400", children: ["\u00BFYa tienes cuenta?", ' ', _jsx(Link, { to: "/login", className: "text-f1-red hover:text-f1-red-dark transition-colors font-medium", children: "Iniciar Sesi\u00F3n" })] })] }));
}
//# sourceMappingURL=RegisterForm.js.map