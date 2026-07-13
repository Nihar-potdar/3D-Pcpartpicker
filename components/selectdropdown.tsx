import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SelectOption = {
    label: string;
    value: string;
}

type SelectDropDownProps = {
  items: SelectOption[];
  northAmerica: SelectOption[];
  europeAfrica: SelectOption[];
  asia: SelectOption[];
  australiaPacific: SelectOption[];
  southAmerica: SelectOption[];
};

export default function SelectDropDown({
  items,
  northAmerica,
  europeAfrica,
  asia,
  australiaPacific,
  southAmerica,
}: SelectDropDownProps) {
  return (
    <div>
      <Select items={items}>
        <SelectTrigger className="w-xl ">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>RTX 50 Series</SelectLabel>
            {northAmerica.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>RTX 40 Series</SelectLabel>
            {europeAfrica.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>RTX 30 Series</SelectLabel>
            {asia.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>Rtx 20 Series</SelectLabel>
            {australiaPacific.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>RTX 10 Series</SelectLabel>
            {southAmerica.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
