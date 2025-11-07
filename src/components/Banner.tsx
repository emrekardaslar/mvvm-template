import React from "react";

interface BannerProps {
    title?: string;
    subtitle?: string;
    backgroundColor?: string;
    textColor?: string;
}

export const Banner: React.FC<BannerProps> = ({
    title = "Static Banner",
    subtitle = "Static component that wont rerender",
    backgroundColor = "#0078D4",
    textColor = "#FFFFFF",
}) => {
    return (
        <div
            style={{
                backgroundColor,
                color: textColor,
                padding: "2rem",
                textAlign: "center",
                borderRadius: "8px",
            }}
        >
            <h1 style={{ margin: 0 }}>{title}</h1>
            {subtitle && <p style={{ marginTop: "0.5rem" }}>{subtitle}</p>}
        </div>
    );
};
