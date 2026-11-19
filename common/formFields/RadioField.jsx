import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { premiumFieldShell } from "./fieldStyles";

const RadioField = ({
  value,
  onChange,
  options,
  disabled = false,
  readOnly = false,
  className,
  label = "",
}) => {
  return (
    <FormItem className={cn("mt-2 flex flex-col space-y-2", className)}>
      {label && (
        <FormLabel className="text-sm font-medium text-foreground">
          {label}
        </FormLabel>
      )}
      <FormControl>
        <RadioGroup
          onValueChange={onChange}
          value={value}
          className={premiumFieldShell({
            disabled,
            readOnly,
            className: "inline-flex w-fit gap-x-6 h-10 items-center px-4",
          })}
          disabled={disabled || readOnly}
        >
          {options.map((option) => (
            <FormItem
              className="flex items-center space-x-2 space-y-0"
              key={option.value}
            >
              <FormControl>
                <RadioGroupItem value={option.value} />
              </FormControl>
              <FormLabel className="font-normal cursor-pointer">
                {option.label}
              </FormLabel>
            </FormItem>
          ))}
        </RadioGroup>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

export default RadioField;
