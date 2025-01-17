import { useState } from "react";
// import DoctorInfo from './components/DoctorInfo';
// import SlotSelection from './components/SlotSelection';
// import PersonalInfo from './components/PersonalInfo';
// import BookingConfirmation from './components/BookingConfirmation';
// import Invoice from './components/Invoice';

import DoctorInfo from "../../components/BookAppointment/DoctorInfo";
import SlotSelection from "../../components/BookAppointment/SlotSelection";
import PersonalInfo from "../../components/BookAppointment/PersonalInfo";
import BookingConfirmation from "../../components/BookAppointment/BookingConfirmation";
import Invoice from "../../components/BookAppointment/Invoice";
import { fetchDoctorById } from "../../reduxToolkit/reducers/DoctorReducer.js";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { fetchAppointmentSlots } from "../../reduxToolkit/reducers/BookingReducer.js";

import { Book } from "lucide-react";
import { use } from "react";

const doctorInfo = {
  name: "Dr. Darren Elder",
  specialty: "Dental Surgeon",
  rating: 4.5,
  reviews: 35,
  location: "Newyork, USA",
  image: "https://randomuser.me/api/portraits/men/36.jpg",
  experience: "15+ Years Experience",
  fees: "$100",
};

const mockInvoice = {
  orderId: "00124",
  issueDate: "20/07/2023",
  doctor: {
    name: "Dr. Darren Elder",
    address: "806 Twin Willow Lane, Old Forge",
    location: "Newyork, USA",
  },
  patient: {
    name: "Walter Roberson",
    address: "299 Star Trek Drive, Panama City",
    location: "Florida, 32405, USA",
  },
  payment: {
    method: "Debit Card",
    cardNumber: "XXXXXXXXXXXX-2541",
    bank: "HDFC Bank",
  },
  items: [
    {
      description: "General Consultation",
      quantity: 1,
      vat: 0,
      total: 100,
    },
    {
      description: "Video Call Booking",
      quantity: 1,
      vat: 0,
      total: 250,
    },
  ],
  subtotal: 350,
  discount: 10,
  total: 315,
};



const BookAppointment = () => {

    
const {doctorId} = useParams();
const dispatch = useDispatch();
const { selectedDoctor, fetchDoctorByIdStatus, error } = useSelector(
  (state) => state.doctors
);

const { appointments, status, errorA } = useSelector((state) => state.appointments);

console.log("Selected Doctor IN Bookappoin", selectedDoctor);
console.log("appointments from BookAppin", appointments);
//   const [prevDoctorId, setPrevDoctorId] = useState(null);


useEffect(() => {
    // if (doctorId !== prevDoctorId) {
      // Only reset the state if the doctorId has actually changed
    //   dispatch(resetDoctorState());
    //   setPrevDoctorId(doctorId); // Update the previous doctorId after resetting
      dispatch(fetchDoctorById(doctorId)); // Fetch new doctor data
      dispatch(fetchAppointmentSlots(doctorId));
    // }
  }, [doctorId, dispatch]); // Run when doctorId or prevDoctorId changes

  // Handle loading and error state
  if (fetchDoctorByIdStatus === 'loading') {
     <div>Loading...</div>;
  }
  if (fetchDoctorByIdStatus === 'failed') {
     <div>Error: {error}</div>;
  }

  if (status === 'loading') {
    <div>Loading...</div>;
 }
 if (status === 'failed') {
    <div>Error: {error}</div>;
 }



  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBookingConfirm = (formData) => {
    setStep(3);
  };

  const handleViewInvoice = () => {
    setStep(4);
  };

  return (
    <div className="min-h-screen bg-gray-50  md:p-8">
      <div className="max-w-6xl mx-auto pt-16">
        <DoctorInfo doctor={selectedDoctor} />

        {step === 1 && (
          <SlotSelection
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedSlot={selectedSlot}
            appointmentSlots = {appointments.availableSlots}
            setSelectedSlot={setSelectedSlot}
            onNext={handleNext}
          />
        )}

        {step === 2 && <PersonalInfo onSubmit={handleBookingConfirm} />}

        {step === 3 && (
          <BookingConfirmation
            booking={{
              doctorName: doctorInfo.name,
              date: selectedDate.toLocaleDateString(),
              time: selectedSlot,
            }}
            onViewInvoice={handleViewInvoice}
          />
        )}

        {step === 4 && <Invoice invoice={mockInvoice} />}
      </div>
    </div>
  );
};

export default BookAppointment;
