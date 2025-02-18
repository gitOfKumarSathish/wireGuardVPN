// WifiLoader.tsx
import React from "react";

interface WifiLoaderProps {
    background: string;
    desktopSize: string;
    mobileSize: string;
    text: string;
    backColor: string;
    frontColor: string;
}

const WifiLoader: React.FC<WifiLoaderProps> = ({
    background,
    desktopSize,
    mobileSize,
    text,
    backColor,
    frontColor,
}) => {
    return (
        <div className="wifi-loader-container" style={{ background: background }}>
            <div className="wifi-loader" style={{ width: desktopSize, height: desktopSize }}>
                <div className="wifi-circle" style={{ background: backColor }}></div>
                <div className="wifi-circle" style={{ background: frontColor }}></div>
            </div>
            <div className="wifi-loader-text">{text}</div>
        </div>
    );
};

export default WifiLoader;
