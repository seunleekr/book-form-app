export function firstErrorPath(errors: any): string | null {
    const walk = (obj: any, prefix: string[] = []): string | null => {
        for (const key of Object.keys(obj)) {
            const val = obj[key];
            if (val?.message) return [...prefix, key].join(".");
            if (typeof val === "object") {
                const inner = walk(val, [...prefix, key]);
                if (inner) return inner;
            }
        }
        return null;
    };
    return walk(errors);
}