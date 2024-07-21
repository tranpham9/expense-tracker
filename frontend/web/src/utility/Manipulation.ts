export function getInitials(name: string) {
    return name
        .split(" ")
        .slice(0, 2) // (this works fine if there are less than two words as well; gets *up to* two words)
        .reduce((res, word) => res + word.substring(0, 1), "")
        .toLocaleUpperCase();
}

export function getFormattedCurrency(amount: number) {
    return amount.toLocaleString("en-US", { style: "currency", currency: "USD" });
}
