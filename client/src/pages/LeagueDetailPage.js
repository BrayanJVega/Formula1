import { jsx as _jsx } from "react/jsx-runtime";
import { useParams } from 'react-router-dom';
import { LeagueDetail } from '../components/leagues/LeagueDetail';
export default function LeagueDetailPage() {
    const { id } = useParams();
    if (!id) {
        return (_jsx("div", { className: "text-center py-12 text-gray-400", children: "League ID is required." }));
    }
    return (_jsx("div", { className: "max-w-4xl mx-auto", children: _jsx(LeagueDetail, { leagueId: id }) }));
}
//# sourceMappingURL=LeagueDetailPage.js.map