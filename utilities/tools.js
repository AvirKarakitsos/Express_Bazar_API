export const getCurrentDateFormatted = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export function whichColor(value) {
    let color = null;
    switch (value) {
        case 'Vinted':
            color = '#17e9e3';
            break;
        case 'Rakuten':
            color = '#df0a30';
            break;
        case 'Leboncoin':
            color = '#ce4708';
            break;
        case 'Ebay':
            color = '#ce4708';
            break;
        default:
            color = '#000';
    }
    return color;
}
