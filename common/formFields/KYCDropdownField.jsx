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
  FormField,
} from "@/components/ui/form";
import { premiumFieldTrigger } from "./fieldStyles";

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
  const getKey = (item) => String(item?.Id ?? item?.id ?? item?.value ?? "");

  return (
    <FormItem className="w-full flex-1">
      {!labeldisable && (
        <FormLabel className="text-sm font-medium text-foreground">
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
          <SelectTrigger
            className={premiumFieldTrigger({
              disabled,
              className: "h-10 w-full justify-between",
            })}
          >
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
        render={({ field }) => (
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
