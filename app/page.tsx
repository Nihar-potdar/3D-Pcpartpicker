import SelectDropDown from "@/components/selectdropdown";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

const northAmerica = [
  { label: "RTX 5060", value: "est" },
  { label: "RTX 5060 ti", value: "cst" },
  { label: "RTX 5070", value: "mst" },
  { label: "RTX 5070 ti", value: "pst" },
  { label: "RTX 5080", value: "akst" },
  { label: "RTX 5080 ti", value: "hst" },
];

const europeAfrica = [
  { label: "RTX 4060", value: "gmt" },
  { label: "RTX 4060 ti", value: "cet" },
  { label: "RTX 4070", value: "eet" },
  { label: "RTX 4070 super", value: "west" },
  { label: "RTX 4080", value: "cat" },
  { label: "RTX 4090", value: "eat" },
];

const asia = [
  { label: "RTX 3060", value: "msk" },
  { label: "RTX 3060 ti", value: "ist" },
  { label: "RTX 3070", value: "cst_china" },
  { label: "RTX 3070 ti", value: "jst" },
  { label: "RTX 3080", value: "kst" },
  { label: "RTX 3090", value: "ist_indonesia" },
];

const australiaPacific = [
  { label: "RTX 2060", value: "awst" },
  { label: "RTX 2060 ti", value: "acst" },
  { label: "RTX 2070", value: "aest" },
  { label: "RTX 2070 super", value: "nzst" },
  { label: "RTX 2080", value: "fjt" },
];

const southAmerica = [
  { label: "GTX 1050 ti", value: "art" },
  { label: "GTX 1060", value: "bot" },
  { label: "GTX 1070", value: "brt" },
  { label: "GTX 1080 ti", value: "clt" },
];

const items = [
  { label: "Select a Graphics Card", value: null },
  ...northAmerica,
  ...europeAfrica,
  ...asia,
  ...australiaPacific,
  ...southAmerica,
];

export default function Home() {
  return (
    <div className="w-dvw h-dvh justify-center items-center bg-background">
      <main className="w-dvw h-dvh justify-center items-center">
        <ResizablePanelGroup
          orientation="horizontal"
          className="min-h-[200px] max-w-dvw rounded-lg border bg"
        >
          <ResizablePanel defaultSize="25%">
            <div className="flex w-full h-full items-center  justify-around flex-col p-6">
              {/* <span className="font-semibold ">Pc component Sidebar</span> */}
              <SelectDropDown
                className="bg-sidebar-ring"
                items={items}
                northAmerica={northAmerica}
                europeAfrica={europeAfrica}
                asia={asia}
                australiaPacific={australiaPacific}
                southAmerica={southAmerica}
              />
              <SelectDropDown
                items={items}
                northAmerica={northAmerica}
                europeAfrica={europeAfrica}
                asia={asia}
                australiaPacific={australiaPacific}
                southAmerica={southAmerica}
              />
              <SelectDropDown
                items={items}
                northAmerica={northAmerica}
                europeAfrica={europeAfrica}
                asia={asia}
                australiaPacific={australiaPacific}
                southAmerica={southAmerica}
              />
              <SelectDropDown
                items={items}
                northAmerica={northAmerica}
                europeAfrica={europeAfrica}
                asia={asia}
                australiaPacific={australiaPacific}
                southAmerica={southAmerica}
              />
              <SelectDropDown
                items={items}
                northAmerica={northAmerica}
                europeAfrica={europeAfrica}
                asia={asia}
                australiaPacific={australiaPacific}
                southAmerica={southAmerica}
              />
              
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize="75%">
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">3D View</span>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </div>
  );
}
