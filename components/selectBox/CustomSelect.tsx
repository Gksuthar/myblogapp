'use client'
import React from "react";
import Select, { components, MenuProps, StylesConfig } from "react-select";
import { motion, AnimatePresence } from "framer-motion";
import "./Select.css"; // Common CSS

type OptionType = {
    label: string;
    value: string | boolean;
};

type CustomSelectProps = {
    label?: string;
    placeholder?: string;
    name?: string;
    options?: OptionType[];
    value?: OptionType | OptionType[] | null;
    onChange?: (value: OptionType | OptionType[] | null) => void;
    isSearchable?: boolean;
    isDisabled?: boolean;
    isLoading?: boolean;
    required?: boolean;
    isMulti?: boolean;
    autoFocus?: boolean;
    onBlur?: () => void;
    tabIndex?: number;
    styles?: StylesConfig<OptionType, boolean>;
};

// Custom animated Menu component
const AnimatedMenu = (props: MenuProps<OptionType, boolean>) => {
    return (
        <AnimatePresence>
            {props.selectProps.menuIsOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0, ease: "easeOut" }}
                >
                    <components.Menu {...props}>{props.children}</components.Menu>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const CustomSelect: React.FC<CustomSelectProps> = ({
    label,
    placeholder = "Select",
    name,
    options,
    value,
    onChange,
    isSearchable = true,
    isDisabled = false,
    isLoading = false,
    required = false,
    isMulti = false,
    onBlur,
    autoFocus,
    tabIndex,
    styles,
}) => {
    return (
        <div className={required ? "select-required" : ""} style={styles}>
            {label && (
                <label
                    className={`input-label ps-1 text-md ${required ? "required" : ""
                        }`}
                >
                    {label}
                </label>
            )}
            <Select
                className="select-form"
                name={name}
                placeholder={placeholder}
                styles={styles}
                options={options}
                required={required}
                autoFocus={autoFocus}
                isSearchable={isSearchable}
                isDisabled={isDisabled}
                isMulti={isMulti}
                isLoading={isLoading}
                value={value}
                onChange={(selected) => {
                    if (isMulti) {
                        onChange?.(selected as OptionType[]);
                    } else {
                        onChange?.(selected as OptionType);
                    }
                }}
                onBlur={onBlur}
                tabIndex={tabIndex}
                components={{
                    Menu: AnimatedMenu, // override menu with animation
                }}
            />
        </div>
    );
};

export default CustomSelect;
