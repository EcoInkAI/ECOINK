"use client";

import React, { createContext, useContext, useState } from "react";
import BookingModal from "@/components/BookingModal";

interface BookingContextType {
    openBookingModal: () => void;
    closeBookingModal: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider = ({ children }: { children: React.ReactNode }) => {
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

    const openBookingModal = () => setIsBookingModalOpen(true);
    const closeBookingModal = () => setIsBookingModalOpen(false);

    return (
        <BookingContext.Provider value={{ openBookingModal, closeBookingModal }}>
            {children}
            <BookingModal isOpen={isBookingModalOpen} onClose={closeBookingModal} />
        </BookingContext.Provider>
    );
};

export const useBooking = () => {
    const context = useContext(BookingContext);
    if (context === undefined) {
        throw new Error("useBooking must be used within a BookingProvider");
    }
    return context;
};
