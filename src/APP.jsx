import React from "react";
import { Routes, Route } from "react-router-dom";
import FrontPage from "./routing/frontpage";
import SecondPage from "./routing/secondpage";
import ThirdPage from "./routing/thirdpage";
import Monaco from "./routing/monaco";
const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<FrontPage />} />

        <Route path="/abc" element={<FrontPage />} />
        <Route path="/123" element={<SecondPage />} />
        <Route path="/xyz" element={<ThirdPage />} />
        <Route path="/editor" element={<Monaco />} />
      </Routes>
    </div>
  );
};

export default App;
