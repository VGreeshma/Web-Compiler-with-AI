import React, { useState } from "react";
import Select from "react-dropdown-select";
import { useNavigate } from "react-router-dom";

function Dropdown() {
  const navigate = useNavigate();
  const options = [
    { id: "C", name: "c" },
    { id: "C++", name: "c++" },
  ];

  const [selected, setSelected] = useState([]);

  const handleSubmit = () => {
    if(selected[0]) {
      navigate(`/editor?lang=${selected[0].name}`);
    }
  };

  return (
    <div className="d-flex justify-content-center mt-5">
      <div className="w-50 p-3 border rounded">
        <h4>Select your Language</h4>
        <Select
          options={options}
          labelField="id"
          valueField="name"
          values={selected}
          onChange={(values) => setSelected(values)}
        />
        <div className="mt-3">
          <button onClick={handleSubmit} type="submit" className="btn btn-primary w-100">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dropdown;
