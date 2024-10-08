import React from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";

function Creator() {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      cname: "",
      room: "",
    },
    onSubmit: (values) => {
      if (values) {
        const creatorData = {
          cname: values.cname,
          room: values.room,
        };

        console.log("creator data : ", creatorData);
        sessionStorage.setItem("creator", JSON.stringify(creatorData));
        navigate("/lobby");
      }
    },
  });
  
  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <input
          type="text"
          id="cname"
          placeholder="Enter creator's name"
          value={formik.values.cname}
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

export default Creator;
