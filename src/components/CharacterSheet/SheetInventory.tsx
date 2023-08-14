import { useRecoilState, useRecoilValue } from "recoil"
import { activeSheetState, sheetEditingState } from "../../shared/state"

export const SheetInventory = () => {
  const [activeSheet, setActiveSheet] = useRecoilState(activeSheetState);
  const editMode = useRecoilValue(sheetEditingState)

  return (
    <section>
      Inventário de {activeSheet?.name}
    </section>
  );
}