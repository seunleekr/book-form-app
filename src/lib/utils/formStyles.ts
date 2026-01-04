type StyleVariant = 'default' | 'minimal' | 'outlined';

interface FormStyleOptions {
    variant?: StyleVariant;
    hasError?: boolean
}

export const getInputStyle = ({
    variant = 'default',
    hasError = false
}: FormStyleOptions) => {
    const baseStyle = {
        border: "1px solid",
        borderColor: hasError ? "red" : "#ccc",
        borderRadius: "6px",
    };

    const variants = {
        default: {
            ...baseStyle,
            padding: "8px",
        },
        outlined: {
            ...baseStyle,
            outline: hasError ? "2px solid red" : "none",
            outlineOffset: hasError ? "2px" : "0",
            padding: "8px",
        },
        minimal: {
            ...baseStyle,
        },
    };

    return variants[variant];
};

// 간단한 errorStyle 헬퍼 함수 (기본 variant 사용)
export const errorStyle = (hasError: boolean) =>
    getInputStyle({ variant: 'default', hasError });