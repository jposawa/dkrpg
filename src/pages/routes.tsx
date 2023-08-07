import { Routes as Switch, Route } from "react-router-dom";
import { Dices, Home, Library, Settings } from "./";

export const Routes = () => {
  return (
    <section>
      <Switch>
        <Route index path="/" element={<Home />} />

        <Route path="/home" element={<Home />} />

        <Route path="/library" element={<Library />} />

        <Route path="/library/:sheetId" element={<Library />} />

        <Route path="/dices" element={<Dices />} />

        <Route path="/settings" element={<Settings />} />
      </Switch>
    </section>
  )
}