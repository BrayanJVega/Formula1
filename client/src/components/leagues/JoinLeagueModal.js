import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { X } from 'lucide-react';
import { useLeagueStore } from '../../store/league.store';
export function JoinLeagueModal({ isOpen, onClose }) {
    const [code, setCode] = useState('');
    const [error, setError] = useState(null);
    const { joinLeague, isLoading } = useLeagueStore();
    if (!isOpen)
        return null;
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        if (!code.trim()) {
            setError('El código de la liga es obligatorio');
            return;
        }
        try {
            await joinLeague(code.trim().toUpperCase());
            setCode('');
            onClose();
        }
        catch (err) {
            setError(err.message);
        }
    };
    return (_jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center", children: [_jsx("div", { className: "absolute inset-0 bg-black/60 backdrop-blur-sm", onClick: onClose }), _jsxs("div", { className: "relative bg-f1-gray rounded-xl border border-f1-gray-light/20 w-full max-w-md mx-4 p-6 shadow-2xl", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h2", { className: "text-xl font-bold text-white", children: "Unirse a Liga" }), _jsx("button", { onClick: onClose, className: "text-gray-400 hover:text-white transition-colors", children: _jsx(X, { size: 20 }) })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsx(Input, { label: "C\u00F3digo de la Liga", id: "league-code", value: code, onChange: (e) => setCode(e.target.value.toUpperCase()), placeholder: "ej. ABC12345", maxLength: 20, error: error || undefined }), _jsx("p", { className: "text-sm text-gray-400", children: "Introduce el c\u00F3digo de 8 caracteres compartido por el due\u00F1o de la liga." }), _jsxs("div", { className: "flex gap-3 pt-2", children: [_jsx(Button, { type: "button", variant: "ghost", className: "flex-1", onClick: onClose, children: "Cancelar" }), _jsx(Button, { type: "submit", className: "flex-1", isLoading: isLoading, children: "Unirse" })] })] })] })] }));
}
//# sourceMappingURL=JoinLeagueModal.js.map