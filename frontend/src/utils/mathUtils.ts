/**
 * Formats math strings for ReactMarkdown + KaTeX by converting LaTeX delimiters
 * into the format expected by the remark-math plugin.
 */
export const formatMath = (text: string | null | undefined): string => {
    if (!text) return "";

    return text
        .replace(/\\\[/g, '$$$')
        .replace(/\\\]/g, '$$$')
        .replace(/\\\(/g, '$')
        .replace(/\\\)/g, '$');
};

/**
 * Pre-computes math formatting for a list of strings (e.g., options).
 */
export const formatMathArray = (arr: string[] | null | undefined): string[] => {
    if (!arr) return [];
    return arr.map(item => formatMath(item));
};
