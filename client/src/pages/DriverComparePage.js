import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { DriverComparison } from '../components/drivers/DriverComparison';
import { driversApi } from '../api/drivers.api';
export default function DriverComparePage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [driver1, setDriver1] = useState(null);
    const [driver2, setDriver2] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const id1 = searchParams.get('driver1');
    const id2 = searchParams.get('driver2');
    useEffect(() => {
        if (!id1 || !id2)
            return;
        const fetchBoth = async () => {
            try {
                setLoading(true);
                setError(null);
                const [d1, d2] = await Promise.all([
                    driversApi.getDriverById(id1),
                    driversApi.getDriverById(id2),
                ]);
                setDriver1(d1);
                setDriver2(d2);
            }
            catch (err) {
                setError(err.response?.data?.error || 'Error al cargar pilotos');
            }
            finally {
                setLoading(false);
            }
        };
        fetchBoth();
    }, [id1, id2]);
    return (_jsxs("div", { className: "max-w-5xl mx-auto px-4 py-8", children: [_jsxs("div", { className: "flex items-center justify-between mb-8", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-white", children: "Comparaci\u00F3n de Pilotos" }), _jsx("p", { className: "text-gray-400 mt-1", children: "Compara estad\u00EDsticas lado a lado" })] }), _jsx("div", { className: "flex gap-2", children: _jsx(Button, { variant: "ghost", onClick: () => setSearchParams({ driver1: id2, driver2: id1 }), children: "Intercambiar" }) })] }), _jsx(DriverComparison, { driver1: driver1, driver2: driver2, loading: loading, error: error })] }));
}
//# sourceMappingURL=DriverComparePage.js.map