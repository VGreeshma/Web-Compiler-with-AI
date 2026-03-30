import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Form() {
  const [name, setName] = useState("");
const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault(); 
     if (name.trim() !== "") {
      navigate("/xyz"); 
    } else {
      alert("Please enter your name!");
    }
  };

  return (
    <>
      <div className="border w-25 mt-5 m-auto p-3">
        <h2 className="text-primary text-center">Knowing about you...</h2>
        <form onSubmit={handleSubmit}>
          <div className="mt-3">
            <label className="fs-3">Enter your name:</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mt-3">
            <button type="submit" className="btn btn-primary w-100">
              Happy Coding
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default Form;
