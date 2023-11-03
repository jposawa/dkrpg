import React from "react";

import { useRecoilState, useRecoilValue } from "recoil";
import { activeSheetState, sheetEditingState } from "../../shared/state";
import { TraitCard } from "../";

export const SheetTraits = () => {
  const [activeSheet, setActiveSheet] = useRecoilState(activeSheetState);
  const editMode = useRecoilValue(sheetEditingState);

  const activeTraits = React.useMemo(() => {
    if (!activeSheet) {
      return [];
    }

    return activeSheet.traits.filter((trait) => trait.level > 0 || editMode);
  }, [activeSheet]);

  return (
    <section>
      {activeTraits.length === 0 ? (
        <h4>Sem traços ativos</h4>
      ) : (
        <ul>
          {activeTraits.map((trait) => (
            <li>
              <TraitCard trait={trait} key={trait.id} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
