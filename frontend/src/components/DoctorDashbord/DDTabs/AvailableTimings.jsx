import { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDoctorById } from '../../../reduxToolkit/reducers/DoctorReducer.js';
import axios from 'axios';

const daysOfWeek = [
  'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'
];

const timeSlots = [
  '09:00 AM', '09:30 AM',
  '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM',
  '1:00 PM', '1:30 PM',
  '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM',
  '4:00 PM'
];

export default function AvailableTimings() {
  const [selectedDay, setSelectedDay] = useState('Wed');
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [appointmentFee, setAppointmentFee] = useState('');
  const [saveStatus, setSaveStatus] = useState(''); // Track the save status (empty, 'success', or 'error')
  
  const { doctorId } = useParams();
  const dispatch = useDispatch();
  const doctor = useSelector((state) => state.doctors.selectedDoctor);

  console.log("Doctor ID:", doctorId);
  console.log("Doctor data:", doctor);

  // Fetch doctor data on page load
  useEffect(() => {
    if (doctorId) {
      dispatch(fetchDoctorById(doctorId));  // Fetch the doctor data
    }
  }, [doctorId, dispatch]);

  // Update appointmentFee once the doctor data is available
  useEffect(() => {
    if (doctor && doctor.consultationFee !== undefined) {
      setAppointmentFee(doctor.consultationFee);  // Update consultation fee after doctor data is fetched
    }
  }, [doctor]);

  // Handle toggling time slot selection
  const handleSlotToggle = (slot) => {
    if (selectedSlots.includes(slot)) {
      setSelectedSlots(selectedSlots.filter(s => s !== slot));  // Remove slot
    } else {
      setSelectedSlots([...selectedSlots, slot]);  // Add slot
    }
  };

  // Handle saving availability data
  const handleSaveAvailability = async () => {
    try {
      const availability = {
        day: selectedDay,
        slots: selectedSlots
      };
      const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}/api/doctor/addavailability/${doctorId}`, {
        availability,
        consultationFee: appointmentFee || doctor.consultationFee
      });
      console.log("Successfully added availability:", response.data);
      
      // Set the save status to 'success' to trigger rerender
      setSaveStatus('success');
      
      // After saving, we can re-fetch the doctor data to update the availability in state
      dispatch(fetchDoctorById(doctorId));

      // Optionally, clear the selection state after saving
      setSelectedSlots([]);  // Clear selected slots if needed
    } catch (error) {
      console.error("Error adding availability:", error);
      
      // Set the save status to 'error' to trigger rerender
      setSaveStatus('error');
    }
  };

  useEffect(() => {
    gsap.fromTo('.available-timings-title', { opacity: 0 }, { opacity: 1, duration: 0.5 });
  }, []);

  // Get existing slots for the selected day
  const getExistingSlotsForDay = () => {
    if (doctor && doctor.availability) {
      const dayAvailability = doctor.availability.find((item) => item.day === selectedDay);
      return dayAvailability ? dayAvailability.slots : [];
    }
    return [];  // Return an empty array if doctor or availability is undefined
  };

  // Get slots that are available (i.e., not already taken)
  const getAvailableSlotsForDay = () => {
    const existingSlots = getExistingSlotsForDay();
    return timeSlots.filter(slot => !existingSlots.includes(slot));  // Only show slots that are not taken
  };

  if (!doctor) {
    return <div>Loading...</div>; // You can replace this with a loading spinner or any other UI element
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="available-timings-title text-2xl font-bold">Available Timings</h1>
          <p className="text-gray-500 mt-1">Set your availability and consultation fees</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Select Available Slots</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {daysOfWeek.map((day) => (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      selectedDay === day ? 'bg-primary text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">{selectedDay}</h3>
                <div className="flex gap-2">
                  <button className="text-primary hover:text-blue-700 text-sm font-medium">
                    Add Slots
                  </button>
                  <button className="text-red-500 hover:text-red-700 text-sm font-medium">
                    Delete All
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {timeSlots.map((slot) => {
                  const isAlreadyBooked = getExistingSlotsForDay().includes(slot);  // Check if slot is already booked
                  const isAvailable = !isAlreadyBooked;  // Slot is available if it's not already booked

                  return (
                    <button
                      key={slot}
                      onClick={isAvailable ? () => handleSlotToggle(slot) : null}  // Only allow toggle for available slots
                      className={`p-3 rounded-lg border transition-colors ${
                        isAlreadyBooked
                          ? 'border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed'  // Already booked slot
                          : selectedSlots.includes(slot)
                          ? 'border-primary bg-blue-50 text-primary cursor-pointer'  // Selected slot
                          : 'border-gray-200 hover:border-primary hover:text-primary cursor-pointer'  // Available slot
                      }`}
                      id={slot}
                      disabled={isAlreadyBooked}  // Disable already booked slots
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Appointment Fees ($)</h3>
              <input
                type="number"
                value={appointmentFee || ''}  // Ensure the input is controlled and handles empty values
                onChange={(e) => setAppointmentFee(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Enter appointment fee"
              />
            </div>

            {/* Display save status */}
            {saveStatus === 'success' && (
              <div className="text-green-500 text-sm mt-2">Availability saved successfully!</div>
            )}
            {saveStatus === 'error' && (
              <div className="text-red-500 text-sm mt-2">Error saving availability. Please try again.</div>
            )}

            <div className="flex justify-end gap-4 pt-4">
              <button className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                Cancel
              </button>
              <button
                onClick={handleSaveAvailability}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>  
  );
}
