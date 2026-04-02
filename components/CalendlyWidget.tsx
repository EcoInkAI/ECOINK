"use client";

import Script from "next/script";

const CalendlyWidget = () => {
    return (
        <div className="w-full">
            {/* Calendly inline widget begin */}
            <div 
                className="calendly-inline-widget" 
                data-url="https://calendly.com/james-ecoinkaisolutions/business-strategy-call" 
                style={{ minWidth: '320px', height: '700px' }} 
            />
            <Script 
                type="text/javascript" 
                src="https://assets.calendly.com/assets/external/widget.js" 
                strategy="afterInteractive" 
            />
            {/* Calendly inline widget end */}
        </div>
    );
};

export default CalendlyWidget;
