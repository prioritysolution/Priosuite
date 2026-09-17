import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

const RadioField = ({
  value,
  onChange,
  options, // Dynamic label field key
  disabled = false,
  readOnly = false,
  className,
  label = "",
}) => {
  return (
    <FormItem className={cn("w-full mt-2 flex-1", className)}>
      {label && <FormLabel>{label}</FormLabel>}
      <FormControl>
        {/* defaultValue={value} */}
        <RadioGroup
          onValueChange={onChange}
          value={value}
          className="flex gap-3"
          disabled={disabled}
          readOnly={readOnly}
        >
          {options.map((option) => (
            <FormItem
              className="flex items-center space-x-2 space-y-0"
              key={option.value}
            >
              <FormControl>
                <RadioGroupItem value={option.value} />
              </FormControl>
              <FormLabel className="font-normal">{option.label}</FormLabel>
            </FormItem>
          ))}
        </RadioGroup>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

export default RadioField;



// type RadioOption = {
//   value: string;
//   label: string;
//   disabled?: boolean;
// };

// type RadioFieldProps = {
//   value: string;
//   onChange: (value: string) => void;
//   options: RadioOption[];
//   disabled?: boolean; // disables entire group
//   readOnly?: boolean;
//   className?: string;
//   label?: string;
//   customStyle?: boolean;
// };

// const RadioField = ({
//   value,
//   onChange,
//   options,
//   disabled = false,
//   readOnly = false,
//   className,
//   label = "",
//   customStyle = false,
// }) => {
//   return (
//     <FormItem className={cn("w-full mt-2 flex-1", className)}>
//       {label && <FormLabel className="text-sm sm:text-base">{label}</FormLabel>}

//       <FormControl>
//         <RadioGroup
//           onValueChange={onChange}
//           value={value}
//           className={
//             customStyle
//               ? "flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4"
//               : "flex flex-wrap gap-3"
//           }
//           disabled={disabled}
//         >
//           {options.map((option) => {
//             const isOptionDisabled = disabled || option.disabled;

//             // ---------------- CUSTOM STYLE VERSION ----------------
//             if (customStyle) {
//               return (
//                 <label
//                   key={option.value}
//                   htmlFor={option.value}
//                   className={cn(
//                     "flex items-center gap-2.5 px-3 py-2.5 sm:px-4 sm:py-2.5 rounded-lg border select-none transition-colors text-xs sm:text-sm w-full sm:w-auto",
//                     isOptionDisabled
//                       ? "opacity-50 cursor-not-allowed bg-muted"
//                       : "cursor-pointer",
//                     value === option.value && !isOptionDisabled
//                       ? "border-primary bg-primary/5 text-primary font-semibold"
//                       : "border-border bg-muted/20 text-muted-foreground hover:border-primary/30",
//                   )}
//                   onClick={(e) => {
//                     if (isOptionDisabled || readOnly) {
//                       e.preventDefault();
//                     }
//                   }}
//                 >
//                   <RadioGroupItem
//                     value={option.value}
//                     id={option.value}
//                     disabled={isOptionDisabled}
//                   />
//                   <span className="truncate">{option.label}</span>
//                 </label>
//               );
//             }

//             // ---------------- DEFAULT VERSION ----------------
//             return (
//               <FormItem
//                 // className="flex items-center space-x-2 space-y-0 "
//                 className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center space-x-2 space-y-0 "
//                 key={option.value}
//               >
//                 <FormControl>
//                   <RadioGroupItem
//                     value={option.value}
//                     disabled={isOptionDisabled}
//                   />
//                 </FormControl>
//                 <FormLabel
//                   className={cn(
//                     "font-normal",
//                     isOptionDisabled && "opacity-50 cursor-not-allowed",
//                   )}
//                 >
//                   {option.label}
//                 </FormLabel>
//               </FormItem>
//             );
//           })}
//         </RadioGroup>
//       </FormControl>

//       <FormMessage />
//     </FormItem>
//   );
// };

// export default RadioField;






// import React from "react";
// import {
//   FormControl,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { cn } from "@/lib/utils";

// const RadioField = ({
//   value,
//   onChange,
//   options,
//   disabled = false,
//   readOnly = false,
//   className,
//   label = "",
//   customStyle = false,
// }) => {
//   return (
//     <FormItem className={cn("w-full mt-2 flex-1", className)}>
//       {label && <FormLabel className="text-sm sm:text-base">{label}</FormLabel>}

//       <FormControl>
//         <RadioGroup
//           onValueChange={onChange}
//           value={value}
//           className={
//             customStyle
//               ? "flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 lg:gap-4"
//               : "flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3"
//           }
//           disabled={disabled}
//         >
//           {options.map((option) => {
//             const isOptionDisabled = disabled || option.disabled;

//             // ---------------- CUSTOM STYLE VERSION ----------------
//             if (customStyle) {
//               return (
//                 <label
//                   key={option.value}
//                   htmlFor={option.value}
//                   className={cn(
//                     "flex items-center gap-2.5 px-3 py-2.5 sm:px-4 sm:py-2.5 rounded-lg border select-none transition-colors text-xs sm:text-sm w-full sm:w-auto max-w-xs",
//                     isOptionDisabled
//                       ? "opacity-50 cursor-not-allowed bg-muted"
//                       : "cursor-pointer",
//                     value === option.value && !isOptionDisabled
//                       ? "border-primary bg-primary/5 text-primary font-semibold"
//                       : "border-border bg-muted/20 text-muted-foreground hover:border-primary/30",
//                   )}
//                   onClick={(e) => {
//                     if (isOptionDisabled || readOnly) {
//                       e.preventDefault();
//                     }
//                   }}
//                 >
//                   <RadioGroupItem
//                     value={option.value}
//                     id={option.value}
//                     disabled={isOptionDisabled}
//                   />
//                   <span className="truncate">{option.label}</span>
//                 </label>
//               );
//             }

//             // ---------------- DEFAULT VERSION ----------------
//             return (
//               <div
//                 className="flex items-center space-x-2 space-y-0 min-h-[20px]"
//                 key={option.value}
//               >
//                 <FormControl>
//                   <RadioGroupItem
//                     value={option.value}
//                     disabled={isOptionDisabled}
//                   />
//                 </FormControl>
//                 <FormLabel
//                   className={cn(
//                     "font-normal min-w-0 truncate text-xs sm:text-sm",
//                     isOptionDisabled && "opacity-50 cursor-not-allowed",
//                   )}
//                 >
//                   {option.label}
//                 </FormLabel>
//               </div>
//             );
//           })}
//         </RadioGroup>
//       </FormControl>

//       <FormMessage />
//     </FormItem>
//   );
// };

// export default RadioField;
