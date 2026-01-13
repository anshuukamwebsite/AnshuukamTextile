"use client";

import { motion } from "framer-motion";

export const FadeIn = ({
    children,
    delay = 0,
    className = "",
    direction = "up"
}: {
    children: React.ReactNode,
    delay?: number,
    className?: string,
    direction?: "up" | "down" | "left" | "right" | "none"
}) => {
    const variants = {
        hidden: {
            opacity: 0,
            y: direction === "up" ? 20 : direction === "down" ? -20 : 0,
            x: direction === "left" ? 20 : direction === "right" ? -20 : 0,
            filter: "blur(4px)"
        },
        visible: {
            opacity: 1,
            y: 0,
            x: 0,
            filter: "blur(0px)",
            transition: {
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1] as const,
                delay
            }
        }
    };

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={variants}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export const FadeInStagger = ({
    children,
    className = "",
    staggerDelay = 0.1
}: {
    children: React.ReactNode,
    className?: string,
    staggerDelay?: number
}) => {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            transition={{ staggerChildren: staggerDelay }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export const FadeInItem = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
    const variants = {
        hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
        visible: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: {
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1] as const
            }
        }
    };

    return (
        <motion.div variants={variants} className={className}>
            {children}
        </motion.div>
    );
};
