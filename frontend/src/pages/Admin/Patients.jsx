import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Pencil, Trash2, MoreVertical } from 'lucide-react';
import patientImg from '../../assets/patient.png'

const Patients = ({patients,status,error,onDeletePatient}) => {

  if (status === 'loading') {
    return <div className="text-center py-4">Loading patients...</div>;
  }

  if (status === 'failed') {
    return <div className="text-center py-4 text-red-600">{error}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Patients Management</h2>
        <h2 className="text-xl font-semibold text-blue-800 border-2 border-red-400 rounded-lg p-2">
            Total Patients: {patients.length}
        </h2>
      
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="grid grid-cols-1 gap-6 p-6">
          {patients?.map((patient) => (
            <div
              key={patient._id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <img
                  src={patientImg}
                  alt={patient.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{patient.name}</h3>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-sm text-gray-500">{patient.email}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg" onClick={() => onDeletePatient(patient._id)}>
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Patients;