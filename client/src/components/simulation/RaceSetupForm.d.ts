import type { WeatherCondition } from '../../types/simulation.types';
interface RaceSetupFormProps {
    onRun: (config: {
        raceId: string;
        raceName: string;
        laps: number;
        weather?: {
            condition: WeatherCondition;
            temperature: number;
            humidity: number;
            windSpeed: number;
        };
    }) => void;
    isLoading: boolean;
}
export declare function RaceSetupForm({ onRun, isLoading }: RaceSetupFormProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=RaceSetupForm.d.ts.map