import { useRecoilState, useRecoilValue } from "recoil"
import { activeSheetState, sheetEditingState } from "../../shared/state"

export const SheetTraits = () => {
  const [activeSheet, setActiveSheet] = useRecoilState(activeSheetState);
  const editMode = useRecoilValue(sheetEditingState)

  return (
    <section>
      Traços de {activeSheet?.name}
    </section>
  );
}