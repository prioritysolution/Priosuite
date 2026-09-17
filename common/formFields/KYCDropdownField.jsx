import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { FormField } from "@/components/ui/form";

const KYCDropdownFieldInner = ({
  label,
  value,
  onChange,
  options = [],
  optionLabelKey = "Option_Value",
  disabled = false,
  labeldisable = false,
  isRequired = false,
}) => {
  // Debug: Log incoming props

  // Get the item key as string
  const getKey = (item) => String(item?.Id ?? item?.id ?? item?.value ?? "");

  // Debug: Log first few options to see structure
  if (options.length > 0) {
    console.log(`First few options for ${label}:`, options.slice(0, 3));
  }

  return (
    <FormItem className="w-full flex-1">
      {!labeldisable && (
        <FormLabel>
          {label}
          {"  "}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </FormLabel>
      )}
      <Select
        value={
          value !== null && value !== undefined && value !== ""
            ? String(value)
            : ""
        }
        onValueChange={(val) => {
          if (!val || val === "") {
            onChange("");
          } else {
            const numVal = Number(val);
            onChange(!isNaN(numVal) && val !== "" ? numVal : val);
          }
        }}
        disabled={disabled}
      >
        <FormControl>
          <SelectTrigger className="h-10 w-full">
            <SelectValue placeholder={`Select ${label?.toLowerCase()}`} />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          <SelectGroup>
            {options.map((item) => (
              <SelectItem key={getKey(item)} value={getKey(item)}>
                {String(item?.[optionLabelKey] ?? "")}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  );
};

const KYCDropdownField = (props) => {
  if (props.control && props.name) {
    return (
      <FormField
        control={props.control}
        name={props.name}
        render={({ field, fieldState }) => (
          <KYCDropdownFieldInner
            {...props}
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
    );
  }
  return <KYCDropdownFieldInner {...props} />;
};

export default KYCDropdownField;
