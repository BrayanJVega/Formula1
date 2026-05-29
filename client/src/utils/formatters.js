export function formatPoints(points) {
    return points.toFixed(1);
}
export function formatPosition(pos) {
    if (pos === 1)
        return '1st';
    if (pos === 2)
        return '2nd';
    if (pos === 3)
        return '3rd';
    return `${pos}th`;
}
export function formatDate(date) {
    return new Date(date).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}
export function formatTime(date, timezone) {
    return new Date(date).toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: timezone,
    });
}
export function getInitials(name) {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}
export function nationalityFlag(country) {
    const countryMap = {
        'Netherlands': '🇳🇱',
        'United Kingdom': '🇬🇧',
        'Monaco': '🇲🇨',
        'Spain': '🇪🇸',
        'France': '🇫🇷',
        'Germany': '🇩🇪',
        'Finland': '🇫🇮',
        'Australia': '🇦🇺',
        'Japan': '🇯🇵',
        'Canada': '🇨🇦',
        'Mexico': '🇲🇽',
        'Italy': '🇮🇹',
        'Brazil': '🇧🇷',
        'Denmark': '🇩🇰',
        'Switzerland': '🇨🇭',
        'Austria': '🇦🇹',
        'New Zealand': '🇳🇿',
        'Belgium': '🇧🇪',
        'Sweden': '🇸🇪',
        'Thailand': '🇹🇭',
        'United States': '🇺🇸',
        'Argentina': '🇦🇷',
        'China': '🇨🇳',
        'Russia': '🇷🇺',
        'Poland': '🇵🇱',
        'Hungary': '🇭🇺',
        'South Africa': '🇿🇦',
        'India': '🇮🇳',
        'Indonesia': '🇮🇩',
        'Ireland': '🇮🇪',
        'Portugal': '🇵🇹',
        'Turkey': '🇹🇷',
        'UAE': '🇦🇪',
        'Qatar': '🇶🇦',
        'Saudi Arabia': '🇸🇦',
        'Singapore': '🇸🇬',
        'Azerbaijan': '🇦🇿',
        'Bahrain': '🇧🇭',
    };
    return countryMap[country] || '🏁';
}
//# sourceMappingURL=formatters.js.map