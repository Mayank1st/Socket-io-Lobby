import React from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";

function Participent() {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      pname: "",
      room: "",
    },
    onSubmit: (values) => {
      if (values) {
        const participentData = {
          pname: values.pname,
          room: values.room,
        };

        console.log("Participant data : ", participentData);
        sessionStorage.setItem("participent", JSON.stringify(participentData));
        navigate("/lobby");
      }
    },
  });
  
  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <input
          type="text"
          id="pname"
          placeholder="Enter participant's name"
          value={formik.values.pname}
          onChange={formik.handleChange}
        />
        <input
          type="text"
          id="room"
          placeholder="Enter room ID"
          value={formik.values.room}
          onChange={formik.handleChange}
        />
        <button type="submit">Join</button>
      </form>
    </div>
  );
}

export default Participent;
