import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCircuitStore } from '../store/circuit.store';
import { CircuitDetail } from '../components/circuits/CircuitDetail';
import { Button } from '../components/ui/Button';
export default function CircuitDetailPage() {
    const { id } = useParams();
    const selectedCircuit = useCircuitStore((state) => state.selectedCircuit);
    const isLoading = useCircuitStore((state) => state.isLoading);
    const error = useCircuitStore((state) => state.error);
    const fetchCircuitById = useCircuitStore((state) => state.fetchCircuitById);
    useEffect(() => {
        if (id) {
            fetchCircuitById(id);
        }
    }, [id, fetchCircuitById]);
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);
    return (_jsxs("div", { className: "max-w-4xl mx-auto px-4 py-8", children: [_jsx("div", { className: "mb-6", children: _jsx(Link, { to: "/circuits", children: _jsx(Button, { variant: "ghost", size: "sm", children: "\u2190 Volver a Circuitos" }) }) }), error && (_jsx("div", { className: "mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-400", children: error })), _jsx(CircuitDetail, { circuit: selectedCircuit, isLoading: isLoading })] }));
}
//# sourceMappingURL=CircuitDetailPage.js.map