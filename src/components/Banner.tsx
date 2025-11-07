import React from "react";
import "./Banner.css";

interface BannerProps {
    title?: string;
    subtitle?: string;
    backgroundColor?: string;
    textColor?: string;
}

export const Banner: React.FC<BannerProps> = ({
    title = "Static Banner",
    subtitle = "Static component that wont rerender",
    backgroundColor,
    textColor,
}) => {
    const bannerStyle = {
        backgroundColor: backgroundColor || undefined,
        color: textColor || undefined,
    };

    return (
        <div className="banner" style={bannerStyle}>
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
        </div>
    );
};
