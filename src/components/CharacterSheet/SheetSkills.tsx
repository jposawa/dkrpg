import { useRecoilState, useRecoilValue } from "recoil"
import { activeSheetState, sheetEditingState } from "../../shared/state"

export const SheetSkills = () => {
  const [activeSheet, setActiveSheet] = useRecoilState(activeSheetState);
  const editMode = useRecoilValue(sheetEditingState)

  return (
    <section>
      Competências de {activeSheet?.name}
    </section>
  );
}