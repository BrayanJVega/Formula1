interface ComparableDriver {
    id: string;
    name: string;
    number: number;
    nationality: string;
    team: {
        id: string;
        name: string;
        logoUrl?: string;
    };
    photoUrl?: string;
    stats?: {
        championships: number;
        wins: number;
        podiums: number;
        poles: number;
        fastestLaps: number;
        totalPoints: number;
        racesEntered: number;
        seasonPoints: number;
        seasonPosition: number;
    };
}
interface DriverComparisonProps {
    driver1: ComparableDriver | null;
    driver2: ComparableDriver | null;
    loading: boolean;
    error: string | null;
}
export declare function DriverComparison({ driver1, driver2, loading, error }: DriverComparisonProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=DriverComparison.d.ts.map