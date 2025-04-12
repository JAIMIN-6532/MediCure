import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Pencil, Trash2, MoreVertical } from "lucide-react";
const Doctors = ({ doctors, status, error,onVerifyDoctor, onDeleteDoctor }) => {
  const dispatch = useDispatch();
  
  if (status === "loading") {
    return <div className="text-center py-4">Loading doctors...</div>;
  }

  if (status === "failed") {
    return <div className="text-center py-4 text-red-600">{error}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Doctors Management
        </h2>
        <div className="flex items-center gap-4 ">
        <h2 className="text-xl font-semibold text-blue-800 border-2 border-red-400 rounded-lg p-2">
            totalDoctors : {doctors.length}
        </h2>
        <h2 className="text-xl font-semibold text-green-800 border-2 border-red-400 rounded-lg p-2">
            Verified Doctors : {doctors.filter(doctor => doctor.verificationStatus === "Verified").length}
        </h2>
        <h2 className="text-xl font-semibold text-red-800 border-2 border-red-400 rounded-lg p-2">
            UnCompletedProfile Doctors : {doctors.filter(doctor => doctor.verificationStatus !== "Verified").length}
        </h2>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="grid grid-cols-1 gap-6 p-6">
          {doctors.map(
            (doctor) =>
              doctor.steps === 4 && (
                <div
                  key={doctor._id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={doctor.profileImageUrl}
                      alt={doctor.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {doctor.name}
                      </h3>
                      <p className="text-gray-600">{doctor.specialty}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-gray-500">
                          Experience: {doctor.experience}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`${doctor.degreeDocumentUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                    >
                      Degreeproof
                    </a>
                    <a
                      href={`${doctor.idproofUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                    >
                      Idproof
                    </a>
                    {doctor.verificationStatus !== "Verified" ? (
                      <button
                        onClick={() => onVerifyDoctor(doctor._id)}
                        className="p-2 border text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        Verify
                      </button>
                    ) : (
                      <button className="p-2 border text-green-600 hover:bg-green-50 rounded-lg">
                        verified
                      </button>
                    )}
                    <button
                      onClick={() => onDeleteDoctor(doctor._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
